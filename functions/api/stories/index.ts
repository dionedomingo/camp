import { extractCamperId } from '../_media/auth';
import { transformStory, getBatchReactions } from '../_media/transformers';

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

// POST /api/stories: Create a permanent story record after R2 upload
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
        JSON.stringify({ error: 'media_url is required to post a story' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const caption = body.caption ? body.caption.trim() : null;
    const storyId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    await context.env.DB
      .prepare(`
        INSERT INTO stories (id, camper_id, media_url, caption, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(storyId, camperId, mediaUrl, caption, nowIso, nowIso)
      .run();

    const storyRecord = {
      id: storyId,
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
        message: 'Story posted successfully',
        story: transformStory(storyRecord),
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
    console.error('[Create Story API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create story' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// GET /api/stories: Returns campers who have stories grouped for community stories carousel
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const viewerId = extractCamperId(context.request);

    // Get stories grouped by camper
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
    const reactionsMap = await getBatchReactions(context.env.DB, 'story', storyIds, viewerId);

    // Group stories by camper
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
      const transformed = transformStory(row, reactionsMap.get(row.id));
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

    const camperStories = Array.from(camperMap.values()).sort(
      (a, b) => new Date(b.latest_story_at).getTime() - new Date(a.latest_story_at).getTime()
    );

    return new Response(
      JSON.stringify({
        success: true,
        camper_stories: camperStories,
        total_stories: storyRows ? storyRows.length : 0,
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
    console.error('[Get Stories API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch stories' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
