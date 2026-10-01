import { useEffect, type FC } from 'react';
import { X, QrCode } from 'lucide-react';
import type { CamperRegistration } from '../types';
import { CampPassCard } from './CampPassCard';

export interface DigitalPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  camper: CamperRegistration | null;
  onInviteFriend?: () => void;
  onActivatePass?: () => void;
}

export const DigitalPassModal: FC<DigitalPassModalProps> = ({
  isOpen,
  onClose,
  camper,
  onInviteFriend,
  onActivatePass,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !camper) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-[#f8fafd] rounded-3xl border border-[#dadce0] shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-[#f1f3f4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0b57d0]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1f1f1f] leading-tight">
                Digital Delegate Pass
              </h2>
              <p className="text-[11px] text-[#5e5e5e]">
                Show this scannable badge upon arrival &amp; meals
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Solely Displays the Digital Pass */}
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <CampPassCard
            camper={camper}
            onInviteFriend={onInviteFriend || (() => {})}
            onActivatePass={onActivatePass}
          />
        </div>
      </div>
    </div>
  );
};
