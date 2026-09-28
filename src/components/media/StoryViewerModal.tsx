import { useState, useEffect, type FC } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Loader2, 
  Sparkles,
  MapPin
} from 'lucide-react';
import type { CommunityStory, AllowedReactionEmoji, CamperRegistration } from '../../types';
import { apiService } from '../../services/api';

const EMOJI_WHITELIST: AllowedReactionEmoji[] = ['👍', '❤️', '🔥', '⛺', '🌲', '🎉'];

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: CommunityStory[];
  initialIndex?: number;
  currentCamper: CamperRegistration | null;
  onStoryDeleted?: (storyId: string) => void;
  onReactionUpdated?: (storyId: string, emoji: AllowedReactionEmoji | null, counts: any) => void;
}

export const StoryViewerModal: FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  stories,
  initialIndex = 0,
  currentCamper,
  onStoryDeleted,
  onReactionUpdated,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [activeReaction, setActiveReaction] = useState<AllowedReactionEmoji | null>(null);
  const [reactionCounts, setReactionCounts] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(initialIndex, Math.max(0, stories.length - 1)));
    }
  }, [isOpen, initialIndex, stories.length]);

  const currentStory: CommunityStory | undefined = stories[currentIndex];

  useEffect(() => {
    if (currentStory) {
      setActiveReaction(currentStory.user_reaction || null);
      setReactionCounts(currentStory.reaction_counts || {});
    }
  }, [currentStory]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, stories.length]);

  if (!isOpen || !currentStory) return null;

  const isOwner = Boolean(currentCamper && currentCamper.id === currentStory.camper_id);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReaction = async (emoji: AllowedReactionEmoji) => {
    if (!currentCamper?.id) {
      alert('Please log in with your Camp Pass to react to stories!');
      return;
    }
    if (isReacting) return;

    // Optimistic update
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
      const res = await apiService.toggleReaction('story', currentStory.id, emoji, currentCamper.id);
      if (res.success && res.reaction_counts) {
        setReactionCounts(res.reaction_counts);
        setActiveReaction(res.user_reaction || null);
        if (onReactionUpdated) {
          onReactionUpdated(currentStory.id, res.user_reaction || null, res.reaction_counts);
        }
      } else {
        // Rollback
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

  const handleDelete = async () => {
    if (!currentCamper?.id) return;
    if (!confirm('Are you sure you want to delete this highlight story?')) return;

    setIsDeleting(true);
    try {
      const res = await apiService.deleteStory(currentStory.id, currentCamper.id);
      if (res.success) {
        if (onStoryDeleted) {
          onStoryDeleted(currentStory.id);
        }
        if (stories.length <= 1) {
          onClose();
        } else if (currentIndex >= stories.length - 1) {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
        }
      } else {
        alert(res.error || 'Failed to delete story');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting story');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatStoryTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 select-none">
      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Main Vertical Story Container (Portrait 9:16 Aspect Ratio) */}
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[820px] bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Story Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 pt-3.5 flex items-center gap-1.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {stories.map((s, idx) => (
            <div
              key={s.id || idx}
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-xs"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  idx < currentIndex
                    ? 'w-full bg-white'
                    : idx === currentIndex
                    ? 'w-full bg-white'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Story Header (Camper Avatar, Name, Timestamp, Actions) */}
        <div className="absolute top-6 left-0 right-0 z-30 px-4 py-2 flex items-center justify-between text-white bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-zinc-800 shadow-sm">
              {currentStory.camper?.selfie_url ? (
                <img
                  src={currentStory.camper.selfie_url}
                  alt={currentStory.camper.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-amber-300">
                  {currentStory.camper?.nickname?.charAt(0) || 'C'}
                </div>
              )}
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm truncate leading-tight drop-shadow-md">
                  {currentStory.camper?.nickname || currentStory.camper?.full_name}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-400/40">
                  Highlight
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 truncate drop-shadow-md flex items-center gap-1">
                {currentStory.camper?.church_name && (
                  <>
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0 inline" />
                    <span>{currentStory.camper.church_name}</span>
                    <span>&bull;</span>
                  </>
                )}
                <span>{formatStoryTime(currentStory.created_at)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete highlight"
                className="p-2 text-zinc-300 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Canvas (Portrait Story) */}
        <div className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden">
          <img
            src={currentStory.media_url}
            alt={currentStory.caption || 'Camper Story Highlight'}
            className="w-full h-full object-cover select-none"
          />

          {/* Navigation Click Zones */}
          <div
            className="absolute left-0 top-16 bottom-24 w-1/3 cursor-pointer z-20 flex items-center pl-2 opacity-0 hover:opacity-80 transition-opacity"
            onClick={handlePrev}
          >
            {currentIndex > 0 && (
              <div className="p-2 rounded-full bg-black/50 text-white backdrop-blur-xs">
                <ChevronLeft className="w-6 h-6" />
              </div>
            )}
          </div>

          <div
            className="absolute right-0 top-16 bottom-24 w-1/3 cursor-pointer z-20 flex items-center justify-end pr-2 opacity-0 hover:opacity-80 transition-opacity"
            onClick={handleNext}
          >
            <div className="p-2 rounded-full bg-black/50 text-white backdrop-blur-xs">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Story Footer: Caption Overlay & Reaction Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-3">
          {/* Optional Caption */}
          {currentStory.caption && (
            <p className="text-sm text-white font-medium leading-relaxed drop-shadow-md text-left px-1">
              {currentStory.caption}
            </p>
          )}

          {/* Aggregate Reaction Badge Pill */}
          {reactionCounts && reactionCounts.total > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md w-fit border border-white/20 text-xs text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <div className="flex items-center gap-1 font-semibold">
                {EMOJI_WHITELIST.map((emoji) => {
                  const count = reactionCounts[emoji] || 0;
                  if (count === 0) return null;
                  return (
                    <span key={emoji} className="inline-flex items-center gap-0.5">
                      <span>{emoji}</span>
                      <span className="text-[10px] text-zinc-200">{count}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Emoji Reaction Bar */}
          <div className="flex items-center justify-between gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
            {EMOJI_WHITELIST.map((emoji) => {
              const isSelected = activeReaction === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReaction(emoji)}
                  disabled={isReacting}
                  className={`tap-pill flex-1 py-1.5 px-2 rounded-xl text-xl sm:text-2xl transition-all duration-150 transform hover:scale-125 cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-amber-400/30 ring-2 ring-amber-400 scale-110 shadow-lg'
                      : 'hover:bg-white/10 active:scale-95'
                  }`}
                  title={`React with ${emoji}`}
                >
                  <span className="select-none">{emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
