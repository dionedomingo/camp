import { CamperEmailData, EmailEnv, SendEmailResult } from './types';
import { generateCamperQRCode } from './qr';
import { renderCamperPassportEmail, renderPasswordResetEmail } from './template';

/**
 * Dispatches an outbound Camper Passport email idempotently using available providers
 * (Resend, Postmark, Cloudflare Send Email binding, or edge Simulation mode).
 */
export async function dispatchCamperPassportEmail(options: {
  db: D1Database;
  camper: CamperEmailData;
  env: EmailEnv;
  origin?: string;
  force?: boolean;
}): Promise<SendEmailResult> {
  const { db, camper, env, origin, force } = options;

  const deliveryId = 'del_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const idempotencyKey = force 
    ? `camper_resend_${camper.id}_${Date.now()}` 
    : `camper_signup_${camper.id}`;
  const recipientEmail = camper.email.toLowerCase().trim();

  // 1. Check idempotency in D1
  const existingDelivery = await db
    .prepare('SELECT id, status, provider, provider_message_id FROM email_deliveries WHERE idempotency_key = ?')
    .bind(idempotencyKey)
    .first<{ id: string; status: string; provider: string; provider_message_id?: string }>();

  if (existingDelivery) {
    if (existingDelivery.status === 'sent') {
      console.log(`[Email Dispatcher] Idempotent skip: Email already sent for camper ${camper.id} (${existingDelivery.id})`);
      return {
        success: true,
        provider: existingDelivery.provider as any,
        providerMessageId: existingDelivery.provider_message_id,
        idempotentAbort: true,
      };
    }
  }

  // 2. Generate Base64 QR code and compile Passport Email HTML
  const baseUrl = origin || env.BASE_URL || 'https://summer-camp-vlc2027.pages.dev';
  const qr = await generateCamperQRCode(camper.activation_code, camper.activation_token, baseUrl);
  const content = renderCamperPassportEmail(camper, qr, {
    campName: env.CAMP_NAME,
    campTheme: env.CAMP_THEME,
  });

  // Determine provider: Prioritize Cloudflare native Send Email (direct or service binding)
  let provider: 'resend' | 'postmark' | 'cf_email' | 'simulation' = 'simulation';
  if ((env.EMAIL && typeof env.EMAIL.send === 'function') || env.EMAIL_SERVICE) {
    provider = 'cf_email';
  } else if (env.RESEND_API_KEY) {
    provider = 'resend';
  } else if (env.POSTMARK_SERVER_TOKEN) {
    provider = 'postmark';
  }

  const defaultFrom = env.EMAIL_FROM || 'VLC 2027 Camp Desk <noreply@pcciministries.com>';

  // 3. Insert or update delivery record to 'pending'
  try {
    if (!existingDelivery) {
      await db
        .prepare(`
          INSERT INTO email_deliveries (
            id, camper_id, idempotency_key, recipient_email, subject,
            status, provider, attempts, email_preview, created_at
          ) VALUES (?, ?, ?, ?, ?, 'pending', ?, 1, ?, CURRENT_TIMESTAMP)
        `)
        .bind(
          deliveryId,
          camper.id,
          idempotencyKey,
          recipientEmail,
          content.subject,
          provider,
          content.text.substring(0, 500)
        )
        .run();
    } else {
      await db
        .prepare('UPDATE email_deliveries SET attempts = attempts + 1, status = \'pending\' WHERE id = ?')
        .bind(existingDelivery.id)
        .run();
    }
  } catch (dbErr: any) {
    // If concurrent insert occurred and violated UNIQUE key, abort gracefully
    if (dbErr.message?.includes('UNIQUE constraint failed: email_deliveries.idempotency_key')) {
      console.warn(`[Email Dispatcher] Concurrent delivery in progress for ${idempotencyKey}`);
      return { success: true, provider, idempotentAbort: true };
    }
    console.error('[Email Dispatcher] Failed to record pending delivery in D1:', dbErr);
  }

  const activeDeliveryId = existingDelivery ? existingDelivery.id : deliveryId;

  // 4. Provider-specific outbound dispatch
  try {
    let providerMessageId: string | undefined;

    if (provider === 'resend') {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: defaultFrom,
          to: [recipientEmail],
          subject: content.subject,
          html: content.html,
          text: content.text,
        }),
      });

      const json = await res.json() as any;
      if (!res.ok) {
        throw new Error(`Resend API failed (${res.status}): ${json?.message || JSON.stringify(json)}`);
      }
      providerMessageId = json?.id;
    } else if (provider === 'postmark') {
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: defaultFrom,
          To: recipientEmail,
          Subject: content.subject,
          HtmlBody: content.html,
          TextBody: content.text,
        }),
      });

      const json = await res.json() as any;
      if (!res.ok) {
        throw new Error(`Postmark API failed (${res.status}): ${json?.Message || JSON.stringify(json)}`);
      }
      providerMessageId = json?.MessageID;
    } else if (provider === 'cf_email') {
      // Parse "Name <email@domain>" format if provided
      const senderMatch = defaultFrom.match(/^(.*?)\s*<([^>]+)>$/);
      const senderEmail = senderMatch ? senderMatch[2].trim() : defaultFrom.trim();

      if (env.EMAIL_SERVICE) {
        // Dispatched via Cloudflare Workers Email Service Binding
        const res = await env.EMAIL_SERVICE.fetch('https://email-service.internal/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipientEmail,
            from: senderEmail,
            subject: content.subject,
            text: content.text,
            html: content.html,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Cloudflare Email Service failed (${res.status}): ${errText}`);
        }
        providerMessageId = 'cf_service_' + Date.now();
      } else if (env.EMAIL) {
        // Direct Cloudflare Workers send_email binding
        try {
          // Cloudflare Workers recommended structured builder
          await (env.EMAIL as any).send({
            to: recipientEmail,
            from: senderEmail,
            subject: content.subject,
            text: content.text,
            html: content.html,
          });
        } catch (structErr) {
          console.warn('[Email Dispatcher] Structured send failed, attempting content array fallback:', structErr);
          await (env.EMAIL as any).send({
            from: senderEmail,
            to: recipientEmail,
            subject: content.subject,
            content: [
              { type: 'text/plain', value: content.text },
              { type: 'text/html', value: content.html },
            ],
          });
        }
        providerMessageId = 'cf_' + Date.now();
      }
    } else {
      // Simulation mode
      providerMessageId = `sim_${Date.now().toString(36)}`;
      console.log(`[Email Dispatcher (Simulation)] ==============================`);
      console.log(`[Email Dispatcher (Simulation)] To: ${recipientEmail}`);
      console.log(`[Email Dispatcher (Simulation)] Subject: ${content.subject}`);
      console.log(`[Email Dispatcher (Simulation)] Pass Code: ${camper.activation_code}`);
      console.log(`[Email Dispatcher (Simulation)] Activation Link: ${qr.activationUrl}`);
      console.log(`[Email Dispatcher (Simulation)] Message ID: ${providerMessageId}`);
      console.log(`[Email Dispatcher (Simulation)] ==============================`);
    }

    // 5. Update D1 status to 'sent'
    await db
      .prepare(`
        UPDATE email_deliveries
        SET status = 'sent',
            provider = ?,
            provider_message_id = ?,
            sent_at = CURRENT_TIMESTAMP,
            error_message = NULL
        WHERE id = ?
      `)
      .bind(provider, providerMessageId || null, activeDeliveryId)
      .run();

    return {
      success: true,
      provider,
      providerMessageId,
    };
  } catch (err: any) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Email Dispatcher] Send failure for camper ${camper.id}:`, errorMsg);

    // Record failure in D1
    try {
      await db
        .prepare(`
          UPDATE email_deliveries
          SET status = 'failed',
              error_message = ?
          WHERE id = ?
        `)
        .bind(errorMsg.substring(0, 1000), activeDeliveryId)
        .run();
    } catch (dbErr) {
      console.error('[Email Dispatcher] Failed to update delivery failure record:', dbErr);
    }

    return {
      success: false,
      provider,
      error: errorMsg,
    };
  }
}

/**
 * Dispatches a password reset email via Cloudflare native email binding / service
 */
export async function dispatchPasswordResetEmail(options: {
  db: D1Database;
  camper: { id: string; email: string; full_name: string };
  resetToken: string;
  env: EmailEnv;
  origin?: string;
}): Promise<SendEmailResult> {
  const { db, camper, resetToken, env, origin } = options;
  const recipientEmail = camper.email.toLowerCase().trim();
  const deliveryId = 'del_rst_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const idempotencyKey = `reset_${camper.id}_${Date.now()}`;

  const baseUrl = origin || env.BASE_URL || 'https://summer-camp-vlc2027.pages.dev';
  const resetUrl = `${baseUrl.replace(/\/$/, '')}/?reset_token=${encodeURIComponent(resetToken)}`;

  const content = renderPasswordResetEmail({
    full_name: camper.full_name,
    reset_url: resetUrl,
    expires_in_minutes: 60,
  });

  let provider: 'resend' | 'postmark' | 'cf_email' | 'simulation' = 'simulation';
  if ((env.EMAIL && typeof env.EMAIL.send === 'function') || env.EMAIL_SERVICE) {
    provider = 'cf_email';
  } else if (env.RESEND_API_KEY) {
    provider = 'resend';
  } else if (env.POSTMARK_SERVER_TOKEN) {
    provider = 'postmark';
  }

  const defaultFrom = env.EMAIL_FROM || 'VLC 2027 Camp Desk <noreply@pcciministries.com>';

  try {
    await db
      .prepare(`
        INSERT INTO email_deliveries (
          id, camper_id, idempotency_key, recipient_email, subject,
          status, provider, attempts, email_preview, created_at
        ) VALUES (?, ?, ?, ?, ?, 'pending', ?, 1, ?, CURRENT_TIMESTAMP)
      `)
      .bind(
        deliveryId,
        camper.id,
        idempotencyKey,
        recipientEmail,
        content.subject,
        provider,
        content.text.substring(0, 500)
      )
      .run();
  } catch (dbErr) {
    console.warn('[Email Dispatcher] Failed recording pending reset delivery in D1:', dbErr);
  }

  try {
    let providerMessageId: string | undefined;

    if (provider === 'cf_email') {
      const senderMatch = defaultFrom.match(/^(.*?)\s*<([^>]+)>$/);
      const senderEmail = senderMatch ? senderMatch[2].trim() : defaultFrom.trim();

      if (env.EMAIL_SERVICE) {
        const res = await env.EMAIL_SERVICE.fetch('https://email-service.internal/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipientEmail,
            from: senderEmail,
            subject: content.subject,
            text: content.text,
            html: content.html,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Cloudflare Email Service failed (${res.status}): ${errText}`);
        }
        providerMessageId = 'cf_rst_' + Date.now();
      } else if (env.EMAIL) {
        await (env.EMAIL as any).send({
          to: recipientEmail,
          from: senderEmail,
          subject: content.subject,
          text: content.text,
          html: content.html,
        });
        providerMessageId = 'cf_rst_' + Date.now();
      }
    } else if (provider === 'resend') {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: defaultFrom,
          to: [recipientEmail],
          subject: content.subject,
          html: content.html,
          text: content.text,
        }),
      });
      const json = await res.json() as any;
      if (!res.ok) throw new Error(`Resend failed (${res.status}): ${json?.message || JSON.stringify(json)}`);
      providerMessageId = json?.id;
    } else if (provider === 'postmark') {
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: defaultFrom,
          To: recipientEmail,
          Subject: content.subject,
          HtmlBody: content.html,
          TextBody: content.text,
        }),
      });
      const json = await res.json() as any;
      if (!res.ok) throw new Error(`Postmark failed (${res.status}): ${json?.Message || JSON.stringify(json)}`);
      providerMessageId = json?.MessageID;
    } else {
      providerMessageId = `sim_rst_${Date.now().toString(36)}`;
      console.log(`[Email Dispatcher (Simulation)] Password Reset To: ${recipientEmail}, Reset URL: ${resetUrl}`);
    }

    await db
      .prepare(`
        UPDATE email_deliveries
        SET status = 'sent',
            provider = ?,
            provider_message_id = ?,
            sent_at = CURRENT_TIMESTAMP,
            error_message = NULL
        WHERE id = ?
      `)
      .bind(provider, providerMessageId || null, deliveryId)
      .run();

    return {
      success: true,
      provider,
      providerMessageId,
    };
  } catch (err: any) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Email Dispatcher] Password reset send failure for ${camper.id}:`, errorMsg);

    try {
      await db
        .prepare(`
          UPDATE email_deliveries
          SET status = 'failed',
              error_message = ?
          WHERE id = ?
        `)
        .bind(errorMsg.substring(0, 1000), deliveryId)
        .run();
    } catch (dbErr) {
      console.error('[Email Dispatcher] Failed updating delivery failure record:', dbErr);
    }

    return {
      success: false,
      provider,
      error: errorMsg,
    };
  }
}

