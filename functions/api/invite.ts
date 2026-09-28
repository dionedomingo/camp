interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = (await context.request.json()) as {
      camper_id?: string;
      church_id: string;
      platform: string;
    };

    if (!data.church_id || !data.platform) {
      return new Response(
        JSON.stringify({ error: 'Missing church_id or platform' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const shareId = 'shr_' + Math.random().toString(36).substring(2, 9);

    await context.env.DB
      .prepare(`
        INSERT INTO invite_shares (id, camper_id, church_id, platform)
        VALUES (?, ?, ?, ?)
      `)
      .bind(shareId, data.camper_id || null, data.church_id, data.platform)
      .run();

    return new Response(JSON.stringify({ success: true, shareId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
