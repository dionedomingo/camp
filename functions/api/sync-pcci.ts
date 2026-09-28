interface Env {
  DB: D1Database;
}

const PCCI_CHURCHES = [
  { id: 'ch_open_delegate', slug: 'independent', name: 'Independent Delegate / Other Fellowship', province: 'Open / Various', city: 'Various Cities', pastor_name: 'Camp Coordination Team', contact_email: 'info@pcci.org.ph', target_quota: 100 },
  // Cagayan
  { id: 'ch_jia_buguey', slug: 'jia-san-lorenzo-buguey', name: 'Jesus Is Alive Worship Center - San Lorenzo', province: 'Cagayan', city: 'Buguey', pastor_name: 'Pastor in Charge', contact_email: 'buguey@pcci.org.ph', target_quota: 40 },
  { id: 'ch_jia_amunitan', slug: 'jia-amunitan-gonzaga', name: 'Jesus Is Alive Worship Center - Amunitan', province: 'Cagayan', city: 'Gonzaga', pastor_name: 'Pastor in Charge', contact_email: 'amunitan@pcci.org.ph', target_quota: 35 },
  { id: 'ch_jia_ipil', slug: 'jia-ipil-gonzaga', name: 'Jesus Is Alive Worship Center - Purok 1 Ipil', province: 'Cagayan', city: 'Gonzaga', pastor_name: 'Pastor in Charge', contact_email: 'ipil@pcci.org.ph', target_quota: 35 },
  { id: 'ch_jia_tucalan', slug: 'jia-tucalan-lasam', name: 'Jesus Is Alive Worship Center - Tucalan Passing', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'tucalan@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_nabannagan', slug: 'jia-nabannagan-lasam', name: 'Jesus Is Alive - Nabannagan West', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'nabannagan@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_new_orlins', slug: 'jia-new-orlins-lasam', name: 'Jesus Is Alive Worship Center - New Orlins', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'neworlins@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_callao', slug: 'jia-callao-sur-lasam', name: 'Jesus Is Alive Worship Center - Callao Sur', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'callao@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_minanga', slug: 'jia-minanga-sur-lasam', name: 'Jesus Is Alive Worship Center - Minanga Sur', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'minanga@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_ibj', slug: 'jia-ibj-lasam', name: 'Jesus Is Alive Worship Center - IBJ', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'ibj@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_allannay', slug: 'jia-allannay-lasam', name: 'Jesus Is Alive Worship Center - Allannay', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'allannay@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_centro1', slug: 'jia-centro1-lasam', name: 'Jesus Is Alive Worship Center - Centro 1', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'centro1@pcci.org.ph', target_quota: 35 },
  { id: 'ch_jia_sanchez_mira', slug: 'jia-sanchez-mira', name: 'Jesus Is Alive Worship Center - Sanchez Mira', province: 'Cagayan', city: 'Sanchez Mira', pastor_name: 'Pastor in Charge', contact_email: 'sanchezmira@pcci.org.ph', target_quota: 40 },
  { id: 'ch_jia_sta_teresita', slug: 'jia-alucao-sta-teresita', name: 'Jesus Is Alive Worship Center - Alucao & Bungkag', province: 'Cagayan', city: 'Sta. Teresita', pastor_name: 'Pastor in Charge', contact_email: 'stateresita@pcci.org.ph', target_quota: 35 },
  // Nueva Vizcaya
  { id: 'ch_jia_buag', slug: 'jia-buag-bambang', name: 'Jesus Is Alive Worship Center - Buag', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Rev. Pastor (National HQ)', contact_email: 'bambang@pcci.org.ph', target_quota: 80 },
  { id: 'ch_jia_upacan', slug: 'jia-upacan-bambang', name: 'Jesus Is Alive - Upacan', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'upacan@pcci.org.ph', target_quota: 35 },
  { id: 'ch_jia_santo_domingo', slug: 'jia-santo-domingo-bambang', name: 'Jesus Is Alive - Santo Domingo', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'santodomingo@pcci.org.ph', target_quota: 35 },
  { id: 'ch_jia_gifta', slug: 'jia-gifta-almaguer-bambang', name: 'Jesus Is Alive - Gifta, Almaguer North', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'gifta@pcci.org.ph', target_quota: 30 },
  { id: 'ch_cog_almaguer', slug: 'cog-cf-jia-almaguer', name: 'Church of God Christian Fellowship (JIA Almaguer)', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'almaguer@pcci.org.ph', target_quota: 35 },
  { id: 'ch_jia_mauan', slug: 'jia-mauan-bambang', name: 'Jesus Is Alive - Mauan', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'mauan@pcci.org.ph', target_quota: 30 },
  { id: 'ch_jia_san_antonio', slug: 'jia-san-antonio-bambang', name: 'Jesus Is Alive - San Antonio North', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'sanantonio@pcci.org.ph', target_quota: 35 },
  { id: 'ch_jia_mangayang', slug: 'jia-mangayang-dupax', name: 'Jesus Is Alive - Mangayang', province: 'Nueva Vizcaya', city: 'Dupax Del Norte', pastor_name: 'Pastor in Charge', contact_email: 'mangayang@pcci.org.ph', target_quota: 35 },
];

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    let syncedCount = 0;

    for (const c of PCCI_CHURCHES) {
      await context.env.DB
        .prepare(`
          INSERT INTO churches (id, slug, name, province, city, pastor_name, contact_email, target_quota)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            slug = excluded.slug,
            province = excluded.province,
            city = excluded.city,
            pastor_name = excluded.pastor_name,
            contact_email = excluded.contact_email,
            target_quota = excluded.target_quota
        `)
        .bind(c.id, c.slug, c.name, c.province, c.city, c.pastor_name, c.contact_email, c.target_quota)
        .run();
      syncedCount++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synchronized ${syncedCount} PCCI churches and Independent Delegate entry into D1 database.`,
        syncedCount,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Sync error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
