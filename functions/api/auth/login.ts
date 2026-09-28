interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      passcode?: string;
    };

    const identifier = (body.email || body.username || '').trim().toLowerCase();
    const secret = (body.password || body.passcode || '').trim();

    if (!identifier) {
      return new Response(JSON.stringify({ error: 'Email, nickname, or username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!secret) {
      return new Response(JSON.stringify({ error: 'Password is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Look up strictly in campers database by email, nickname, or full name
    const user: any = await context.env.DB
      .prepare(`
        SELECT 
          cmp.*, 
          c.name as church_name, 
          c.slug as church_slug
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE (
          LOWER(cmp.email) = ? 
          OR LOWER(cmp.nickname) = ? 
          OR LOWER(cmp.full_name) = ?
        ) AND COALESCE(cmp.is_active, 1) = 1
        LIMIT 1
      `)
      .bind(identifier, identifier, identifier)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials. Account not found or inactive.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate password strictly against database password_hash only
    if (!user.password_hash || user.password_hash !== secret) {
      return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update last_login_at
    try {
      await context.env.DB
        .prepare('UPDATE campers SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(user.id)
        .run();
    } catch {
      // Non-blocking
    }

    // Parse ministry_interests if JSON string
    let ministryInterests: string[] = [];
    if (user.ministry_interests) {
      try {
        ministryInterests = typeof user.ministry_interests === 'string'
          ? JSON.parse(user.ministry_interests)
          : user.ministry_interests;
      } catch {
        ministryInterests = [];
      }
    }

    // Fetch all registered camp events for this camper
    let registrations: any[] = [];
    try {
      const regQuery = await context.env.DB
        .prepare(`
          SELECT 
            er.id,
            er.event_id,
            e.name as event_name,
            e.slug as event_slug,
            e.theme as event_theme,
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
        .bind(user.id)
        .all();
      registrations = regQuery.results || [];
    } catch {
      registrations = [];
    }

    const { password_hash, ...safeUser } = user;

    // Use latest registration info if present
    const latestReg = registrations[0];

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          ...safeUser,
          event_id: latestReg ? latestReg.event_id : safeUser.event_id,
          activation_code: latestReg ? latestReg.activation_code : safeUser.activation_code,
          activation_token: latestReg ? latestReg.activation_token : safeUser.activation_token,
          status: latestReg ? latestReg.status : safeUser.status,
          registrations,
          ministry_interests: ministryInterests,
          is_active: Boolean(user.is_active ?? 1),
          is_admin: user.role === 'admin',
          is_staff: ['admin', 'staff', 'coordinator'].includes(user.role),
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Sign-in error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
