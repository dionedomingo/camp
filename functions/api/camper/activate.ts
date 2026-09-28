interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      token?: string;
      code?: string;
      password?: string;
    };

    const token = (body.token || '').trim();
    const code = (body.code || '').trim().toUpperCase();
    const password = (body.password || '').trim();

    if (!token && !code) {
      return new Response(
        JSON.stringify({ error: 'Activation token or code is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Look up camper by token or activation_code
    let query = `
      SELECT cmp.*, c.name as church_name, c.slug as church_slug
      FROM campers cmp
      LEFT JOIN churches c ON cmp.church_id = c.id
      WHERE 
    `;
    let queryParam = '';

    if (token) {
      query += `cmp.activation_token = ?`;
      queryParam = token;
    } else {
      query += `UPPER(cmp.activation_code) = ? OR UPPER(cmp.id) = ?`;
    }

    const camper = token
      ? await context.env.DB.prepare(query).bind(queryParam).first<any>()
      : await context.env.DB.prepare(query).bind(code, code).first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'No matching registration found. Please verify your pass code or visit the Admin Arrival Desk.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mark as activated & checked in
    if (password) {
      await context.env.DB
        .prepare(`
          UPDATE campers
          SET status = 'activated',
              password_hash = ?,
              checked_in_at = COALESCE(checked_in_at, CURRENT_TIMESTAMP)
          WHERE id = ?
        `)
        .bind(password, camper.id)
        .run();
    } else {
      await context.env.DB
        .prepare(`
          UPDATE campers
          SET status = 'activated',
              checked_in_at = COALESCE(checked_in_at, CURRENT_TIMESTAMP)
          WHERE id = ?
        `)
        .bind(camper.id)
        .run();
    }

    // Re-fetch updated record
    const updatedCamper = await context.env.DB
      .prepare(`
        SELECT cmp.*, c.name as church_name, c.slug as church_slug
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE cmp.id = ?
      `)
      .bind(camper.id)
      .first<any>();

    const { password_hash, ...safeCamper } = updatedCamper || camper;

    // Parse ministry_interests if needed
    if (typeof safeCamper.ministry_interests === 'string') {
      try {
        safeCamper.ministry_interests = JSON.parse(safeCamper.ministry_interests);
      } catch {
        safeCamper.ministry_interests = [];
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Welcome to VLC 2027, ${safeCamper.nickname}! Your pass has been activated.`,
        camper: {
          ...safeCamper,
          status: 'activated',
          checked_in_at: safeCamper.checked_in_at || new Date().toISOString(),
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Activation error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
