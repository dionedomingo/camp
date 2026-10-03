interface Env {
  DB: D1Database;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

// POST /api/music/play: Record play count and update camper live listening status
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      track_id?: string;
      camper_id?: string;
      is_playing?: boolean;
    };

    const trackId = (body.track_id || '').trim();
    const camperId = (body.camper_id || '').trim();
    const isPlaying = body.is_playing !== false;

    if (!trackId && !camperId) {
      return new Response(
        JSON.stringify({ error: 'Either track_id or camper_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let updatedPlayCount = 0;
    let trackInfo: any = null;

    // 1. If starting playback on a track, increment play_count and fetch track details
    if (trackId && isPlaying) {
      await context.env.DB
        .prepare(`
          UPDATE music_tracks
          SET play_count = COALESCE(play_count, 0) + 1
          WHERE id = ?
        `)
        .bind(trackId)
        .run();

      trackInfo = await context.env.DB
        .prepare(`SELECT id, title, artist, album, cover_art_url, play_count FROM music_tracks WHERE id = ?`)
        .bind(trackId)
        .first<any>();

      if (trackInfo) {
        updatedPlayCount = trackInfo.play_count || 0;
      }
    } else if (trackId) {
      trackInfo = await context.env.DB
        .prepare(`SELECT id, title, artist, album, cover_art_url, play_count FROM music_tracks WHERE id = ?`)
        .bind(trackId)
        .first<any>();
      if (trackInfo) {
        updatedPlayCount = trackInfo.play_count || 0;
      }
    }

    // 2. If camper_id provided, update camper_listening_status safely
    let listeningStatus: any = null;
    if (camperId) {
      try {
        if (isPlaying && trackInfo) {
          await context.env.DB
            .prepare(`
              INSERT INTO camper_listening_status (
                camper_id, track_id, title, artist, album, cover_art_url, is_playing, started_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              ON CONFLICT(camper_id) DO UPDATE SET
                track_id = excluded.track_id,
                title = excluded.title,
                artist = excluded.artist,
                album = excluded.album,
                cover_art_url = excluded.cover_art_url,
                is_playing = 1,
                updated_at = CURRENT_TIMESTAMP
            `)
            .bind(
              camperId,
              trackInfo.id,
              trackInfo.title,
              trackInfo.artist,
              trackInfo.album || 'VLC 2027 Worship',
              trackInfo.cover_art_url || null
            )
            .run();

          listeningStatus = {
            track_id: trackInfo.id,
            title: trackInfo.title,
            artist: trackInfo.artist,
            album: trackInfo.album,
            cover_art_url: trackInfo.cover_art_url,
            is_playing: true,
            updated_at: new Date().toISOString(),
          };
        } else if (!isPlaying) {
          // Paused or stopped playback
          await context.env.DB
            .prepare(`
              UPDATE camper_listening_status
              SET is_playing = 0, updated_at = CURRENT_TIMESTAMP
              WHERE camper_id = ?
            `)
            .bind(camperId)
            .run();

          listeningStatus = {
            camper_id: camperId,
            is_playing: false,
            updated_at: new Date().toISOString(),
          };
        }
      } catch (clsErr) {
        console.warn('[Music Play API] Listening status notice:', clsErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        play_count: updatedPlayCount,
        listening_status: listeningStatus,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('[Music Play API] Error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Failed to record play' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
