interface Env {
  DB: D1Database;
  TARGET_CAPACITY?: string;
  CAMP_NAME?: string;
  CAMP_THEME?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const targetCapacity = parseInt(context.env.TARGET_CAPACITY || '600', 10);

    // 1. Total signups count
    const totalRow = await context.env.DB
      .prepare('SELECT COUNT(*) as total FROM campers')
      .first<{ total: number }>();
    const totalCount = totalRow?.total || 0;

    // 2. Breakdown per church
    const { results: churchBreakdown } = await context.env.DB
      .prepare(`
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.province,
          c.city,
          c.target_quota,
          COUNT(cmp.id) as count
        FROM churches c
        LEFT JOIN campers cmp ON c.id = cmp.church_id
        GROUP BY c.id
        ORDER BY count DESC
      `)
      .all();

    // 3. Breakdown per province
    const { results: provinceBreakdown } = await context.env.DB
      .prepare(`
        SELECT 
          province,
          COUNT(*) as count
        FROM campers
        GROUP BY province
        ORDER BY count DESC
      `)
      .all();

    // 4. Breakdown per role
    const { results: roleBreakdown } = await context.env.DB
      .prepare(`
        SELECT 
          role,
          COUNT(*) as count
        FROM campers
        GROUP BY role
        ORDER BY count DESC
      `)
      .all();

    // 5. Recent signups ticker (anonymized/nicknames)
    const { results: recentSignups } = await context.env.DB
      .prepare(`
        SELECT 
          cmp.nickname,
          cmp.role,
          cmp.age,
          cmp.birthdate,
          cmp.province,
          c.name as church_name,
          cmp.favorite_verse,
          cmp.created_at
        FROM campers cmp
        JOIN churches c ON cmp.church_id = c.id
        ORDER BY cmp.created_at DESC
        LIMIT 12
      `)
      .all();

    return new Response(
      JSON.stringify({
        campName: context.env.CAMP_NAME || 'VLC 2027',
        campTheme: context.env.CAMP_THEME || 'Arise & Shine (Isaiah 60:1)',
        targetCapacity,
        totalRegistered: totalCount,
        percentFilled: Math.min(100, Math.round((totalCount / targetCapacity) * 100)),
        churchBreakdown,
        provinceBreakdown,
        roleBreakdown,
        recentSignups,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=10',
        },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
