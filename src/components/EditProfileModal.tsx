import { useState, type FC } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  HeartHandshake,
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Key,
  Link2,
  Copy,
  Check
} from 'lucide-react';
import { QRCodeCanvas } from './ui/QRCodeCanvas';
import { Code128Barcode } from './ui/Code128Barcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { CamperRegistration } from '../types';
import { SelfieCapture } from './SelfieCapture';
import { apiService } from '../services/api';

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

function getInitialFormData(camper: CamperRegistration | null): Partial<CamperRegistration> {
  if (!camper) return {};
  return {
    full_name: camper.full_name || '',
    nickname: camper.nickname || '',
    gender: camper.gender || 'male',
    birthdate: camper.birthdate || '2008-05-15',
    age: camper.age || calculateAgeFromBirthdate(camper.birthdate || '2008-05-15'),
    email: camper.email || '',
    phone: camper.phone || '',
    dietary_needs: camper.dietary_needs || 'None',
    emergency_name: camper.emergency_name || '',
    emergency_phone: camper.emergency_phone || '',
    emergency_relation: camper.emergency_relation || 'Parent / Guardian',
    favorite_verse: camper.favorite_verse || 'Philippians 4:13',
    verse_reflection: camper.verse_reflection || '',
    selfie_url: camper.selfie_url || '',
    ministry_interests: camper.ministry_interests || ['Praise & Worship'],
  };
}

export interface EditProfileFormProps {
  camper: CamperRegistration;
  onProfileUpdated: (updatedCamper: CamperRegistration) => void;
  onCancel?: () => void;
}

export const EditProfileForm: FC<EditProfileFormProps> = ({
  camper,
  onProfileUpdated,
  onCancel,
}) => {
  const [prevCamperId, setPrevCamperId] = useState<string | undefined>(camper.id);
  const [formData, setFormData] = useState<Partial<CamperRegistration>>(() => getInitialFormData(camper));
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBarcodeUrlCopied, setIsBarcodeUrlCopied] = useState(false);
  const [isPassCodeCopied, setIsPassCodeCopied] = useState(false);

  if (camper.id !== prevCamperId) {
    setPrevCamperId(camper.id);
    setFormData(getInitialFormData(camper));
    setNewPassword('');
    setSaveSuccess(false);
    setErrorMessage(null);
  }

  const toggleMinistry = (ministry: string) => {
    const current = formData.ministry_interests || [];
    if (current.includes(ministry)) {
      setFormData({ ...formData, ministry_interests: current.filter((m) => m !== ministry) });
    } else {
      setFormData({ ...formData, ministry_interests: [...current, ministry] });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!camper.id) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const updates: Partial<CamperRegistration> = {
        ...formData,
      };
      if (newPassword.trim()) {
        updates.password = newPassword.trim();
      }

      const result = await apiService.updateProfile(camper.id, updates);
      if (result.success && result.camper) {
        setSaveSuccess(true);
        onProfileUpdated(result.camper);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setErrorMessage(result.error || 'Failed to update profile. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving.';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const calculatedAge = formData.birthdate ? calculateAgeFromBirthdate(formData.birthdate) : (formData.age || 0);
  const ageCategory = getAgeCategory(calculatedAge);

  return (
    <form onSubmit={handleSave} className="space-y-6 pt-1">
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile updated successfully in the camp database!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: OFFICIAL BADGE PHOTO (SELFIE & PREVIEW) */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0b57d0]" />
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              Official Camp ID Photo
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500">Live preview &amp; webcam capture</span>
        </div>

        <SelfieCapture
          currentPhoto={formData.selfie_url}
          onPhotoSelected={(photoUrl) => {
            setFormData({ ...formData, selfie_url: photoUrl });
          }}
        />
      </div>

      {/* SECTION 2: OFFICIAL SCANNABLE PASS BARCODE & CHECK-IN LINK */}
      {(() => {
        const passCode = camper.activation_code || 'VLC-DELEGATE';
        const checkInUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/?code=${encodeURIComponent(passCode)}`
          : `https://summer-camp-vlc2027.pages.dev/?code=${encodeURIComponent(passCode)}`;

        return (
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0b57d0]" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Official Scannable Barcode &amp; Pass
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-zinc-600 border border-zinc-200 font-bold">
                1D Code 128 + 2D QR
              </span>
            </div>

            {/* 1D Linear Barcode for scanners */}
            <div className="p-2.5 bg-white border border-zinc-200/90 rounded-xl flex flex-col items-center justify-center shadow-2xs">
              <Code128Barcode
                value={passCode}
                height={36}
                width="100%"
                showText={false}
                barColor="#1f1f1f"
              />
              <div className="flex items-center justify-between w-full px-2 pt-1 font-mono text-[10px] text-zinc-500">
                <span className="uppercase tracking-wider">Pass Barcode:</span>
                <strong className="text-zinc-900 tracking-widest">{passCode}</strong>
              </div>
            </div>

            {/* QR Code and Fast Check-In Link */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-1 min-w-0 flex-1">
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
                    className="p-1 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-200/60 transition-colors cursor-pointer"
                  >
                    {isPassCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">
                  Scannable at entrance and session desks for instant badge check-in.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(checkInUrl);
                      setIsBarcodeUrlCopied(true);
                      setTimeout(() => setIsBarcodeUrlCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    {isBarcodeUrlCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Check-In URL Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Copy Scannable URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-2 bg-white border border-zinc-200 rounded-2xl shrink-0 shadow-2xs">
                <QRCodeCanvas value={checkInUrl} size={80} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* SECTION 3: PERSONAL IDENTITY & BIRTHDAY */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-zinc-600" />
          <span>Personal Identity &amp; Delegation</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Juan Dela Cruz"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Badge Nickname *
            </label>
            <input
              type="text"
              required
              value={formData.nickname || ''}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="Juan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
            />
          </div>
        </div>

        {/* Birthdate & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-700">Birthdate *</label>
              {calculatedAge > 0 && (
                <span className="text-[11px] font-mono text-zinc-500">
                  🎂 {calculatedAge} yrs &bull; {ageCategory}
                </span>
              )}
            </div>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={formData.birthdate || ''}
                onChange={(e) => {
                  const bdate = e.target.value;
                  const age = calculateAgeFromBirthdate(bdate);
                  setFormData({
                    ...formData,
                    birthdate: bdate,
                    age,
                  });
                }}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Gender *</label>
            <div className="grid grid-cols-2 gap-2">
              {(['male', 'female'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`tap-pill py-2.5 rounded-xl text-xs font-semibold capitalize border cursor-pointer ${
                    formData.gender === g
                      ? 'bg-[#0b57d0] text-white border-[#0b57d0]'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Mobile / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: EMERGENCY & DIETARY CARE */}
      <div className="space-y-4 pt-2 border-t border-zinc-100">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-red-500" />
          <span>Camp Care &amp; Emergency</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Emergency Contact *
            </label>
            <input
              type="text"
              required
              value={formData.emergency_name || ''}
              onChange={(e) => setFormData({ ...formData, emergency_name: e.target.value })}
              placeholder="Parent / Guardian"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Relationship *
            </label>
            <input
              type="text"
              required
              value={formData.emergency_relation || ''}
              onChange={(e) => setFormData({ ...formData, emergency_relation: e.target.value })}
              placeholder="Mother / Father"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Emergency Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.emergency_phone || ''}
              onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
              placeholder="+63 917 000 1122"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Dietary Requirements &amp; Food Allergies
          </label>
          <input
            type="text"
            value={formData.dietary_needs || ''}
            onChange={(e) => setFormData({ ...formData, dietary_needs: e.target.value })}
            placeholder="e.g. Vegetarian, No shellfish, Nut allergy, None"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
          />
          <p className="text-[10px] text-zinc-500 mt-1">
            Shared with camp catering staff for meal preparation.
          </p>
        </div>
      </div>

      {/* SECTION 5: SCRIPTURE & MINISTRY INTERESTS */}
      <div className="space-y-4 pt-2 border-t border-zinc-100">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#0b57d0]" />
          <span>Spiritual &amp; Ministry Pass Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Favorite Anchor Verse
            </label>
            <input
              type="text"
              value={formData.favorite_verse || ''}
              onChange={(e) => setFormData({ ...formData, favorite_verse: e.target.value })}
              placeholder="Philippians 4:13"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Personal Verse Reflection
            </label>
            <input
              type="text"
              value={formData.verse_reflection || ''}
              onChange={(e) => setFormData({ ...formData, verse_reflection: e.target.value })}
              placeholder="Short note or takeaway"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
            Ministry Interests
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MINISTRIES.map((m) => {
              const isChecked = (formData.ministry_interests || []).includes(m);
              return (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggleMinistry(m)}
                  className={`tap-pill text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#0b57d0] text-white border-[#0b57d0] shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 6: UPDATE PASSWORD (OPTIONAL) */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
          <Key className="w-3.5 h-3.5 text-zinc-600" />
          <span>Change Account Password (Optional)</span>
        </div>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leave blank to keep your current password"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0]"
        />
        <p className="text-[10px] text-zinc-500">
          Used when signing into your camper account at VLC 2027.
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-xs text-zinc-700"
          >
            Cancel
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="submit"
          disabled={isSaving}
          className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold px-6 gap-2 rounded-xl shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </Button>
      </div>
    </form>
  );
};

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  camper: CamperRegistration | null;
  onProfileUpdated: (updatedCamper: CamperRegistration) => void;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  camper,
  onProfileUpdated,
}) => {
  if (!isOpen || !camper) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <DialogHeader className="border-b border-zinc-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#0b57d0] shadow-2xs">
                <User className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
                  Edit Delegate Profile
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Update your camp badge details, identity, and ministry preferences.
                </DialogDescription>
              </div>
            </div>

            <Badge variant="outline" className="text-[11px] font-mono bg-zinc-50">
              {camper.activation_code || 'VLC Delegate'}
            </Badge>
          </div>
        </DialogHeader>

        <EditProfileForm
          camper={camper}
          onProfileUpdated={onProfileUpdated}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
