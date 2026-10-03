import { useState, type FC } from 'react';
import { 
  Share2, 
  Copy, 
  CheckCircle2, 
  Church as ChurchIcon, 
  MapPin, 
  QrCode, 
  ExternalLink, 
  MessageCircle, 
  Mail
} from 'lucide-react';
import type { Church } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { QRCodeCanvas } from './ui/QRCodeCanvas';
import { getBaseUrl } from '../lib/utils';

interface ShareChurchModalProps {
  isOpen: boolean;
  onClose: () => void;
  church: Church | null;
}

export const ShareChurchModal: FC<ShareChurchModalProps> = ({
  isOpen,
  onClose,
  church,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');

  if (!church) return null;

  const origin = getBaseUrl();
  const shareUrl = `${origin}/join?church=${church.slug}`;
  const shareTitle = `${church.name} Delegation - VLC 2027`;
  const shareText = `Join our delegation (${church.name}) for the Vision & Leadership Camp (VLC 2027) - Arise & Shine! Register here:`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share dismissed or cancelled:', err);
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // Social share URLs
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(`VLC 2027: Join the ${church.name} delegation!`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={onClose} className="max-w-md p-6 rounded-3xl border border-zinc-200 shadow-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-[#0b57d0] flex items-center justify-center shadow-2xs shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 leading-tight">
                Share Delegation Invite
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                Send this link to rally delegates from your church
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Church Identity Snippet */}
        <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200/80 space-y-1 text-left">
          <div className="flex items-start gap-2">
            <ChurchIcon className="w-4 h-4 text-[#0b57d0] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-zinc-900 leading-snug">
                {church.name}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5">
                <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                <span>{church.city}, {church.province}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Mode Switcher: Link vs QR Code */}
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`tap-pill flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-blue-50 text-[#0b57d0] border border-blue-200/60'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Link &amp; Social</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`tap-pill flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-blue-50 text-[#0b57d0] border border-blue-200/60'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {activeTab === 'link' ? (
          <div className="space-y-4">
            {/* Copyable Invite Link Box */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                Direct Delegation Invite Link
              </label>
              <div className="flex items-center gap-2 bg-zinc-50 p-2 rounded-2xl border border-zinc-200">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="bg-transparent text-xs text-zinc-700 font-mono px-2 py-1 flex-1 outline-none truncate selection:bg-blue-100"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`tap-pill px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                    copied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white hover:bg-zinc-100 text-[#0b57d0] border-zinc-200 shadow-2xs'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Share Button (Mobile & Desktop) */}
            {hasNativeShare && (
              <Button
                onClick={handleNativeShare}
                className="w-full bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-xl text-xs font-semibold py-2.5 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via Phone / Messaging App</span>
              </Button>
            )}

            {/* Quick Social Share Buttons */}
            <div className="space-y-1.5 text-left">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Or share directly to:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-pill py-2 px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-zinc-700 hover:text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-pill py-2 px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-zinc-700 hover:text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook</span>
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-pill py-2 px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-sky-50 hover:border-sky-200 text-zinc-700 hover:text-sky-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
                  <span>Telegram</span>
                </a>
                <a
                  href={mailUrl}
                  className="tap-pill py-2 px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-2 animate-fadeIn text-center">
            <div className="p-3 bg-white rounded-2xl border border-zinc-200 shadow-sm inline-block">
              <QRCodeCanvas value={shareUrl} size={150} />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="text-xs font-semibold text-zinc-800">
                Scan to join the {church.name} delegation
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Open your smartphone camera to immediately open the registration wizard pre-selected for this delegation.
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-zinc-100 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-zinc-600 hover:text-zinc-900 rounded-xl cursor-pointer"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
