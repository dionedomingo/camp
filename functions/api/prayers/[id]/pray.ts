import { extractCamperId } from '../../_media/auth';

interface Env {
  DB: D1Database;
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

// POST /api/prayers/:id/pray: Stand in prayer with avatar tracking and daily re-praying support
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const prayerId = context.params.id as string;
    const contentType = context.request.headers.get('content-type') || '';
    let body: any = {};
    if (contentType.includes('application/json')) {
      body = (await context.request.json()) as any;
    }

    const camperId = extractCamperId(context.request, body);
    if (!camperId) {
      return new Response(
        JSON.stringify({ error: 'Please sign in with your Camp Pass to stand in prayer!' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Verify prayer request exists
    const prayer = await context.env.DB
      .prepare('SELECT id, status, prayer_count FROM prayer_requests WHERE id = ?')
      .bind(prayerId)
      .first<any>();

    if (!prayer) {
      return new Response(
        JSON.stringify({ error: 'Prayer request not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verify camper exists
    const camper = await context.env.DB
      .prepare('SELECT id, full_name, nickname, selfie_url, church_id FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isAnonymous = Boolean(body.is_anonymous) ? 1 : 0;
    const reactionType = (body.reaction_type || '🙏').trim();
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.substring(0, 10); // YYYY-MM-DD

    // 3. Check existing participant record
    const existing = await context.env.DB
      .prepare(`
        SELECT id, prayer_count, last_prayed_at, is_anonymous
        FROM prayer_participants
        WHERE prayer_id = ? AND camper_id = ?
      `)
      .bind(prayerId, camperId)
      .first<any>();

    let action: 'first_prayer' | 're_prayed' | 'already_prayed_today' = 'first_prayer';
    let userPrayerCount = 1;

    if (!existing) {
      // First time praying for this request
      const participantId = `pp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await context.env.DB
        .prepare(`
          INSERT INTO prayer_participants (
            id, prayer_id, camper_id, reaction_type, prayer_count, is_anonymous, last_prayed_at, created_at
          ) VALUES (?, ?, ?, ?, 1, ?, ?, ?)
        `)
        .bind(participantId, prayerId, camperId, reactionType, isAnonymous, nowIso, nowIso)
        .run();

      // Increment denormalized prayer_count on prayer_requests
      await context.env.DB
        .prepare('UPDATE prayer_requests SET prayer_count = prayer_count + 1, updated_at = ? WHERE id = ?')
        .bind(nowIso, prayerId)
        .run();

      action = 'first_prayer';
      userPrayerCount = 1;
    } else {
      const lastPrayedDate = (existing.last_prayed_at || '').substring(0, 10);

      if (lastPrayedDate === todayDate) {
        // Already prayed today!
        action = 'already_prayed_today';
        userPrayerCount = Number(existing.prayer_count) || 1;
      } else {
        // Re-praying on a new camp day
        userPrayerCount = (Number(existing.prayer_count) || 1) + 1;
        await context.env.DB
          .prepare(`
            UPDATE prayer_participants
            SET prayer_count = prayer_count + 1, last_prayed_at = ?, reaction_type = ?
            WHERE id = ?
          `)
          .bind(nowIso, reactionType, existing.id)
          .run();

        // Increment total prayer_count
        await context.env.DB
          .prepare('UPDATE prayer_requests SET prayer_count = prayer_count + 1, updated_at = ? WHERE id = ?')
          .bind(nowIso, prayerId)
          .run();

        action = 're_prayed';
      }
    }

    // 4. Fetch updated total prayer_count
    const updatedPrayer = await context.env.DB
      .prepare('SELECT prayer_count FROM prayer_requests WHERE id = ?')
      .bind(prayerId)
      .first<any>();
    const totalPrayerCount = Number(updatedPrayer?.prayer_count) || 0;

    // 5. Fetch refreshed recent participants facepile
    const { results: pRows } = await context.env.DB
      .prepare(`
        SELECT 
          pp.camper_id,
          pp.is_anonymous,
          pp.prayer_count,
          pp.last_prayed_at,
          cmp.full_name,
          cmp.nickname,
          cmp.role,
          cmp.selfie_url,
          church.name as church_name
        FROM prayer_participants pp
        JOIN campers cmp ON pp.camper_id = cmp.id
        LEFT JOIN churches church ON cmp.church_id = church.id
        WHERE pp.prayer_id = ?
        ORDER BY pp.last_prayed_at DESC
        LIMIT 5
      `)
      .bind(prayerId)
      .all<any>();

    const recentParticipants = (pRows || []).map((pr: any) => {
      const isAnon = Boolean(pr.is_anonymous);
      return {
        camper_id: pr.camper_id,
        nickname: isAnon ? 'Anonymous' : (pr.nickname || pr.full_name),
        selfie_url: isAnon ? null : pr.selfie_url,
        church_name: isAnon ? null : pr.church_name,
        prayer_count: pr.prayer_count,
        last_prayed_at: pr.last_prayed_at,
      };
    });

    const message =
      action === 'already_prayed_today'
        ? 'You have already stood in prayer for this request today! Your faith and agreement are making an impact.'
        : action === 're_prayed'
        ? 'Thank you for continuing to stand in prayer today!'
        : 'Thank you for standing in agreement and praying for this need!';

    return new Response(
      JSON.stringify({
        success: true,
        action,
        message,
        prayer_count: totalPrayerCount,
        has_prayed: true,
        has_prayed_today: true,
        user_prayer_count: userPrayerCount,
        recent_participants: recentParticipants,
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
    console.error('[Pray Action API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to record prayer action' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
