interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const totalRow = await context.env.DB
      .prepare('SELECT COUNT(*) as total FROM campers')
      .first<{ total: number }>();
    const totalRegistered = totalRow?.total || 0;

    const checkedInRow = await context.env.DB
      .prepare(`
        SELECT COUNT(*) as checked_in 
        FROM campers 
        WHERE status = 'activated' OR checked_in_at IS NOT NULL
      `)
      .first<{ checked_in: number }>();
    const totalCheckedIn = checkedInRow?.checked_in || 0;

    const kitsRow = await context.env.DB
      .prepare('SELECT COUNT(*) as kits FROM campers WHERE kit_claimed = 1')
      .first<{ kits: number }>();
    const totalKitsClaimed = kitsRow?.kits || 0;

    const percentCheckedIn = totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0;

    const { results: delegationStats } = await context.env.DB
      .prepare(`
        SELECT 
          c.id as church_id,
          c.name as church_name,
          COUNT(cmp.id) as total,
          SUM(CASE WHEN cmp.status = 'activated' OR cmp.checked_in_at IS NOT NULL THEN 1 ELSE 0 END) as checkedIn
        FROM churches c
        LEFT JOIN campers cmp ON c.id = cmp.church_id
        GROUP BY c.id
        HAVING total > 0
        ORDER BY checkedIn DESC, total DESC
      `)
      .all<any>();

    return new Response(
      JSON.stringify({
        totalRegistered,
        totalCheckedIn,
        percentCheckedIn,
        totalKitsClaimed,
        delegationStats: delegationStats || [],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=5',
        },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Database error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
