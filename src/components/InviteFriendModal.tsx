import { useState, useEffect, type FC } from 'react';
import { 
  X, 
  Copy, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  MessageCircle, 
  Smartphone,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CamperRegistration } from '../types';
import { apiService } from '../services/api';

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  camper: CamperRegistration;
}

export const InviteFriendModal: FC<InviteFriendModalProps> = ({
  isOpen,
  onClose,
  camper,
}) => {
  const [copied, setCopied] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendContact, setFriendContact] = useState('');
  const [nominatedSuccess, setNominatedSuccess] = useState(false);
  const [inviteText, setInviteText] = useState<string>('');

  const churchSlug = camper.church_slug || 'vlc';
  const inviteUrl = `${window.location.origin}${window.location.pathname}?church=${churchSlug}&ref=${camper.nickname || 'camper'}`;

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0b57d0', '#188038', '#f29900', '#d93025'],
      });

      apiService.getInviteCopy(camper).then((res) => {
        setInviteText(res.message);
      });
    }
  }, [isOpen, camper]);

  if (!isOpen) return null;

  const defaultMessage = inviteText || `Hey! I just registered for VLC 2027 with ${camper.church_name || 'our church'}! Come with me: `;
  const fullShareText = `${defaultMessage} ${inviteUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    apiService.trackInvite(camper.church_id, 'copy_link', camper.id);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    apiService.trackInvite(camper.church_id, 'whatsapp', camper.id);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    apiService.trackInvite(camper.church_id, 'telegram', camper.id);
    const url = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    apiService.trackInvite(camper.church_id, 'sms', camper.id);
    window.location.href = `sms:?body=${encodeURIComponent(fullShareText)}`;
  };

  const handleNominateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendName && friendContact) {
      apiService.trackInvite(camper.church_id, 'direct_nomination', camper.id);
      setNominatedSuccess(true);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => {
        setFriendName('');
        setFriendContact('');
        setNominatedSuccess(false);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#dadce0] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#747775] hover:text-[#1f1f1f] rounded-full hover:bg-[#f1f3f4] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#1f1f1f]">Invite a Friend to VLC 2027</h2>
          <p className="text-xs text-[#5e5e5e]">
            Camp is life-changing when experienced with a friend. Share your church delegation invite with one tap!
          </p>
        </div>

        {/* 1-Click Quick Sharing */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#444746] block">
            Share via:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleWhatsApp}
              className="tap-pill flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-[#e6f4ea] hover:bg-[#ceead6] text-[#188038] font-semibold text-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleTelegram}
              className="tap-pill flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#0b57d0] font-semibold text-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </button>

            <button
              onClick={handleSMS}
              className="tap-pill flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#444746] font-semibold text-xs transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="tap-pill flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Preview */}
        <div className="bg-[#f8fafd] rounded-2xl p-3.5 border border-[#e8eaed] space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#747775]">
            <span>Invite message preview:</span>
            <button
              onClick={handleCopyLink}
              className="text-[#0b57d0] hover:underline font-medium cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[#444746] font-mono text-[11px] select-all leading-relaxed">
            {fullShareText}
          </p>
        </div>

        {/* Direct Friend Nomination Form */}
        <div className="pt-3 border-t border-[#f1f3f4] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1f1f1f]">
            <Users className="w-3.5 h-3.5 text-[#0b57d0]" />
            <span>Or send direct invitation:</span>
          </div>

          {nominatedSuccess ? (
            <div className="p-3 rounded-xl bg-[#e6f4ea] text-[#188038] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Invitation recorded! We will follow up with your friend.</span>
            </div>
          ) : (
            <form onSubmit={handleNominateSubmit} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Friend's Name"
                  required
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0]"
                />
                <input
                  type="text"
                  placeholder="Friend's Mobile or Email"
                  required
                  value={friendContact}
                  onChange={(e) => setFriendContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
              <button
                type="submit"
                className="tap-pill w-full py-2 px-4 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#1f1f1f] font-semibold text-xs transition-colors cursor-pointer"
              >
                Send Invite
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
