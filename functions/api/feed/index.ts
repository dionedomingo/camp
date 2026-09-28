import { extractCamperId } from '../_media/auth';
import { 
  transformPost, 
  transformStory, 
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

// GET /api/feed: Community feed combining recent posts and camper story highlights
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const viewerId = extractCamperId(context.request);

    // 1. Total posts count
    const totalRow = await context.env.DB
      .prepare('SELECT COUNT(*) as count FROM posts')
      .first<any>();
    const total = Number(totalRow?.count) || 0;

    // 2. Paginated posts with camper and church info
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
    const postReactionsMap = await getBatchReactions(context.env.DB, 'post', postIds, viewerId);
    const commentCountsMap = await getBatchCommentCounts(context.env.DB, postIds);

    const posts = (postRows || []).map((row: any) => {
      return transformPost(row, postReactionsMap.get(row.id), commentCountsMap.get(row.id));
    });

    // 3. Camper stories reel (grouped by camper for the top carousel/stories tray)
    let camperStories: any[] = [];
    if (page === 1) {
      const { results: storyRows } = await context.env.DB
        .prepare(`
          SELECT 
            s.id,
            s.camper_id,
            s.media_url,
            s.caption,
            s.created_at,
            s.updated_at,
            c.full_name,
            c.nickname,
            c.role,
            c.selfie_url,
            ch.name as church_name
          FROM stories s
          JOIN campers c ON s.camper_id = c.id
          LEFT JOIN churches ch ON c.church_id = ch.id
          ORDER BY s.created_at ASC
        `)
        .all<any>();

      const storyIds = (storyRows || []).map((s: any) => s.id);
      const storyReactionsMap = await getBatchReactions(context.env.DB, 'story', storyIds, viewerId);

      const camperMap = new Map<string, {
        camper: {
          id: string;
          full_name: string;
          nickname: string;
          role: string;
          selfie_url: string | null;
          church_name: string | null;
        };
        latest_story_at: string;
        stories: any[];
      }>();

      for (const row of storyRows || []) {
        const transformed = transformStory(row, storyReactionsMap.get(row.id));
        if (!camperMap.has(row.camper_id)) {
          camperMap.set(row.camper_id, {
            camper: transformed.camper,
            latest_story_at: row.created_at,
            stories: [],
          });
        }
        const group = camperMap.get(row.camper_id)!;
        group.stories.push(transformed);
        group.latest_story_at = row.created_at;
      }

      camperStories = Array.from(camperMap.values()).sort(
        (a, b) => new Date(b.latest_story_at).getTime() - new Date(a.latest_story_at).getTime()
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        posts,
        camper_stories: camperStories,
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
    console.error('[Community Feed API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch community feed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
