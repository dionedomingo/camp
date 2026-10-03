interface Env {
  EMAIL: {
    send(message: {
      to: string;
      from: string;
      subject: string;
      text?: string;
      html?: string;
    }): Promise<void>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const data = await request.json() as {
        to: string;
        from?: string;
        subject: string;
        text?: string;
        html?: string;
      };

      if (!data.to || !data.subject || (!data.text && !data.html)) {
        return new Response(JSON.stringify({ error: 'Missing required email fields (to, subject, content)' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Default to verified sender address on pcciministries.com
      const fromAddress = (data.from && data.from.includes('@pcciministries.com'))
        ? data.from
        : 'noreply@pcciministries.com';

      await env.EMAIL.send({
        to: data.to,
        from: fromAddress,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });

      return new Response(JSON.stringify({ success: true, messageId: 'cf_' + Date.now() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: unknown) {
      console.error('[Cloudflare Email Worker Error]', err);
      const msg = err instanceof Error ? err.message : 'Email dispatch failed';
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
