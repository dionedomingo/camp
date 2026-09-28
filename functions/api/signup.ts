import { dispatchCamperPassportEmail } from './_email/dispatcher';
import { EmailEnv } from './_email/types';

interface Env extends EmailEnv {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json() as any;

    // Basic validation
    if (!data.church_id || !data.full_name || !data.email || !data.phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required registration fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const camperId = 'vlc_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    
    // Generate human-friendly 6-char Activation Code (e.g. VLC-7K8P)
    const codeChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let codeSuffix = '';
    for (let i = 0; i < 4; i++) {
      codeSuffix += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
    }
    const activationCode = `VLC-${codeSuffix}`;
    const activationToken = 'act_' + Math.random().toString(36).substring(2) + Date.now().toString(36) + Math.random().toString(36).substring(2);

    const ministryInterestsJson = typeof data.ministry_interests === 'string'
      ? data.ministry_interests
      : JSON.stringify(data.ministry_interests || []);

    let determinedAge = Number(data.age);
    if ((!determinedAge || isNaN(determinedAge) || determinedAge <= 0) && data.birthdate) {
      const birth = new Date(data.birthdate);
      if (!isNaN(birth.getTime())) {
        const today = new Date();
        determinedAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          determinedAge--;
        }
      }
    }
    if (!determinedAge || determinedAge <= 0) determinedAge = 18;

    if (!data.password || !data.password.trim()) {
      return new Response(
        JSON.stringify({ error: 'A password is required to create your camper account' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = data.email.toLowerCase().trim();
    const eventId = data.event_id || 'vlc-2027';

    // Fetch the target event info
    const event = await context.env.DB
      .prepare('SELECT id, name, theme FROM events WHERE id = ?')
      .bind(eventId)
      .first<{ id: string; name: string; theme: string }>();

    const targetEventName = event?.name || 'Vision & Leadership Camp 2027';
    const targetEventTheme = event?.theme || 'Arise & Shine (Isaiah 60:1)';

    // Check if camper account already exists
    const existingCamper: any = await context.env.DB
      .prepare('SELECT * FROM campers WHERE LOWER(email) = ?')
      .bind(normalizedEmail)
      .first();

    if (existingCamper) {
      // Validate password against existing account
      if (existingCamper.password_hash && existingCamper.password_hash !== data.password.trim()) {
        return new Response(
          JSON.stringify({
            error: 'An account with this email address already exists. Please enter your existing account password to join this camp event, or use Forgot Password to reset it.',
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if already registered for this specific event
      const existingReg: any = await context.env.DB
        .prepare('SELECT * FROM event_registrations WHERE camper_id = ? AND event_id = ?')
        .bind(existingCamper.id, eventId)
        .first();

      const church = await context.env.DB
        .prepare('SELECT name, slug, province FROM churches WHERE id = ?')
        .bind(data.church_id || existingCamper.church_id)
        .first<{ name: string; slug: string; province: string }>();

      if (existingReg) {
        return new Response(
          JSON.stringify({
            success: true,
            already_registered: true,
            message: `You are already registered for ${targetEventName}! Here is your delegate pass.`,
            camper: {
              ...existingCamper,
              event_id: eventId,
              activation_code: existingReg.activation_code,
              activation_token: existingReg.activation_token,
              status: existingReg.status,
              church_name: church?.name || 'Local Church',
              church_slug: church?.slug || 'vlc',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Register existing camper account for this new event
      const regId = 'reg_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
      await context.env.DB
        .prepare(`
          INSERT INTO event_registrations (
            id, event_id, camper_id, church_id, role,
            dietary_needs, ministry_interests, activation_code,
            activation_token, status, kit_claimed
          ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, 'registered', 0
          )
        `)
        .bind(
          regId,
          eventId,
          existingCamper.id,
          data.church_id || existingCamper.church_id,
          data.role || existingCamper.role || 'camper',
          data.dietary_needs || existingCamper.dietary_needs || 'None',
          ministryInterestsJson,
          activationCode,
          activationToken
        )
        .run();

      // Update camper's current active event pointer
      await context.env.DB
        .prepare(`
          UPDATE campers
          SET event_id = ?,
              activation_code = ?,
              activation_token = ?,
              church_id = ?,
              role = ?,
              status = 'registered'
          WHERE id = ?
        `)
        .bind(
          eventId,
          activationCode,
          activationToken,
          data.church_id || existingCamper.church_id,
          data.role || existingCamper.role || 'camper',
          existingCamper.id
        )
        .run();

      // Dispatch event passport email
      const requestOrigin = new URL(context.request.url).origin;
      context.waitUntil(
        dispatchCamperPassportEmail({
          db: context.env.DB,
          camper: {
            id: existingCamper.id,
            full_name: existingCamper.full_name,
            nickname: existingCamper.nickname || existingCamper.full_name.split(' ')[0],
            email: normalizedEmail,
            phone: existingCamper.phone,
            role: data.role || existingCamper.role || 'camper',
            church_id: data.church_id || existingCamper.church_id,
            church_name: church?.name || 'PCCI Church Delegation',
            church_slug: church?.slug || 'vlc',
            province: data.province || church?.province || existingCamper.province || 'Metro Manila',
            city: data.city || existingCamper.city || '',
            dietary_needs: data.dietary_needs || existingCamper.dietary_needs || 'None',
            emergency_name: existingCamper.emergency_name,
            emergency_phone: existingCamper.emergency_phone,
            emergency_relation: existingCamper.emergency_relation,
            favorite_verse: existingCamper.favorite_verse,
            activation_code: activationCode,
            activation_token: activationToken,
          },
          env: {
            ...context.env,
            CAMP_NAME: targetEventName,
            CAMP_THEME: targetEventTheme,
          },
          origin: requestOrigin,
        }).catch((dispatchErr) => {
          console.error(`[Background Email Error] Camper ${existingCamper.id}:`, dispatchErr);
        })
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: `Welcome back! You have joined ${targetEventName} using your saved account.`,
          camper: {
            ...existingCamper,
            event_id: eventId,
            activation_code: activationCode,
            activation_token: activationToken,
            status: 'registered',
            church_name: church?.name || 'Local Church',
            church_slug: church?.slug || 'vlc',
          },
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // New Camper Account: Insert into campers table
    await context.env.DB
      .prepare(`
        INSERT INTO campers (
          id, church_id, role, full_name, nickname, gender, age, birthdate,
          email, phone, province, city, dietary_needs,
          emergency_name, emergency_phone, emergency_relation,
          ministry_interests, favorite_verse, verse_reflection, selfie_url,
          activation_code, activation_token, password_hash, is_active, status, event_id
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, 1, 'registered', ?
        )
      `)
      .bind(
        camperId,
        data.church_id,
        data.role || 'camper',
        data.full_name,
        data.nickname || data.full_name.split(' ')[0],
        data.gender || 'unspecified',
        determinedAge,
        data.birthdate || null,
        normalizedEmail,
        data.phone.trim(),
        data.province || 'Metro Manila',
        data.city || '',
        data.dietary_needs || 'None',
        data.emergency_name || 'Guardian',
        data.emergency_phone || data.phone,
        data.emergency_relation || 'Family',
        ministryInterestsJson,
        data.favorite_verse || 'Philippians 4:13',
        data.verse_reflection || null,
        data.selfie_url || null,
        activationCode,
        activationToken,
        data.password.trim(),
        eventId
      )
      .run();

    // Insert corresponding initial record into event_registrations
    const regId = 'reg_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    await context.env.DB
      .prepare(`
        INSERT INTO event_registrations (
          id, event_id, camper_id, church_id, role,
          dietary_needs, ministry_interests, activation_code,
          activation_token, status, kit_claimed
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, 'registered', 0
        )
      `)
      .bind(
        regId,
        eventId,
        camperId,
        data.church_id,
        data.role || 'camper',
        data.dietary_needs || 'None',
        ministryInterestsJson,
        activationCode,
        activationToken
      )
      .run();

    // Fetch the church info to return friendly pass details
    const church = await context.env.DB
      .prepare('SELECT name, slug, province FROM churches WHERE id = ?')
      .bind(data.church_id)
      .first<{ name: string; slug: string; province: string }>();

    // Asynchronously dispatch the Camper Passport email without blocking the client registration response
    const requestOrigin = new URL(context.request.url).origin;
    context.waitUntil(
      dispatchCamperPassportEmail({
        db: context.env.DB,
        camper: {
          id: camperId,
          full_name: data.full_name,
          nickname: data.nickname || data.full_name.split(' ')[0],
          email: normalizedEmail,
          phone: data.phone.trim(),
          role: data.role || 'camper',
          church_id: data.church_id,
          church_name: church?.name || 'PCCI Church Delegation',
          church_slug: church?.slug || 'vlc',
          province: data.province || church?.province || 'Metro Manila',
          city: data.city || '',
          dietary_needs: data.dietary_needs || 'None',
          emergency_name: data.emergency_name || 'Guardian',
          emergency_phone: data.emergency_phone || data.phone,
          emergency_relation: data.emergency_relation || 'Family',
          favorite_verse: data.favorite_verse || 'Philippians 4:13',
          activation_code: activationCode,
          activation_token: activationToken,
        },
        env: {
          ...context.env,
          CAMP_NAME: targetEventName,
          CAMP_THEME: targetEventTheme,
        },
        origin: requestOrigin,
      }).catch((dispatchErr) => {
        console.error(`[Background Email Error] Camper ${camperId}:`, dispatchErr);
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        camper: {
          id: camperId,
          ...data,
          event_id: eventId,
          activation_code: activationCode,
          activation_token: activationToken,
          status: 'registered',
          church_name: church?.name || 'Local Church',
          church_slug: church?.slug || 'vlc',
          created_at: new Date().toISOString(),
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    // Check if unique email constraint violated
    if (error.message?.includes('UNIQUE constraint failed: campers.email')) {
      return new Response(
        JSON.stringify({ error: 'This email address is already registered. Please sign in to join other events.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ error: error.message || 'Registration failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
