import { extractCamperId } from '../../_media/auth';

interface Env {
  DB: D1Database;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

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

// GET /api/prayers/:id: Fetch single prayer request details
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const prayerId = context.params.id as string;
    const viewerId = extractCamperId(context.request);

    let viewer: any = null;
    if (viewerId) {
      viewer = await context.env.DB
        .prepare('SELECT id, role, church_id FROM campers WHERE id = ?')
        .bind(viewerId)
        .first<any>();
    }

    const row = await context.env.DB
      .prepare(`
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
        WHERE p.id = ?
      `)
      .bind(prayerId)
      .first<any>();

    if (!row) {
      return new Response(JSON.stringify({ error: 'Prayer request not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isAuthor = viewerId === row.camper_id;
    const isLeader = viewer && ['admin', 'pastor', 'counselor', 'staff'].includes(viewer.role);

    // Privacy Verification
    if (row.privacy_level === 'pastors_counselors' && !isLeader && !isAuthor) {
      return new Response(JSON.stringify({ error: 'This prayer request is restricted to camp pastoral staff.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (row.privacy_level === 'church_delegation' && !isAuthor && !isLeader) {
      if (!viewer || viewer.church_id !== row.author_church_id) {
        return new Response(JSON.stringify({ error: 'This prayer request is only visible to members of the delegation.' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Check if viewer has prayed
    let viewerPrayed: any = null;
    if (viewerId) {
      viewerPrayed = await context.env.DB
        .prepare('SELECT prayer_count, last_prayed_at FROM prayer_participants WHERE prayer_id = ? AND camper_id = ?')
        .bind(prayerId, viewerId)
        .first<any>();
    }

    // Fetch top 5 recent participants for facepile
    const { results: pRows } = await context.env.DB
      .prepare(`
        SELECT 
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
        WHERE pp.prayer_id = ?
        ORDER BY pp.last_prayed_at DESC
        LIMIT 5
      `)
      .bind(prayerId)
      .all<any>();

    const facepile = (pRows || []).map((pr: any) => {
      const isAnon = Boolean(pr.is_anonymous);
      return {
        camper_id: pr.camper_id,
        nickname: isAnon ? 'Anonymous' : (pr.nickname || pr.full_name),
        selfie_url: isAnon ? null : pr.selfie_url,
        church_name: isAnon ? null : pr.church_name,
        prayer_count: pr.prayer_count,
        last_prayed_at: pr.last_prayed_at,
      };
    });

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

    let hasPrayedToday = false;
    if (viewerPrayed) {
      const lastDate = (viewerPrayed.last_prayed_at || '').substring(0, 10);
      const todayDate = new Date().toISOString().substring(0, 10);
      hasPrayedToday = lastDate === todayDate;
    }

    const prayer = {
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

    return new Response(
      JSON.stringify({ success: true, prayer }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('[Get Single Prayer API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch prayer' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/prayers/:id: Delete prayer request (author or admin only)
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const prayerId = context.params.id as string;
    const camperId = extractCamperId(context.request);

    if (!camperId) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prayer = await context.env.DB
      .prepare('SELECT id, camper_id FROM prayer_requests WHERE id = ?')
      .bind(prayerId)
      .first<any>();

    if (!prayer) {
      return new Response(JSON.stringify({ error: 'Prayer request not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const camper = await context.env.DB
      .prepare('SELECT id, role FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    const isAdmin = camper && ['admin', 'staff'].includes(camper.role);
    const isAuthor = prayer.camper_id === camperId;

    if (!isAuthor && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Permission denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB
      .prepare('DELETE FROM prayer_requests WHERE id = ?')
      .bind(prayerId)
      .run();

    return new Response(
      JSON.stringify({ success: true, message: 'Prayer request deleted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('[Delete Prayer API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to delete prayer' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
