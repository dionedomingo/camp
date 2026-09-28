import { dispatchPasswordResetEmail } from '../_email/dispatcher';
import { EmailEnv } from '../_email/types';

interface Env extends EmailEnv {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as { email?: string };
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'A valid email address is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Look up camper in D1
    const camper = await context.env.DB
      .prepare(`
        SELECT id, full_name, email, is_active 
        FROM campers 
        WHERE LOWER(email) = ? AND COALESCE(is_active, 1) = 1 
        LIMIT 1
      `)
      .bind(email)
      .first<{ id: string; full_name: string; email: string; is_active: number }>();

    if (camper) {
      // Generate a secure 48-character hex token
      const array = new Uint8Array(24);
      crypto.getRandomValues(array);
      const resetToken = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');

      // Save token in D1 with 1 hour expiration
      await context.env.DB
        .prepare(`
          UPDATE campers 
          SET reset_token = ?, 
              reset_token_expires_at = datetime('now', '+1 hour')
          WHERE id = ?
        `)
        .bind(resetToken, camper.id)
        .run();

      // Dispatch reset email asynchronously
      const requestOrigin = new URL(context.request.url).origin;
      context.waitUntil(
        dispatchPasswordResetEmail({
          db: context.env.DB,
          camper: {
            id: camper.id,
            email: camper.email,
            full_name: camper.full_name,
          },
          resetToken,
          env: context.env,
          origin: requestOrigin,
        }).catch((err) => {
          console.error('[Forgot Password] Email dispatch failed:', err);
        })
      );
    }

    // Always respond with success to prevent email enumeration
    return new Response(
      JSON.stringify({
        success: true,
        message: 'If an account exists with this email address, a password reset link has been dispatched.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[Forgot Password API] Internal Error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred while requesting password reset.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
