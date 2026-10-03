import type { FC } from 'react';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  LogOut,
  Building2,
  Lock,
  CheckCircle2,
  QrCode,
  Mail,
} from 'lucide-react';
import type { CamperRegistration, AdminUser } from '../types';
import { EditProfileForm } from './EditProfileModal';

interface AccountPageProps {
  currentCamper: CamperRegistration | null;
  currentUser: AdminUser | null;
  onProfileUpdated: (updatedCamper: CamperRegistration) => void;
  onBack: () => void;
  onViewPublicProfile?: (camperId: string) => void;
  onOpenDigitalPass?: () => void;
  onOpenLogin: () => void;
  onSignOut: () => void;
  onNavigateToAdmin?: () => void;
}

export const AccountPage: FC<AccountPageProps> = ({
  currentCamper,
  currentUser,
  onProfileUpdated,
  onBack,
  onViewPublicProfile,
  onOpenDigitalPass,
  onOpenLogin,
  onSignOut,
  onNavigateToAdmin,
}) => {
  const isLoggedIn = Boolean(currentCamper || currentUser);

  // If not logged in, show access card
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-zinc-200/80 shadow-lg shadow-zinc-200/50 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0b57d0] flex items-center justify-center mx-auto shadow-xs border border-blue-100">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
              Sign In to View Account
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Please sign in with your pass code or leader credentials to review and edit your registration profile, badge selfie, and emergency care details.
            </p>
          </div>

          <div className="pt-3 flex flex-col gap-2.5">
            <button
              onClick={onOpenLogin}
              className="w-full py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
            <button
              onClick={onBack}
              className="w-full py-2.5 px-6 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If logged in as an Admin user without a camper pass
  if (!currentCamper && currentUser) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-xs font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-zinc-900">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Administrative Privileges Active</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              You are signed in under an administrative staff role with access to badge printing, on-arrival check-in desk, delegations, and camp settings.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Go to Admin Portal
              </button>
            )}
            <button
              onClick={onSignOut}
              className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Camper Account Page
  const camper = currentCamper!;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6 pb-28 animate-fadeIn space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-xs font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {onViewPublicProfile && camper.id && (
            <button
              onClick={() => camper.id && onViewPublicProfile(camper.id)}
              className="tap-pill px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0b57d0] text-xs font-semibold border border-blue-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>View Public Profile</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </button>
          )}

          {onOpenDigitalPass && (
            <button
              onClick={onOpenDigitalPass}
              className="tap-pill px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Digital Pass</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white p-6 sm:p-7 rounded-3xl border border-blue-100/80 shadow-xs relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Selfie Photo */}
            <div className="relative shrink-0">
              {camper.selfie_url ? (
                <img
                  src={camper.selfie_url}
                  alt={camper.nickname}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md">
                  {camper.nickname?.charAt(0) || 'C'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Names & Delegation */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight truncate">
                  {camper.full_name}
                </h1>
                <span className="text-xs text-blue-600 font-bold truncate">
                  (@{camper.nickname})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-600">
                <span className="flex items-center gap-1 truncate font-medium">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {camper.church_name || 'PCCI Delegation'}
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  {camper.activation_code || `VLC-${camper.id?.slice(-6).toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-start">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              {camper.role || 'Camper'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Account & Profile Form Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
        <div className="pb-5 mb-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Edit Account &amp; Registration Details</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Updates are instantly saved to your official conference delegate profile.
            </p>
          </div>
        </div>

        {/* Embedded Full EditProfileForm */}
        <EditProfileForm
          camper={camper}
          onProfileUpdated={onProfileUpdated}
        />
      </div>

      {/* Account Danger / Sign Out Section */}
      <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
            Account Session
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Sign out of this device if you are using a shared computer or tablet.
          </p>
        </div>

        <button
          onClick={onSignOut}
          className="tap-pill px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
