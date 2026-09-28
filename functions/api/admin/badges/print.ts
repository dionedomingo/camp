interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      registration_ids?: string[];
      camper_ids?: string[];
      event_id?: string;
      admin_id?: string;
      reason?: string;
      action?: 'print' | 'reprint' | 'reset';
    };

    const registrationIds = body.registration_ids || [];
    const camperIds = body.camper_ids || [];
    const adminId = body.admin_id || 'admin';
    const reason = body.reason || null;
    const action = body.action || 'print';

    if (registrationIds.length === 0 && camperIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'registration_ids or camper_ids array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'reset') {
      // Reset print count to 0
      if (registrationIds.length > 0) {
        const placeholders = registrationIds.map(() => '?').join(',');
        await context.env.DB
          .prepare(`
            UPDATE event_registrations
            SET print_count = 0,
                last_printed_at = NULL,
                last_printed_by = NULL,
                reprint_reason = NULL
            WHERE id IN (${placeholders})
          `)
          .bind(...registrationIds)
          .run();
      }

      if (camperIds.length > 0) {
        const placeholders = camperIds.map(() => '?').join(',');
        await context.env.DB
          .prepare(`
            UPDATE campers
            SET print_count = 0,
                last_printed_at = NULL,
                last_printed_by = NULL,
                reprint_reason = NULL
            WHERE id IN (${placeholders})
          `)
          .bind(...camperIds)
          .run();
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Print count reset successfully.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Default: record print or reprint
    let updatedCount = 0;

    if (registrationIds.length > 0) {
      for (const regId of registrationIds) {
        await context.env.DB
          .prepare(`
            UPDATE event_registrations
            SET print_count = COALESCE(print_count, 0) + 1,
                last_printed_at = CURRENT_TIMESTAMP,
                last_printed_by = ?,
                reprint_reason = ?
            WHERE id = ?
          `)
          .bind(adminId, reason, regId)
          .run();

        // Also sync camper record
        await context.env.DB
          .prepare(`
            UPDATE campers
            SET print_count = COALESCE(print_count, 0) + 1,
                last_printed_at = CURRENT_TIMESTAMP,
                last_printed_by = ?,
                reprint_reason = ?
            WHERE id IN (SELECT camper_id FROM event_registrations WHERE id = ?)
          `)
          .bind(adminId, reason, regId)
          .run();

        updatedCount++;
      }
    } else if (camperIds.length > 0) {
      for (const cmpId of camperIds) {
        await context.env.DB
          .prepare(`
            UPDATE campers
            SET print_count = COALESCE(print_count, 0) + 1,
                last_printed_at = CURRENT_TIMESTAMP,
                last_printed_by = ?,
                reprint_reason = ?
            WHERE id = ?
          `)
          .bind(adminId, reason, cmpId)
          .run();

        if (body.event_id) {
          await context.env.DB
            .prepare(`
              UPDATE event_registrations
              SET print_count = COALESCE(print_count, 0) + 1,
                  last_printed_at = CURRENT_TIMESTAMP,
                  last_printed_by = ?,
                  reprint_reason = ?
              WHERE camper_id = ? AND event_id = ?
            `)
            .bind(adminId, reason, cmpId, body.event_id)
            .run();
        }

        updatedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated_count: updatedCount,
        message: `Successfully recorded print for ${updatedCount} badge(s).`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    console.error('[Badges Print API] Error:', err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
