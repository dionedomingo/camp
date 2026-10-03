import { useState, type FC } from 'react';
import { X, Sparkles, Trophy, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PrayerRequest } from '../../types';
import { apiService } from '../../services/api';

interface ResolvePrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: PrayerRequest;
  onResolved: (prayerId: string, resolutionNotes: string, linkedTestimonyId?: string) => void;
}

export const ResolvePrayerModal: FC<ResolvePrayerModalProps> = ({
  isOpen,
  onClose,
  prayer,
  onResolved,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [createTestimony, setCreateTestimony] = useState(true);
  const [testimonyTitle, setTestimonyTitle] = useState(`God Answered: ${prayer.title}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      setError('Please write a note about how God answered your prayer!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiService.resolvePrayerRequest(
        prayer.id,
        prayer.author.id,
        {
          resolution_notes: resolutionNotes.trim(),
          create_testimony: createTestimony,
          testimony_title: testimonyTitle.trim(),
        }
      );

      if (res.success) {
        // Trigger celebratory confetti particles!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
        });

        onResolved(prayer.id, resolutionNotes.trim(), res.linked_testimony_id);
        onClose();
      } else {
        setError(res.error || 'Failed to update prayer request status.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with celebration banner */}
        <div className="p-5 border-b border-zinc-100 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs shrink-0">
              <Trophy className="w-5 h-5 text-amber-200" />
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Praise God!</span>
              </div>
              <h3 className="text-lg font-black truncate">God Has Answered!</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          {/* Original Prayer Summary */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Original Prayer Request
            </span>
            <h4 className="text-sm font-bold text-zinc-900">{prayer.title}</h4>
            <p className="text-xs text-zinc-500 line-clamp-2">{prayer.description}</p>
          </div>

          {/* Resolution Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-800">
              How did God answer your prayer? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Share the good news! What did the Lord do? Give Him the praise and encourage fellow campers..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm text-zinc-900 transition-all outline-hidden resize-none"
            />
          </div>

          {/* Create Testimony Toggle */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={createTestimony}
                onChange={(e) => setCreateTestimony(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Also post as a Camp Praise Report (Testimony)</span>
                </span>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  This will publish your answered prayer to the Testimonies wall to build the faith of the whole camp!
                </p>
              </div>
            </label>

            {createTestimony && (
              <div className="pt-2 border-t border-emerald-200/60">
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Testimony Title
                </label>
                <input
                  type="text"
                  value={testimonyTitle}
                  onChange={(e) => setTestimonyTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 focus:ring-2 focus:ring-emerald-200 text-xs text-zinc-800 outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !resolutionNotes.trim()}
              className="tap-pill px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Praise Report...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm: God Has Answered!</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
