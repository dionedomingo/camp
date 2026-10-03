interface Env {
  DB: D1Database;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

// GET /api/music/playlists
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const playlists = await context.env.DB
      .prepare(`SELECT * FROM music_playlists ORDER BY sort_order ASC, created_at ASC`)
      .all();

    return new Response(JSON.stringify({ success: true, playlists: playlists.results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to fetch playlists' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/music/playlists: Add or update curated playlist link
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as any;
    const { title, platform, url, description, cover_url, is_featured, sort_order } = body;

    if (!title || !platform || !url) {
      return new Response(JSON.stringify({ error: 'Title, platform, and playlist URL are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const playlistId = body.id || `playlist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    await context.env.DB
      .prepare(`
        INSERT INTO music_playlists (id, title, platform, url, description, cover_url, is_featured, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          platform = excluded.platform,
          url = excluded.url,
          description = excluded.description,
          cover_url = excluded.cover_url,
          is_featured = excluded.is_featured,
          sort_order = excluded.sort_order
      `)
      .bind(
        playlistId,
        title,
        platform,
        url,
        description || '',
        cover_url || '',
        is_featured !== undefined ? is_featured : 1,
        sort_order || 0
      )
      .run();

    return new Response(JSON.stringify({ success: true, playlistId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to save playlist' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
