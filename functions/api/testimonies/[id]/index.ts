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

// GET /api/testimonies/:id: Single testimony details
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const testimonyId = context.params.id as string;
    const viewerId = extractCamperId(context.request);

    const row = await context.env.DB
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
        WHERE t.id = ?
      `)
      .bind(testimonyId)
      .first<any>();

    if (!row) {
      return new Response(JSON.stringify({ error: 'Testimony not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isAuthor = viewerId === row.camper_id;
    const isAnonymous = Boolean(row.is_anonymous);

    let userReaction: string | null = null;
    if (viewerId) {
      const reac = await context.env.DB
        .prepare('SELECT reaction_type FROM testimony_reactions WHERE testimony_id = ? AND camper_id = ?')
        .bind(testimonyId, viewerId)
        .first<any>();
      if (reac) userReaction = reac.reaction_type;
    }

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

    const testimony = {
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

    return new Response(JSON.stringify({ success: true, testimony }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('[Get Single Testimony API] Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to fetch testimony' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE /api/testimonies/:id: Delete testimony (author or admin only)
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const testimonyId = context.params.id as string;
    const camperId = extractCamperId(context.request);

    if (!camperId) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = await context.env.DB
      .prepare('SELECT id, camper_id FROM testimonies WHERE id = ?')
      .bind(testimonyId)
      .first<any>();

    if (!row) {
      return new Response(JSON.stringify({ error: 'Testimony not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const camper = await context.env.DB
      .prepare('SELECT id, role FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    const isAdmin = camper && ['admin', 'staff'].includes(camper.role);
    const isAuthor = row.camper_id === camperId;

    if (!isAuthor && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Permission denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB
      .prepare('DELETE FROM testimonies WHERE id = ?')
      .bind(testimonyId)
      .run();

    return new Response(
      JSON.stringify({ success: true, message: 'Testimony deleted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('[Delete Testimony API] Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to delete testimony' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
