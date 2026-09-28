interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

// GET /api/media: List uploaded images and videos
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const mediaType = url.searchParams.get('type'); // 'image' | 'video'
    const eventId = url.searchParams.get('event_id') || url.searchParams.get('eventId');
    const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 100);

    let items: any[] = [];

    // 1. Try fetching from D1 media_items table
    if (context.env.DB) {
      try {
        let query = `SELECT * FROM media_items WHERE 1=1`;
        const params: any[] = [];

        if (mediaType && (mediaType === 'image' || mediaType === 'video')) {
          query += ` AND media_type = ?`;
          params.push(mediaType);
        }

        if (eventId) {
          query += ` AND event_id = ?`;
          params.push(eventId);
        }

        query += ` ORDER BY created_at DESC LIMIT ?`;
        params.push(limit);

        const stmt = context.env.DB.prepare(query);
        const { results } = await stmt.bind(...params).all();
        items = results || [];
      } catch (dbErr) {
        console.warn('[Media API] D1 query fallback to R2 listing:', dbErr);
      }
    }

    // 2. Fallback to listing directly from R2 if D1 has no items
    if (items.length === 0 && context.env.MEDIA_BUCKET) {
      const r2List = await context.env.MEDIA_BUCKET.list({
        limit,
        prefix: eventId ? `events/` : undefined,
      });

      items = r2List.objects.map((obj) => {
        const isVid = /\.(mp4|webm|mov|m4v|ogg)$/i.test(obj.key);
        return {
          id: `r2_${obj.key.replace(/[^a-zA-Z0-9]/g, '_')}`,
          r2_key: obj.key,
          url: `/api/media/${obj.key}`,
          file_name: obj.key.split('/').pop() || obj.key,
          file_type: obj.httpMetadata?.contentType || (isVid ? 'video/mp4' : 'image/jpeg'),
          media_type: isVid ? 'video' : 'image',
          file_size: obj.size,
          event_id: obj.customMetadata?.eventId || 'vlc-2027',
          title: obj.customMetadata?.fileName || obj.key.split('/').pop(),
          is_primary: obj.key.includes('/primary/') ? 1 : 0,
          uploaded_by: obj.customMetadata?.uploadedBy || 'admin',
          created_at: obj.uploaded.toISOString(),
        };
      });
    }

    return new Response(JSON.stringify({ success: true, count: items.length, items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Media API] Error fetching media list:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to list media' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/media: Media actions (e.g. set_primary)
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as any;
    const action = body.action;

    if (action === 'set_primary') {
      const eventId = body.event_id || body.eventId || 'vlc-2027';
      const mediaUrl = body.url;
      const mediaId = body.id;

      if (!mediaUrl) {
        return new Response(JSON.stringify({ error: 'Missing media url' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (context.env.DB) {
        // Unset old primary
        await context.env.DB
          .prepare(`UPDATE media_items SET is_primary = 0 WHERE event_id = ?`)
          .bind(eventId)
          .run();

        // Set new primary if id provided
        if (mediaId) {
          await context.env.DB
            .prepare(`UPDATE media_items SET is_primary = 1 WHERE id = ?`)
            .bind(mediaId)
            .run();
        }

        // Update events table primary_image_url and banner_url
        await context.env.DB
          .prepare(`
            UPDATE events 
            SET primary_image_url = ?, banner_url = ? 
            WHERE id = ? OR slug = ?
          `)
          .bind(mediaUrl, mediaUrl, eventId, eventId)
          .run();
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Primary event image updated successfully',
          primary_image_url: mediaUrl,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Media API] Error executing media action:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to execute media action' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE /api/media: Delete media item from R2 and catalog
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const key = url.searchParams.get('key');
    const id = url.searchParams.get('id');

    let r2Key = key;

    if (!r2Key && id && context.env.DB) {
      const record = await context.env.DB
        .prepare(`SELECT r2_key FROM media_items WHERE id = ?`)
        .bind(id)
        .first<{ r2_key: string }>();
      if (record) {
        r2Key = record.r2_key;
      }
    }

    if (r2Key && context.env.MEDIA_BUCKET) {
      await context.env.MEDIA_BUCKET.delete(r2Key);
    }

    if (context.env.DB) {
      if (id) {
        await context.env.DB.prepare(`DELETE FROM media_items WHERE id = ?`).bind(id).run();
      } else if (r2Key) {
        await context.env.DB.prepare(`DELETE FROM media_items WHERE r2_key = ?`).bind(r2Key).run();
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Media deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Media API] Error deleting media:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to delete media' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
