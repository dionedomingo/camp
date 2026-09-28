interface Env {
  DB: D1Database;
}

// GET: List all users/campers from unified campers table
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB
      .prepare(`
        SELECT 
          cmp.id, 
          cmp.full_name as name, 
          cmp.nickname,
          cmp.email, 
          cmp.role, 
          cmp.church_id, 
          c.name as church_name,
          cmp.is_active, 
          cmp.created_at, 
          cmp.last_login_at
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        ORDER BY 
          CASE 
            WHEN cmp.role = 'admin' THEN 0 
            WHEN cmp.role IN ('staff', 'coordinator') THEN 1 
            ELSE 2 
          END,
          cmp.created_at DESC
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

// POST: Create a new user/delegate
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      name: string;
      email: string;
      password?: string;
      role?: string;
      church_id?: string;
      phone?: string;
    };

    if (!body.name || !body.email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!body.password || !body.password.trim()) {
      return new Response(JSON.stringify({ error: 'Password is required for creating a user account' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const role = body.role || 'staff';
    const password = body.password.trim();
    const churchId = body.church_id || 'ch_jia_buag';

    await context.env.DB
      .prepare(`
        INSERT INTO campers (
          id, church_id, role, full_name, nickname, gender, age, birthdate,
          email, phone, province, city, emergency_name, emergency_phone, emergency_relation,
          password_hash, is_active, created_at
        ) VALUES (
          ?, ?, ?, ?, ?, 'unspecified', 25, '2000-01-01',
          ?, ?, 'Nueva Vizcaya', 'Bambang', 'Camp Office', '+639170000000', 'Office',
          ?, 1, CURRENT_TIMESTAMP
        )
      `)
      .bind(
        id,
        churchId,
        role,
        body.name.trim(),
        body.name.trim().split(' ')[0],
        body.email.trim().toLowerCase(),
        body.phone || '+639170000000',
        password
      )
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id,
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          role,
          church_id: churchId,
          is_active: 1,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create user';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PUT / PATCH: Update user, change role (promote camper to admin), or reset password
export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      id: string;
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      church_id?: string;
      is_active?: boolean | number;
    };

    if (!body.id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Safety guard: cannot demote Alexius from admin
    if (body.id === 'usr_admin_alexius' && body.role && body.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Primary admin (Alexius) cannot be demoted' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isActive = body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1;

    if (body.password) {
      await context.env.DB
        .prepare(`
          UPDATE campers
          SET full_name = COALESCE(?, full_name),
              email = COALESCE(?, email),
              password_hash = ?,
              role = COALESCE(?, role),
              church_id = COALESCE(?, church_id),
              is_active = ?
          WHERE id = ?
        `)
        .bind(
          body.name?.trim() || null,
          body.email?.trim().toLowerCase() || null,
          body.password,
          body.role || null,
          body.church_id || null,
          isActive,
          body.id
        )
        .run();
    } else {
      await context.env.DB
        .prepare(`
          UPDATE campers
          SET full_name = COALESCE(?, full_name),
              email = COALESCE(?, email),
              role = COALESCE(?, role),
              church_id = COALESCE(?, church_id),
              is_active = ?
          WHERE id = ?
        `)
        .bind(
          body.name?.trim() || null,
          body.email?.trim().toLowerCase() || null,
          body.role || null,
          body.church_id || null,
          isActive,
          body.id
        )
        .run();
    }

    return new Response(JSON.stringify({ success: true, updatedRole: body.role }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update user';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE: Remove a user
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Guard against deleting Alexius
  if (id === 'usr_admin_alexius') {
    return new Response(JSON.stringify({ error: 'Primary admin user (Alexius) cannot be deleted' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await context.env.DB
      .prepare('DELETE FROM campers WHERE id = ?')
      .bind(id)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete user';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
