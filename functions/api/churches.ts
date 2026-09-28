interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get('slug');

  try {
    if (slug) {
      const church = await context.env.DB
        .prepare('SELECT * FROM churches WHERE slug = ?')
        .bind(slug)
        .first();

      if (!church) {
        return new Response(JSON.stringify({ error: 'Church not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const countResult = await context.env.DB
        .prepare('SELECT COUNT(*) as registered_count FROM campers WHERE church_id = ?')
        .bind((church as { id: string }).id)
        .first<{ registered_count: number }>();

      return new Response(
        JSON.stringify({
          ...church,
          registered_count: countResult?.registered_count || 0,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // List all churches ordered with Independent Delegate first or top, then highest signups
    const { results } = await context.env.DB
      .prepare(`
        SELECT 
          c.*, 
          COUNT(cmp.id) as registered_count
        FROM churches c
        LEFT JOIN campers cmp ON c.id = cmp.church_id
        GROUP BY c.id
        ORDER BY 
          CASE WHEN c.id = 'ch_open_delegate' THEN 0 ELSE 1 END,
          registered_count DESC, 
          c.province ASC, 
          c.name ASC
      `)
      .all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Database error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Admin: Add new church
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = (await context.request.json()) as {
      name: string;
      slug: string;
      province: string;
      city: string;
      pastor_name?: string;
      contact_email?: string;
      target_quota?: number;
    };

    if (!data.name || !data.slug || !data.province || !data.city) {
      return new Response(
        JSON.stringify({ error: 'Name, slug, province, and city are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const churchId = 'ch_' + data.slug.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

    await context.env.DB
      .prepare(`
        INSERT INTO churches (id, slug, name, province, city, pastor_name, contact_email, target_quota)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        churchId,
        data.slug.toLowerCase().trim(),
        data.name.trim(),
        data.province.trim(),
        data.city.trim(),
        data.pastor_name?.trim() || null,
        data.contact_email?.trim() || null,
        Number(data.target_quota) || 50
      )
      .run();

    return new Response(
      JSON.stringify({ success: true, id: churchId, ...data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error creating church';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Admin: Update existing church
export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const data = (await context.request.json()) as {
      id: string;
      name: string;
      slug: string;
      province: string;
      city: string;
      pastor_name?: string;
      contact_email?: string;
      target_quota?: number;
    };

    if (!data.id) {
      return new Response(JSON.stringify({ error: 'Church ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB
      .prepare(`
        UPDATE churches
        SET name = ?, slug = ?, province = ?, city = ?, pastor_name = ?, contact_email = ?, target_quota = ?
        WHERE id = ?
      `)
      .bind(
        data.name.trim(),
        data.slug.toLowerCase().trim(),
        data.province.trim(),
        data.city.trim(),
        data.pastor_name?.trim() || null,
        data.contact_email?.trim() || null,
        Number(data.target_quota) || 50,
        data.id
      )
      .run();

    return new Response(JSON.stringify({ success: true, ...data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error updating church';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Admin: Delete church
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Church ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (id === 'ch_open_delegate') {
      return new Response(
        JSON.stringify({ error: 'Cannot delete the default Open Delegate entry' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await context.env.DB
      .prepare('DELETE FROM churches WHERE id = ?')
      .bind(id)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error deleting church';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
