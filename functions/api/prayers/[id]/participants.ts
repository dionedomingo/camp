interface Env {
  DB: D1Database;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

// GET /api/prayers/:id/participants: Fetch full list of intercessors who prayed for this request
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const prayerId = context.params.id as string;

    // Verify prayer request exists
    const prayer = await context.env.DB
      .prepare('SELECT id, title, prayer_count FROM prayer_requests WHERE id = ?')
      .bind(prayerId)
      .first<any>();

    if (!prayer) {
      return new Response(
        JSON.stringify({ error: 'Prayer request not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { results: pRows } = await context.env.DB
      .prepare(`
        SELECT 
          pp.id as participant_id,
          pp.camper_id,
          pp.reaction_type,
          pp.prayer_count,
          pp.is_anonymous,
          pp.last_prayed_at,
          pp.created_at,
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
      `)
      .bind(prayerId)
      .all<any>();

    const participants = (pRows || []).map((pr: any) => {
      const isAnon = Boolean(pr.is_anonymous);
      return {
        id: pr.participant_id,
        camper_id: isAnon ? null : pr.camper_id,
        nickname: isAnon ? 'Anonymous Camper' : (pr.nickname || pr.full_name),
        role: isAnon ? 'camper' : pr.role,
        selfie_url: isAnon ? null : pr.selfie_url,
        church_name: isAnon ? null : pr.church_name,
        reaction_type: pr.reaction_type || '🙏',
        prayer_count: Number(pr.prayer_count) || 1,
        last_prayed_at: pr.last_prayed_at,
        created_at: pr.created_at,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        prayer_id: prayerId,
        prayer_title: prayer.title,
        total_prayers: Number(prayer.prayer_count) || 0,
        participants_count: participants.length,
        participants,
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
    console.error('[Get Prayer Participants API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch prayer participants' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
