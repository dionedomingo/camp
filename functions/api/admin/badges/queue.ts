interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const eventId = url.searchParams.get('event_id') || '';
    const churchId = url.searchParams.get('church_id') || '';
    const printStatus = url.searchParams.get('print_status') || 'all'; // 'all', 'unprinted', 'printed', 'reprint'
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();

    // 1. Compute summary stats
    let statsQuery = `
      SELECT 
        COUNT(*) as total_in_queue,
        SUM(CASE WHEN COALESCE(er.print_count, cmp.print_count, 0) = 0 THEN 1 ELSE 0 END) as unprinted_count,
        SUM(CASE WHEN COALESCE(er.print_count, cmp.print_count, 0) = 1 THEN 1 ELSE 0 END) as printed_count,
        SUM(CASE WHEN COALESCE(er.print_count, cmp.print_count, 0) > 1 THEN 1 ELSE 0 END) as reprint_count
      FROM event_registrations er
      JOIN campers cmp ON er.camper_id = cmp.id
      WHERE 1=1
    `;
    const statsParams: any[] = [];
    if (eventId) {
      statsQuery += ` AND er.event_id = ?`;
      statsParams.push(eventId);
    }
    if (churchId) {
      statsQuery += ` AND er.church_id = ?`;
      statsParams.push(churchId);
    }

    const statsRes: any = await context.env.DB
      .prepare(statsQuery)
      .bind(...statsParams)
      .first();

    // 2. Fetch queue list
    let query = `
      SELECT 
        er.id as registration_id,
        er.event_id,
        e.name as event_name,
        e.slug as event_slug,
        e.theme as event_theme,
        (e.start_date || ' to ' || e.end_date) as event_dates,
        e.venue_name as event_venue,
        e.city as event_city,
        cmp.id as camper_id,
        cmp.full_name,
        cmp.nickname,
        cmp.gender,
        cmp.age,
        cmp.birthdate,
        cmp.email,
        cmp.phone,
        cmp.province,
        cmp.city,
        cmp.dietary_needs,
        cmp.emergency_name,
        cmp.emergency_phone,
        cmp.emergency_relation,
        cmp.favorite_verse,
        cmp.verse_reflection,
        cmp.selfie_url,
        COALESCE(er.activation_code, cmp.activation_code) as activation_code,
        COALESCE(er.activation_token, cmp.activation_token) as activation_token,
        COALESCE(er.role, cmp.role, 'camper') as role,
        COALESCE(er.status, cmp.status, 'registered') as status,
        COALESCE(er.print_count, cmp.print_count, 0) as print_count,
        COALESCE(er.last_printed_at, cmp.last_printed_at) as last_printed_at,
        COALESCE(er.last_printed_by, cmp.last_printed_by) as last_printed_by,
        COALESCE(er.reprint_reason, cmp.reprint_reason) as reprint_reason,
        er.checked_in_at,
        er.kit_claimed,
        er.church_id,
        c.name as church_name,
        c.slug as church_slug,
        er.created_at
      FROM event_registrations er
      JOIN campers cmp ON er.camper_id = cmp.id
      JOIN events e ON er.event_id = e.id
      LEFT JOIN churches c ON er.church_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (eventId) {
      query += ` AND er.event_id = ?`;
      params.push(eventId);
    }
    if (churchId) {
      query += ` AND er.church_id = ?`;
      params.push(churchId);
    }

    if (printStatus === 'unprinted') {
      query += ` AND COALESCE(er.print_count, cmp.print_count, 0) = 0`;
    } else if (printStatus === 'printed') {
      query += ` AND COALESCE(er.print_count, cmp.print_count, 0) = 1`;
    } else if (printStatus === 'reprint') {
      query += ` AND COALESCE(er.print_count, cmp.print_count, 0) > 1`;
    }

    query += ` ORDER BY 
      CASE WHEN COALESCE(er.print_count, cmp.print_count, 0) = 0 THEN 0 ELSE 1 END,
      er.created_at DESC
    `;

    const { results } = await context.env.DB
      .prepare(query)
      .bind(...params)
      .all<any>();

    let list = results || [];

    if (search) {
      list = list.filter((item) =>
        item.full_name?.toLowerCase().includes(search) ||
        item.nickname?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.includes(search) ||
        item.activation_code?.toLowerCase().includes(search) ||
        item.church_name?.toLowerCase().includes(search)
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          total_in_queue: statsRes?.total_in_queue || 0,
          unprinted_count: statsRes?.unprinted_count || 0,
          printed_count: statsRes?.printed_count || 0,
          reprint_count: statsRes?.reprint_count || 0,
        },
        delegates: list,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    console.error('[Badges Queue API] Error:', err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
