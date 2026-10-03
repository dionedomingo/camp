import { extractCamperId } from '../_media/auth';

interface Env {
  DB: D1Database;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

const ALLOWED_CATEGORIES = [
  'spiritual_growth',
  'healing_health',
  'family_personal',
  'academic_career',
  'salvation_evangelism',
  'camp_breakthrough',
  'general',
] as const;

const ALLOWED_PRIVACY_LEVELS = [
  'public',
  'church_delegation',
  'pastors_counselors',
  'anonymous_author',
] as const;

// Helper to sanitize author info for anonymous requests
function formatCamper(camper: any, isAnonymous: boolean, isAuthor: boolean) {
  if (isAnonymous && !isAuthor) {
    return {
      id: camper.id,
      full_name: 'Camper in Christ',
      nickname: 'Anonymous Camper',
      role: 'camper',
      selfie_url: null,
      church_name: null,
    };
  }
  return {
    id: camper.id,
    full_name: camper.full_name,
    nickname: camper.nickname || camper.full_name,
    role: camper.role || 'camper',
    selfie_url: camper.selfie_url || null,
    church_name: camper.church_name || null,
  };
}

// GET /api/prayers: Fetch prayer requests with privacy enforcement and avatar reaction tracking
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const statusFilter = (url.searchParams.get('status') || 'all').toLowerCase(); // 'all', 'open', 'answered'
    const categoryFilter = url.searchParams.get('category') || '';
    const tabFilter = (url.searchParams.get('filter') || 'all').toLowerCase(); // 'all', 'my_prayers', 'my_delegation', 'i_prayed'

    const viewerId = extractCamperId(context.request);

    // Fetch viewer profile if authenticated
    let viewer: any = null;
    if (viewerId) {
      viewer = await context.env.DB
        .prepare(`
          SELECT id, role, church_id
          FROM campers
          WHERE id = ?
        `)
        .bind(viewerId)
        .first<any>();
    }

    const isLeader = viewer && ['admin', 'pastor', 'counselor', 'staff'].includes(viewer.role);

    // Build WHERE clause based on privacy and filters
    const whereClauses: string[] = [];
    const bindParams: any[] = [];

    // 1. Status Filter
    if (statusFilter === 'open') {
      whereClauses.push("p.status = 'open'");
    } else if (statusFilter === 'answered') {
      whereClauses.push("p.status = 'answered'");
    } else {
      whereClauses.push("p.status != 'archived'");
    }

    // 2. Category Filter
    if (categoryFilter && ALLOWED_CATEGORIES.includes(categoryFilter as any)) {
      whereClauses.push("p.category = ?");
      bindParams.push(categoryFilter);
    }

    // 3. Tab Specific Filters
    if (tabFilter === 'my_prayers' && viewerId) {
      whereClauses.push("p.camper_id = ?");
      bindParams.push(viewerId);
    } else if (tabFilter === 'i_prayed' && viewerId) {
      whereClauses.push("EXISTS (SELECT 1 FROM prayer_participants pp WHERE pp.prayer_id = p.id AND pp.camper_id = ?)");
      bindParams.push(viewerId);
    } else if (tabFilter === 'my_delegation' && viewer?.church_id) {
      whereClauses.push("c.church_id = ?");
      bindParams.push(viewer.church_id);
    }

    // 4. Privacy Enforcement Clause
    if (!viewerId) {
      // Anonymous / Guest viewer: only public or anonymous_author
      whereClauses.push("p.privacy_level IN ('public', 'anonymous_author')");
    } else if (isLeader) {
      // Leaders can see everything, but respect delegation filter if church_delegation
      whereClauses.push(`(
        p.privacy_level IN ('public', 'anonymous_author', 'pastors_counselors')
        OR p.camper_id = ?
        OR (p.privacy_level = 'church_delegation' AND c.church_id = ?)
        OR ? = 1
      )`);
      bindParams.push(viewerId, viewer?.church_id || '', 1); // Leaders have full oversight
    } else {
      // Regular camper viewer
      whereClauses.push(`(
        p.privacy_level IN ('public', 'anonymous_author')
        OR p.camper_id = ?
        OR (p.privacy_level = 'church_delegation' AND c.church_id = ?)
      )`);
      bindParams.push(viewerId, viewer?.church_id || '');
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total Count Query
    const countSql = `
      SELECT COUNT(*) as count 
      FROM prayer_requests p
      JOIN campers c ON p.camper_id = c.id
      ${whereSql}
    `;
    const totalRow = await context.env.DB
      .prepare(countSql)
      .bind(...bindParams)
      .first<any>();
    const total = Number(totalRow?.count) || 0;

    // Fetch Paginated Prayer Requests
    const selectSql = `
      SELECT 
        p.id,
        p.camper_id,
        p.event_id,
        p.title,
        p.description,
        p.category,
        p.scripture_reference,
        p.privacy_level,
        p.is_anonymous,
        p.status,
        p.prayer_count,
        p.answered_at,
        p.resolution_notes,
        p.linked_testimony_id,
        p.created_at,
        p.updated_at,
        c.full_name as author_full_name,
        c.nickname as author_nickname,
        c.role as author_role,
        c.selfie_url as author_selfie_url,
        ch.name as author_church_name,
        ch.id as author_church_id
      FROM prayer_requests p
      JOIN campers c ON p.camper_id = c.id
      LEFT JOIN churches ch ON c.church_id = ch.id
      ${whereSql}
      ORDER BY 
        CASE WHEN p.status = 'open' THEN 0 ELSE 1 END ASC,
        p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const { results: rows } = await context.env.DB
      .prepare(selectSql)
      .bind(...bindParams, limit, offset)
      .all<any>();

    const prayerIds = (rows || []).map((r: any) => r.id);

    // Fetch Avatar Reaction Tracking for these prayer requests
    // 1. Viewer's prayer status
    const viewerPrayedMap = new Map<string, { prayer_count: number; last_prayed_at: string }>();
    if (viewerId && prayerIds.length > 0) {
      const placeholders = prayerIds.map(() => '?').join(',');
      const { results: vRows } = await context.env.DB
        .prepare(`
          SELECT prayer_id, prayer_count, last_prayed_at
          FROM prayer_participants
          WHERE camper_id = ? AND prayer_id IN (${placeholders})
        `)
        .bind(viewerId, ...prayerIds)
        .all<any>();

      for (const vr of vRows || []) {
        viewerPrayedMap.set(vr.prayer_id, {
          prayer_count: Number(vr.prayer_count) || 1,
          last_prayed_at: vr.last_prayed_at,
        });
      }
    }

    // 2. Top-5 recent praying avatars for each prayer request (Facepile)
    const participantsFacepileMap = new Map<string, any[]>();
    if (prayerIds.length > 0) {
      const placeholders = prayerIds.map(() => '?').join(',');
      // Fetch up to 10 participants per prayer
      const { results: pRows } = await context.env.DB
        .prepare(`
          SELECT 
            pp.prayer_id,
            pp.camper_id,
            pp.is_anonymous,
            pp.prayer_count,
            pp.last_prayed_at,
            cmp.full_name,
            cmp.nickname,
            cmp.role,
            cmp.selfie_url,
            church.name as church_name
          FROM prayer_participants pp
          JOIN campers cmp ON pp.camper_id = cmp.id
          LEFT JOIN churches church ON cmp.church_id = church.id
          WHERE pp.prayer_id IN (${placeholders})
          ORDER BY pp.last_prayed_at DESC
        `)
        .bind(...prayerIds)
        .all<any>();

      for (const pr of pRows || []) {
        if (!participantsFacepileMap.has(pr.prayer_id)) {
          participantsFacepileMap.set(pr.prayer_id, []);
        }
        const list = participantsFacepileMap.get(pr.prayer_id)!;
        if (list.length < 5) {
          const isParticipantAnon = Boolean(pr.is_anonymous);
          list.push({
            camper_id: pr.camper_id,
            nickname: isParticipantAnon ? 'Anonymous' : (pr.nickname || pr.full_name),
            selfie_url: isParticipantAnon ? null : pr.selfie_url,
            church_name: isParticipantAnon ? null : pr.church_name,
            prayer_count: pr.prayer_count,
            last_prayed_at: pr.last_prayed_at,
          });
        }
      }
    }

    // Assemble final response objects
    const prayers = (rows || []).map((row: any) => {
      const isAuthor = viewerId === row.camper_id;
      const isAnonymous = Boolean(row.is_anonymous || row.privacy_level === 'anonymous_author');

      const authorInfo = formatCamper(
        {
          id: row.camper_id,
          full_name: row.author_full_name,
          nickname: row.author_nickname,
          role: row.author_role,
          selfie_url: row.author_selfie_url,
          church_name: row.author_church_name,
        },
        isAnonymous,
        isAuthor
      );

      const viewerPrayed = viewerPrayedMap.get(row.id);
      const facepile = participantsFacepileMap.get(row.id) || [];

      // Check if prayed today (YYYY-MM-DD in UTC)
      let hasPrayedToday = false;
      if (viewerPrayed) {
        const lastDate = (viewerPrayed.last_prayed_at || '').substring(0, 10);
        const todayDate = new Date().toISOString().substring(0, 10);
        hasPrayedToday = lastDate === todayDate;
      }

      return {
        id: row.id,
        camper_id: isAnonymous && !isAuthor ? null : row.camper_id,
        event_id: row.event_id,
        title: row.title,
        description: row.description,
        category: row.category,
        scripture_reference: row.scripture_reference || null,
        privacy_level: row.privacy_level,
        is_anonymous: Boolean(row.is_anonymous),
        status: row.status,
        prayer_count: Number(row.prayer_count) || 0,
        answered_at: row.answered_at || null,
        resolution_notes: row.resolution_notes || null,
        linked_testimony_id: row.linked_testimony_id || null,
        created_at: row.created_at,
        updated_at: row.updated_at,
        author: authorInfo,
        has_prayed: Boolean(viewerPrayed),
        has_prayed_today: hasPrayedToday,
        user_prayer_count: viewerPrayed?.prayer_count || 0,
        recent_participants: facepile,
        is_owner: isAuthor,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        prayers,
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('[Get Prayers API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch prayer requests' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/prayers: Create a new prayer request
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid Content-Type. Please use application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await context.request.json()) as any;
    const camperId = extractCamperId(context.request, body);

    if (!camperId) {
      return new Response(
        JSON.stringify({ error: 'You must be signed in with your Camp Pass to share a prayer request' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify camper exists
    const camper = await context.env.DB
      .prepare(`
        SELECT cmp.id, cmp.full_name, cmp.nickname, cmp.role, cmp.selfie_url, c.name as church_name
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE cmp.id = ?
      `)
      .bind(camperId)
      .first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const title = (body.title || '').trim();
    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required for your prayer request' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (title.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Title cannot exceed 200 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const description = (body.description || body.content || '').trim();
    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Please describe what you are asking prayer for' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rawCategory = (body.category || 'general').trim();
    const category = ALLOWED_CATEGORIES.includes(rawCategory as any) ? rawCategory : 'general';

    const rawPrivacy = (body.privacy_level || 'public').trim();
    const privacyLevel = ALLOWED_PRIVACY_LEVELS.includes(rawPrivacy as any) ? rawPrivacy : 'public';

    const isAnonymous = Boolean(body.is_anonymous || privacyLevel === 'anonymous_author') ? 1 : 0;
    const scriptureReference = (body.scripture_reference || body.scriptureReference || '').trim() || null;

    const prayerId = `pray_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    await context.env.DB
      .prepare(`
        INSERT INTO prayer_requests (
          id, camper_id, event_id, title, description, category,
          scripture_reference, privacy_level, is_anonymous, status,
          prayer_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', 0, ?, ?)
      `)
      .bind(
        prayerId,
        camperId,
        'vlc-2027',
        title,
        description,
        category,
        scriptureReference,
        privacyLevel,
        isAnonymous,
        nowIso,
        nowIso
      )
      .run();

    const createdPrayer = {
      id: prayerId,
      camper_id: isAnonymous ? null : camperId,
      event_id: 'vlc-2027',
      title,
      description,
      category,
      scripture_reference: scriptureReference,
      privacy_level: privacyLevel,
      is_anonymous: Boolean(isAnonymous),
      status: 'open',
      prayer_count: 0,
      answered_at: null,
      resolution_notes: null,
      linked_testimony_id: null,
      created_at: nowIso,
      updated_at: nowIso,
      author: formatCamper(camper, Boolean(isAnonymous), true),
      has_prayed: false,
      has_prayed_today: false,
      user_prayer_count: 0,
      recent_participants: [],
      is_owner: true,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Prayer request shared with the community',
        prayer: createdPrayer,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('[Create Prayer API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create prayer request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
