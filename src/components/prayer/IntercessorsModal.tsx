import { useState, useEffect, type FC } from 'react';
import { X, HeartHandshake, Loader2, Calendar } from 'lucide-react';
import type { PrayerParticipantDetail } from '../../types';
import { apiService } from '../../services/api';

interface IntercessorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerId: string;
  prayerTitle: string;
  onNavigateToCamper?: (camperId: string) => void;
}

export const IntercessorsModal: FC<IntercessorsModalProps> = ({
  isOpen,
  onClose,
  prayerId,
  prayerTitle,
  onNavigateToCamper,
}) => {
  const [participants, setParticipants] = useState<PrayerParticipantDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!isOpen || !prayerId) return;

    let isMounted = true;
    setIsLoading(true);

    apiService
      .getPrayerParticipants(prayerId)
      .then((res) => {
        if (isMounted && res.success && res.participants) {
          setParticipants(res.participants);
          setTotalCount(res.total_prayers || res.participants.length);
        }
      })
      .catch((err) => {
        console.error('Failed to load prayer participants:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, prayerId]);

  if (!isOpen) return null;

  const formatRelativeTime = (iso: string) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[85vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-zinc-900 truncate">
                Standing in Prayer ({totalCount})
              </h3>
              <p className="text-xs text-zinc-500 truncate">{prayerTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Participant List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <p className="text-xs text-zinc-400 font-medium">Loading prayer warriors...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No participants recorded yet. Be the first to pray!
            </div>
          ) : (
            participants.map((p) => {
              const canClickProfile = Boolean(p.camper_id && onNavigateToCamper);

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 transition-colors border border-zinc-100"
                >
                  <button
                    type="button"
                    disabled={!canClickProfile}
                    onClick={() => p.camper_id && onNavigateToCamper && onNavigateToCamper(p.camper_id)}
                    className={`flex items-center gap-3 min-w-0 text-left ${
                      canClickProfile ? 'cursor-pointer group' : 'cursor-default'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-2xs shrink-0 bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                      {p.selfie_url ? (
                        <img
                          src={p.selfie_url}
                          alt={p.nickname}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span>{p.nickname.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold text-zinc-900 truncate ${
                          canClickProfile ? 'group-hover:text-blue-600 transition-colors' : ''
                        }`}
                      >
                        {p.nickname}
                      </h4>
                      <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1.5">
                        {p.church_name && <span>{p.church_name}</span>}
                        {p.church_name && <span>&bull;</span>}
                        <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span>{formatRelativeTime(p.last_prayed_at)}</span>
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span className="text-base select-none">{p.reaction_type || '🙏'}</span>
                    {p.prayer_count > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        {p.prayer_count}x
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 text-center">
          <p className="text-[11px] text-zinc-400">
            &ldquo;For where two or three gather in my name, there am I with them.&rdquo; — Matthew 18:20
          </p>
        </div>
      </div>
    </div>
  );
};
