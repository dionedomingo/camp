import { saveSelfieToR2 } from '../media/helper';

interface Env {
  DB: D1Database;
  MEDIA_BUCKET?: R2Bucket;
}

function calculateAge(birthdate: string): number {
  if (!birthdate) return 0;
  const birth = new Date(birthdate);
  if (isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// GET: Retrieve camper profile by ID or activation code
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id') || '';
    const code = url.searchParams.get('code') || '';

    if (!id && !code) {
      return new Response(
        JSON.stringify({ error: 'Camper ID or code is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const query = `
      SELECT cmp.*, c.name as church_name, c.slug as church_slug
      FROM campers cmp
      LEFT JOIN churches c ON cmp.church_id = c.id
      WHERE cmp.id = ? OR UPPER(cmp.activation_code) = UPPER(?)
      LIMIT 1
    `;

    const camper = await context.env.DB.prepare(query).bind(id || code, code || id).first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse ministry_interests if needed
    if (typeof camper.ministry_interests === 'string') {
      try {
        camper.ministry_interests = JSON.parse(camper.ministry_interests);
      } catch {
        camper.ministry_interests = [camper.ministry_interests];
      }
    }

    // Sanitize sensitive credentials and tokens
    delete camper.password_hash;
    delete camper.reset_token;
    delete camper.reset_token_expires_at;
    delete camper.activation_token;

    return new Response(
      JSON.stringify({ success: true, camper }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve profile';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST / PUT: Update camper profile (Selfie, Personal Info, Emergency, Verse)
export const onRequestPost: PagesFunction<Env> = async (context) => {
  return handleUpdate(context);
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  return handleUpdate(context);
};

async function handleUpdate(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const body = (await context.request.json()) as any;
    const camperId = (body.id || '').trim();

    if (!camperId) {
      return new Response(
        JSON.stringify({ error: 'Camper ID is required to update profile' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify camper exists
    const existing = await context.env.DB
      .prepare('SELECT * FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    if (!existing) {
      return new Response(
        JSON.stringify({ error: 'Camper profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate age if birthdate is updated
    let calculatedAge = existing.age;
    if (body.birthdate) {
      const derived = calculateAge(body.birthdate);
      if (derived > 0) calculatedAge = derived;
    }
    if (body.age && !isNaN(Number(body.age)) && Number(body.age) > 0) {
      calculatedAge = Number(body.age);
    }

    const fullName = (body.full_name || existing.full_name || '').trim();
    const nickname = (body.nickname || existing.nickname || fullName.split(' ')[0] || '').trim();
    const gender = body.gender || existing.gender || 'unspecified';
    const birthdate = body.birthdate || existing.birthdate || null;
    const email = (body.email || existing.email || '').toLowerCase().trim();
    const phone = (body.phone || existing.phone || '').trim();
    const dietaryNeeds = body.dietary_needs !== undefined ? body.dietary_needs : existing.dietary_needs;
    const emergencyName = body.emergency_name !== undefined ? body.emergency_name : existing.emergency_name;
    const emergencyPhone = body.emergency_phone !== undefined ? body.emergency_phone : existing.emergency_phone;
    const emergencyRelation = body.emergency_relation !== undefined ? body.emergency_relation : existing.emergency_relation;
    const favoriteVerse = body.favorite_verse !== undefined ? body.favorite_verse : (existing.favorite_verse ?? null);
    const verseReflection = body.verse_reflection !== undefined
      ? body.verse_reflection
      : (body.verseReflection !== undefined ? body.verseReflection : (existing.verse_reflection ?? null));
    let selfieUrl = body.selfie_url !== undefined ? body.selfie_url : existing.selfie_url;
    if (selfieUrl && typeof selfieUrl === 'string' && selfieUrl.startsWith('data:')) {
      selfieUrl = await saveSelfieToR2(context.env.MEDIA_BUCKET, selfieUrl, existing.id);
    }

    let ministryJson = existing.ministry_interests;
    if (body.ministry_interests) {
      ministryJson = typeof body.ministry_interests === 'string'
        ? body.ministry_interests
        : JSON.stringify(body.ministry_interests);
    }

    const newPassword = (body.password || '').trim();

    // Execute update in D1
    if (newPassword) {
      await context.env.DB
        .prepare(`
          UPDATE campers
          SET full_name = ?,
              nickname = ?,
              gender = ?,
              birthdate = ?,
              age = ?,
              email = ?,
              phone = ?,
              dietary_needs = ?,
              emergency_name = ?,
              emergency_phone = ?,
              emergency_relation = ?,
              favorite_verse = ?,
              verse_reflection = ?,
              selfie_url = ?,
              ministry_interests = ?,
              password_hash = ?
          WHERE id = ?
        `)
        .bind(
          fullName,
          nickname,
          gender,
          birthdate,
          calculatedAge,
          email,
          phone,
          dietaryNeeds,
          emergencyName,
          emergencyPhone,
          emergencyRelation,
          favoriteVerse,
          verseReflection,
          selfieUrl,
          ministryJson,
          newPassword,
          camperId
        )
        .run();
    } else {
      await context.env.DB
        .prepare(`
          UPDATE campers
          SET full_name = ?,
              nickname = ?,
              gender = ?,
              birthdate = ?,
              age = ?,
              email = ?,
              phone = ?,
              dietary_needs = ?,
              emergency_name = ?,
              emergency_phone = ?,
              emergency_relation = ?,
              favorite_verse = ?,
              verse_reflection = ?,
              selfie_url = ?,
              ministry_interests = ?
          WHERE id = ?
        `)
        .bind(
          fullName,
          nickname,
          gender,
          birthdate,
          calculatedAge,
          email,
          phone,
          dietaryNeeds,
          emergencyName,
          emergencyPhone,
          emergencyRelation,
          favoriteVerse,
          verseReflection,
          selfieUrl,
          ministryJson,
          camperId
        )
        .run();
    }

    // Fetch and return the updated camper record with church details
    const updated = await context.env.DB
      .prepare(`
        SELECT cmp.*, c.name as church_name, c.slug as church_slug
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE cmp.id = ?
      `)
      .bind(camperId)
      .first<any>();

    if (typeof updated.ministry_interests === 'string') {
      try {
        updated.ministry_interests = JSON.parse(updated.ministry_interests);
      } catch {
        updated.ministry_interests = [updated.ministry_interests];
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        camper: updated,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update profile';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
