import { useState, useEffect, type FC } from 'react';
import { 
  Church as ChurchIcon, 
  MapPin, 
  BookOpen, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  ArrowLeft,
  Link2,
  Check
} from 'lucide-react';
import { QRCodeCanvas } from './ui/QRCodeCanvas';
import type { CamperRegistration, CamperRole } from '../types';
import { apiService } from '../services/api';

interface PublicCamperProfilePageProps {
  camperId: string | null;
  onBack: () => void;
  onJoinDelegation?: (churchId: string) => void;
}

export const PublicCamperProfilePage: FC<PublicCamperProfilePageProps> = ({
  camperId,
  onBack,
  onJoinDelegation,
}) => {
  const [camper, setCamper] = useState<CamperRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(camperId));
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isProfileUrlCopied, setIsProfileUrlCopied] = useState(false);
  const [isPassCodeCopied, setIsPassCodeCopied] = useState(false);

  useEffect(() => {
    if (!camperId) return;

    let isMounted = true;
    apiService.getCamperProfile(camperId)
      .then((res) => {
        if (isMounted) {
          if (res.success && res.camper) {
            setCamper(res.camper);
          } else {
            setError(res.error || 'Camper not found');
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load camper profile:', err);
          setError('Failed to load camper profile. They may have chosen to keep it private or the ID is incorrect.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [camperId]);

  const handleCopyLink = () => {
    if (!camperId) return;
    const url = `${window.location.origin}/camper/${camperId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!camperId || !camper) return;
    const url = `${window.location.origin}/camper/${camperId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${camper.nickname}'s VLC 2027 Pass`,
          text: `Check out my official delegate pass for Vision & Leadership Camp 2027!`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const getRoleBadge = (role: CamperRole = 'camper') => {
    switch (role) {
      case 'counselor': return { label: 'Counselor', badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200' };
      case 'first_timer': return { label: 'First-Timer', badge: 'bg-purple-100 text-purple-800 border border-purple-200' };
      case 'worship': return { label: 'Worship Team', badge: 'bg-amber-100 text-amber-800 border border-amber-200' };
      case 'staff': return { label: 'Camp Staff', badge: 'bg-zinc-800 text-zinc-100 border border-zinc-900' };
      case 'camper':
      default:
        return { label: 'Camper', badge: 'bg-blue-100 text-blue-800 border border-blue-200' };
    }
  };

  const currentRole = getRoleBadge(camper?.role);
  const isActivated = camper?.status === 'activated';

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-xs font-semibold cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-zinc-500 text-sm font-medium">Loading camper profile...</p>
        </div>
      ) : error || !camper ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center space-y-4">
          <p className="font-semibold text-sm">{error || 'Camper not found'}</p>
          <button
            onClick={onBack}
            className="tap-pill px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="space-y-6 text-left animate-fadeIn">
          {/* Top Pass Brand Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
                VLC 2027 DELEGATE PASS
              </span>
              {isActivated ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase border border-emerald-200">
                  ✓ Activated
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase border border-blue-200">
                  Registered
                </span>
              )}
            </div>

            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${currentRole.badge}`}>
              {currentRole.label}
            </span>
          </div>

          {/* Avatar & Badge Name Identity Plate */}
          <div className="flex items-center gap-5 bg-gradient-to-br from-blue-50/80 via-zinc-50/50 to-white p-5 rounded-3xl border border-blue-100/80 shadow-sm">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-zinc-100 shrink-0">
              {camper.selfie_url ? (
                <img
                  src={camper.selfie_url}
                  alt={camper.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#0b57d0]">
                  {camper.nickname?.charAt(0) || 'C'}
                </div>
              )}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#0b57d0] bg-white px-2.5 py-0.5 rounded-md border border-blue-200 inline-block shadow-2xs">
                OFFICIAL BADGE NAME
              </span>
              <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight truncate leading-tight">
                {camper.nickname}
              </h3>
              <p className="text-sm text-zinc-600 font-medium truncate">
                {camper.full_name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{camper.city ? `${camper.city}, ` : ''}{camper.province}</span>
              </div>
            </div>
          </div>

          {/* Delegation / Church affiliation */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-1.5 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 text-[#0b57d0] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <ChurchIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider">
                  Delegation / Church
                </span>
                <h4 className="text-sm font-bold text-zinc-900 leading-snug">
                  {camper.church_name || 'PCCI Delegation'}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Jesus Is Alive Worship Center &bull; {camper.province}
                </p>
              </div>
            </div>
          </div>

          {/* Favorite Bible Verse Quote Card */}
          {camper.favorite_verse && (
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Favorite Verse: {camper.favorite_verse}</span>
              </div>
              {camper.verse_reflection && (
                <p className="text-sm text-zinc-700 italic leading-relaxed">
                  &ldquo;{camper.verse_reflection}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Ministry Interests Pills */}
          {camper.ministry_interests && camper.ministry_interests.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider">
                Ministry Interests
              </span>
              <div className="flex flex-wrap gap-2">
                {camper.ministry_interests.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-blue-50 text-[#0b57d0] border border-blue-100 px-3 py-1 rounded-full"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Official Camper Public Profile QR & Pass Code */}
          {(() => {
            const passCode = camper.activation_code || camper.id || 'VLC-DELEGATE';
            const profileUrl = `${window.location.origin}/camper/${camper.id}`;
            return (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
                    <span>Official Profile QR &amp; Pass</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    Public Camper Profile QR
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Activation / Pass Code
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-zinc-900 tracking-wider">
                        {passCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(passCode);
                          setIsPassCodeCopied(true);
                          setTimeout(() => setIsPassCodeCopied(false), 2000);
                        }}
                        title="Copy Pass Code"
                        className="p-1 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
                      >
                        {isPassCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-tight">
                      Scan this QR code with any smartphone camera to open and share this public camper profile.
                    </p>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(profileUrl);
                          setIsProfileUrlCopied(true);
                          setTimeout(() => setIsProfileUrlCopied(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        {isProfileUrlCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Profile Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Copy Public Profile Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-2 bg-white border border-zinc-200 rounded-2xl shrink-0 shadow-2xs">
                    <QRCodeCanvas value={profileUrl} size={92} />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Shareable Profile URL Box */}
          <div className="pt-2 flex items-center justify-between text-sm gap-3">
            <div className="flex-1 min-w-0 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
              <span className="font-mono text-xs text-zinc-500 truncate block">
                {window.location.origin}/camper/{camper.id}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`tap-pill px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
                isCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200 shadow-2xs'
              }`}
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Page Bottom Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="tap-pill w-full sm:w-auto py-3 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs shrink-0"
            >
              <Share2 className="w-4 h-4 text-[#0b57d0]" />
              <span>Share Profile</span>
            </button>

            {onJoinDelegation && camper.church_id && (
              <button
                type="button"
                onClick={() => {
                  onJoinDelegation(camper.church_id!);
                }}
                className="tap-pill w-full flex-1 py-3 px-5 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Join this Delegation</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
