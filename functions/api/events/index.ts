interface Env {
  DB: D1Database;
}

function computeRegistrationStatus(e: any): { registration_status: 'open' | 'upcoming' | 'closed'; is_registration_allowed: boolean } {
  const today = new Date().toISOString().split('T')[0];
  if (e.status === 'completed' || e.status === 'archived') {
    return { registration_status: 'closed', is_registration_allowed: false };
  }
  if (e.registration_start_date && today < e.registration_start_date) {
    return { registration_status: 'upcoming', is_registration_allowed: false };
  }
  if (e.registration_end_date && today > e.registration_end_date) {
    return { registration_status: 'closed', is_registration_allowed: false };
  }
  return { registration_status: 'open', is_registration_allowed: true };
}

// GET /api/events: Returns camp events (default active event)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    if (slug || id) {
      const event: any = await context.env.DB
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

      event.primary_image_url = event.primary_image_url || event.banner_url || null;
      event.banner_url = event.banner_url || event.primary_image_url || null;
      const regInfo = computeRegistrationStatus(event);
      event.registration_status = regInfo.registration_status;
      event.is_registration_allowed = regInfo.is_registration_allowed;

      return new Response(JSON.stringify({ event }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // List all events, ordered by start_date DESC
    const { results } = await context.env.DB
      .prepare(`SELECT * FROM events ORDER BY start_date DESC`)
      .all();

    const normalizedEvents = (results || []).map((e: any) => {
      const regInfo = computeRegistrationStatus(e);
      return {
        ...e,
        primary_image_url: e.primary_image_url || e.banner_url || null,
        banner_url: e.banner_url || e.primary_image_url || null,
        registration_status: regInfo.registration_status,
        is_registration_allowed: regInfo.is_registration_allowed,
      };
    });

    const activeEvent = normalizedEvents.find((e: any) => e.status === 'active') || normalizedEvents[0] || null;

    return new Response(
      JSON.stringify({
        events: normalizedEvents,
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
    const primaryImageUrl = body.primary_image_url || body.banner_url || null;
    const bannerUrl = body.banner_url || body.primary_image_url || null;
    const registrationStartDate = body.registration_start_date ? String(body.registration_start_date).trim() : null;
    const registrationEndDate = body.registration_end_date ? String(body.registration_end_date).trim() : null;

    if (registrationStartDate && registrationEndDate && registrationStartDate > registrationEndDate) {
      return new Response(
        JSON.stringify({ error: 'Registration start date cannot be later than registration cutoff date' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await context.env.DB
      .prepare(`
        INSERT INTO events (
          id, slug, name, theme, tagline, description,
          start_date, end_date, venue_name, venue_address,
          city, province, target_capacity, status,
          primary_image_url, banner_url,
          registration_start_date, registration_end_date
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?
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
          status = excluded.status,
          primary_image_url = COALESCE(excluded.primary_image_url, events.primary_image_url),
          banner_url = COALESCE(excluded.banner_url, events.banner_url),
          registration_start_date = excluded.registration_start_date,
          registration_end_date = excluded.registration_end_date
      `)
      .bind(
        id, slug, name, theme, tagline, description,
        startDate, endDate, venueName, venueAddress,
        city, province, targetCapacity, status,
        primaryImageUrl, bannerUrl,
        registrationStartDate, registrationEndDate
      )
      .run();

    const updated: any = await context.env.DB
      .prepare('SELECT * FROM events WHERE id = ?')
      .bind(id)
      .first();

    if (updated) {
      updated.primary_image_url = updated.primary_image_url || updated.banner_url || null;
      updated.banner_url = updated.banner_url || updated.primary_image_url || null;
      const regInfo = computeRegistrationStatus(updated);
      updated.registration_status = regInfo.registration_status;
      updated.is_registration_allowed = regInfo.is_registration_allowed;
    }

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
