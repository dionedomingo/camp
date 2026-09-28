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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

// GET /api/campers/:camper_id/posts: Paginated list of a camper's posts
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const camperId = context.params.camper_id as string;
    const url = new URL(context.request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '12', 10)));
    const offset = (page - 1) * limit;
    const viewerId = extractCamperId(context.request);

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

    // Total post count for this camper
    const totalRow = await context.env.DB
      .prepare('SELECT COUNT(*) as count FROM posts WHERE camper_id = ?')
      .bind(camperId)
      .first<any>();
    const total = Number(totalRow?.count) || 0;

    // Fetch posts ordered by created_at DESC
    const { results: postRows } = await context.env.DB
      .prepare(`
        SELECT id, camper_id, media_url, caption, created_at, updated_at
        FROM posts
        WHERE camper_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(camperId, limit, offset)
      .all<any>();

    const postIds = (postRows || []).map((p: any) => p.id);
    const reactionsMap = await getBatchReactions(context.env.DB, 'post', postIds, viewerId);
    const commentsCountMap = await getBatchCommentCounts(context.env.DB, postIds);

    const posts = (postRows || []).map((row: any) => {
      return transformPost(
        {
          ...row,
          camper_full_name: camper.full_name,
          camper_nickname: camper.nickname,
          camper_role: camper.role,
          camper_selfie_url: camper.selfie_url,
          camper_church_name: camper.church_name,
        },
        reactionsMap.get(row.id),
        commentsCountMap.get(row.id)
      );
    });

    return new Response(
      JSON.stringify({
        success: true,
        camper: {
          id: camper.id,
          full_name: camper.full_name,
          nickname: camper.nickname,
          role: camper.role,
          selfie_url: camper.selfie_url,
          church_name: camper.church_name,
        },
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
    console.error('[Get Camper Posts API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch camper posts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
