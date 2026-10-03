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

const ALLOWED_TESTIMONY_EMOJIS = ['🙌', '❤️', '🔥', '🎉', '🙏'];

// POST /api/testimonies/:id/reactions: Toggle praise reaction on a testimony
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const testimonyId = context.params.id as string;
    const contentType = context.request.headers.get('content-type') || '';
    let body: any = {};
    if (contentType.includes('application/json')) {
      body = (await context.request.json()) as any;
    }

    const camperId = extractCamperId(context.request, body);
    if (!camperId) {
      return new Response(
        JSON.stringify({ error: 'Please sign in with your Camp Pass to react' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify testimony exists
    const testimony = await context.env.DB
      .prepare('SELECT id, praise_count FROM testimonies WHERE id = ?')
      .bind(testimonyId)
      .first<any>();

    if (!testimony) {
      return new Response(
        JSON.stringify({ error: 'Testimony not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emoji = (body.reaction_type || body.emoji || '🙌').trim();
    if (!ALLOWED_TESTIMONY_EMOJIS.includes(emoji)) {
      return new Response(
        JSON.stringify({ error: `Invalid emoji reaction. Allowed: ${ALLOWED_TESTIMONY_EMOJIS.join(' ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check existing reaction
    const existing = await context.env.DB
      .prepare('SELECT id, reaction_type FROM testimony_reactions WHERE testimony_id = ? AND camper_id = ?')
      .bind(testimonyId, camperId)
      .first<any>();

    let action: 'added' | 'updated' | 'removed';
    let currentUserReaction: string | null = null;
    let praiseDelta = 0;

    if (existing) {
      if (existing.reaction_type === emoji) {
        // Toggle OFF
        await context.env.DB
          .prepare('DELETE FROM testimony_reactions WHERE id = ?')
          .bind(existing.id)
          .run();
        action = 'removed';
        currentUserReaction = null;
        praiseDelta = -1;
      } else {
        // Change reaction emoji
        await context.env.DB
          .prepare('UPDATE testimony_reactions SET reaction_type = ? WHERE id = ?')
          .bind(emoji, existing.id)
          .run();
        action = 'updated';
        currentUserReaction = emoji;
        praiseDelta = 0;
      }
    } else {
      // Add reaction
      const reactionId = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await context.env.DB
        .prepare(`
          INSERT INTO testimony_reactions (id, testimony_id, camper_id, reaction_type, created_at)
          VALUES (?, ?, ?, ?, ?)
        `)
        .bind(reactionId, testimonyId, camperId, emoji, new Date().toISOString())
        .run();
      action = 'added';
      currentUserReaction = emoji;
      praiseDelta = 1;
    }

    // Update denormalized praise_count
    if (praiseDelta !== 0) {
      await context.env.DB
        .prepare('UPDATE testimonies SET praise_count = MAX(0, praise_count + ?), updated_at = ? WHERE id = ?')
        .bind(praiseDelta, new Date().toISOString(), testimonyId)
        .run();
    }

    const updated = await context.env.DB
      .prepare('SELECT praise_count FROM testimonies WHERE id = ?')
      .bind(testimonyId)
      .first<any>();

    return new Response(
      JSON.stringify({
        success: true,
        action,
        user_reaction: currentUserReaction,
        has_praised: Boolean(currentUserReaction),
        praise_count: Number(updated?.praise_count) || 0,
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
    console.error('[Testimony Reaction API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to update reaction' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
