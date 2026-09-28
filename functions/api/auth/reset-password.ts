interface Env {
  DB: D1Database;
}

// GET: Validate if a reset token is valid and unexpired
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const token = (
      url.searchParams.get('token') ||
      url.searchParams.get('reset_token') ||
      url.searchParams.get('resetToken') ||
      ''
    ).trim();

    if (!token) {
      return new Response(JSON.stringify({ valid: false, error: 'Token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const camper = await context.env.DB
      .prepare(`
        SELECT id, full_name, email, reset_token_expires_at
        FROM campers
        WHERE reset_token = ? 
          AND reset_token_expires_at > datetime('now')
        LIMIT 1
      `)
      .bind(token)
      .first<{ id: string; full_name: string; email: string; reset_token_expires_at: string }>();

    if (!camper) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Password reset link is invalid or has expired.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
        full_name: camper.full_name,
        email: camper.email,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[Reset Password Verification API] Error:', err);
    return new Response(
      JSON.stringify({ valid: false, error: 'Failed to verify token' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// POST: Execute the password reset with a valid token
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      token?: string;
      reset_token?: string;
      resetToken?: string;
      password?: string;
    };
    const token = (body.token || body.reset_token || body.resetToken || '').trim();
    const password = (body.password || '').trim();

    if (!token) {
      return new Response(JSON.stringify({ error: 'Reset token is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!password || password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters long.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify token validity
    const camper = await context.env.DB
      .prepare(`
        SELECT id, full_name, email
        FROM campers
        WHERE reset_token = ? 
          AND reset_token_expires_at > datetime('now')
        LIMIT 1
      `)
      .bind(token)
      .first<{ id: string; full_name: string; email: string }>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'This password reset link is invalid or has expired. Please request a new one.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update password and clear reset token
    await context.env.DB
      .prepare(`
        UPDATE campers
        SET password_hash = ?,
            reset_token = NULL,
            reset_token_expires_at = NULL
        WHERE id = ?
      `)
      .bind(password, camper.id)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password has been reset successfully. You may now sign in with your new password.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[Reset Password Execution API] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to reset password. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
