import type { FC } from 'react';
import type { PrayerParticipantSummary } from '../../types';

interface IntercessorsFacepileProps {
  participants: PrayerParticipantSummary[];
  totalPrayers: number;
  hasPrayed: boolean;
  onOpenModal: () => void;
}

export const IntercessorsFacepile: FC<IntercessorsFacepileProps> = ({
  participants,
  totalPrayers,
  hasPrayed,
  onOpenModal,
}) => {
  if (totalPrayers === 0 && participants.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500 py-1">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
        <span>Be the first to stand in prayer for this request.</span>
      </div>
    );
  }

  const visibleParticipants = participants.slice(0, 4);
  const remainingCount = Math.max(0, totalPrayers - visibleParticipants.length);

  // Friendly summary string
  let summaryText = '';
  if (participants.length === 1) {
    summaryText = hasPrayed ? 'You prayed for this' : `${participants[0].nickname} prayed`;
  } else if (participants.length === 2) {
    summaryText = `${participants[0].nickname} and ${participants[1].nickname} prayed`;
  } else if (participants.length > 2) {
    const first = participants[0].nickname;
    const othersCount = totalPrayers - 1;
    summaryText = `${first} and ${othersCount} other${othersCount > 1 ? 's' : ''} prayed`;
  } else {
    summaryText = `${totalPrayers} camper${totalPrayers > 1 ? 's' : ''} prayed`;
  }

  return (
    <button
      type="button"
      onClick={onOpenModal}
      className="flex items-center gap-2.5 group cursor-pointer text-left hover:opacity-90 transition-opacity py-1 max-w-full"
      title="View all campers who prayed"
    >
      {/* Overlapping Avatar Stack */}
      <div className="flex -space-x-2 shrink-0 overflow-hidden py-0.5">
        {visibleParticipants.map((p, idx) => (
          <div
            key={p.camper_id || `anon-${idx}`}
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-zinc-200 shrink-0 shadow-2xs"
          >
            {p.selfie_url ? (
              <img
                src={p.selfie_url}
                alt={p.nickname}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                {p.nickname ? p.nickname.charAt(0).toUpperCase() : '🙏'}
              </div>
            )}
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-white ring-2 ring-white shrink-0 shadow-2xs">
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Label Text */}
      <div className="text-xs text-zinc-600 truncate group-hover:text-blue-700 transition-colors">
        <span className="font-semibold text-zinc-800">{summaryText}</span>
        <span className="text-[11px] text-zinc-400 ml-1">· View list</span>
      </div>
    </button>
  );
};
