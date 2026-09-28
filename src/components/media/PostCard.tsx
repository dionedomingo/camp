import { useState, type FC } from 'react';
import { 
  MessageCircle, 
  MapPin, 
  Sparkles, 
  Share2, 
  Clock,
  Check
} from 'lucide-react';
import type { CommunityPost, AllowedReactionEmoji, CamperRegistration } from '../../types';
import { apiService } from '../../services/api';

const EMOJI_WHITELIST: AllowedReactionEmoji[] = ['👍', '❤️', '🔥', '⛺', '🌲', '🎉'];

interface PostCardProps {
  post: CommunityPost;
  currentCamper: CamperRegistration | null;
  onOpenDetail: (post: CommunityPost) => void;
  onCamperClick?: (camperId: string) => void;
  onReactionUpdated?: (postId: string, emoji: AllowedReactionEmoji | null, counts: any) => void;
}

export const PostCard: FC<PostCardProps> = ({
  post,
  currentCamper,
  onOpenDetail,
  onCamperClick,
  onReactionUpdated,
}) => {
  const [activeReaction, setActiveReaction] = useState<AllowedReactionEmoji | null>(post.user_reaction || null);
  const [reactionCounts, setReactionCounts] = useState<any>(post.reaction_counts || {});
  const [isReacting, setIsReacting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleReaction = async (emoji: AllowedReactionEmoji) => {
    if (!currentCamper?.id) {
      alert('Please sign in with your Camp Pass to react to posts!');
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

  const handleShare = () => {
    const url = `${window.location.origin}/camper/${post.camper_id}`;
    if (navigator.share) {
      navigator.share({
        title: `${post.camper?.nickname}'s Camp Post`,
        text: post.caption || 'Check out this camp moment from Vision & Leadership Camp 2027!',
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-zinc-200/90 shadow-2xs hover:shadow-md transition-shadow text-left">
      {/* Author Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onCamperClick && onCamperClick(post.camper_id)}
          className="flex items-center gap-3 min-w-0 group cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shrink-0 bg-zinc-100 shadow-2xs">
            {post.camper?.selfie_url ? (
              <img
                src={post.camper.selfie_url}
                alt={post.camper.nickname}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-blue-600">
                {post.camper?.nickname?.charAt(0) || 'C'}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-sm text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
              {post.camper?.nickname || post.camper?.full_name}
            </h4>
            <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1">
              {post.camper?.church_name && (
                <>
                  <MapPin className="w-3 h-3 text-zinc-400 shrink-0 inline" />
                  <span>{post.camper.church_name}</span>
                  <span>&bull;</span>
                </>
              )}
              <Clock className="w-3 h-3 text-zinc-400 shrink-0 inline" />
              <span>{formatTime(post.created_at)}</span>
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleShare}
          title={isCopied ? "Link copied" : "Share post"}
          className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Media Image */}
      <div
        onClick={() => onOpenDetail(post)}
        className="relative bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer group max-h-[500px]"
      >
        <img
          src={post.media_url}
          alt={post.caption || 'Camp post'}
          className="w-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
        />
      </div>

      {/* Post Actions & Caption */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-line">
            <span className="font-bold text-zinc-900 mr-1.5">
              {post.camper?.nickname}:
            </span>
            {post.caption}
          </p>
        )}

        {/* Reaction Aggregate Counts */}
        {reactionCounts && reactionCounts.total > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-semibold pt-1">
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
              <span className="text-[10px] text-zinc-400 font-medium">({reactionCounts.total})</span>
            </div>
          </div>
        )}

        {/* Action Bar (Reactions Row + Comments Button) */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100">
          {/* Reaction Emoji Bar */}
          <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-2xl border border-zinc-200/80">
            {EMOJI_WHITELIST.map((emoji) => {
              const isSelected = activeReaction === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReaction(emoji)}
                  disabled={isReacting}
                  className={`tap-pill p-1.5 rounded-xl text-base sm:text-lg transition-all duration-150 transform hover:scale-125 cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-white ring-2 ring-blue-500 scale-110 shadow-2xs'
                      : 'hover:bg-white/80 active:scale-95'
                  }`}
                  title={`React with ${emoji}`}
                >
                  <span className="select-none">{emoji}</span>
                </button>
              );
            })}
          </div>

          {/* Comments Button */}
          <button
            type="button"
            onClick={() => onOpenDetail(post)}
            className="tap-pill flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80 text-xs font-bold transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span>{post.comments_count || 0}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
