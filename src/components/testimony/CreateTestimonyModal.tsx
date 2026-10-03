import { useState, type FC } from 'react';
import { X, Sparkles, Loader2, BookOpen, ImageIcon, UserX } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { TestimonyCategory, Testimony, CamperRegistration } from '../../types';
import { apiService } from '../../services/api';

interface CreateTestimonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCamper: CamperRegistration | null;
  onTestimonyCreated: (newTestimony: Testimony) => void;
}

const TESTIMONY_CATEGORIES: Array<{ key: TestimonyCategory; label: string; icon: string }> = [
  { key: 'answered_prayer', label: 'Answered Prayer', icon: '🎉' },
  { key: 'salvation', label: 'Salvation Story', icon: '🕊️' },
  { key: 'healing', label: 'Healing & Miracle', icon: '❤️‍🩹' },
  { key: 'spiritual_milestone', label: 'Breakthrough', icon: '🔥' },
  { key: 'delegation_story', label: 'Delegation Blessing', icon: '🤝' },
  { key: 'general', label: 'Praise Report', icon: '✨' },
];

export const CreateTestimonyModal: FC<CreateTestimonyModalProps> = ({
  isOpen,
  onClose,
  currentCamper,
  onTestimonyCreated,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<TestimonyCategory>('answered_prayer');
  const [scriptureReference, setScriptureReference] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCamper?.id) {
      setError('Please sign in with your Camp Pass to share a testimony.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for your praise report.');
      return;
    }

    if (!content.trim()) {
      setError('Please share what God has done.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiService.createTestimony(
        {
          title: title.trim(),
          content: content.trim(),
          category,
          scripture_reference: scriptureReference.trim() || undefined,
          media_url: mediaUrl.trim() || undefined,
          is_anonymous: isAnonymous,
        },
        currentCamper.id
      );

      if (res.success && res.testimony) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#3b82f6', '#10b981'],
        });

        onTestimonyCreated(res.testimony);
        onClose();
      } else {
        setError(res.error || 'Failed to submit testimony.');
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
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold truncate">Share a Praise Report</h3>
              <p className="text-xs text-amber-100 truncate">
                Declare what the Lord has done at VLC 2027!
              </p>
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

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-800">
              Testimony Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Healed of Chronic Back Pain, Received Salvation at the Rally!"
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-zinc-900 transition-all outline-hidden"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-800">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TESTIMONY_CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-2.5 rounded-2xl text-xs font-medium border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-300 shadow-2xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-800">
              Testimony / Praise Story <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Give God the glory! Share the details of what happened, how your faith was strengthened, or how prayer was answered..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-zinc-900 transition-all outline-hidden resize-none"
            />
          </div>

          {/* Scripture Promise */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span>Scripture Verse (Optional)</span>
            </label>
            <input
              type="text"
              value={scriptureReference}
              onChange={(e) => setScriptureReference(e.target.value)}
              placeholder="e.g. Psalm 103:2-3, 1 Thessalonians 5:18"
              className="w-full px-4 py-2 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs text-zinc-800 outline-hidden"
            />
          </div>

          {/* Optional Media URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span>Photo / Media URL (Optional)</span>
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://... or photo link from camp"
              className="w-full px-4 py-2 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs text-zinc-800 outline-hidden"
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <UserX className="w-4 h-4 text-zinc-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Post Anonymously</span>
                <span className="text-[11px] text-zinc-500 block">
                  Give God all the glory while keeping your name private.
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 shrink-0 cursor-pointer"
            />
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
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="tap-pill px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Praise...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Praise Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
