import { useState, type FC } from 'react';
import { X, HeartHandshake, Loader2, Lock, Shield, Users, UserX, BookOpen } from 'lucide-react';
import type { PrayerCategory, PrayerPrivacyLevel, PrayerRequest, CamperRegistration } from '../../types';
import { apiService } from '../../services/api';

interface CreatePrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCamper: CamperRegistration | null;
  onPrayerCreated: (newPrayer: PrayerRequest) => void;
}

const CATEGORIES: Array<{ key: PrayerCategory; label: string; icon: string }> = [
  { key: 'spiritual_growth', label: 'Spiritual Growth & Faith', icon: '🌱' },
  { key: 'healing_health', label: 'Healing & Health', icon: '❤️‍🩹' },
  { key: 'family_personal', label: 'Family & Personal Life', icon: '🏡' },
  { key: 'academic_career', label: 'Studies & Career', icon: '📚' },
  { key: 'salvation_evangelism', label: 'Salvation of Loved Ones', icon: '🕊️' },
  { key: 'camp_breakthrough', label: 'Camp Breakthrough & Revival', icon: '🔥' },
  { key: 'general', label: 'General Petition', icon: '🙏' },
];

const PRIVACY_OPTIONS: Array<{
  level: PrayerPrivacyLevel;
  title: string;
  desc: string;
  icon: typeof Users;
}> = [
  {
    level: 'public',
    title: 'Public (Camp Community)',
    desc: 'Visible to all registered campers and attendees across all church delegations.',
    icon: Users,
  },
  {
    level: 'church_delegation',
    title: 'My Delegation Only',
    desc: 'Visible only to campers and leaders from your own church delegation.',
    icon: Lock,
  },
  {
    level: 'pastors_counselors',
    title: 'Pastors & Counselors Only',
    desc: 'Restricted confidentially to pastors, counselors, and camp leaders.',
    icon: Shield,
  },
];

export const CreatePrayerModal: FC<CreatePrayerModalProps> = ({
  isOpen,
  onClose,
  currentCamper,
  onPrayerCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PrayerCategory>('spiritual_growth');
  const [scriptureReference, setScriptureReference] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<PrayerPrivacyLevel>('public');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCamper?.id) {
      setError('Please sign in with your Camp Pass to share a prayer request.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for your prayer petition.');
      return;
    }

    if (!description.trim()) {
      setError('Please describe your prayer request.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiService.createPrayerRequest(
        {
          title: title.trim(),
          description: description.trim(),
          category,
          scripture_reference: scriptureReference.trim() || undefined,
          privacy_level: privacyLevel,
          is_anonymous: isAnonymous,
        },
        currentCamper.id
      );

      if (res.success && res.prayer) {
        onPrayerCreated(res.prayer);
        onClose();
      } else {
        setError(res.error || 'Failed to submit prayer request.');
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
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs shrink-0">
              <HeartHandshake className="w-5 h-5 text-amber-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold truncate">Share a Prayer Request</h3>
              <p className="text-xs text-blue-100 truncate">
                We are standing in faith with you at VLC 2027
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
              Prayer Title / Need <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Healing for my mother, Guidance in college choices, Revival in my church"
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm text-zinc-900 transition-all outline-hidden"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-800">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-2.5 rounded-2xl text-xs font-medium border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold ring-2 ring-blue-300 shadow-2xs'
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

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-800">
              Details / Specific Petitions <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell fellow campers how they can specifically pray for you. Feel free to share details or prayer points..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm text-zinc-900 transition-all outline-hidden resize-none"
            />
          </div>

          {/* Scripture Reference */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span>Scripture Promise (Optional)</span>
            </label>
            <input
              type="text"
              value={scriptureReference}
              onChange={(e) => setScriptureReference(e.target.value)}
              placeholder="e.g. Philippians 4:6-7, Jeremiah 29:11, Isaiah 41:10"
              className="w-full px-4 py-2 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs text-zinc-800 outline-hidden"
            />
          </div>

          {/* Privacy Level */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <label className="block text-xs font-bold text-zinc-800">Privacy &amp; Visibility</label>
            <div className="space-y-2">
              {PRIVACY_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = privacyLevel === opt.level;
                return (
                  <label
                    key={opt.level}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-200 shadow-2xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy_level"
                      value={opt.level}
                      checked={isSelected}
                      onChange={() => setPrivacyLevel(opt.level)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                        <IconComponent className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <UserX className="w-4 h-4 text-zinc-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Post Anonymously</span>
                <span className="text-[11px] text-zinc-500 block">
                  Your name and photo will be hidden from the public feed.
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
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
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="tap-pill px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Prayer...</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-4 h-4" />
                  <span>Share Prayer Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
