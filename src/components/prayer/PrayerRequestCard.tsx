import { useState, type FC } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  BookOpen, 
  Share2, 
  Check, 
  CheckCircle2, 
  Trash2, 
  Lock, 
  Shield, 
  UserX,
  Trophy,
  Loader2
} from 'lucide-react';
import type { PrayerRequest, CamperRegistration } from '../../types';
import { apiService } from '../../services/api';
import { IntercessorsFacepile } from './IntercessorsFacepile';
import { IntercessorsModal } from './IntercessorsModal';
import { ResolvePrayerModal } from './ResolvePrayerModal';
import { getBaseUrl } from '../../lib/utils';

interface PrayerRequestCardProps {
  prayer: PrayerRequest;
  currentCamper: CamperRegistration | null;
  onNavigateToCamper?: (camperId: string) => void;
  onPrayerUpdated?: (updated: PrayerRequest) => void;
  onPrayerDeleted?: (prayerId: string) => void;
}

const CATEGORY_NAMES: Record<string, { label: string; icon: string }> = {
  spiritual_growth: { label: 'Spiritual Growth', icon: '🌱' },
  healing_health: { label: 'Healing & Health', icon: '❤️‍🩹' },
  family_personal: { label: 'Family & Life', icon: '🏡' },
  academic_career: { label: 'Studies & Career', icon: '📚' },
  salvation_evangelism: { label: 'Salvation', icon: '🕊️' },
  camp_breakthrough: { label: 'Revival', icon: '🔥' },
  general: { label: 'Petition', icon: '🙏' },
};

export const PrayerRequestCard: FC<PrayerRequestCardProps> = ({
  prayer,
  currentCamper,
  onNavigateToCamper,
  onPrayerUpdated,
  onPrayerDeleted,
}) => {
  const [isIntercessorsOpen, setIsIntercessorsOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isPraying, setIsPraying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Local optimistic state
  const [prayerCount, setPrayerCount] = useState(prayer.prayer_count);
  const [hasPrayed, setHasPrayed] = useState(prayer.has_prayed);
  const [hasPrayedToday, setHasPrayedToday] = useState(prayer.has_prayed_today);
  const [recentParticipants, setRecentParticipants] = useState(prayer.recent_participants || []);
  const [status, setStatus] = useState(prayer.status);
  const [resolutionNotes, setResolutionNotes] = useState(prayer.resolution_notes);

  const isOwner = Boolean(
    currentCamper?.id && (currentCamper.id === prayer.author.id || prayer.is_owner)
  );
  const isAdmin = Boolean(currentCamper && ['admin', 'staff'].includes(currentCamper.role));

  const handlePray = async () => {
    if (!currentCamper?.id) {
      alert('Please sign in with your Camp Pass to stand in prayer!');
      return;
    }
    if (isPraying || hasPrayedToday) return;

    // Optimistic Update
    const prevCount = prayerCount;
    const prevHasPrayed = hasPrayed;
    const prevHasPrayedToday = hasPrayedToday;
    const prevParticipants = [...recentParticipants];

    setPrayerCount((c) => c + 1);
    setHasPrayed(true);
    setHasPrayedToday(true);

    // Prepend user avatar to facepile if not present
    const existsInFacepile = recentParticipants.some((p) => p.camper_id === currentCamper.id);
    if (!existsInFacepile) {
      setRecentParticipants((prev) => [
        {
          camper_id: currentCamper.id || null,
          nickname: currentCamper.nickname || currentCamper.full_name,
          selfie_url: currentCamper.selfie_url || null,
          church_name: currentCamper.church_name || null,
          prayer_count: 1,
          last_prayed_at: new Date().toISOString(),
        },
        ...prev.slice(0, 4),
      ]);
    }

    setIsPraying(true);

    try {
      const res = await apiService.prayForRequest(prayer.id, currentCamper.id, '🙏', false);
      if (res.success) {
        if (typeof res.prayer_count === 'number') setPrayerCount(res.prayer_count);
        if (res.recent_participants) setRecentParticipants(res.recent_participants);
        setHasPrayed(true);
        setHasPrayedToday(Boolean(res.has_prayed_today));

        if (onPrayerUpdated) {
          onPrayerUpdated({
            ...prayer,
            prayer_count: res.prayer_count ?? prayerCount + 1,
            has_prayed: true,
            has_prayed_today: Boolean(res.has_prayed_today),
            recent_participants: res.recent_participants || recentParticipants,
          });
        }
      } else {
        // Revert
        setPrayerCount(prevCount);
        setHasPrayed(prevHasPrayed);
        setHasPrayedToday(prevHasPrayedToday);
        setRecentParticipants(prevParticipants);
      }
    } catch {
      setPrayerCount(prevCount);
      setHasPrayed(prevHasPrayed);
      setHasPrayedToday(prevHasPrayedToday);
      setRecentParticipants(prevParticipants);
    } finally {
      setIsPraying(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCamper?.id) return;
    if (!confirm('Are you sure you want to delete this prayer request?')) return;

    setIsDeleting(true);
    try {
      const res = await apiService.deletePrayerRequest(prayer.id, currentCamper.id);
      if (res.success && onPrayerDeleted) {
        onPrayerDeleted(prayer.id);
      } else {
        alert(res.error || 'Failed to delete prayer request.');
      }
    } catch {
      alert('Failed to delete prayer request.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const url = `${getBaseUrl()}/camper/${prayer.author.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Prayer Request: ${prayer.title}`,
        text: `Please stand in faith with us at VLC 2027: "${prayer.title}"`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleResolved = (_id: string, notes: string, linkedTestimonyId?: string) => {
    setStatus('answered');
    setResolutionNotes(notes);
    if (onPrayerUpdated) {
      onPrayerUpdated({
        ...prayer,
        status: 'answered',
        resolution_notes: notes,
        linked_testimony_id: linkedTestimonyId,
      });
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

  const catMeta = CATEGORY_NAMES[prayer.category] || CATEGORY_NAMES.general;
  const isAnswered = status === 'answered';

  return (
    <article
      className={`rounded-3xl overflow-hidden border transition-all text-left shadow-2xs hover:shadow-md ${
        isAnswered
          ? 'bg-gradient-to-b from-emerald-50/40 via-white to-white border-emerald-200'
          : 'bg-white border-zinc-200/90'
      }`}
    >
      {/* Top Status & Category Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-2 border-b border-zinc-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Answered vs Seeking Prayer Badge */}
          {isAnswered ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>God Has Answered!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
              <span>🙏 Seeking Prayer</span>
            </span>
          )}

          {/* Category Pill */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium">
            <span>{catMeta.icon}</span>
            <span>{catMeta.label}</span>
          </span>

          {/* Privacy Level Badge (if not public) */}
          {prayer.privacy_level === 'church_delegation' && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold"
              title="Visible only to your church delegation"
            >
              <Lock className="w-3 h-3 text-amber-700" />
              <span>Delegation Only</span>
            </span>
          )}

          {prayer.privacy_level === 'pastors_counselors' && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-semibold"
              title="Confidential pastoral care request"
            >
              <Shield className="w-3 h-3 text-purple-700" />
              <span>Pastoral Care</span>
            </span>
          )}

          {prayer.is_anonymous && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-semibold"
              title="Author name is hidden"
            >
              <UserX className="w-3 h-3 text-zinc-500" />
              <span>Anonymous</span>
            </span>
          )}
        </div>

        {/* Right Action Icons (Share & Delete) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            title={isCopied ? 'Link copied' : 'Share prayer request'}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {(isOwner || isAdmin) && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              title="Delete prayer request"
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Author & Timestamp */}
      <div className="px-5 pt-3 flex items-center justify-between">
        <button
          type="button"
          disabled={Boolean(prayer.is_anonymous) || !prayer.author.id}
          onClick={() => prayer.author.id && onNavigateToCamper && onNavigateToCamper(prayer.author.id)}
          className={`flex items-center gap-3 min-w-0 text-left ${
            !prayer.is_anonymous ? 'group cursor-pointer' : 'cursor-default'
          }`}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 shrink-0 bg-blue-50 shadow-2xs flex items-center justify-center font-bold text-blue-700 text-xs">
            {prayer.author.selfie_url ? (
              <img
                src={prayer.author.selfie_url}
                alt={prayer.author.nickname}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <span>{prayer.author.nickname.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0">
            <h4
              className={`font-bold text-xs text-zinc-900 truncate ${
                !prayer.is_anonymous ? 'group-hover:text-blue-600 transition-colors' : ''
              }`}
            >
              {prayer.author.nickname}
            </h4>
            <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1">
              {prayer.author.church_name && (
                <>
                  <MapPin className="w-3 h-3 text-zinc-400 shrink-0 inline" />
                  <span>{prayer.author.church_name}</span>
                  <span>&bull;</span>
                </>
              )}
              <Clock className="w-3 h-3 text-zinc-400 shrink-0 inline" />
              <span>{formatTime(prayer.created_at)}</span>
            </p>
          </div>
        </button>
      </div>

      {/* Main Prayer Petition Content */}
      <div className="px-5 py-3 space-y-2.5">
        <h3 className="text-base font-bold text-zinc-900 leading-snug">
          {prayer.title}
        </h3>

        <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line font-sans">
          {prayer.description}
        </p>

        {/* Scripture Promise Callout */}
        {prayer.scripture_reference && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold italic">{prayer.scripture_reference}</span>
          </div>
        )}

        {/* Answered Celebration Banner (if answered) */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-300 space-y-1.5 mt-2">
            <div className="flex items-center justify-between text-xs font-black text-emerald-800">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>God Answered This Prayer!</span>
              </span>
              {prayer.answered_at && (
                <span className="text-[10px] font-normal text-emerald-700">
                  {formatTime(prayer.answered_at)}
                </span>
              )}
            </div>

            {resolutionNotes && (
              <p className="text-xs text-emerald-950 leading-relaxed font-medium whitespace-pre-line pl-5 border-l-2 border-emerald-400">
                {resolutionNotes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Intercessors Facepile Stack */}
      <div className="px-5 py-2 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-3">
        <IntercessorsFacepile
          participants={recentParticipants}
          totalPrayers={prayerCount}
          hasPrayed={hasPrayed}
          onOpenModal={() => setIsIntercessorsOpen(true)}
        />
      </div>

      {/* Action Bar (I Prayed & God Has Answered buttons) */}
      <div className="px-5 py-3 border-t border-zinc-100 flex items-center justify-between gap-3">
        {/* "I Prayed" Button */}
        <button
          type="button"
          onClick={handlePray}
          disabled={isPraying || hasPrayedToday}
          className={`tap-pill px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-2xs ${
            hasPrayedToday
              ? 'bg-blue-50 text-blue-700 border border-blue-200 cursor-default opacity-90'
              : hasPrayed
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              : 'bg-zinc-900 hover:bg-blue-600 text-white shadow-xs active:scale-95'
          }`}
          title={
            hasPrayedToday
              ? 'You have already stood in prayer today!'
              : hasPrayed
              ? 'Stand in prayer again today (+1)'
              : 'Click to stand in prayer'
          }
        >
          {isPraying ? (
            <Loader2 className="w-4 h-4 animate-spin text-current" />
          ) : hasPrayedToday ? (
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          ) : (
            <span className="text-base select-none">🙏</span>
          )}

          <span>
            {hasPrayedToday
              ? 'Prayed Today'
              : hasPrayed
              ? 'Pray Again Today'
              : 'I Stand in Prayer'}
          </span>

          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              hasPrayedToday ? 'bg-blue-100 text-blue-800' : 'bg-white/20 text-white'
            }`}
          >
            {prayerCount}
          </span>
        </button>

        {/* Mark Answered Button (Owner only, when open) */}
        {isOwner && !isAnswered && (
          <button
            type="button"
            onClick={() => setIsResolveModalOpen(true)}
            className="tap-pill px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark Answered!</span>
          </button>
        )}
      </div>

      {/* Participants Detail Modal */}
      {isIntercessorsOpen && (
        <IntercessorsModal
          isOpen={isIntercessorsOpen}
          onClose={() => setIsIntercessorsOpen(false)}
          prayerId={prayer.id}
          prayerTitle={prayer.title}
          onNavigateToCamper={onNavigateToCamper}
        />
      )}

      {/* Resolution Modal */}
      {isResolveModalOpen && (
        <ResolvePrayerModal
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          prayer={prayer}
          onResolved={handleResolved}
        />
      )}
    </article>
  );
};
