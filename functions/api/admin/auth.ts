interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      email?: string;
      username?: string;
      password?: string;
      passcode?: string;
    };

    const identifier = (body.email || body.username || '').trim().toLowerCase();
    const secret = (body.password || body.passcode || '').trim();

    if (!identifier) {
      return new Response(JSON.stringify({ error: 'Email or username is required' }), {
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

    // Look up strictly in campers database by email, nickname, or full_name
    const user: any = await context.env.DB
      .prepare(`
        SELECT id, full_name as name, nickname, email, password_hash, role, church_id, is_active, created_at, last_login_at
        FROM campers
        WHERE (LOWER(email) = ? OR LOWER(nickname) = ? OR LOWER(full_name) = ?)
          AND role IN ('admin', 'staff', 'coordinator')
          AND COALESCE(is_active, 1) = 1
        LIMIT 1
      `)
      .bind(identifier, identifier, identifier)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials or account is deactivated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Strict password match against database password_hash only
    if (!user.password_hash || user.password_hash !== secret) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
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

    const { password_hash, ...safeUser } = user;

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          ...safeUser,
          is_active: Boolean(safeUser.is_active ?? 1),
          is_admin: safeUser.role === 'admin',
          is_staff: ['admin', 'staff', 'coordinator'].includes(safeUser.role),
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Authentication failed';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
