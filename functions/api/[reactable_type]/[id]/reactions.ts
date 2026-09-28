import { extractCamperId } from '../../_media/auth';
import { 
  normalizeReactableType, 
  isValidReactionEmoji, 
  ALLOWED_REACTION_EMOJIS, 
  ReactableType 
} from '../../_media/validation';
import { getBatchReactions, createEmptyReactionCounts } from '../../_media/transformers';

interface Env {
  DB: D1Database;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-camper-id',
    },
  });
};

/**
 * Validates that the reactable target exists in the appropriate table.
 */
async function verifyEntityExists(db: D1Database, type: ReactableType, id: string): Promise<boolean> {
  let table = 'posts';
  if (type === 'story') table = 'stories';
  if (type === 'comment') table = 'post_comments';

  const row = await db.prepare(`SELECT id FROM ${table} WHERE id = ?`).bind(id).first<any>();
  return Boolean(row);
}

// GET /api/:reactable_type/:id/reactions: Get reaction summary for an entity
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const rawType = context.params.reactable_type as string;
    const reactableType = normalizeReactableType(rawType);
    const entityId = context.params.id as string;
    const viewerId = extractCamperId(context.request);

    if (!reactableType) {
      return new Response(
        JSON.stringify({ error: `Invalid reactable type: ${rawType}. Must be post, story, or comment.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const exists = await verifyEntityExists(context.env.DB, reactableType, entityId);
    if (!exists) {
      return new Response(
        JSON.stringify({ error: `${reactableType} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const summaryMap = await getBatchReactions(context.env.DB, reactableType, [entityId], viewerId);
    const summary = summaryMap.get(entityId) || { counts: createEmptyReactionCounts(), user_reaction: null };

    return new Response(
      JSON.stringify({
        success: true,
        reactable_type: reactableType,
        reactable_id: entityId,
        reaction_counts: summary.counts,
        user_reaction: summary.user_reaction,
        allowed_reactions: ALLOWED_REACTION_EMOJIS,
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
    console.error('[Get Reactions API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch reactions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST /api/:reactable_type/:id/reactions: Add or toggle allowed emoji reaction
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const rawType = context.params.reactable_type as string;
    const reactableType = normalizeReactableType(rawType);
    const entityId = context.params.id as string;

    if (!reactableType) {
      return new Response(
        JSON.stringify({ error: `Invalid reactable type: ${rawType}. Must be post, story, or comment.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contentType = context.request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid Content-Type. Please use application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await context.request.json()) as any;
    const camperId = extractCamperId(context.request, body);

    if (!camperId) {
      return new Response(
        JSON.stringify({ error: 'camper_id is required to react' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reactionType = (body.reaction_type || body.reaction || body.emoji || '').trim();
    if (!isValidReactionEmoji(reactionType)) {
      return new Response(
        JSON.stringify({
          error: `Invalid reaction '${reactionType}'. Allowed emojis are: ${ALLOWED_REACTION_EMOJIS.join(' ')}`,
          allowed_reactions: ALLOWED_REACTION_EMOJIS,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify entity exists
    const entityExists = await verifyEntityExists(context.env.DB, reactableType, entityId);
    if (!entityExists) {
      return new Response(
        JSON.stringify({ error: `${reactableType} with ID ${entityId} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify camper exists
    const camper = await context.env.DB
      .prepare('SELECT id FROM campers WHERE id = ?')
      .bind(camperId)
      .first<any>();

    if (!camper) {
      return new Response(
        JSON.stringify({ error: 'Camper not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check existing reaction for this camper on this entity
    const existing = await context.env.DB
      .prepare(`
        SELECT id, reaction_type 
        FROM reactions 
        WHERE camper_id = ? AND reactable_type = ? AND reactable_id = ?
      `)
      .bind(camperId, reactableType, entityId)
      .first<any>();

    let action: 'added' | 'updated' | 'removed';
    let currentUserReaction: string | null = null;

    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Toggle OFF: same reaction clicked again -> remove
        await context.env.DB
          .prepare('DELETE FROM reactions WHERE id = ?')
          .bind(existing.id)
          .run();
        action = 'removed';
        currentUserReaction = null;
      } else {
        // Replace with new reaction
        await context.env.DB
          .prepare('UPDATE reactions SET reaction_type = ? WHERE id = ?')
          .bind(reactionType, existing.id)
          .run();
        action = 'updated';
        currentUserReaction = reactionType;
      }
    } else {
      // Insert new reaction (enforcing one active reaction per camper per entity)
      const reactionId = `reac_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await context.env.DB
        .prepare(`
          INSERT INTO reactions (id, camper_id, reactable_type, reactable_id, reaction_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(reactionId, camperId, reactableType, entityId, reactionType, new Date().toISOString())
        .run();
      action = 'added';
      currentUserReaction = reactionType;
    }

    // Fetch updated aggregate reaction counts
    const summaryMap = await getBatchReactions(context.env.DB, reactableType, [entityId], camperId);
    const summary = summaryMap.get(entityId) || { counts: createEmptyReactionCounts(), user_reaction: null };

    return new Response(
      JSON.stringify({
        success: true,
        action,
        user_reaction: currentUserReaction,
        reaction_counts: summary.counts,
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
    console.error('[Add/Toggle Reaction API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to update reaction' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/:reactable_type/:id/reactions: Remove reaction
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const rawType = context.params.reactable_type as string;
    const reactableType = normalizeReactableType(rawType);
    const entityId = context.params.id as string;
    const camperId = extractCamperId(context.request);

    if (!reactableType) {
      return new Response(
        JSON.stringify({ error: `Invalid reactable type: ${rawType}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!camperId) {
      return new Response(
        JSON.stringify({ error: 'Authentication required to remove reaction' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await context.env.DB
      .prepare(`
        DELETE FROM reactions 
        WHERE camper_id = ? AND reactable_type = ? AND reactable_id = ?
      `)
      .bind(camperId, reactableType, entityId)
      .run();

    const summaryMap = await getBatchReactions(context.env.DB, reactableType, [entityId], camperId);
    const summary = summaryMap.get(entityId) || { counts: createEmptyReactionCounts(), user_reaction: null };

    return new Response(
      JSON.stringify({
        success: true,
        action: 'removed',
        user_reaction: null,
        reaction_counts: summary.counts,
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
    console.error('[Delete Reaction API] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to remove reaction' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
