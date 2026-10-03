import { useState, type FC } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  BookOpen, 
  Share2, 
  Check, 
  Trash2, 
  Trophy,
  Loader2
} from 'lucide-react';
import type { Testimony, CamperRegistration } from '../../types';
import { apiService } from '../../services/api';
import { getBaseUrl } from '../../lib/utils';

interface TestimonyCardProps {
  testimony: Testimony;
  currentCamper: CamperRegistration | null;
  onNavigateToCamper?: (camperId: string) => void;
  onTestimonyDeleted?: (testimonyId: string) => void;
}

const TESTIMONY_CATEGORIES: Record<string, { label: string; icon: string }> = {
  answered_prayer: { label: 'Answered Prayer', icon: '🎉' },
  salvation: { label: 'Salvation Story', icon: '🕊️' },
  healing: { label: 'Healing & Miracle', icon: '❤️‍🩹' },
  spiritual_milestone: { label: 'Spiritual Breakthrough', icon: '🔥' },
  delegation_story: { label: 'Delegation Blessing', icon: '🤝' },
  general: { label: 'Praise Report', icon: '✨' },
};

const PRAISE_EMOJIS = ['🙌', '❤️', '🔥', '🎉', '🙏'];

export const TestimonyCard: FC<TestimonyCardProps> = ({
  testimony,
  currentCamper,
  onNavigateToCamper,
  onTestimonyDeleted,
}) => {
  const [activeReaction, setActiveReaction] = useState<string | null>(testimony.user_reaction || null);
  const [praiseCount, setPraiseCount] = useState(testimony.praise_count || 0);
  const [isReacting, setIsReacting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isOwner = Boolean(
    currentCamper?.id && (currentCamper.id === testimony.author.id || testimony.is_owner)
  );
  const isAdmin = Boolean(currentCamper && ['admin', 'staff'].includes(currentCamper.role));

  const handlePraiseReaction = async (emoji: string) => {
    if (!currentCamper?.id) {
      alert('Please sign in with your Camp Pass to praise the Lord!');
      return;
    }
    if (isReacting) return;

    const prevReaction = activeReaction;
    const prevCount = praiseCount;
    const isToggleOff = activeReaction === emoji;

    setActiveReaction(isToggleOff ? null : emoji);
    setPraiseCount((c) => (isToggleOff ? Math.max(0, c - 1) : prevReaction ? c : c + 1));
    setIsReacting(true);

    try {
      const res = await apiService.toggleTestimonyReaction(testimony.id, currentCamper.id, emoji);
      if (res.success) {
        setActiveReaction(res.user_reaction || null);
        if (typeof res.praise_count === 'number') setPraiseCount(res.praise_count);
      } else {
        setActiveReaction(prevReaction);
        setPraiseCount(prevCount);
      }
    } catch {
      setActiveReaction(prevReaction);
      setPraiseCount(prevCount);
    } finally {
      setIsReacting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCamper?.id) return;
    if (!confirm('Are you sure you want to delete this praise report?')) return;

    setIsDeleting(true);
    try {
      const res = await apiService.deleteTestimony(testimony.id, currentCamper.id);
      if (res.success && onTestimonyDeleted) {
        onTestimonyDeleted(testimony.id);
      } else {
        alert(res.error || 'Failed to delete testimony.');
      }
    } catch {
      alert('Failed to delete testimony.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const url = `${getBaseUrl()}/camper/${testimony.author.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Praise Report: ${testimony.title}`,
        text: `Read how God moved at VLC 2027: "${testimony.title}"`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const catMeta = TESTIMONY_CATEGORIES[testimony.category] || TESTIMONY_CATEGORIES.general;

  return (
    <article className="rounded-3xl overflow-hidden border border-amber-200/90 bg-gradient-to-b from-amber-50/50 via-white to-white shadow-2xs hover:shadow-md transition-all text-left">
      {/* Top Banner */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-2 border-b border-amber-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Praise Report</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[11px] font-semibold">
            <span>{catMeta.icon}</span>
            <span>{catMeta.label}</span>
          </span>

          {testimony.is_featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
              <span>⭐ Featured</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            title={isCopied ? 'Link copied' : 'Share praise report'}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {(isOwner || isAdmin) && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              title="Delete testimony"
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Author & Timestamp */}
      <div className="px-5 pt-3.5 flex items-center justify-between">
        <button
          type="button"
          disabled={Boolean(testimony.is_anonymous) || !testimony.author.id}
          onClick={() =>
            testimony.author.id && onNavigateToCamper && onNavigateToCamper(testimony.author.id)
          }
          className={`flex items-center gap-3 min-w-0 text-left ${
            !testimony.is_anonymous ? 'group cursor-pointer' : 'cursor-default'
          }`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-200 shrink-0 bg-amber-100 shadow-2xs flex items-center justify-center font-bold text-amber-800 text-sm">
            {testimony.author.selfie_url ? (
              <img
                src={testimony.author.selfie_url}
                alt={testimony.author.nickname}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <span>{testimony.author.nickname.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0">
            <h4
              className={`font-bold text-sm text-zinc-900 truncate ${
                !testimony.is_anonymous ? 'group-hover:text-amber-700 transition-colors' : ''
              }`}
            >
              {testimony.author.nickname}
            </h4>
            <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1">
              {testimony.author.church_name && (
                <>
                  <MapPin className="w-3 h-3 text-zinc-400 shrink-0 inline" />
                  <span>{testimony.author.church_name}</span>
                  <span>&bull;</span>
                </>
              )}
              <Clock className="w-3 h-3 text-zinc-400 shrink-0 inline" />
              <span>{formatTime(testimony.created_at)}</span>
            </p>
          </div>
        </button>
      </div>

      {/* Linked Answered Prayer Reference */}
      {testimony.linked_prayer && (
        <div className="mx-5 mt-3 p-3 rounded-2xl bg-amber-100/60 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-950">
          <Trophy className="w-4 h-4 text-amber-700 shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold">Answered Prayer: </span>
            <span className="italic truncate">&ldquo;{testimony.linked_prayer.title}&rdquo;</span>
            {testimony.linked_prayer.prayer_count > 0 && (
              <span className="text-[11px] text-amber-800 ml-1.5 font-bold">
                ({testimony.linked_prayer.prayer_count} stood in faith)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-5 py-3.5 space-y-3">
        <h3 className="text-lg font-black text-zinc-900 leading-tight">
          {testimony.title}
        </h3>

        <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-line font-sans">
          {testimony.content}
        </p>

        {testimony.scripture_reference && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-100/40 border border-amber-200/50 text-xs text-amber-900">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold italic">{testimony.scripture_reference}</span>
          </div>
        )}

        {testimony.media_url && (
          <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-950 max-h-[400px] flex items-center justify-center">
            <img
              src={testimony.media_url}
              alt={testimony.title}
              className="w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Action Bar (Praise Reaction Row) */}
      <div className="px-5 py-3 border-t border-amber-100 bg-amber-50/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-amber-200/80 shadow-2xs">
          {PRAISE_EMOJIS.map((emoji) => {
            const isSelected = activeReaction === emoji;
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => handlePraiseReaction(emoji)}
                disabled={isReacting}
                className={`tap-pill p-1.5 rounded-xl text-base transition-all duration-150 transform hover:scale-125 cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'bg-amber-100 ring-2 ring-amber-500 scale-110 shadow-2xs'
                    : 'hover:bg-zinc-100 active:scale-95'
                }`}
                title={`Praise with ${emoji}`}
              >
                <span className="select-none">{emoji}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold px-3 py-1.5 rounded-xl bg-amber-100/80 border border-amber-200/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{praiseCount} Praises to God</span>
        </div>
      </div>
    </article>
  );
};
