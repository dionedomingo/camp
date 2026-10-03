interface Env {
  DB: D1Database;
  MEDIA_BUCKET?: R2Bucket;
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  return handleUpdateTrack(context);
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  return handleUpdateTrack(context);
};

async function handleUpdateTrack(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const id = context.params.id as string;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing track ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await context.env.DB
      .prepare(`SELECT id, cover_art_url FROM music_tracks WHERE id = ?`)
      .bind(id)
      .first<{ id: string; cover_art_url?: string | null }>();

    if (!existing) {
      return new Response(JSON.stringify({ error: 'Track not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contentType = context.request.headers.get('content-type') || '';
    let title: string | undefined;
    let artist: string | undefined;
    let album: string | undefined;
    let category: string | undefined;
    let lyrics: string | undefined;
    let spotify_url: string | undefined;
    let youtube_url: string | undefined;
    let duration_display: string | undefined;
    let cover_art_url: string | null | undefined;
    let is_published: number | undefined;
    let sort_order: number | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      if (formData.has('title')) title = (formData.get('title') as string) || undefined;
      if (formData.has('artist')) artist = (formData.get('artist') as string) || undefined;
      if (formData.has('album')) album = (formData.get('album') as string) || undefined;
      if (formData.has('category')) category = (formData.get('category') as string) || undefined;
      if (formData.has('lyrics')) lyrics = (formData.get('lyrics') as string) || undefined;
      if (formData.has('spotify_url')) spotify_url = (formData.get('spotify_url') as string) || undefined;
      if (formData.has('youtube_url')) youtube_url = (formData.get('youtube_url') as string) || undefined;
      if (formData.has('duration_display')) duration_display = (formData.get('duration_display') as string) || undefined;
      if (formData.has('cover_art_url')) {
        const raw = (formData.get('cover_art_url') as string).trim();
        cover_art_url = raw.length > 0 ? raw : null;
      }

      const coverFile = formData.get('cover_file') as File | null;
      if (coverFile && typeof coverFile === 'object' && coverFile.size > 0 && context.env.MEDIA_BUCKET) {
        const cleanCoverName = coverFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const coverR2Key = `music/covers/${Date.now()}_${cleanCoverName}`;
        const coverBuffer = await coverFile.arrayBuffer();

        await context.env.MEDIA_BUCKET.put(coverR2Key, coverBuffer, {
          httpMetadata: { contentType: coverFile.type || 'image/jpeg' },
        });

        cover_art_url = `/api/media/${coverR2Key}`;

        // Clean up previous custom R2 cover art if present
        if (existing.cover_art_url && existing.cover_art_url.startsWith('/api/media/music/covers/')) {
          const oldR2Key = existing.cover_art_url.replace('/api/media/', '');
          try {
            await context.env.MEDIA_BUCKET.delete(oldR2Key);
          } catch {
            // Non-critical
          }
        }
      }
    } else {
      const body = (await context.request.json()) as any;
      title = body.title;
      artist = body.artist;
      album = body.album;
      category = body.category;
      lyrics = body.lyrics;
      spotify_url = body.spotify_url;
      youtube_url = body.youtube_url;
      duration_display = body.duration_display;
      if (body.cover_art_url !== undefined) {
        cover_art_url = body.cover_art_url && body.cover_art_url.trim().length > 0 ? body.cover_art_url.trim() : null;
      }
      is_published = body.is_published;
      sort_order = body.sort_order;

      // Handle base64 cover if provided
      if (body.cover_base64 && context.env.MEDIA_BUCKET) {
        let base64 = body.cover_base64;
        let mime = body.cover_mime_type || 'image/jpeg';
        if (base64.startsWith('data:')) {
          const match = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (match) {
            mime = match[1];
            base64 = match[2];
          }
        }
        const bin = atob(base64);
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);

        const r2Key = `music/covers/${Date.now()}_${body.cover_file_name || 'cover.jpg'}`;
        await context.env.MEDIA_BUCKET.put(r2Key, u8.buffer, {
          httpMetadata: { contentType: mime },
        });
        cover_art_url = `/api/media/${r2Key}`;
      }
    }

    const updates: string[] = [];
    const bindings: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); bindings.push(title); }
    if (artist !== undefined) { updates.push('artist = ?'); bindings.push(artist); }
    if (album !== undefined) { updates.push('album = ?'); bindings.push(album); }
    if (category !== undefined) { updates.push('category = ?'); bindings.push(category); }
    if (lyrics !== undefined) { updates.push('lyrics = ?'); bindings.push(lyrics); }
    if (spotify_url !== undefined) { updates.push('spotify_url = ?'); bindings.push(spotify_url); }
    if (youtube_url !== undefined) { updates.push('youtube_url = ?'); bindings.push(youtube_url); }
    if (duration_display !== undefined) { updates.push('duration_display = ?'); bindings.push(duration_display); }
    if (cover_art_url !== undefined) { updates.push('cover_art_url = ?'); bindings.push(cover_art_url); }
    if (is_published !== undefined) { updates.push('is_published = ?'); bindings.push(is_published); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); bindings.push(sort_order); }

    if (updates.length > 0) {
      bindings.push(id);
      await context.env.DB
        .prepare(`UPDATE music_tracks SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...bindings)
        .run();

      // If cover_art_url changed, update active listener status records
      if (cover_art_url !== undefined) {
        try {
          await context.env.DB
            .prepare(`UPDATE camper_listening_status SET cover_art_url = ? WHERE track_id = ?`)
            .bind(cover_art_url, id)
            .run();
        } catch {
          // Non-critical
        }
      }
    }

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
}

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
