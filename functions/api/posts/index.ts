import { extractCamperId } from '../_media/auth';
import { 
  transformPost, 
  getBatchReactions, 
  getBatchCommentCounts 
} from '../_media/transformers';

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

// POST /api/posts: Create a post record after R2 upload
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
        JSON.stringify({ error: 'camper_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
        JSON.stringify({ error: 'Camper not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const mediaUrl = (body.media_url || body.mediaUrl || (body.r2_key ? `/api/media/${body.r2_key}` : '') || '').trim();
    if (!mediaUrl) {
      return new Response(
        JSON.stringify({ error: 'media_url is required to create a post' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const caption = (body.caption || '').trim();
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    await context.env.DB
      .prepare(`
        INSERT INTO posts (id, camper_id, media_url, caption, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(postId, camperId, mediaUrl, caption, nowIso, nowIso)
      .run();

    const postRecord = {
      id: postId,
      camper_id: camperId,
      media_url: mediaUrl,
      caption,
      created_at: nowIso,
      updated_at: nowIso,
      full_name: camper.full_name,
      nickname: camper.nickname,
      role: camper.role,
      selfie_url: camper.selfie_url,
      church_name: camper.church_name,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Post created successfully',
        post: transformPost(postRecord, undefined, 0),
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
    console.error('[Create Post API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// GET /api/posts: Paginated list of recent posts across the community
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const viewerId = extractCamperId(context.request);

    // Total count
    const totalRow = await context.env.DB
      .prepare('SELECT COUNT(*) as count FROM posts')
      .first<any>();
    const total = Number(totalRow?.count) || 0;

    // Fetch posts with camper info
    const { results: postRows } = await context.env.DB
      .prepare(`
        SELECT 
          p.id,
          p.camper_id,
          p.media_url,
          p.caption,
          p.created_at,
          p.updated_at,
          c.full_name,
          c.nickname,
          c.role,
          c.selfie_url,
          ch.name as church_name
        FROM posts p
        JOIN campers c ON p.camper_id = c.id
        LEFT JOIN churches ch ON c.church_id = ch.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all<any>();

    const postIds = (postRows || []).map((p: any) => p.id);
    const reactionsMap = await getBatchReactions(context.env.DB, 'post', postIds, viewerId);
    const commentsCountMap = await getBatchCommentCounts(context.env.DB, postIds);

    const posts = (postRows || []).map((row: any) => {
      return transformPost(row, reactionsMap.get(row.id), commentsCountMap.get(row.id));
    });

    return new Response(
      JSON.stringify({
        success: true,
        posts,
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
    console.error('[Get Posts API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch posts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
