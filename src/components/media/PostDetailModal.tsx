import { useState, useEffect, type FC } from 'react';
import { 
  X, 
  Trash2, 
  Send, 
  MessageCircle, 
  Loader2, 
  Sparkles, 
  MapPin,
  Clock,
  Heart,
  Smile
} from 'lucide-react';
import type { CommunityPost, PostComment, AllowedReactionEmoji, CamperRegistration } from '../../types';
import { apiService } from '../../services/api';

const EMOJI_WHITELIST: AllowedReactionEmoji[] = ['👍', '❤️', '🔥', '⛺', '🌲', '🎉'];

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost | null;
  currentCamper: CamperRegistration | null;
  onPostDeleted?: (postId: string) => void;
  onReactionUpdated?: (postId: string, emoji: AllowedReactionEmoji | null, counts: any) => void;
  onCommentAdded?: (postId: string, newComment: PostComment) => void;
  onNavigateToCamper?: (camperId: string) => void;
}

export const PostDetailModal: FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
  currentCamper,
  onPostDeleted,
  onReactionUpdated,
  onCommentAdded,
  onNavigateToCamper,
}) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeReaction, setActiveReaction] = useState<AllowedReactionEmoji | null>(null);
  const [reactionCounts, setReactionCounts] = useState<any>({});
  const [isReacting, setIsReacting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Comment reaction states
  const [reactingCommentId, setReactingCommentId] = useState<string | null>(null);
  const [activeCommentEmojiPicker, setActiveCommentEmojiPicker] = useState<string | null>(null);

  // Close floating emoji picker on outside click
  useEffect(() => {
    if (!activeCommentEmojiPicker) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.emoji-picker-container')) {
        setActiveCommentEmojiPicker(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [activeCommentEmojiPicker]);

  const handleOpenCamper = (camperId?: string) => {
    if (!camperId) return;
    onClose();
    onNavigateToCamper?.(camperId);
  };

  const handleCommentReaction = async (commentId: string, emoji: AllowedReactionEmoji) => {
    if (!currentCamper?.id) {
      alert('Please log in with your Camp Pass to react to comments!');
      return;
    }
    if (reactingCommentId === commentId) return;

    const targetComment = comments.find((c) => c.id === commentId);
    if (!targetComment) return;

    const prevUserReaction = targetComment.user_reaction;
    const prevCounts = { ...(targetComment.reaction_counts || {}) };
    const isToggleOff = prevUserReaction === emoji;
    const nextUserReaction = isToggleOff ? null : emoji;

    const nextCounts = { ...prevCounts };
    if (prevUserReaction && (nextCounts[prevUserReaction] || 0) > 0) {
      nextCounts[prevUserReaction] -= 1;
      nextCounts.total = Math.max(0, (nextCounts.total || 1) - 1);
    }
    if (!isToggleOff) {
      nextCounts[emoji] = (nextCounts[emoji] || 0) + 1;
      nextCounts.total = (nextCounts.total || 0) + 1;
    }

    // Optimistic update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, user_reaction: nextUserReaction, reaction_counts: nextCounts }
          : c
      )
    );
    setActiveCommentEmojiPicker(null);
    setReactingCommentId(commentId);

    try {
      const res = await apiService.toggleReaction('comment', commentId, emoji, currentCamper.id);
      if (res.success && res.reaction_counts) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, user_reaction: res.user_reaction || null, reaction_counts: res.reaction_counts }
              : c
          )
        );
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, user_reaction: prevUserReaction, reaction_counts: prevCounts }
              : c
          )
        );
      }
    } catch {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, user_reaction: prevUserReaction, reaction_counts: prevCounts }
            : c
        )
      );
    } finally {
      setReactingCommentId(null);
    }
  };

  useEffect(() => {
    if (!isOpen || !post) return;

    setActiveReaction(post.user_reaction || null);
    setReactionCounts(post.reaction_counts || {});

    // Fetch comments
    setIsLoadingComments(true);
    apiService.getPostComments(post.id, currentCamper?.id)
      .then((res) => {
        if (res.success && res.comments) {
          setComments(res.comments);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingComments(false));
  }, [isOpen, post?.id, currentCamper?.id]);

  if (!isOpen || !post) return null;

  const isOwner = Boolean(currentCamper && currentCamper.id === post.camper_id);

  const handleReaction = async (emoji: AllowedReactionEmoji) => {
    if (!currentCamper?.id) {
      alert('Please log in with your Camp Pass to react to posts!');
      return;
    }
    if (isReacting) return;

    const previousReaction = activeReaction;
    const previousCounts = { ...reactionCounts };
    const isToggleOff = activeReaction === emoji;
    const nextReaction = isToggleOff ? null : emoji;

    const nextCounts = { ...reactionCounts };
    if (previousReaction && nextCounts[previousReaction] > 0) {
      nextCounts[previousReaction] -= 1;
      nextCounts.total = Math.max(0, (nextCounts.total || 1) - 1);
    }
    if (!isToggleOff) {
      nextCounts[emoji] = (nextCounts[emoji] || 0) + 1;
      nextCounts.total = (nextCounts.total || 0) + 1;
    }

    setActiveReaction(nextReaction);
    setReactionCounts(nextCounts);
    setIsReacting(true);

    try {
      const res = await apiService.toggleReaction('post', post.id, emoji, currentCamper.id);
      if (res.success && res.reaction_counts) {
        setReactionCounts(res.reaction_counts);
        setActiveReaction(res.user_reaction || null);
        if (onReactionUpdated) {
          onReactionUpdated(post.id, res.user_reaction || null, res.reaction_counts);
        }
      } else {
        setActiveReaction(previousReaction);
        setReactionCounts(previousCounts);
      }
    } catch {
      setActiveReaction(previousReaction);
      setReactionCounts(previousCounts);
    } finally {
      setIsReacting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCamper?.id) {
      alert('Please log in with your Camp Pass to leave a comment!');
      return;
    }

    const trimmed = newCommentText.trim();
    if (!trimmed || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await apiService.addPostComment(post.id, currentCamper.id, trimmed);
      if (res.success && res.comment) {
        setComments((prev) => [...prev, res.comment!]);
        setNewCommentText('');
        if (onCommentAdded) {
          onCommentAdded(post.id, res.comment);
        }
      } else {
        alert(res.error || 'Failed to submit comment');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!currentCamper?.id) return;
    if (!confirm('Are you sure you want to permanently delete this post?')) return;

    setIsDeleting(true);
    try {
      const res = await apiService.deletePost(post.id, currentCamper.id);
      if (res.success) {
        if (onPostDeleted) {
          onPostDeleted(post.id);
        }
        onClose();
      } else {
        alert(res.error || 'Failed to delete post');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting post');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPostTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Media Image Canvas */}
        <div className="relative md:w-3/5 bg-zinc-950 flex items-center justify-center min-h-[320px] max-h-[50vh] md:max-h-[85vh] overflow-hidden select-none">
          <img
            src={post.media_url}
            alt={post.caption || 'Community Post'}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side: Header, Caption, Reactions, and Comments Stream */}
        <div className="md:w-2/5 flex flex-col h-[55vh] md:h-auto max-h-[85vh] bg-white text-left">
          
          {/* Post Header */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => handleOpenCamper(post.camper_id || post.camper?.id)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shrink-0 bg-zinc-100 shadow-2xs hover:ring-2 hover:ring-blue-500 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-hidden"
                title={`View ${post.camper?.nickname || 'Camper'}'s profile`}
              >
                {post.camper?.selfie_url ? (
                  <img
                    src={post.camper.selfie_url}
                    alt={post.camper.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 bg-blue-50">
                    {post.camper?.nickname?.charAt(0) || 'C'}
                  </div>
                )}
              </button>

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => handleOpenCamper(post.camper_id || post.camper?.id)}
                  className="font-bold text-sm text-zinc-900 truncate block hover:text-blue-600 hover:underline cursor-pointer text-left focus:outline-hidden"
                  title={`View ${post.camper?.nickname || 'Camper'}'s profile`}
                >
                  {post.camper?.nickname || post.camper?.full_name}
                </button>
                <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1">
                  {post.camper?.church_name && (
                    <>
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0 inline" />
                      <span>{post.camper.church_name}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isOwner && (
                <button
                  type="button"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  title="Delete post"
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                title="Close"
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Post Caption & Comments Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-zinc-100">
            {/* Caption & Timestamp */}
            <div className="space-y-2 pb-2">
              {post.caption && (
                <p className="text-sm text-zinc-800 font-normal leading-relaxed whitespace-pre-line">
                  {post.caption}
                </p>
              )}
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                <Clock className="w-3 h-3 inline" />
                <span>{formatPostTime(post.created_at)}</span>
              </div>
            </div>

            {/* Comments List */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Comments ({comments.length})</span>
                </span>
              </div>

              {isLoadingComments ? (
                <div className="flex items-center justify-center py-8 text-zinc-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Loading comments...</span>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-zinc-400 italic py-6 text-center">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => {
                    const hasHeart = comment.user_reaction === '❤️';
                    const hasReactions = Boolean(comment.reaction_counts && comment.reaction_counts.total > 0);
                    const isPickerOpen = activeCommentEmojiPicker === comment.id;

                    return (
                      <div key={comment.id} className="flex items-start gap-2.5 group">
                        {/* Commenter Avatar (Click to view profile) */}
                        <button
                          type="button"
                          onClick={() => handleOpenCamper(comment.camper_id || comment.camper?.id)}
                          className="w-7 h-7 rounded-full overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200 mt-0.5 hover:ring-2 hover:ring-blue-500 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-hidden shadow-2xs"
                          title={`View ${comment.camper?.nickname || 'Camper'}'s profile`}
                        >
                          {comment.camper?.selfie_url ? (
                            <img
                              src={comment.camper.selfie_url}
                              alt={comment.camper.nickname || 'Avatar'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-600 bg-zinc-200">
                              {comment.camper?.nickname?.charAt(0) || comment.camper?.full_name?.charAt(0) || 'C'}
                            </div>
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="bg-zinc-50 rounded-2xl p-2.5 text-xs border border-zinc-100/80">
                            {/* Commenter Name (Clickable) & Time */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <button
                                type="button"
                                onClick={() => handleOpenCamper(comment.camper_id || comment.camper?.id)}
                                className="font-bold text-zinc-900 truncate hover:text-blue-600 hover:underline cursor-pointer text-left focus:outline-hidden"
                                title={`View ${comment.camper?.nickname || 'Camper'}'s profile`}
                              >
                                {comment.camper?.nickname || comment.camper?.full_name}
                              </button>
                              <span className="text-[10px] text-zinc-400 shrink-0">
                                {formatPostTime(comment.created_at)}
                              </span>
                            </div>

                            {/* Comment Body */}
                            <p className="text-zinc-700 whitespace-pre-line leading-relaxed">
                              {comment.body}
                            </p>

                            {/* Existing Reactions Badges */}
                            {hasReactions && (
                              <div className="flex flex-wrap items-center gap-1 mt-2 pt-1.5 border-t border-zinc-200/50">
                                {EMOJI_WHITELIST.map((emoji) => {
                                  const count = comment.reaction_counts?.[emoji] || 0;
                                  if (count === 0) return null;
                                  const isUserActive = comment.user_reaction === emoji;
                                  return (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => handleCommentReaction(comment.id, emoji)}
                                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                                        isUserActive
                                          ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs font-bold'
                                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                                      }`}
                                      title={isUserActive ? `Remove ${emoji}` : `React with ${emoji}`}
                                    >
                                      <span>{emoji}</span>
                                      <span className="text-[10px]">{count}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Quick Action Buttons Row: Heart Like & Emoji React */}
                          <div className="flex items-center gap-3 px-2 pt-1 text-[11px] text-zinc-500">
                            {/* Quick Heart Button */}
                            <button
                              type="button"
                              onClick={() => handleCommentReaction(comment.id, '❤️')}
                              className={`inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                                hasHeart
                                  ? 'text-rose-600 hover:text-rose-700'
                                  : 'text-zinc-400 hover:text-rose-500'
                              }`}
                              title={hasHeart ? 'Unlike comment' : 'Heart comment'}
                            >
                              <Heart className={`w-3 h-3 ${hasHeart ? 'fill-rose-500 text-rose-500' : ''}`} />
                              <span className="text-[10px]">{hasHeart ? 'Liked' : 'Like'}</span>
                            </button>

                            {/* Emoji reaction picker button */}
                            <div className="relative emoji-picker-container">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCommentEmojiPicker(isPickerOpen ? null : comment.id);
                                }}
                                className={`inline-flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                                  isPickerOpen ? 'text-blue-600 font-bold' : 'text-zinc-400 hover:text-zinc-700'
                                }`}
                                title="React with emoji"
                              >
                                <Smile className="w-3 h-3" />
                                <span className="text-[10px]">React</span>
                              </button>

                              {/* Floating Mini Emoji Palette */}
                              {isPickerOpen && (
                                <div
                                  className="absolute left-0 bottom-full mb-1.5 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-zinc-200 shadow-xl animate-in fade-in zoom-in-95 duration-150"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {EMOJI_WHITELIST.map((emoji) => {
                                    const isSelected = comment.user_reaction === emoji;
                                    return (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleCommentReaction(comment.id, emoji)}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-125 cursor-pointer ${
                                          isSelected
                                            ? 'bg-blue-50 ring-1 ring-blue-500 scale-110 shadow-xs'
                                            : 'hover:bg-zinc-100 active:scale-95'
                                        }`}
                                        title={`React ${emoji}`}
                                      >
                                        <span className="select-none">{emoji}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Post Reaction Bar */}
          <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 space-y-2">
            {/* Aggregate counts */}
            {reactionCounts && reactionCounts.total > 0 && (
              <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-zinc-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <div className="flex items-center gap-2">
                  {EMOJI_WHITELIST.map((emoji) => {
                    const count = reactionCounts[emoji] || 0;
                    if (count === 0) return null;
                    return (
                      <span key={emoji} className="inline-flex items-center gap-0.5">
                        <span>{emoji}</span>
                        <span className="text-[11px] font-bold text-zinc-700">{count}</span>
                      </span>
                    );
                  })}
                  <span className="text-[10px] text-zinc-400 font-medium">({reactionCounts.total} total)</span>
                </div>
              </div>
            )}

            {/* Reaction Emoji Row */}
            <div className="flex items-center justify-between gap-1 bg-white p-1 rounded-2xl border border-zinc-200/80 shadow-2xs">
              {EMOJI_WHITELIST.map((emoji) => {
                const isSelected = activeReaction === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleReaction(emoji)}
                    disabled={isReacting}
                    className={`tap-pill flex-1 py-1.5 px-1 rounded-xl text-lg sm:text-xl transition-all duration-150 transform hover:scale-125 cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-50 ring-2 ring-blue-500 scale-110 shadow-xs'
                        : 'hover:bg-zinc-100 active:scale-95'
                    }`}
                    title={`React with ${emoji}`}
                  >
                    <span className="select-none">{emoji}</span>
                  </button>
                );
              })}
            </div>

            {/* Comment Input Form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={currentCamper ? 'Write a comment...' : 'Log in to write a comment'}
                disabled={!currentCamper || isSubmittingComment}
                className="flex-1 text-xs bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-zinc-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim() || isSubmittingComment || !currentCamper}
                className="tap-pill p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 text-white transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
