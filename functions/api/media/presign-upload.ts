import { generatePresignedUploadUrl, PresignEnv } from '../_media/presign';
import { extractCamperId } from '../_media/auth';

interface Env extends PresignEnv {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

// POST /api/media/presign-upload: Generate pre-signed R2 upload URL
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid Content-Type. Please use application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await context.request.json()) as any;
    const camperId = extractCamperId(context.request, body);

    if (!camperId) {
      return new Response(
        JSON.stringify({ error: 'camper_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify camper exists in D1 database
    const camper = await context.env.DB
      .prepare('SELECT id FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper not found. You must be a registered camper to upload media.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { file_name, file_type, file_size, type = 'post' } = body;

    const presignedResult = await generatePresignedUploadUrl(
      {
        camper_id: camperId,
        file_name,
        file_type,
        file_size,
        type: type === 'story' ? 'story' : 'post',
      },
      context.env,
      context.request.url
    );

    return new Response(
      JSON.stringify({
        success: true,
        ...presignedResult,
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
    console.error('[Presign Upload API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to generate pre-signed upload URL' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
