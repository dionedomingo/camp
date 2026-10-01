import { useState, type FC } from 'react';
import { 
  Church as ChurchIcon, 
  BookOpen, 
  Share2,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Link2,
  ChevronDown
} from 'lucide-react';
import type { CamperRegistration, CamperRole } from '../types';
import { QRCodeCanvas } from './ui/QRCodeCanvas';

function parseScripture(favoriteVerse?: string, verseReflection?: string) {
  if (!favoriteVerse) return { reference: 'Isaiah 60:1', fullText: verseReflection || '' };
  
  const splitDash = favoriteVerse.split(/\s*[-–—]\s*/);
  if (splitDash.length > 1 && splitDash[0].trim().match(/\d+:\d+/)) {
    return {
      reference: splitDash[0].trim(),
      fullText: splitDash.slice(1).join(' - ').trim() || verseReflection || '',
    };
  }

  const match = favoriteVerse.match(/^((?:\d\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d+:\d+(?:-\d+)?)(.*)$/i);
  if (match) {
    const ref = match[1].trim();
    const remaining = match[2].trim().replace(/^[-:–—\s]+/, '');
    return {
      reference: ref,
      fullText: remaining || verseReflection || '',
    };
  }

  return {
    reference: favoriteVerse.trim(),
    fullText: verseReflection || '',
  };
}

interface CampPassCardProps {
  camper: CamperRegistration;
  eventName?: string;
  eventDates?: string;
  onInviteFriend: () => void;
  onActivatePass?: () => void;
}

export const CampPassCard: FC<CampPassCardProps> = ({ camper, eventName, onInviteFriend, onActivatePass }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isVerseExpanded, setIsVerseExpanded] = useState(false);

  const roleStyles: Record<CamperRole, { label: string; badge: string }> = {
    admin: { label: 'CAMP ADMINISTRATOR', badge: 'bg-zinc-900 text-amber-400' },
    staff: { label: 'CAMP STAFF', badge: 'bg-[#fef7e0] text-[#b06000]' },
    coordinator: { label: 'DELEGATION COORDINATOR', badge: 'bg-[#e8f0fe] text-[#0b57d0]' },
    camper: { label: 'REGULAR CAMPER', badge: 'bg-[#e8f0fe] text-[#0b57d0]' },
    first_timer: { label: 'FIRST-TIMER CAMPER 🌿', badge: 'bg-[#e6f4ea] text-[#188038]' },
    counselor: { label: 'CABIN COUNSELOR', badge: 'bg-[#f3e8fd] text-[#7b1fa2]' },
    pastor: { label: 'PASTOR / MINISTER', badge: 'bg-[#fce8e6] text-[#c5221f]' },
    worship: { label: 'WORSHIP & ARTS', badge: 'bg-[#e8f0fe] text-[#1a73e8]' },
    medical: { label: 'FIRST AID & MEDIC', badge: 'bg-[#fce8e6] text-[#d93025]' },
  };

  const currentRole = roleStyles[camper.role] || roleStyles.camper;
  const isActivated = camper.status === 'activated' || Boolean(camper.checked_in_at);
  const passCode = camper.activation_code || camper.id?.toUpperCase() || 'VLC-2027';
  const displayEventName = eventName || camper.active_event_name || 'VLC 2027';

  // Construct camper public profile URL for QR code
  const camperId = camper.id || '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://summer-camp-vlc2027.pages.dev';
  const profileUrl = camperId ? `${origin}/camper/${camperId}` : origin;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(passCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 text-left animate-fadeIn">
      {/* Google Wallet Style Digital Pass */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dadce0] shadow-[0_4px_16px_rgba(60,64,67,0.08)] space-y-5">
        
        {/* Pass Top Bar */}
        <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b57d0]">
                {displayEventName} DIGITAL PASS
              </span>
              {isActivated ? (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#188038] uppercase">
                  ✓ Activated
                </span>
              ) : (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] uppercase">
                  Pending Arrival
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#5e5e5e] font-medium mt-0.5">
              <ChurchIcon className="w-3.5 h-3.5 text-[#0b57d0]" />
              <span>{camper.church_name || 'Home Church'}</span>
            </div>
          </div>

          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${currentRole.badge}`}>
            {currentRole.label}
          </span>
        </div>

        {/* Avatar & Delegate Details */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#dadce0] shrink-0 bg-[#f8fafd]">
            {camper.selfie_url ? (
              <img
                src={camper.selfie_url}
                alt={camper.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#0b57d0]">
                {camper.nickname.charAt(0)}
              </div>
            )}
            <div className={`absolute bottom-0 right-0 p-0.5 rounded-full text-white ${isActivated ? 'bg-[#188038]' : 'bg-[#0b57d0]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1f1f1f]">
              &ldquo;{camper.nickname}&rdquo;
            </h2>
            <p className="text-xs text-[#5e5e5e]">
              {camper.full_name}
            </p>
            <p className="text-[11px] text-[#747775] mt-0.5">
              {camper.province} &bull; Age {camper.age} {camper.birthdate ? `(b. ${camper.birthdate})` : ''}
            </p>
          </div>
        </div>

        {/* Ministry Tags */}
        {camper.ministry_interests && camper.ministry_interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {camper.ministry_interests.map((m) => (
              <span
                key={m}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f1f3f4] text-[#444746] font-medium"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Scripture Anchor (Minimized to Book & Chapter:Verse Reference with Expandable Option) */}
        {(() => {
          const scripture = parseScripture(camper.favorite_verse, camper.verse_reflection);
          const hasExpandableContent = Boolean(scripture.fullText || camper.verse_reflection);

          return (
            <div className="rounded-2xl bg-[#f8fafd] border border-[#e8eaed] p-3 text-xs transition-all">
              <button
                type="button"
                onClick={() => hasExpandableContent && setIsVerseExpanded(!isVerseExpanded)}
                className={`w-full flex items-center justify-between text-left ${hasExpandableContent ? 'cursor-pointer group' : 'cursor-default'}`}
                title={hasExpandableContent ? (isVerseExpanded ? 'Hide Scripture Verse' : 'Reveal Scripture Verse') : undefined}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <BookOpen className="w-3.5 h-3.5 text-[#0b57d0] shrink-0" />
                  <span className="text-[#5e5e5e] text-[11px] font-medium shrink-0">Scripture Anchor:</span>
                  <span className="font-bold text-[#0b57d0] truncate group-hover:underline">
                    {scripture.reference}
                  </span>
                </div>
                {hasExpandableContent && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#0b57d0] bg-[#e8f0fe] hover:bg-[#d2e3fc] px-2 py-0.5 rounded-full transition-colors shrink-0 ml-2">
                    <span>{isVerseExpanded ? 'Hide' : 'Reveal'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isVerseExpanded ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </button>

              {isVerseExpanded && (scripture.fullText || camper.verse_reflection) && (
                <div className="mt-2.5 pt-2 border-t border-[#e8eaed] text-[11px] text-[#444746] italic leading-relaxed animate-fadeIn">
                  &ldquo;{scripture.fullText || camper.verse_reflection}&rdquo;
                </div>
              )}
            </div>
          );
        })()}

        {/* Pass Footer with Public Profile QR Code & Pass Code */}
        <div className="pt-3 border-t border-[#f1f3f4]">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#747775] block uppercase tracking-wider">
                Activation / Pass Code
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#1f1f1f] tracking-wider">
                  {passCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Copy Pass Code"
                  className="p-1 text-[#747775] hover:text-[#1f1f1f] rounded-md hover:bg-[#f1f3f4] transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-[#747775] leading-tight">
                {isActivated 
                  ? 'Pass verified! QR code links to your camper profile.' 
                  : 'Scan QR code to view public profile, or enter code to activate.'}
              </p>

              {/* Public Profile URL Copy Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(profileUrl);
                    setIsUrlCopied(true);
                    setTimeout(() => setIsUrlCopied(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  {isUrlCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Profile Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3 h-3" />
                      <span>Copy Public Profile Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-2 bg-white border border-[#dadce0] rounded-2xl shrink-0 shadow-2xs">
              <QRCodeCanvas value={profileUrl} size={84} />
            </div>
          </div>
        </div>

        {/* Quick self-activation prompt if not yet activated */}
        {!isActivated && onActivatePass && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onActivatePass}
              className="tap-pill w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#0b57d0] text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Arrived at Camp? Activate Pass Now</span>
            </button>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onInviteFriend}
        className="tap-pill w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>Invite a Friend to My Church Delegation</span>
      </button>
    </div>
  );
};

