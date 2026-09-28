import { extractCamperId } from '../../_media/auth';
import { transformStory, getBatchReactions } from '../../_media/transformers';

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

// GET /api/campers/:camper_id/stories: Chronological list of a camper's permanent stories
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const camperId = context.params.camper_id as string;
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

    // Chronological order (ASC) as requested: permanent stories / highlights reel
    const { results: storyRows } = await context.env.DB
      .prepare(`
        SELECT id, camper_id, media_url, caption, created_at, updated_at
        FROM stories
        WHERE camper_id = ?
        ORDER BY created_at ASC
      `)
      .bind(camperId)
      .all<any>();

    const storyIds = (storyRows || []).map((s: any) => s.id);
    const reactionsMap = await getBatchReactions(context.env.DB, 'story', storyIds, viewerId);

    const stories = (storyRows || []).map((row: any) => {
      return transformStory(
        {
          ...row,
          camper_full_name: camper.full_name,
          camper_nickname: camper.nickname,
          camper_role: camper.role,
          camper_selfie_url: camper.selfie_url,
          camper_church_name: camper.church_name,
        },
        reactionsMap.get(row.id)
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
        stories,
        count: stories.length,
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
    console.error('[Get Camper Stories API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch camper stories' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
