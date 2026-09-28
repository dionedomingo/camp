interface Env {
  DB: D1Database;
}

// GET /api/events: Returns camp events (default active event)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    if (slug || id) {
      const event = await context.env.DB
        .prepare(`
          SELECT * FROM events 
          WHERE slug = ? OR id = ?
          LIMIT 1
        `)
        .bind(slug || id, id || slug)
        .first();

      if (!event) {
        return new Response(JSON.stringify({ error: 'Event not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ event }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // List all events, ordered by start_date DESC
    const { results } = await context.env.DB
      .prepare(`SELECT * FROM events ORDER BY start_date DESC`)
      .all();

    const activeEvent = results.find((e: any) => e.status === 'active') || results[0] || null;

    return new Response(
      JSON.stringify({
        events: results,
        active_event: activeEvent,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[Events API] Error fetching events:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/events: Update or create event
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as any;
    const id = (body.id || 'vlc-2027').trim();
    const slug = (body.slug || 'vlc-2027').trim();
    const name = (body.name || 'Vision & Leadership Camp 2027').trim();
    const theme = (body.theme || 'Arise & Shine (Isaiah 60:1)').trim();
    const tagline = (body.tagline || '').trim();
    const description = (body.description || '').trim();
    const startDate = body.start_date || '2027-07-21';
    const endDate = body.end_date || '2027-07-24';
    const venueName = (body.venue_name || 'PCCI National Campgrounds').trim();
    const venueAddress = (body.venue_address || 'Maharlika Highway').trim();
    const city = (body.city || 'Bambang').trim();
    const province = (body.province || 'Nueva Vizcaya').trim();
    const targetCapacity = Number(body.target_capacity) || 600;
    const status = body.status || 'active';

    await context.env.DB
      .prepare(`
        INSERT INTO events (
          id, slug, name, theme, tagline, description,
          start_date, end_date, venue_name, venue_address,
          city, province, target_capacity, status
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          slug = excluded.slug,
          name = excluded.name,
          theme = excluded.theme,
          tagline = excluded.tagline,
          description = excluded.description,
          start_date = excluded.start_date,
          end_date = excluded.end_date,
          venue_name = excluded.venue_name,
          venue_address = excluded.venue_address,
          city = excluded.city,
          province = excluded.province,
          target_capacity = excluded.target_capacity,
          status = excluded.status
      `)
      .bind(
        id, slug, name, theme, tagline, description,
        startDate, endDate, venueName, venueAddress,
        city, province, targetCapacity, status
      )
      .run();

    const updated = await context.env.DB
      .prepare('SELECT * FROM events WHERE id = ?')
      .bind(id)
      .first();

    return new Response(JSON.stringify({ success: true, event: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Events API] Error saving event:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to save event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
