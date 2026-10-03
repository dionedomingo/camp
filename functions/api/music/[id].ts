interface Env {
  DB: D1Database;
  MEDIA_BUCKET?: R2Bucket;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

// PUT /api/music/:id: Update track details
export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing track ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = (await context.request.json()) as any;
    const {
      title,
      artist,
      album,
      category,
      lyrics,
      spotify_url,
      youtube_url,
      duration_display,
      cover_art_url,
      is_published,
      sort_order,
    } = body;

    const existing = await context.env.DB
      .prepare(`SELECT id FROM music_tracks WHERE id = ?`)
      .bind(id)
      .first();

    if (!existing) {
      return new Response(JSON.stringify({ error: 'Track not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB
      .prepare(`
        UPDATE music_tracks
        SET 
          title = COALESCE(?, title),
          artist = COALESCE(?, artist),
          album = COALESCE(?, album),
          category = COALESCE(?, category),
          lyrics = COALESCE(?, lyrics),
          spotify_url = COALESCE(?, spotify_url),
          youtube_url = COALESCE(?, youtube_url),
          duration_display = COALESCE(?, duration_display),
          cover_art_url = COALESCE(?, cover_art_url),
          is_published = COALESCE(?, is_published),
          sort_order = COALESCE(?, sort_order)
        WHERE id = ?
      `)
      .bind(
        title ?? null,
        artist ?? null,
        album ?? null,
        category ?? null,
        lyrics ?? null,
        spotify_url ?? null,
        youtube_url ?? null,
        duration_display ?? null,
        cover_art_url ?? null,
        is_published !== undefined ? is_published : null,
        sort_order !== undefined ? sort_order : null,
        id
      )
      .run();

    const updated = await context.env.DB
      .prepare(`SELECT * FROM music_tracks WHERE id = ?`)
      .bind(id)
      .first();

    return new Response(JSON.stringify({ success: true, track: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to update track' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE /api/music/:id: Delete track
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing track ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const track = await context.env.DB
      .prepare(`SELECT id, audio_url, cover_art_url FROM music_tracks WHERE id = ?`)
      .bind(id)
      .first<any>();

    if (!track) {
      return new Response(JSON.stringify({ error: 'Track not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Attempt to delete audio file from R2 if it's hosted internally
    if (context.env.MEDIA_BUCKET && track.audio_url && track.audio_url.startsWith('/api/media/')) {
      const r2Key = track.audio_url.replace('/api/media/', '');
      try {
        await context.env.MEDIA_BUCKET.delete(r2Key);
      } catch (r2Err) {
        console.warn('[Music Delete] R2 deletion warning:', r2Err);
      }
    }

    await context.env.DB.prepare(`DELETE FROM music_tracks WHERE id = ?`).bind(id).run();

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to delete track' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
