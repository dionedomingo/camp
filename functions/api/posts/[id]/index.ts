import { extractCamperId } from '../../_media/auth';
import { 
  transformPost, 
  getBatchReactions, 
  getBatchCommentCounts 
} from '../../_media/transformers';

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

// GET /api/posts/:id: Get single post
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    const viewerId = extractCamperId(context.request);

    const postRow = await context.env.DB
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
        WHERE p.id = ?
      `)
      .bind(id)
      .first<any>();

    if (!postRow) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const reactionsMap = await getBatchReactions(context.env.DB, 'post', [id], viewerId);
    const commentsCountMap = await getBatchCommentCounts(context.env.DB, [id]);

    return new Response(
      JSON.stringify({
        success: true,
        post: transformPost(postRow, reactionsMap.get(id), commentsCountMap.get(id)),
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
    console.error('[Get Single Post API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/posts/:id: Delete post
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    const camperId = extractCamperId(context.request);

    if (!camperId) {
      return new Response(JSON.stringify({ error: 'Authentication required to delete post' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const post = await context.env.DB
      .prepare('SELECT id, camper_id FROM posts WHERE id = ?')
      .bind(id)
      .first<any>();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check ownership or admin
    if (post.camper_id !== camperId) {
      // Check if camper is admin/staff
      const camper = await context.env.DB
        .prepare('SELECT role FROM campers WHERE id = ?')
        .bind(camperId)
        .first<any>();

      if (!camper || !['admin', 'staff', 'coordinator'].includes(camper.role)) {
        return new Response(
          JSON.stringify({ error: 'You do not have permission to delete this post' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Cascade delete is configured on foreign keys; deleting post also deletes comments & reactions
    await context.env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
    await context.env.DB.prepare('DELETE FROM reactions WHERE reactable_type = "post" AND reactable_id = ?').bind(id).run();
    await context.env.DB.prepare('DELETE FROM post_comments WHERE post_id = ?').bind(id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Post deleted successfully',
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
    console.error('[Delete Post API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to delete post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
