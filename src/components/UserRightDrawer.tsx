import { useEffect, type FC } from 'react';
import {
  X,
  User,
  UserCog,
  QrCode,
  LogOut,
  Building2,
  ShieldCheck,
  ChevronRight,
  Flame,
  CheckCircle2,
  Music,
} from 'lucide-react';
import type { CamperRegistration, AdminUser } from '../types';
import { useLanguage } from '../lib/i18n';
import { LanguageSelector } from './LanguageSelector';

export interface UserRightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  camper?: CamperRegistration | null;
  adminUser?: AdminUser | null;
  isAdminAuthenticated?: boolean;
  onViewProfile?: () => void;
  onOpenAccount?: () => void;
  onOpenDigitalPass?: () => void;
  onOpenMusic?: () => void;
  onSignOut: () => void;
  onOpenAdmin?: () => void;
}

export const UserRightDrawer: FC<UserRightDrawerProps> = ({
  isOpen,
  onClose,
  camper,
  adminUser,
  isAdminAuthenticated = false,
  onViewProfile,
  onOpenAccount,
  onOpenDigitalPass,
  onOpenMusic,
  onSignOut,
  onOpenAdmin,
}) => {
  const { t } = useLanguage();

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

  // Lock body scroll when drawer is open
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

  const displayName =
    camper?.full_name ||
    camper?.nickname ||
    adminUser?.name ||
    adminUser?.nickname ||
    'VLC Delegate';

  const selfieUrl = camper?.selfie_url || adminUser?.selfie_url || null;
  const email = camper?.email || adminUser?.email || '';
  const churchName = camper?.church_name || adminUser?.church_name || '';
  const roleName = adminUser?.role || camper?.role || (isAdminAuthenticated ? 'Administrator' : 'Camper');
  const isAdmin = Boolean(
    isAdminAuthenticated ||
    adminUser ||
    camper?.role === 'admin' ||
    camper?.role === 'staff' ||
    camper?.role === 'coordinator' ||
    camper?.is_admin
  );

  const registrationCode =
    camper?.activation_code ||
    (camper?.id ? `VLC-${camper.id.slice(-6).toUpperCase()}` : null);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm sm:max-w-md bg-slate-950/95 border-l border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="User account drawer"
      >
        {/* Top Sticky Header */}
        <div className="px-5 pt-4 pb-1 sm:px-6 sm:pt-5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
            title={t('drawer.close')}
            aria-label={t('drawer.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Identity & Profile Hero Card */}
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-36 h-36 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              {/* User Selfie Photo or Initials */}
              <div className="relative shrink-0">
                {selfieUrl ? (
                  <img
                    src={selfieUrl}
                    alt={displayName}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-500/60 shadow-xl shadow-blue-500/30"
                  />
                ) : (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/40">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Active Online Indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Name & Delegation Info */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-lg sm:text-xl font-black text-white truncate leading-tight">
                  {displayName}
                </h3>
                {camper?.nickname && camper?.full_name && (
                  <p className="text-xs text-blue-400 font-semibold truncate">
                    @{camper.nickname}
                  </p>
                )}
                {email && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {email}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {roleName}
                  </span>
                  {registrationCode && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-zinc-300 border border-white/10">
                      {registrationCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Church Delegation Banner */}
            {churchName && (
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center gap-2 text-xs text-zinc-300">
                <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate font-medium">{churchName}</span>
              </div>
            )}
          </div>

          {/* Navigation Action Options */}
          <div className="space-y-3">
            {/* 1. DIGITAL PASS (Primary Highlighted Option) */}
            <button
              onClick={() => {
                onClose();
                onOpenDigitalPass?.();
              }}
              className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-blue-600/25 via-indigo-600/20 to-blue-600/10 border border-blue-500/40 hover:border-blue-400 hover:from-blue-600/35 hover:to-indigo-600/30 transition-all group cursor-pointer flex items-center justify-between shadow-lg shadow-blue-500/10"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform shrink-0">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {t('drawer.digitalPass')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Ready
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {t('drawer.digitalPassDesc')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            {/* 2. MY PROFILE */}
            <button
              onClick={() => {
                onClose();
                onViewProfile?.();
              }}
              className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors block">
                    {t('drawer.myProfile')}
                  </span>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {t('drawer.myProfileDesc')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            {/* 3. PRAISE & MUSIC PLAYER */}
            <button
              onClick={() => {
                onClose();
                onOpenMusic?.();
              }}
              className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-[#1db954]/20 via-[#1db954]/10 to-transparent border border-[#1db954]/30 hover:border-[#1db954]/70 hover:from-[#1db954]/30 transition-all group cursor-pointer flex items-center justify-between shadow-lg shadow-[#1db954]/5"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#1db954]/25 text-[#1db954] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-[#1db954]/40">
                  <Music className="w-5 h-5 fill-[#1db954]/30" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-[#1db954] transition-colors block">
                      Praise &amp; Music Player
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#1db954]/20 text-[#1db954] border border-[#1db954]/30">
                      Spotify Style
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    Stream camp anthems, worship sets &amp; playlists
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#1db954]/70 group-hover:text-[#1db954] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            {/* 3. ACCOUNT & SETTINGS */}
            <button
              onClick={() => {
                onClose();
                onOpenAccount?.();
              }}
              className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <UserCog className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors block">
                    {t('drawer.account')}
                  </span>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {t('drawer.accountDesc')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            {/* 4. ADMIN PAGES (Extra Link for Admin Users) */}
            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin?.();
                }}
                className="w-full text-left p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-400 transition-all group cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors block">
                        {t('drawer.adminPortal')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Admin Only
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {t('drawer.adminPortalDesc')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Sticky Action Footer with Language Selector & Logout */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-slate-950/80 space-y-4">
          {/* Language Selection */}
          <LanguageSelector variant="drawer" />

          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/50 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>{t('drawer.logout')}</span>
          </button>

          <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500/70" />
            <span>Victory Leadership Camp 2027 • Buag Campgrounds</span>
          </p>
        </div>
      </aside>
    </>
  );
};
