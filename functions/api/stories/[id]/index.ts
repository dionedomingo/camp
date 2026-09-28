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
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

// GET /api/stories/:id: Get single story
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    const viewerId = extractCamperId(context.request);

    const storyRow = await context.env.DB
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
        WHERE s.id = ?
      `)
      .bind(id)
      .first<any>();

    if (!storyRow) {
      return new Response(JSON.stringify({ error: 'Story not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const reactionsMap = await getBatchReactions(context.env.DB, 'story', [id], viewerId);

    return new Response(
      JSON.stringify({
        success: true,
        story: transformStory(storyRow, reactionsMap.get(id)),
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
    console.error('[Get Story API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch story' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/stories/:id: Delete story
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    const camperId = extractCamperId(context.request);

    if (!camperId) {
      return new Response(JSON.stringify({ error: 'Authentication required to delete story' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const story = await context.env.DB
      .prepare('SELECT id, camper_id FROM stories WHERE id = ?')
      .bind(id)
      .first<any>();

    if (!story) {
      return new Response(JSON.stringify({ error: 'Story not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (story.camper_id !== camperId) {
      const camper = await context.env.DB
        .prepare('SELECT role FROM campers WHERE id = ?')
        .bind(camperId)
        .first<any>();

      if (!camper || !['admin', 'staff', 'coordinator'].includes(camper.role)) {
        return new Response(
          JSON.stringify({ error: 'You do not have permission to delete this story' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    await context.env.DB.prepare('DELETE FROM stories WHERE id = ?').bind(id).run();
    await context.env.DB.prepare('DELETE FROM reactions WHERE reactable_type = "story" AND reactable_id = ?').bind(id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Story deleted successfully',
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
    console.error('[Delete Story API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to delete story' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
