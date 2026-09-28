import { useState, type FC } from 'react';
import {
  X,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Search,
  HeartHandshake
} from 'lucide-react';
import type { CamperRegistration, CamperRole, Church } from '../../types';
import { SelfieCapture } from '../SelfieCapture';
import { CampPassCard } from '../CampPassCard';
import { apiService } from '../../services/api';

interface AgenticSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChurch: Church | null;
  allChurches: Church[];
  onComplete: (camper: CamperRegistration) => void;
  onOpenInviteModal: (camper: CamperRegistration) => void;
}

function calculateAgeFromBirthdate(birthdate: string): number {
  if (!birthdate) return 0;
  const birth = new Date(birthdate);
  if (isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

function getAgeCategory(age: number): string {
  if (age <= 0) return '';
  if (age < 13) return 'Junior Camper';
  if (age <= 17) return 'Youth Delegate';
  if (age <= 25) return 'Young Adult';
  return 'Adult / Leader';
}

export const AgenticSignupModal: FC<AgenticSignupModalProps> = ({
  isOpen,
  onClose,
  initialChurch,
  allChurches,
  onComplete,
  onOpenInviteModal,
}) => {
  // Steps: 0: Church (if not pre-selected), 1: Role, 2: Basics & Care, 3: Photo, 4: Ministry & Verse, 5: Complete
  const [currentStep, setCurrentStep] = useState<number>(initialChurch ? 1 : 0);
  const [churchSearch, setChurchSearch] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedCamper, setCompletedCamper] = useState<CamperRegistration | null>(null);

  const [formData, setFormData] = useState<Partial<CamperRegistration>>({
    church_id: initialChurch?.id || '',
    church_name: initialChurch?.name || '',
    church_slug: initialChurch?.slug || '',
    role: 'camper',
    full_name: '',
    nickname: '',
    gender: 'male',
    birthdate: '2008-05-15',
    age: calculateAgeFromBirthdate('2008-05-15'),
    email: '',
    phone: '',
    province: initialChurch?.province || 'Metro Manila',
    city: initialChurch?.city || '',
    dietary_needs: 'None',
    emergency_name: '',
    emergency_phone: '',
    emergency_relation: 'Parent / Guardian',
    ministry_interests: ['Praise & Worship'],
    favorite_verse: 'Jeremiah 29:11',
    verse_reflection: '',
    selfie_url: '',
    password: '',
  });

  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);

  if (!isOpen) return null;

  const ROLES: Array<{ role: CamperRole; label: string; desc: string }> = [
    { role: 'camper', label: 'Regular Camper', desc: 'Standard youth or student delegate' },
    { role: 'first_timer', label: 'First-Timer Camper 🌿', desc: 'My first time attending camp! (Special welcome)' },
    { role: 'counselor', label: 'Cabin Leader / Counselor', desc: 'Mentoring and overseeing campers' },
    { role: 'worship', label: 'Worship & Creative Arts', desc: 'Band, vocals, sound, or media production' },
    { role: 'staff', label: 'Staff / Operations', desc: 'Logistics, registration, or catering crew' },
    { role: 'pastor', label: 'Pastor / Minister', desc: 'Ordained clergy and ministry leaders' },
    { role: 'medical', label: 'Medical / First Aid', desc: 'Nurses, physicians, and first aiders' },
  ];

  const MINISTRIES = [
    'Praise & Worship',
    'Media & Video',
    'Youth Ministry',
    'Hospitality & Ushers',
    'Intercessory Prayer',
    'Kids Ministry',
    'Sound & Production',
    'Sports & Logistics',
    'Medical & First Aid',
  ];

  const POPULAR_VERSES = [
    'Jeremiah 29:11',
    'Philippians 4:13',
    'Joshua 1:9',
    'Romans 8:28',
    'Isaiah 40:31',
    'Psalm 23:1',
    'Isaiah 60:1',
  ];

  const prompts: Record<number, string> = {
    0: `Welcome! Which church delegation are you joining for VLC 2027?`,
    1: `Glad you're coming with ${formData.church_name || 'us'}! What will your role be at camp?`,
    2: `Great! Let's get your name, birthday, and contact details so we can determine your age group and prepare your pass.`,
    3: `Smile! Let's snap a quick photo for your official camp ID badge.`,
    4: `Almost done! Where do you love serving, and what's your anchor Bible verse?`,
  };

  const toggleMinistry = (item: string) => {
    const current = formData.ministry_interests || [];
    if (current.includes(item)) {
      setFormData({ ...formData, ministry_interests: current.filter((i) => i !== item) });
    } else {
      setFormData({ ...formData, ministry_interests: [...current, item] });
    }
  };

  const handleRoleSelect = (role: CamperRole) => {
    setFormData({ ...formData, role });
    // Smooth auto-advance
    setTimeout(() => {
      setCurrentStep(2);
    }, 180);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      let reflection = formData.verse_reflection;
      if (!reflection && formData.favorite_verse) {
        reflection = await apiService.getVerseReflection(formData.favorite_verse, formData);
      }

      const payload: CamperRegistration = {
        ...(formData as CamperRegistration),
        verse_reflection: reflection,
      };

      const result = await apiService.registerCamper(payload);
      setCompletedCamper(result);
      setCurrentStep(5);
      onComplete(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Please check your inputs';
      alert('Registration error: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#dadce0] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">

        {/* Top Header & Close */}
        <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center font-bold text-sm">
              ✝
            </div>
            <div>
              <span className="text-xs font-bold text-[#1f1f1f]">VLC 2027 Registration</span>
              <span className="text-xs text-[#747775] ml-1.5">• Vicky Assistant</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#747775] hover:text-[#1f1f1f] rounded-full hover:bg-[#f1f3f4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPLETED STEP: Show Camp Pass & Invite CTA */}
        {currentStep === 5 && completedCamper ? (
          <div className="space-y-5 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#188038] flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1f1f1f]">
                {completedCamper.active_event_name ? `You're Confirmed for ${completedCamper.active_event_name}! 🎉` : "You're Confirmed for VLC 2027! 🎉"}
              </h2>
              <p className="text-xs text-[#747775] mt-1">Here is your official digital delegation pass and passport QR</p>
            </div>

            <CampPassCard
              camper={completedCamper}
              eventName={completedCamper.active_event_name || 'VLC 2027'}
              onInviteFriend={() => onOpenInviteModal(completedCamper)}
            />
          </div>
        ) : (
          /* ACTIVE STEPPER FLOW */
          <div className="space-y-5">
            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs text-[#747775]">
              <span>Step {currentStep} of 4</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${s === currentStep
                      ? 'w-6 bg-[#0b57d0]'
                      : s < currentStep
                        ? 'w-2.5 bg-[#ceead6]'
                        : 'w-2 bg-[#f1f3f4]'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Google Assistant Prompt Bubble */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f8fafd] border border-[#edf2fa]">
              <div className="w-7 h-7 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold text-xs shrink-0">
                B
              </div>
              <p className="text-sm font-medium text-[#1f1f1f] leading-snug">
                {prompts[currentStep] || prompts[1]}
              </p>
            </div>

            {/* STEP 0: Church Selection */}
            {currentStep === 0 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">
                      Select Your PCCI Church Delegation *
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {allChurches.filter((c) => c.id !== 'ch_open_delegate').length} Churches
                    </span>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search church by name, city, or province..."
                      value={churchSearch}
                      onChange={(e) => setChurchSearch(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Primary: PCCI Church Delegations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {allChurches
                    .filter((c) => c.id !== 'ch_open_delegate')
                    .filter((c) => {
                      if (!churchSearch.trim()) return true;
                      const q = churchSearch.toLowerCase();
                      return (
                        c.name.toLowerCase().includes(q) ||
                        c.city.toLowerCase().includes(q) ||
                        c.province.toLowerCase().includes(q)
                      );
                    })
                    .map((church) => {
                      const isSelected = formData.church_id === church.id;
                      return (
                        <button
                          type="button"
                          key={church.id}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              church_id: church.id,
                              church_name: church.name,
                              church_slug: church.slug,
                              province: church.province,
                              city: church.city,
                            });
                            setCurrentStep(1);
                          }}
                          className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${isSelected
                              ? 'bg-[#e8f0fe] border-[#0b57d0] text-[#0b57d0] shadow-xs ring-1 ring-[#0b57d0]'
                              : 'bg-white border-zinc-200 hover:border-[#0b57d0] hover:bg-[#f8fafd]'
                            }`}
                        >
                          <div className="font-semibold text-xs text-zinc-900 line-clamp-1">{church.name}</div>
                          <div className="text-[11px] text-zinc-500">{church.city}, {church.province}</div>
                        </button>
                      );
                    })}
                </div>

                {/* Down-prioritized: Independent Delegate Option at the Bottom */}
                <div className="pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        church_id: 'ch_open_delegate',
                        church_name: 'Independent Delegate / Other Fellowship',
                        church_slug: 'independent',
                        province: 'Open / Other',
                        city: 'Various Cities',
                      });
                      setCurrentStep(1);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition-colors cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-zinc-700 text-xs">
                        Not part of a listed PCCI church delegation?
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Register as an Independent / Guest Delegate
                      </p>
                    </div>
                    <span className="text-xs text-zinc-600 font-semibold px-2 py-0.5 rounded bg-zinc-200/60">
                      Select &rarr;
                    </span>
                  </button>
                </div>
              </div>
            )}


            {/* STEP 1: Role Selection (Pill Tiles) */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROLES.map((r) => {
                  const isSelected = formData.role === r.role;
                  return (
                    <button
                      type="button"
                      key={r.role}
                      onClick={() => handleRoleSelect(r.role)}
                      className={`tap-pill text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected
                        ? 'bg-[#e8f0fe] border-[#0b57d0] shadow-xs ring-1 ring-[#0b57d0]'
                        : 'bg-white border-[#dadce0] hover:border-[#0b57d0] hover:bg-[#f8fafd]'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs sm:text-sm text-[#1f1f1f]">{r.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#0b57d0]" />}
                      </div>
                      <p className="text-[11px] text-[#747775] mt-0.5">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 2: Basics & Camp Care */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#444746] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Joshua Miguel Valdez"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#444746] block mb-1">Badge Nickname *</label>
                    <input
                      type="text"
                      placeholder="Josh"
                      required
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#444746]">
                        Birthday / Date of Birth *
                      </label>
                      {formData.birthdate && (formData.age || 0) > 0 ? (
                        <span className="text-[11px] font-semibold text-[#0b57d0] bg-[#e8f0fe] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span>🎂 {formData.age} yrs</span>
                          <span className="text-[#5e5e5e]">&bull;</span>
                          <span className="text-[#1f1f1f]">{getAgeCategory(formData.age || 0)}</span>
                        </span>
                      ) : null}
                    </div>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.birthdate || ''}
                      onChange={(e) => {
                        const bdate = e.target.value;
                        const determinedAge = calculateAgeFromBirthdate(bdate);
                        setFormData({
                          ...formData,
                          birthdate: bdate,
                          age: determinedAge,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:bg-white cursor-pointer"
                    />
                    <p className="text-[10px] text-[#747775] mt-1">
                      Age is automatically determined from your birth date
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#444746] block mb-1">Gender *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['male', 'female'] as const).map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`tap-pill py-2.5 rounded-2xl text-xs font-semibold capitalize border cursor-pointer ${formData.gender === g
                            ? 'bg-[#0b57d0] text-white border-[#0b57d0]'
                            : 'bg-[#f8fafd] text-[#444746] border-[#dadce0]'
                            }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#444746] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="camper@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#444746] block mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="+63 917 123 4567"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Account Password for Login */}
                <div className="pt-2 border-t border-[#f1f3f4]">
                  <div>
                    <label className="text-xs font-semibold text-[#444746] block mb-1">Account Password (for Sign In) *</label>
                    <input
                      type="password"
                      placeholder="Enter a secure password (min. 4 characters)"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f8fafd] border border-[#dadce0] text-xs text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] focus:bg-white"
                    />
                    <p className="text-[10px] text-[#747775] mt-1">
                      Matched directly against the database. Already joined a previous camp event? Enter your account password to register with your existing account.
                    </p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-2 border-t border-[#f1f3f4] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#444746]">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#d93025]" />
                    <span>Emergency Contact (Camp Safety)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Contact Person Name *"
                      required
                      value={formData.emergency_name}
                      onChange={(e) => setFormData({ ...formData, emergency_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8fafd] border border-[#dadce0] text-xs"
                    />
                    <input
                      type="tel"
                      placeholder="Contact Phone Number *"
                      required
                      value={formData.emergency_phone}
                      onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8fafd] border border-[#dadce0] text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Camper Photo */}
            {currentStep === 3 && (
              <div className="py-2">
                <SelfieCapture
                  currentPhoto={formData.selfie_url}
                  onPhotoSelected={(url) => setFormData({ ...formData, selfie_url: url })}
                />
              </div>
            )}

            {/* STEP 4: Ministry & Favorite Scripture */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#444746] block">
                    Where do you love serving or want to learn about?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MINISTRIES.map((item) => {
                      const isSelected = (formData.ministry_interests || []).includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleMinistry(item)}
                          className={`tap-pill px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${isSelected
                            ? 'bg-[#e8f0fe] text-[#0b57d0] border-[#d2e3fc]'
                            : 'bg-white text-[#444746] border-[#dadce0]'
                            }`}
                        >
                          {isSelected ? `✓ ${item}` : item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#f1f3f4]">
                  <label className="text-xs font-semibold text-[#444746] block">
                    Favorite Bible Verse
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {POPULAR_VERSES.map((v) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setFormData({ ...formData, favorite_verse: v })}
                        className={`tap-pill px-2.5 py-1 rounded-full text-[11px] border cursor-pointer ${formData.favorite_verse === v
                          ? 'bg-[#0b57d0] text-white border-[#0b57d0]'
                          : 'bg-[#f8fafd] text-[#5e5e5e] border-[#dadce0]'
                          }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. Jeremiah 29:11 or Joshua 1:9"
                    value={formData.favorite_verse}
                    onChange={(e) => setFormData({ ...formData, favorite_verse: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f8fafd] border border-[#dadce0] text-xs focus:outline-none focus:border-[#0b57d0]"
                  />

                  {/* Real-time reflection preview card */}
                  <div className="p-3 bg-[#e8f0fe] rounded-2xl border border-[#d2e3fc] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#0b57d0] font-semibold text-[11px]">
                      <span>Real-Time Scripture Blessing</span>
                      <button
                        type="button"
                        disabled={isGeneratingReflection}
                        onClick={async () => {
                          setIsGeneratingReflection(true);
                          const refl = await apiService.getVerseReflection(
                            formData.favorite_verse || 'Jeremiah 29:11',
                            formData
                          );
                          setFormData({ ...formData, verse_reflection: refl });
                          setIsGeneratingReflection(false);
                        }}
                        className="underline text-[10px] cursor-pointer"
                      >
                        {isGeneratingReflection ? 'Generating...' : 'Refresh'}
                      </button>
                    </div>
                    <p className="text-[#0b57d0] italic leading-relaxed text-[11px]">
                      {formData.verse_reflection ||
                        `"${formData.favorite_verse || 'Jeremiah 29:11'}" is an inspiring anchor for VLC 2027. We will generate your personalized camp blessing upon submitting.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="pt-4 border-t border-[#f1f3f4] flex items-center justify-between">
              {currentStep > (initialChurch ? 1 : 0) ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="tap-pill inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium text-[#5e5e5e] hover:text-[#1f1f1f] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 2 && (!formData.full_name || !formData.email || !formData.phone || !formData.birthdate || !formData.password || formData.password.trim().length < 4)) {
                      alert('Please fill in your full name, birthday, email, mobile number, and an account password (at least 4 characters).');
                      return;
                    }
                    setCurrentStep((prev) => prev + 1);
                  }}
                  className="tap-pill inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-sm cursor-pointer ml-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="tap-pill inline-flex items-center gap-1.5 px-7 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-bold shadow-sm cursor-pointer ml-auto disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Pass...' : 'Complete Registration'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
