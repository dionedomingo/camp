import { useState, type FC } from 'react';
import { 
  Church as ChurchIcon, 
  BookOpen, 
  Share2,
  CheckCircle2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import type { CamperRegistration, CamperRole } from '../types';
import { QRCodeCanvas } from './ui/QRCodeCanvas';

interface CampPassCardProps {
  camper: CamperRegistration;
  eventName?: string;
  eventDates?: string;
  onInviteFriend: () => void;
  onActivatePass?: () => void;
}

export const CampPassCard: FC<CampPassCardProps> = ({ camper, eventName, onInviteFriend, onActivatePass }) => {
  const [isCopied, setIsCopied] = useState(false);

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

  // Construct activation URL for QR code
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vlc2027.pcci.ph';
  const qrUrl = `${origin}/?activate_token=${camper.activation_token || ''}&code=${passCode}&event_id=${camper.event_id || ''}`;

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

        {/* Scripture Anchor & Real-Time Reflection */}
        <div className="rounded-2xl bg-[#f8fafd] border border-[#e8eaed] p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-[#0b57d0] font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scripture Anchor: {camper.favorite_verse}</span>
          </div>
          {camper.verse_reflection && (
            <p className="text-[#444746] italic leading-relaxed text-[11px]">
              &ldquo;{camper.verse_reflection}&rdquo;
            </p>
          )}
        </div>

        {/* Pass Footer with Scannable QR Code */}
        <div className="pt-3 border-t border-[#f1f3f4] flex items-center justify-between gap-4">
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
                ? 'Pass verified! Use for meal claim & sessions.' 
                : 'Scan at entrance or enter code to activate.'}
            </p>
          </div>

          <div className="p-2 bg-white border border-[#dadce0] rounded-2xl shrink-0 shadow-2xs">
            <QRCodeCanvas value={qrUrl} size={84} />
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

