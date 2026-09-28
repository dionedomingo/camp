interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const limit = Math.min(Number(url.searchParams.get('limit') || 50), 100);
    const status = url.searchParams.get('status');

    let query = `
      SELECT 
        ed.id,
        ed.camper_id,
        ed.idempotency_key,
        ed.recipient_email,
        ed.subject,
        ed.status,
        ed.provider,
        ed.provider_message_id,
        ed.error_message,
        ed.attempts,
        ed.sent_at,
        ed.created_at,
        cmp.full_name as camper_name,
        cmp.nickname as camper_nickname,
        cmp.activation_code
      FROM email_deliveries ed
      LEFT JOIN campers cmp ON ed.camper_id = cmp.id
    `;

    if (status) {
      query += ` WHERE ed.status = ? ORDER BY ed.created_at DESC LIMIT ?`;
      const { results } = await context.env.DB.prepare(query).bind(status, limit).all<any>();
      return new Response(JSON.stringify({ deliveries: results || [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      query += ` ORDER BY ed.created_at DESC LIMIT ?`;
      const { results } = await context.env.DB.prepare(query).bind(limit).all<any>();
      return new Response(JSON.stringify({ deliveries: results || [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch email deliveries' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
