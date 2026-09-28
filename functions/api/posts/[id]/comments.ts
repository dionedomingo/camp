import { extractCamperId } from '../../_media/auth';
import { transformComment, getBatchReactions } from '../../_media/transformers';

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

// GET /api/posts/:id/comments: List comments for a post
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const postId = context.params.id as string;
    const viewerId = extractCamperId(context.request);

    // Verify post exists
    const post = await context.env.DB
      .prepare('SELECT id FROM posts WHERE id = ?')
      .bind(postId)
      .first<any>();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results: commentRows } = await context.env.DB
      .prepare(`
        SELECT 
          pc.id,
          pc.post_id,
          pc.camper_id,
          pc.body,
          pc.created_at,
          pc.updated_at,
          c.full_name,
          c.nickname,
          c.role,
          c.selfie_url
        FROM post_comments pc
        JOIN campers c ON pc.camper_id = c.id
        WHERE pc.post_id = ?
        ORDER BY pc.created_at ASC
      `)
      .bind(postId)
      .all<any>();

    const commentIds = (commentRows || []).map((c: any) => c.id);
    const reactionsMap = await getBatchReactions(context.env.DB, 'comment', commentIds, viewerId);

    const comments = (commentRows || []).map((row: any) => {
      return transformComment(row, reactionsMap.get(row.id));
    });

    return new Response(
      JSON.stringify({
        success: true,
        comments,
        count: comments.length,
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
    console.error('[Get Comments API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch comments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/posts/:id/comments: Add comment to a post
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const postId = context.params.id as string;
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

    const commentText = (body.body || body.text || body.comment || '').trim();
    if (!commentText) {
      return new Response(
        JSON.stringify({ error: 'Comment body cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (commentText.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Comment must be 1000 characters or less' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify post exists
    const post = await context.env.DB
      .prepare('SELECT id FROM posts WHERE id = ?')
      .bind(postId)
      .first<any>();

    if (!post) {
      return new Response(
        JSON.stringify({ error: 'Post not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify camper exists
    const camper = await context.env.DB
      .prepare('SELECT id, full_name, nickname, role, selfie_url FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const commentId = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    await context.env.DB
      .prepare(`
        INSERT INTO post_comments (id, post_id, camper_id, body, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(commentId, postId, camperId, commentText, nowIso, nowIso)
      .run();

    const commentRecord = {
      id: commentId,
      post_id: postId,
      camper_id: camperId,
      body: commentText,
      created_at: nowIso,
      updated_at: nowIso,
      full_name: camper.full_name,
      nickname: camper.nickname,
      role: camper.role,
      selfie_url: camper.selfie_url,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comment added successfully',
        comment: transformComment(commentRecord),
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
    console.error('[Add Comment API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to add comment' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
