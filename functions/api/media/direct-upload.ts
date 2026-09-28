import { verifyPresignSignature } from '../_media/presign';

interface Env {
  MEDIA_BUCKET: R2Bucket;
  JWT_SECRET?: string;
  PRESIGN_SECRET?: string;
}

const DEFAULT_SECRET = 'vlc-2027-r2-presign-signing-key-secret-safe';

// Handle CORS preflight for direct client upload
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Content-Length',
    },
  });
};

// PUT /api/media/direct-upload: Direct binary upload target for presigned URLs
export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    if (!context.env.MEDIA_BUCKET) {
      return new Response(
        JSON.stringify({ error: 'R2 MEDIA_BUCKET binding is missing or not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(context.request.url);
    const key = url.searchParams.get('key');
    const mime = url.searchParams.get('mime');
    const sizeParam = url.searchParams.get('size');
    const expiresParam = url.searchParams.get('expires');
    const sig = url.searchParams.get('sig');

    if (!key || !mime || !sizeParam || !expiresParam || !sig) {
      return new Response(
        JSON.stringify({ error: 'Missing required presigned signature query parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const expires = parseInt(expiresParam, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(expires) || now > expires) {
      return new Response(
        JSON.stringify({ error: 'Presigned upload URL has expired. Please request a new one.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const size = parseInt(sizeParam, 10);
    const secret = context.env.PRESIGN_SECRET || context.env.JWT_SECRET || DEFAULT_SECRET;

    const isValid = await verifyPresignSignature(secret, key, mime, size, expires, sig);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid or forged presigned upload signature' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Read the binary body directly
    const body = await context.request.arrayBuffer();
    if (!body || body.byteLength === 0) {
      return new Response(
        JSON.stringify({ error: 'Empty file payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Put into R2 bucket
    await context.env.MEDIA_BUCKET.put(key, body, {
      httpMetadata: {
        contentType: mime,
      },
      customMetadata: {
        r2Key: key,
        uploadedAt: new Date().toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        key,
        url: `/api/media/${key}`,
        bytes: body.byteLength,
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
    console.error('[Direct Upload API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Direct upload to R2 failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
