import { ALLOWED_REACTION_EMOJIS, AllowedReactionEmoji, ReactableType } from './validation';

export interface ReactionCounts {
  '👍': number;
  '❤️': number;
  '🔥': number;
  '⛺': number;
  '🌲': number;
  '🎉': number;
  total: number;
  [key: string]: number;
}

export interface ReactionSummary {
  counts: ReactionCounts;
  user_reaction: AllowedReactionEmoji | null;
}

export function createEmptyReactionCounts(): ReactionCounts {
  return {
    '👍': 0,
    '❤️': 0,
    '🔥': 0,
    '⛺': 0,
    '🌲': 0,
    '🎉': 0,
    total: 0,
  };
}

/**
 * Builds reaction counts and user_reaction state from rows.
 */
export function buildReactionSummary(
  reactions: Array<{ reaction_type: string; camper_id?: string; count?: number }>,
  currentCamperId?: string | null
): ReactionSummary {
  const counts = createEmptyReactionCounts();
  let user_reaction: AllowedReactionEmoji | null = null;

  for (const r of reactions) {
    const emoji = r.reaction_type as AllowedReactionEmoji;
    const count = typeof r.count === 'number' ? r.count : 1;
    if (ALLOWED_REACTION_EMOJIS.includes(emoji)) {
      counts[emoji] = (counts[emoji] || 0) + count;
      counts.total += count;
    }

    if (currentCamperId && r.camper_id === currentCamperId) {
      user_reaction = emoji;
    }
  }

  return { counts, user_reaction };
}

/**
 * Fetch reaction counts and current camper reaction state in batch for multiple entities.
 */
export async function getBatchReactions(
  db: D1Database,
  reactableType: ReactableType,
  entityIds: string[],
  currentCamperId?: string | null
): Promise<Map<string, ReactionSummary>> {
  const resultMap = new Map<string, ReactionSummary>();
  if (!entityIds.length) return resultMap;

  // Initialize all with empty counts
  for (const id of entityIds) {
    resultMap.set(id, { counts: createEmptyReactionCounts(), user_reaction: null });
  }

  const placeholders = entityIds.map(() => '?').join(',');

  // 1. Grouped counts per emoji per entity
  const countQuery = `
    SELECT reactable_id, reaction_type, COUNT(*) as count
    FROM reactions
    WHERE reactable_type = ? AND reactable_id IN (${placeholders})
    GROUP BY reactable_id, reaction_type
  `;
  const countResults = await db.prepare(countQuery).bind(reactableType, ...entityIds).all<any>();

  for (const row of countResults.results || []) {
    const summary = resultMap.get(row.reactable_id);
    if (summary) {
      const emoji = row.reaction_type as AllowedReactionEmoji;
      const count = Number(row.count) || 0;
      if (ALLOWED_REACTION_EMOJIS.includes(emoji)) {
        summary.counts[emoji] = count;
        summary.counts.total += count;
      }
    }
  }

  // 2. Current camper's reaction for each entity
  if (currentCamperId) {
    const userQuery = `
      SELECT reactable_id, reaction_type
      FROM reactions
      WHERE reactable_type = ? AND reactable_id IN (${placeholders}) AND camper_id = ?
    `;
    const userResults = await db.prepare(userQuery).bind(reactableType, ...entityIds, currentCamperId).all<any>();

    for (const row of userResults.results || []) {
      const summary = resultMap.get(row.reactable_id);
      if (summary) {
        summary.user_reaction = row.reaction_type as AllowedReactionEmoji;
      }
    }
  }

  return resultMap;
}

/**
 * Fetch comment counts in batch for multiple posts.
 */
export async function getBatchCommentCounts(
  db: D1Database,
  postIds: string[]
): Promise<Map<string, number>> {
  const resultMap = new Map<string, number>();
  if (!postIds.length) return resultMap;

  for (const id of postIds) {
    resultMap.set(id, 0);
  }

  const placeholders = postIds.map(() => '?').join(',');
  const query = `
    SELECT post_id, COUNT(*) as count
    FROM post_comments
    WHERE post_id IN (${placeholders})
    GROUP BY post_id
  `;
  const results = await db.prepare(query).bind(...postIds).all<any>();

  for (const row of results.results || []) {
    resultMap.set(row.post_id, Number(row.count) || 0);
  }

  return resultMap;
}

/**
 * Response transformer for single or list of Posts.
 */
export function transformPost(
  row: any,
  reactionSummary?: ReactionSummary,
  commentsCount?: number
) {
  return {
    id: row.id,
    camper_id: row.camper_id,
    media_url: row.media_url,
    caption: row.caption || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
    camper: {
      id: row.camper_id,
      full_name: row.camper_full_name || row.full_name || '',
      nickname: row.camper_nickname || row.nickname || '',
      role: row.camper_role || row.role || 'camper',
      selfie_url: row.camper_selfie_url || row.selfie_url || null,
      church_name: row.camper_church_name || row.church_name || null,
    },
    reaction_counts: reactionSummary ? reactionSummary.counts : createEmptyReactionCounts(),
    user_reaction: reactionSummary ? reactionSummary.user_reaction : null,
    comments_count: typeof commentsCount === 'number' ? commentsCount : 0,
  };
}

/**
 * Response transformer for Stories.
 */
export function transformStory(
  row: any,
  reactionSummary?: ReactionSummary
) {
  return {
    id: row.id,
    camper_id: row.camper_id,
    media_url: row.media_url,
    caption: row.caption || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    camper: {
      id: row.camper_id,
      full_name: row.camper_full_name || row.full_name || '',
      nickname: row.camper_nickname || row.nickname || '',
      role: row.camper_role || row.role || 'camper',
      selfie_url: row.camper_selfie_url || row.selfie_url || null,
      church_name: row.camper_church_name || row.church_name || null,
    },
    reaction_counts: reactionSummary ? reactionSummary.counts : createEmptyReactionCounts(),
    user_reaction: reactionSummary ? reactionSummary.user_reaction : null,
  };
}

/**
 * Response transformer for Comments.
 */
export function transformComment(
  row: any,
  reactionSummary?: ReactionSummary
) {
  return {
    id: row.id,
    post_id: row.post_id,
    camper_id: row.camper_id,
    body: row.body,
    created_at: row.created_at,
    updated_at: row.updated_at,
    camper: {
      id: row.camper_id,
      full_name: row.camper_full_name || row.full_name || '',
      nickname: row.camper_nickname || row.nickname || '',
      role: row.camper_role || row.role || 'camper',
      selfie_url: row.camper_selfie_url || row.selfie_url || null,
    },
    reaction_counts: reactionSummary ? reactionSummary.counts : createEmptyReactionCounts(),
    user_reaction: reactionSummary ? reactionSummary.user_reaction : null,
  };
}
