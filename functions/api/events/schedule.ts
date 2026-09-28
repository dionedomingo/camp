interface Env {
  DB: D1Database;
}

// GET /api/events/schedule: Get schedule items for an event
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const eventId = url.searchParams.get('event_id') || 'vlc-2027';

    const { results } = await context.env.DB
      .prepare(`
        SELECT * FROM event_schedules 
        WHERE event_id = ? 
        ORDER BY day_number ASC, sort_order ASC, time_start ASC
      `)
      .bind(eventId)
      .all();

    return new Response(
      JSON.stringify({
        event_id: eventId,
        schedules: results,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[Schedule API] Error fetching schedule:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch schedule' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/events/schedule: Create or update schedule item
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as any;
    const id = body.id || ('sch_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36));
    const eventId = body.event_id || 'vlc-2027';
    const dayNumber = Number(body.day_number) || 1;
    const dayTitle = (body.day_title || `Day ${dayNumber}`).trim();
    const date = body.date || '2027-07-21';
    const timeStart = (body.time_start || '08:00').trim();
    const timeEnd = (body.time_end || '09:00').trim();
    const timeDisplay = (body.time_display || `${timeStart} - ${timeEnd}`).trim();
    const title = (body.title || '').trim();
    const description = (body.description || '').trim();
    const location = (body.location || 'Main Auditorium').trim();
    const speaker = (body.speaker || '').trim();
    const sessionType = (body.session_type || 'general').trim();
    const sortOrder = Number(body.sort_order) || 0;

    if (!title) {
      return new Response(JSON.stringify({ error: 'Session title is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB
      .prepare(`
        INSERT INTO event_schedules (
          id, event_id, day_number, day_title, date,
          time_start, time_end, time_display, title,
          description, location, speaker, session_type, sort_order
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          day_number = excluded.day_number,
          day_title = excluded.day_title,
          date = excluded.date,
          time_start = excluded.time_start,
          time_end = excluded.time_end,
          time_display = excluded.time_display,
          title = excluded.title,
          description = excluded.description,
          location = excluded.location,
          speaker = excluded.speaker,
          session_type = excluded.session_type,
          sort_order = excluded.sort_order
      `)
      .bind(
        id, eventId, dayNumber, dayTitle, date,
        timeStart, timeEnd, timeDisplay, title,
        description, location, speaker, sessionType, sortOrder
      )
      .run();

    const saved = await context.env.DB
      .prepare('SELECT * FROM event_schedules WHERE id = ?')
      .bind(id)
      .first();

    return new Response(JSON.stringify({ success: true, schedule: saved }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Schedule API] Error saving schedule item:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to save schedule item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE /api/events/schedule: Delete a schedule item
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Schedule item ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB
      .prepare('DELETE FROM event_schedules WHERE id = ?')
      .bind(id)
      .run();

    return new Response(JSON.stringify({ success: true, message: 'Schedule session deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Schedule API] Error deleting schedule item:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete schedule item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
