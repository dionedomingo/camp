interface Env {
  DB: D1Database;
  MEDIA_BUCKET?: R2Bucket;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  duration_display: string;
  audio_url: string;
  cover_art_url?: string | null;
  category: 'worship' | 'praise' | 'anthem' | 'acoustic' | 'reflection';
  lyrics?: string | null;
  spotify_url?: string | null;
  youtube_url?: string | null;
  uploaded_by?: string;
  sort_order: number;
  is_published: number;
  created_at: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  platform: 'spotify' | 'youtube' | 'apple' | 'custom';
  url: string;
  description?: string | null;
  cover_url?: string | null;
  is_featured: number;
  sort_order: number;
  created_at: string;
}

// Built-in initial starter tracks if D1 database has no tracks yet
const SEED_TRACKS: Omit<MusicTrack, 'id' | 'created_at'>[] = [
  {
    title: 'Arise & Shine (VLC 2027 Official Theme)',
    artist: 'PCCI National Youth Worship Team',
    album: 'VLC 2027: Arise & Shine',
    duration: 275,
    duration_display: '4:35',
    audio_url: '/videos/camp-teaser.mp4',
    cover_art_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    category: 'anthem',
    lyrics: 'Arise, shine, for your light has come, and the glory of the Lord rises upon you! (Isaiah 60:1)\n\nWe lift our eyes unto the hills\nYour Spirit moving, our hearts You fill\nFrom Nueva Vizcaya to the ends of the earth\nA generation of fire and spiritual rebirth!',
    spotify_url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    youtube_url: 'https://music.youtube.com',
    sort_order: 1,
    is_published: 1,
  },
  {
    title: 'Apostolic Fire (Live Camp Gathering)',
    artist: 'VLC Combined Delegates Choir',
    album: 'Live at Bambang Tabernacle',
    duration: 318,
    duration_display: '5:18',
    audio_url: '/videos/hero-placeholder.mp4',
    cover_art_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    category: 'praise',
    lyrics: 'Let the fire fall upon this ground\nEvery chain is broken, revival is found!\nWith one voice we worship and shout\nJesus the King without a doubt!',
    spotify_url: 'https://open.spotify.com',
    youtube_url: 'https://music.youtube.com',
    sort_order: 2,
    is_published: 1,
  },
  {
    title: 'Holy Ground (Intimate Worship Session)',
    artist: 'Northern Luzon Worship Collective',
    album: 'Secret Place Recordings',
    duration: 345,
    duration_display: '5:45',
    audio_url: '/videos/camp-teaser.mp4',
    cover_art_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    category: 'worship',
    lyrics: 'Here in Your presence, Lord\nTake off your shoes for this is holy ground\nAll of my heart, all of my devotion\nPoured out at Your feet.',
    spotify_url: 'https://open.spotify.com',
    youtube_url: 'https://music.youtube.com',
    sort_order: 3,
    is_published: 1,
  },
  {
    title: 'Grace Greater Than Our Sin',
    artist: 'VLC Acoustic Campfire Ensemble',
    album: 'Campfire Hymns Under The Stars',
    duration: 214,
    duration_display: '3:34',
    audio_url: '/videos/hero-placeholder.mp4',
    cover_art_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    category: 'acoustic',
    lyrics: 'Grace, grace, God’s grace,\nGrace that will pardon and cleanse within;\nGrace, grace, God’s grace,\nGrace that is greater than all our sin!',
    spotify_url: 'https://open.spotify.com',
    youtube_url: 'https://music.youtube.com',
    sort_order: 4,
    is_published: 1,
  },
  {
    title: 'Resting in Your Love (Late Night Reflection)',
    artist: 'PCCI Prayer & Intercession Team',
    album: 'Bambang Mountain Melodies',
    duration: 290,
    duration_display: '4:50',
    audio_url: '/videos/camp-teaser.mp4',
    cover_art_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    category: 'reflection',
    lyrics: 'Be still and know that I am God.\nI will be exalted among the nations.\nRest in His peace, find refuge in His wings.',
    spotify_url: 'https://open.spotify.com',
    youtube_url: 'https://music.youtube.com',
    sort_order: 5,
    is_published: 1,
  },
];

const SEED_PLAYLISTS: Omit<MusicPlaylist, 'id' | 'created_at'>[] = [
  {
    title: 'VLC 2027 Official Worship Playlist on Spotify',
    platform: 'spotify',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    description: 'The official pre-camp praise and worship anthems curated for Vision & Leadership Camp 2027.',
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
    is_featured: 1,
    sort_order: 1,
  },
  {
    title: 'VLC 2027 YouTube Music Camp Playlist',
    platform: 'youtube',
    url: 'https://music.youtube.com/playlist?list=RDCLAK5uy_kset6iWp_T5fO7z3_z1p-Z1a3c',
    description: 'Stream live praise medleys, apostolic anthems, and campfire acoustic sessions on YouTube Music.',
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    is_featured: 1,
    sort_order: 2,
  },
];

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

// GET /api/music: Returns all published tracks & curated playlists
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const includeUnpublished = url.searchParams.get('all') === 'true';

    // 1. Ensure tables exist in D1
    await context.env.DB.exec(`
      CREATE TABLE IF NOT EXISTS music_tracks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT DEFAULT 'VLC 2027 Worship',
        duration INTEGER DEFAULT 0,
        duration_display TEXT DEFAULT '3:45',
        audio_url TEXT NOT NULL,
        cover_art_url TEXT,
        category TEXT DEFAULT 'worship',
        lyrics TEXT,
        spotify_url TEXT,
        youtube_url TEXT,
        uploaded_by TEXT DEFAULT 'admin',
        sort_order INTEGER DEFAULT 0,
        is_published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS music_playlists (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        cover_url TEXT,
        is_featured INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch tracks
    let query = `SELECT * FROM music_tracks`;
    const conditions: string[] = [];
    const params: any[] = [];

    if (!includeUnpublished) {
      conditions.push(`is_published = 1`);
    }

    if (category && category !== 'all') {
      conditions.push(`category = ?`);
      params.push(category.toLowerCase());
    }

    if (search) {
      conditions.push(`(title LIKE ? OR artist LIKE ? OR album LIKE ?)`);
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY sort_order ASC, created_at DESC`;

    let tracks = await context.env.DB.prepare(query).bind(...params).all<MusicTrack>();

    // If database is empty, seed defaults
    if (!tracks.results || tracks.results.length === 0) {
      const existingCount = await context.env.DB
        .prepare(`SELECT count(*) as count FROM music_tracks`)
        .first<{ count: number }>();

      if (!existingCount || existingCount.count === 0) {
        for (let i = 0; i < SEED_TRACKS.length; i++) {
          const track = SEED_TRACKS[i];
          const trackId = `track_${Date.now()}_${i + 1}`;
          await context.env.DB
            .prepare(`
              INSERT INTO music_tracks (
                id, title, artist, album, duration, duration_display,
                audio_url, cover_art_url, category, lyrics, spotify_url,
                youtube_url, sort_order, is_published
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .bind(
              trackId, track.title, track.artist, track.album, track.duration,
              track.duration_display, track.audio_url, track.cover_art_url,
              track.category, track.lyrics, track.spotify_url, track.youtube_url,
              track.sort_order, track.is_published
            )
            .run();
        }

        // Also seed playlists if empty
        const playlistCount = await context.env.DB
          .prepare(`SELECT count(*) as count FROM music_playlists`)
          .first<{ count: number }>();

        if (!playlistCount || playlistCount.count === 0) {
          for (let i = 0; i < SEED_PLAYLISTS.length; i++) {
            const p = SEED_PLAYLISTS[i];
            const pId = `playlist_${Date.now()}_${i + 1}`;
            await context.env.DB
              .prepare(`
                INSERT INTO music_playlists (
                  id, title, platform, url, description, cover_url, is_featured, sort_order
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `)
              .bind(pId, p.title, p.platform, p.url, p.description, p.cover_url, p.is_featured, p.sort_order)
              .run();
          }
        }

        // Re-query tracks after seed
        tracks = await context.env.DB.prepare(query).bind(...params).all<MusicTrack>();
      }
    }

    // 3. Fetch playlists
    const playlists = await context.env.DB
      .prepare(`SELECT * FROM music_playlists ORDER BY sort_order ASC, created_at ASC`)
      .all<MusicPlaylist>();

    return new Response(
      JSON.stringify({
        success: true,
        tracks: tracks.results || [],
        playlists: playlists.results || [],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60',
        },
      }
    );
  } catch (err: any) {
    console.error('[Music API] GET error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Failed to fetch music tracks' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/music: Upload and publish a new praise song (Admin only)
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    let trackId = `track_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let title = '';
    let artist = '';
    let album = 'VLC 2027 Praise & Worship';
    let category: 'worship' | 'praise' | 'anthem' | 'acoustic' | 'reflection' = 'worship';
    let audioUrl = '';
    let coverArtUrl = '';
    let lyrics = '';
    let spotifyUrl = '';
    let youtubeUrl = '';
    let duration = 0;
    let durationDisplay = '3:30';
    let uploadedBy = 'admin';

    if (contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      title = (formData.get('title') as string) || '';
      artist = (formData.get('artist') as string) || 'VLC Worship Team';
      album = (formData.get('album') as string) || album;
      category = ((formData.get('category') as string) || category) as any;
      lyrics = (formData.get('lyrics') as string) || '';
      spotifyUrl = (formData.get('spotify_url') as string) || '';
      youtubeUrl = (formData.get('youtube_url') as string) || '';
      durationDisplay = (formData.get('duration_display') as string) || durationDisplay;
      uploadedBy = (formData.get('uploaded_by') as string) || uploadedBy;

      // Handle direct audio file upload to Cloudflare R2
      const audioFile = formData.get('audio_file') as File | null;
      if (audioFile && context.env.MEDIA_BUCKET) {
        const cleanName = audioFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const r2Key = `music/${Date.now()}_${cleanName}`;
        const buffer = await audioFile.arrayBuffer();

        await context.env.MEDIA_BUCKET.put(r2Key, buffer, {
          httpMetadata: {
            contentType: audioFile.type || 'audio/mpeg',
          },
          customMetadata: {
            title,
            artist,
            uploadedBy,
            uploadedAt: new Date().toISOString(),
          },
        });

        audioUrl = `/api/media/${r2Key}`;
      } else {
        audioUrl = (formData.get('audio_url') as string) || '';
      }

      // Handle cover art upload or URL
      const coverFile = formData.get('cover_file') as File | null;
      if (coverFile && context.env.MEDIA_BUCKET) {
        const cleanCoverName = coverFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const coverR2Key = `music/covers/${Date.now()}_${cleanCoverName}`;
        const coverBuffer = await coverFile.arrayBuffer();

        await context.env.MEDIA_BUCKET.put(coverR2Key, coverBuffer, {
          httpMetadata: { contentType: coverFile.type || 'image/jpeg' },
        });

        coverArtUrl = `/api/media/${coverR2Key}`;
      } else {
        coverArtUrl = (formData.get('cover_art_url') as string) || '';
      }
    } else if (contentType.includes('application/json')) {
      const json = (await context.request.json()) as any;
      title = json.title || '';
      artist = json.artist || 'VLC Worship Team';
      album = json.album || album;
      category = json.category || category;
      audioUrl = json.audio_url || '';
      coverArtUrl = json.cover_art_url || '';
      lyrics = json.lyrics || '';
      spotifyUrl = json.spotify_url || '';
      youtubeUrl = json.youtube_url || '';
      duration = json.duration || 0;
      durationDisplay = json.duration_display || durationDisplay;
      uploadedBy = json.uploaded_by || uploadedBy;

      // Base64 audio upload support
      if (json.audio_base64 && context.env.MEDIA_BUCKET) {
        let base64 = json.audio_base64;
        let mime = json.mime_type || 'audio/mpeg';
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

        const r2Key = `music/${Date.now()}_${json.file_name || 'track.mp3'}`;
        await context.env.MEDIA_BUCKET.put(r2Key, u8.buffer, {
          httpMetadata: { contentType: mime },
        });
        audioUrl = `/api/media/${r2Key}`;
      }
    }

    if (!title || !audioUrl) {
      return new Response(
        JSON.stringify({ error: 'Song title and audio file/URL are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Default cover art if none specified
    if (!coverArtUrl) {
      coverArtUrl = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80';
    }

    await context.env.DB
      .prepare(`
        INSERT INTO music_tracks (
          id, title, artist, album, duration, duration_display,
          audio_url, cover_art_url, category, lyrics, spotify_url,
          youtube_url, uploaded_by, sort_order, is_published
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `)
      .bind(
        trackId, title, artist, album, duration, durationDisplay,
        audioUrl, coverArtUrl, category, lyrics, spotifyUrl,
        youtubeUrl, uploadedBy, 0
      )
      .run();

    const createdTrack: MusicTrack = {
      id: trackId,
      title,
      artist,
      album,
      duration,
      duration_display: durationDisplay,
      audio_url: audioUrl,
      cover_art_url: coverArtUrl,
      category,
      lyrics,
      spotify_url: spotifyUrl,
      youtube_url: youtubeUrl,
      uploaded_by: uploadedBy,
      sort_order: 0,
      is_published: 1,
      created_at: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({ success: true, track: createdTrack }),
      { status: 201, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    console.error('[Music API] POST error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Failed to upload song' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
