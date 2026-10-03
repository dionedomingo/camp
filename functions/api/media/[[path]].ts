interface Env {
  MEDIA_BUCKET: R2Bucket;
}

// GET /api/media/*: Serves media files (images & videos) directly from Cloudflare R2
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    if (!context.env.MEDIA_BUCKET) {
      return new Response(JSON.stringify({ error: 'R2 MEDIA_BUCKET binding is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pathParam = context.params.path;
    let key = '';
    if (Array.isArray(pathParam)) {
      key = pathParam.join('/');
    } else if (typeof pathParam === 'string') {
      key = pathParam;
    }

    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing media key' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    key = decodeURIComponent(key);

    const range = context.request.headers.get('range');
    let object: R2Object | R2ObjectBody | null = null;

    if (range) {
      object = await context.env.MEDIA_BUCKET.get(key, {
        range: context.request.headers,
        onlyIf: context.request.headers,
      });
    } else {
      object = await context.env.MEDIA_BUCKET.get(key);
    }

    if (!object) {
      return new Response('Media file not found in R2', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');

    // Infer content type if missing
    if (!headers.has('content-type')) {
      const lower = key.toLowerCase();
      if (lower.endsWith('.mp3')) headers.set('content-type', 'audio/mpeg');
      else if (lower.endsWith('.wav')) headers.set('content-type', 'audio/wav');
      else if (lower.endsWith('.m4a') || lower.endsWith('.aac')) headers.set('content-type', 'audio/aac');
      else if (lower.endsWith('.ogg')) headers.set('content-type', 'audio/ogg');
      else if (lower.endsWith('.mp4')) headers.set('content-type', 'video/mp4');
      else if (lower.endsWith('.webm')) headers.set('content-type', 'video/webm');
      else if (lower.endsWith('.mov')) headers.set('content-type', 'video/quicktime');
      else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) headers.set('content-type', 'image/jpeg');
      else if (lower.endsWith('.png')) headers.set('content-type', 'image/png');
      else if (lower.endsWith('.webp')) headers.set('content-type', 'image/webp');
      else if (lower.endsWith('.gif')) headers.set('content-type', 'image/gif');
      else if (lower.endsWith('.svg')) headers.set('content-type', 'image/svg+xml');
      else headers.set('content-type', 'application/octet-stream');
    }

    // Long-term immutable caching for static media
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    let status = 200;
    if (range && 'range' in object && object.range) {
      status = 206;
      const totalSize = object.size;
      const { offset, length } = object.range;
      headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${totalSize}`);
      headers.set('Content-Length', `${length}`);
    }

    return new Response('body' in object ? (object as R2ObjectBody).body : null, {
      status,
      headers,
    });
  } catch (err: any) {
    console.error('[Media Serve API] Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to serve media' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
