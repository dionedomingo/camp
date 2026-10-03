import { extractCamperId } from '../../_media/auth';

interface Env {
  DB: D1Database;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

// PATCH /api/prayers/:id/resolve: Mark prayer as "God has answered!" with optional testimony generation
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  return handleResolve(context);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  return handleResolve(context);
};

async function handleResolve(context: EventContext<Env, any, any>) {
  try {
    const prayerId = context.params.id as string;
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
        JSON.stringify({ error: 'Please sign in with your Camp Pass' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch prayer request
    const prayer = await context.env.DB
      .prepare(`
        SELECT 
          id, camper_id, event_id, title, description, category,
          scripture_reference, privacy_level, is_anonymous, status,
          prayer_count, linked_testimony_id
        FROM prayer_requests
        WHERE id = ?
      `)
      .bind(prayerId)
      .first<any>();

    if (!prayer) {
      return new Response(
        JSON.stringify({ error: 'Prayer request not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verify permissions (Author or Admin/Staff)
    const camper = await context.env.DB
      .prepare('SELECT id, role FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    const isAdmin = camper && ['admin', 'staff'].includes(camper.role);
    const isAuthor = prayer.camper_id === camperId;

    if (!isAuthor && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Only the author of this prayer request can mark it as answered' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resolutionNotes = (body.resolution_notes || body.notes || body.praise_report || '').trim();
    if (!resolutionNotes) {
      return new Response(
        JSON.stringify({ error: 'Please share a brief note or praise report of how God answered!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const nowIso = new Date().toISOString();
    let linkedTestimonyId = prayer.linked_testimony_id || null;

    // 3. Optional: Create linked Testimony post
    const shouldCreateTestimony = Boolean(body.create_testimony);
    if (shouldCreateTestimony && !linkedTestimonyId) {
      linkedTestimonyId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const testimonyTitle = body.testimony_title || `God Answered: ${prayer.title}`;
      const testimonyMediaUrl = (body.testimony_media_url || '').trim() || null;

      await context.env.DB
        .prepare(`
          INSERT INTO testimonies (
            id, camper_id, prayer_request_id, event_id, title, content,
            scripture_reference, media_url, category, praise_count, is_featured, is_anonymous, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'answered_prayer', 0, 0, ?, ?, ?)
        `)
        .bind(
          linkedTestimonyId,
          prayer.camper_id,
          prayer.id,
          prayer.event_id || 'vlc-2027',
          testimonyTitle,
          resolutionNotes,
          prayer.scripture_reference || null,
          testimonyMediaUrl,
          prayer.is_anonymous ? 1 : 0,
          nowIso,
          nowIso
        )
        .run();
    }

    // 4. Update prayer_request status
    await context.env.DB
      .prepare(`
        UPDATE prayer_requests
        SET status = 'answered', answered_at = ?, resolution_notes = ?, linked_testimony_id = ?, updated_at = ?
        WHERE id = ?
      `)
      .bind(nowIso, resolutionNotes, linkedTestimonyId, nowIso, prayerId)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Praise God! Your prayer request has been marked as answered!',
        status: 'answered',
        answered_at: nowIso,
        resolution_notes: resolutionNotes,
        linked_testimony_id: linkedTestimonyId,
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
    console.error('[Resolve Prayer API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to mark prayer as answered' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
