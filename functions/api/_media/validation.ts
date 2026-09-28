export const ALLOWED_REACTION_EMOJIS = ['👍', '❤️', '🔥', '⛺', '🌲', '🎉'] as const;
export type AllowedReactionEmoji = typeof ALLOWED_REACTION_EMOJIS[number];

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export const ALLOWED_REACTABLE_TYPES = ['post', 'story', 'comment'] as const;
export type ReactableType = typeof ALLOWED_REACTABLE_TYPES[number];

/**
 * Normalizes input reactable_type string to 'post' | 'story' | 'comment',
 * accepting both singular and plural forms (e.g. 'posts' -> 'post', 'stories' -> 'story').
 */
export function normalizeReactableType(raw: string | undefined | null): ReactableType | null {
  if (!raw) return null;
  const clean = raw.trim().toLowerCase();
  if (clean === 'post' || clean === 'posts') return 'post';
  if (clean === 'story' || clean === 'stories') return 'story';
  if (clean === 'comment' || clean === 'comments' || clean === 'post_comment' || clean === 'post_comments') return 'comment';
  return null;
}

/**
 * Validates if the given string is one of the allowed emojis.
 */
export function isValidReactionEmoji(emoji: string | undefined | null): emoji is AllowedReactionEmoji {
  if (!emoji) return false;
  return ALLOWED_REACTION_EMOJIS.includes(emoji as AllowedReactionEmoji);
}

/**
 * Validates file mime-type against allowed whitelist.
 */
export function isValidMimeType(mime: string | undefined | null): mime is AllowedMimeType {
  if (!mime) return false;
  return ALLOWED_MIME_TYPES.includes(mime.toLowerCase() as AllowedMimeType);
}

/**
 * Validates file size.
 */
export function isValidFileSize(size: number | undefined | null): boolean {
  if (typeof size !== 'number' || isNaN(size)) return false;
  return size > 0 && size <= MAX_FILE_SIZE_BYTES;
}

/**
 * Derives clean file extension from mime type.
 */
export function getExtensionFromMime(mime: string): string {
  const lower = mime.toLowerCase();
  if (lower.includes('webp')) return 'webp';
  if (lower.includes('png')) return 'png';
  return 'jpg';
}
