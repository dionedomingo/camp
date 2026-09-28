interface Env {
  DB: D1Database;
}

// GET: List campers for check-in desk with search and status filter
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const status = url.searchParams.get('status'); // 'all', 'checked_in', 'pending'

    let query = `
      SELECT 
        cmp.id,
        cmp.church_id,
        c.name as church_name,
        c.slug as church_slug,
        cmp.role,
        cmp.full_name,
        cmp.nickname,
        cmp.gender,
        cmp.age,
        cmp.birthdate,
        cmp.email,
        cmp.phone,
        cmp.province,
        cmp.city,
        cmp.dietary_needs,
        cmp.emergency_name,
        cmp.emergency_phone,
        cmp.emergency_relation,
        cmp.favorite_verse,
        cmp.verse_reflection,
        cmp.selfie_url,
        cmp.activation_code,
        cmp.activation_token,
        COALESCE(cmp.status, 'registered') as status,
        cmp.checked_in_at,
        cmp.checked_in_by,
        COALESCE(cmp.kit_claimed, 0) as kit_claimed,
        cmp.created_at
      FROM campers cmp
      LEFT JOIN churches c ON cmp.church_id = c.id
      ORDER BY 
        CASE WHEN cmp.checked_in_at IS NOT NULL THEN 0 ELSE 1 END,
        cmp.created_at DESC
    `;

    const { results } = await context.env.DB.prepare(query).all<any>();
    let list = results || [];

    if (search) {
      list = list.filter((c) =>
        c.full_name?.toLowerCase().includes(search) ||
        c.nickname?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        c.phone?.toLowerCase().includes(search) ||
        c.activation_code?.toLowerCase().includes(search) ||
        c.church_name?.toLowerCase().includes(search)
      );
    }

    if (status === 'checked_in') {
      list = list.filter((c) => c.status === 'activated' || c.checked_in_at);
    } else if (status === 'pending') {
      list = list.filter((c) => c.status !== 'activated' && !c.checked_in_at);
    }

    return new Response(JSON.stringify(list), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Database error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST: Admin manual check-in / kit distribution toggle
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      camper_id?: string;
      code_or_token?: string;
      admin_id?: string;
      kit_claimed?: boolean;
      action?: 'check_in' | 'undo_check_in' | 'toggle_kit' | 'reset_password';
      new_password?: string;
    };

    const camperId = body.camper_id?.trim();
    const codeOrToken = body.code_or_token?.trim();
    const action = body.action || 'check_in';
    const adminId = body.admin_id || 'admin';

    // Find camper
    let camper: any = null;
    if (camperId) {
      camper = await context.env.DB
        .prepare('SELECT * FROM campers WHERE id = ?')
        .bind(camperId)
        .first();
    } else if (codeOrToken) {
      camper = await context.env.DB
        .prepare(`
          SELECT * FROM campers 
          WHERE UPPER(activation_code) = UPPER(?) 
             OR activation_token = ? 
             OR UPPER(id) = UPPER(?)
        `)
        .bind(codeOrToken, codeOrToken, codeOrToken)
        .first();
    }

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'check_in') {
      const kitValue = body.kit_claimed !== undefined ? (body.kit_claimed ? 1 : 0) : (camper.kit_claimed || 1);
      await context.env.DB
        .prepare(`
          UPDATE campers 
          SET status = 'activated',
              checked_in_at = COALESCE(checked_in_at, CURRENT_TIMESTAMP),
              checked_in_by = ?,
              kit_claimed = ?
          WHERE id = ?
        `)
        .bind(adminId, kitValue, camper.id)
        .run();
    } else if (action === 'undo_check_in') {
      await context.env.DB
        .prepare(`
          UPDATE campers 
          SET status = 'registered',
              checked_in_at = NULL,
              checked_in_by = NULL
          WHERE id = ?
        `)
        .bind(camper.id)
        .run();
    } else if (action === 'toggle_kit') {
      const newKit = camper.kit_claimed ? 0 : 1;
      await context.env.DB
        .prepare('UPDATE campers SET kit_claimed = ? WHERE id = ?')
        .bind(newKit, camper.id)
        .run();
    } else if (action === 'reset_password') {
      const newPass = (body.new_password || '').trim();
      if (!newPass) {
        return new Response(JSON.stringify({ error: 'New password is required for password reset' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      await context.env.DB
        .prepare('UPDATE campers SET password_hash = ? WHERE id = ?')
        .bind(newPass, camper.id)
        .run();
    }

    // Return updated camper with church name
    const updated = await context.env.DB
      .prepare(`
        SELECT cmp.*, c.name as church_name
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE cmp.id = ?
      `)
      .bind(camper.id)
      .first<any>();

    const { password_hash, ...safeCamper } = updated || camper;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully updated ${safeCamper.nickname}`,
        camper: safeCamper,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Action failed';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
