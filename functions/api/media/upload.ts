interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

// POST /api/media/upload: Upload images and videos directly to Cloudflare R2
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    if (!context.env.MEDIA_BUCKET) {
      return new Response(
        JSON.stringify({ error: 'Cloudflare R2 MEDIA_BUCKET binding is missing or not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contentType = context.request.headers.get('content-type') || '';
    let fileBuffer: ArrayBuffer | null = null;
    let fileName = '';
    let fileMimeType = '';
    let fileSize = 0;
    let folder = 'events';
    let eventId = 'vlc-2027';
    let title = '';
    let description = '';
    let isPrimary = false;
    let uploadedBy = 'admin';

    if (contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided in form data' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      fileName = file.name || 'unnamed_file';
      fileMimeType = file.type || 'application/octet-stream';
      fileSize = file.size;
      fileBuffer = await file.arrayBuffer();

      folder = (formData.get('folder') as string) || folder;
      eventId = (formData.get('event_id') as string) || (formData.get('eventId') as string) || eventId;
      title = (formData.get('title') as string) || fileName;
      description = (formData.get('description') as string) || '';
      isPrimary = formData.get('is_primary') === 'true' || formData.get('isPrimary') === 'true';
      uploadedBy = (formData.get('uploaded_by') as string) || uploadedBy;
    } else if (contentType.includes('application/json')) {
      const json = (await context.request.json()) as any;
      if (!json.file_data && !json.base64 && !json.data_url) {
        return new Response(JSON.stringify({ error: 'Missing base64 or data_url in JSON payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const rawData = json.file_data || json.base64 || json.data_url;
      fileName = json.file_name || json.fileName || `media_${Date.now()}`;
      folder = json.folder || folder;
      eventId = json.event_id || json.eventId || eventId;
      title = json.title || fileName;
      description = json.description || '';
      isPrimary = Boolean(json.is_primary || json.isPrimary);
      uploadedBy = json.uploaded_by || uploadedBy;

      // Extract MIME type and decode Base64
      let base64String = rawData;
      if (rawData.startsWith('data:')) {
        const matches = rawData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          fileMimeType = matches[1];
          base64String = matches[2];
        }
      }

      if (!fileMimeType) {
        fileMimeType = json.file_type || json.mimeType || 'image/jpeg';
      }

      const binaryStr = atob(base64String);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      fileBuffer = bytes.buffer;
      fileSize = bytes.byteLength;
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Content-Type. Use multipart/form-data or application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!fileBuffer || fileBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: 'Empty file payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine media type (image or video)
    const isVideo = fileMimeType.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(fileName);
    const isImage = fileMimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(fileName);

    if (!isImage && !isVideo) {
      return new Response(JSON.stringify({ error: 'Only images and videos are supported for upload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const mediaType = isVideo ? 'video' : 'image';

    // Generate sanitized clean R2 key
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const folderPrefix = isPrimary ? `${folder}/primary` : folder;
    const r2Key = `${folderPrefix}/${timestamp}_${cleanFileName}`;

    // Upload to Cloudflare R2 Bucket
    await context.env.MEDIA_BUCKET.put(r2Key, fileBuffer, {
      httpMetadata: {
        contentType: fileMimeType,
      },
      customMetadata: {
        fileName,
        mediaType,
        uploadedBy,
        eventId,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Public served URL through the /api/media proxy endpoint
    const url = `/api/media/${r2Key}`;
    const mediaId = `med_${timestamp}_${Math.random().toString(36).substring(2, 8)}`;

    // Store catalog metadata in D1 if available
    if (context.env.DB) {
      try {
        if (isPrimary) {
          // Reset other primary items for this event
          await context.env.DB
            .prepare(`UPDATE media_items SET is_primary = 0 WHERE event_id = ?`)
            .bind(eventId)
            .run();

          // Update primary_image_url and banner_url in events table
          await context.env.DB
            .prepare(`
              UPDATE events 
              SET primary_image_url = ?, banner_url = ? 
              WHERE id = ? OR slug = ?
            `)
            .bind(url, url, eventId, eventId)
            .run();
        }

        await context.env.DB
          .prepare(`
            INSERT INTO media_items (
              id, r2_key, url, file_name, file_type, media_type,
              file_size, event_id, title, description, is_primary, uploaded_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            mediaId,
            r2Key,
            url,
            fileName,
            fileMimeType,
            mediaType,
            fileSize,
            eventId,
            title || fileName,
            description || '',
            isPrimary ? 1 : 0,
            uploadedBy
          )
          .run();
      } catch (dbErr: any) {
        console.warn('[Media Upload] D1 cataloging warning (R2 upload succeeded):', dbErr);
      }
    }

    const mediaRecord = {
      id: mediaId,
      r2_key: r2Key,
      url,
      file_name: fileName,
      file_type: fileMimeType,
      media_type: mediaType,
      file_size: fileSize,
      event_id: eventId,
      title: title || fileName,
      description,
      is_primary: isPrimary ? 1 : 0,
      uploaded_by: uploadedBy,
      created_at: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: `${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully to Cloudflare R2`,
        url,
        r2_key: r2Key,
        media: mediaRecord,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[Media Upload API] Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to upload media to R2' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
