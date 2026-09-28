import { dispatchCamperPassportEmail } from '../_email/dispatcher';
import { EmailEnv } from '../_email/types';

interface Env extends EmailEnv {
  DB: D1Database;
}

// GET /api/camper/events: Get camper's registered camp events & available next events
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const camperId = url.searchParams.get('camper_id');

    if (!camperId) {
      return new Response(JSON.stringify({ error: 'camper_id parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch all registered events for this camper
    const { results: registrations } = await context.env.DB
      .prepare(`
        SELECT 
          er.id,
          er.event_id,
          e.name as event_name,
          e.slug as event_slug,
          e.theme as event_theme,
          e.start_date,
          e.end_date,
          (e.start_date || ' to ' || e.end_date) as event_dates,
          e.venue_name as event_venue,
          e.city as event_city,
          er.camper_id,
          er.church_id,
          c.name as church_name,
          c.slug as church_slug,
          er.role,
          er.activation_code,
          er.activation_token,
          er.status,
          er.checked_in_at,
          er.checked_in_by,
          er.kit_claimed,
          er.created_at
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        LEFT JOIN churches c ON er.church_id = c.id
        WHERE er.camper_id = ?
        ORDER BY e.start_date DESC
      `)
      .bind(camperId)
      .all();

    // 2. Fetch available events that camper hasn't joined yet
    const { results: availableEvents } = await context.env.DB
      .prepare(`
        SELECT * FROM events 
        WHERE id NOT IN (
          SELECT event_id FROM event_registrations WHERE camper_id = ?
        )
        AND status IN ('active', 'upcoming')
        ORDER BY start_date ASC
      `)
      .bind(camperId)
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        registrations,
        available_events: availableEvents,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch camper events';
    console.error('[Camper Events API] Error:', err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/camper/events: Join a new camp event using existing account
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      camper_id: string;
      event_id: string;
      church_id?: string;
      role?: string;
    };

    if (!body.camper_id || !body.event_id) {
      return new Response(
        JSON.stringify({ error: 'camper_id and event_id are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch camper profile
    const camper: any = await context.env.DB
      .prepare('SELECT * FROM campers WHERE id = ?')
      .bind(body.camper_id)
      .first();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper account not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch event details
    const event: any = await context.env.DB
      .prepare('SELECT * FROM events WHERE id = ?')
      .bind(body.event_id)
      .first();

    if (!event) {
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Check if already registered for this event
    const existingRegistration: any = await context.env.DB
      .prepare('SELECT * FROM event_registrations WHERE camper_id = ? AND event_id = ?')
      .bind(body.camper_id, body.event_id)
      .first();

    if (existingRegistration) {
      return new Response(
        JSON.stringify({
          success: true,
          already_registered: true,
          message: `You are already registered for ${event.name}!`,
          registration: existingRegistration,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Generate new human-friendly activation pass code for this event
    const codeChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let codeSuffix = '';
    for (let i = 0; i < 4; i++) {
      codeSuffix += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
    }
    const activationCode = `VLC-${codeSuffix}`;
    const activationToken = 'act_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const regId = 'reg_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    const churchId = body.church_id || camper.church_id;
    const role = body.role || camper.role || 'camper';

    // 5. Insert new event registration
    await context.env.DB
      .prepare(`
        INSERT INTO event_registrations (
          id, event_id, camper_id, church_id, role,
          dietary_needs, ministry_interests, activation_code,
          activation_token, status, kit_claimed
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, 'registered', 0
        )
      `)
      .bind(
        regId,
        body.event_id,
        body.camper_id,
        churchId,
        role,
        camper.dietary_needs || 'None',
        camper.ministry_interests || '[]',
        activationCode,
        activationToken
      )
      .run();

    // 6. Update camper's current event pointer and active pass code
    await context.env.DB
      .prepare(`
        UPDATE campers
        SET event_id = ?,
            activation_code = ?,
            activation_token = ?,
            status = 'registered'
        WHERE id = ?
      `)
      .bind(body.event_id, activationCode, activationToken, body.camper_id)
      .run();

    // 7. Fetch church for email
    const church: any = await context.env.DB
      .prepare('SELECT name, slug, province FROM churches WHERE id = ?')
      .bind(churchId)
      .first();

    // 8. Dispatch event passport email asynchronously
    const requestOrigin = new URL(context.request.url).origin;
    context.waitUntil(
      dispatchCamperPassportEmail({
        db: context.env.DB,
        camper: {
          id: camper.id,
          full_name: camper.full_name,
          nickname: camper.nickname || camper.full_name.split(' ')[0],
          email: camper.email,
          phone: camper.phone,
          role: role,
          church_id: churchId,
          church_name: church?.name || 'PCCI Church Delegation',
          church_slug: church?.slug || 'vlc',
          province: camper.province || church?.province || 'Metro Manila',
          city: camper.city || '',
          dietary_needs: camper.dietary_needs || 'None',
          emergency_name: camper.emergency_name,
          emergency_phone: camper.emergency_phone,
          emergency_relation: camper.emergency_relation,
          favorite_verse: camper.favorite_verse,
          activation_code: activationCode,
          activation_token: activationToken,
        },
        env: {
          ...context.env,
          CAMP_NAME: event.name,
          CAMP_THEME: event.theme,
        },
        origin: requestOrigin,
      }).catch((dispatchErr) => {
        console.error('[Camper Join Event] Email dispatch failed:', dispatchErr);
      })
    );

    const savedRegistration = await context.env.DB
      .prepare(`
        SELECT 
          er.*,
          e.name as event_name,
          e.slug as event_slug,
          e.theme as event_theme,
          e.start_date,
          e.end_date,
          (e.start_date || ' to ' || e.end_date) as event_dates,
          e.venue_name as event_venue,
          e.city as event_city,
          c.name as church_name,
          c.slug as church_slug
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        LEFT JOIN churches c ON er.church_id = c.id
        WHERE er.id = ?
      `)
      .bind(regId)
      .first();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully joined ${event.name}! Your official pass code is ${activationCode}.`,
        registration: savedRegistration,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to join event';
    console.error('[Camper Join Event API] Error:', err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
