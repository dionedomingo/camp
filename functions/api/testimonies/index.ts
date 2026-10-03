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

const ALLOWED_TESTIMONY_CATEGORIES = [
  'answered_prayer',
  'salvation',
  'healing',
  'spiritual_milestone',
  'delegation_story',
  'general',
] as const;

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

// GET /api/testimonies: Paginated list of camp praise reports and testimonies
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const categoryFilter = url.searchParams.get('category') || '';
    const viewerId = extractCamperId(context.request);

    const whereClauses: string[] = [];
    const bindParams: any[] = [];

    if (categoryFilter && ALLOWED_TESTIMONY_CATEGORIES.includes(categoryFilter as any)) {
      whereClauses.push('t.category = ?');
      bindParams.push(categoryFilter);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total Count
    const totalRow = await context.env.DB
      .prepare(`SELECT COUNT(*) as count FROM testimonies t ${whereSql}`)
      .bind(...bindParams)
      .first<any>();
    const total = Number(totalRow?.count) || 0;

    // Fetch Testimonies
    const { results: rows } = await context.env.DB
      .prepare(`
        SELECT 
          t.id,
          t.camper_id,
          t.prayer_request_id,
          t.event_id,
          t.title,
          t.content,
          t.scripture_reference,
          t.media_url,
          t.category,
          t.praise_count,
          t.is_featured,
          t.is_anonymous,
          t.created_at,
          t.updated_at,
          c.full_name as author_full_name,
          c.nickname as author_nickname,
          c.role as author_role,
          c.selfie_url as author_selfie_url,
          ch.name as author_church_name,
          pr.title as linked_prayer_title,
          pr.prayer_count as linked_prayer_count,
          pr.answered_at as linked_answered_at
        FROM testimonies t
        JOIN campers c ON t.camper_id = c.id
        LEFT JOIN churches ch ON c.church_id = ch.id
        LEFT JOIN prayer_requests pr ON t.prayer_request_id = pr.id
        ${whereSql}
        ORDER BY t.is_featured DESC, t.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...bindParams, limit, offset)
      .all<any>();

    const testimonyIds = (rows || []).map((r: any) => r.id);

    // Fetch viewer's reactions for these testimonies
    const viewerReactionsMap = new Map<string, string>();
    if (viewerId && testimonyIds.length > 0) {
      const placeholders = testimonyIds.map(() => '?').join(',');
      const { results: trRows } = await context.env.DB
        .prepare(`
          SELECT testimony_id, reaction_type
          FROM testimony_reactions
          WHERE camper_id = ? AND testimony_id IN (${placeholders})
        `)
        .bind(viewerId, ...testimonyIds)
        .all<any>();

      for (const tr of trRows || []) {
        viewerReactionsMap.set(tr.testimony_id, tr.reaction_type);
      }
    }

    const testimonies = (rows || []).map((row: any) => {
      const isAuthor = viewerId === row.camper_id;
      const isAnonymous = Boolean(row.is_anonymous);

      const author = formatCamper(
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

      const userReaction = viewerReactionsMap.get(row.id) || null;

      return {
        id: row.id,
        camper_id: isAnonymous && !isAuthor ? null : row.camper_id,
        prayer_request_id: row.prayer_request_id || null,
        event_id: row.event_id,
        title: row.title,
        content: row.content,
        scripture_reference: row.scripture_reference || null,
        media_url: row.media_url || null,
        category: row.category,
        praise_count: Number(row.praise_count) || 0,
        is_featured: Boolean(row.is_featured),
        is_anonymous: isAnonymous,
        created_at: row.created_at,
        updated_at: row.updated_at,
        author,
        user_reaction: userReaction,
        has_praised: Boolean(userReaction),
        linked_prayer: row.prayer_request_id
          ? {
              id: row.prayer_request_id,
              title: row.linked_prayer_title,
              prayer_count: Number(row.linked_prayer_count) || 0,
              answered_at: row.linked_answered_at,
            }
          : null,
        is_owner: isAuthor,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        testimonies,
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
    console.error('[Get Testimonies API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch testimonies' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/testimonies: Create a new testimony (praise report)
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
        JSON.stringify({ error: 'Please sign in with your Camp Pass to share a testimony' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
        JSON.stringify({ error: 'Testimony title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const content = (body.content || body.description || '').trim();
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Testimony content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rawCategory = (body.category || 'general').trim();
    const category = ALLOWED_TESTIMONY_CATEGORIES.includes(rawCategory as any) ? rawCategory : 'general';

    const scriptureReference = (body.scripture_reference || body.scriptureReference || '').trim() || null;
    const mediaUrl = (body.media_url || body.mediaUrl || '').trim() || null;
    const isAnonymous = Boolean(body.is_anonymous) ? 1 : 0;
    const prayerRequestId = (body.prayer_request_id || '').trim() || null;

    const testimonyId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    await context.env.DB
      .prepare(`
        INSERT INTO testimonies (
          id, camper_id, prayer_request_id, event_id, title, content,
          scripture_reference, media_url, category, praise_count, is_featured, is_anonymous, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?)
      `)
      .bind(
        testimonyId,
        camperId,
        prayerRequestId,
        'vlc-2027',
        title,
        content,
        scriptureReference,
        mediaUrl,
        category,
        isAnonymous,
        nowIso,
        nowIso
      )
      .run();

    const createdTestimony = {
      id: testimonyId,
      camper_id: isAnonymous ? null : camperId,
      prayer_request_id: prayerRequestId,
      event_id: 'vlc-2027',
      title,
      content,
      scripture_reference: scriptureReference,
      media_url: mediaUrl,
      category,
      praise_count: 0,
      is_featured: false,
      is_anonymous: Boolean(isAnonymous),
      created_at: nowIso,
      updated_at: nowIso,
      author: formatCamper(camper, Boolean(isAnonymous), true),
      user_reaction: null,
      has_praised: false,
      linked_prayer: null,
      is_owner: true,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your testimony has been published to praise God!',
        testimony: createdTestimony,
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
    console.error('[Create Testimony API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create testimony' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
