import { dispatchCamperPassportEmail } from '../_email/dispatcher';
import { EmailEnv } from '../_email/types';

interface Env extends EmailEnv {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      camper_id?: string;
      email?: string;
      code?: string;
    };

    const camperId = (body.camper_id || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const code = (body.code || '').trim().toUpperCase();

    if (!camperId && !email && !code) {
      return new Response(
        JSON.stringify({ error: 'Camper ID, email, or activation code is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let query = `
      SELECT cmp.*, c.name as church_name, c.slug as church_slug
      FROM campers cmp
      LEFT JOIN churches c ON cmp.church_id = c.id
      WHERE 
    `;
    let queryParam = '';

    if (camperId) {
      query += `cmp.id = ?`;
      queryParam = camperId;
    } else if (code) {
      query += `UPPER(cmp.activation_code) = ?`;
      queryParam = code;
    } else {
      query += `cmp.email = ?`;
      queryParam = email;
    }

    const camper = await context.env.DB.prepare(query).bind(queryParam).first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'No matching camper registration found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestOrigin = new URL(context.request.url).origin;

    const result = await dispatchCamperPassportEmail({
      db: context.env.DB,
      camper: {
        id: camper.id,
        full_name: camper.full_name,
        nickname: camper.nickname || camper.full_name.split(' ')[0],
        email: camper.email,
        phone: camper.phone,
        role: camper.role || 'camper',
        church_id: camper.church_id,
        church_name: camper.church_name || 'PCCI Church Delegation',
        church_slug: camper.church_slug || 'vlc',
        province: camper.province || 'Metro Manila',
        city: camper.city || '',
        dietary_needs: camper.dietary_needs || 'None',
        emergency_name: camper.emergency_name || 'Guardian',
        emergency_phone: camper.emergency_phone || camper.phone,
        emergency_relation: camper.emergency_relation || 'Family',
        favorite_verse: camper.favorite_verse || 'Philippians 4:13',
        activation_code: camper.activation_code,
        activation_token: camper.activation_token,
      },
      env: context.env,
      origin: requestOrigin,
      force: true, // Allow manual resends
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to dispatch email' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Camper Passport email successfully sent to ${camper.email}!`,
        provider: result.provider,
        provider_message_id: result.providerMessageId,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
