import type { FC } from 'react';
import { User, ShieldCheck, Sparkles, CheckCircle2, Menu, Building2 } from 'lucide-react';
import type { AdminUser, CamperRegistration } from '../types';

interface HeaderProps {
  onLogoClick: () => void;
  onSignInClick: () => void;
  isAdminAuthenticated: boolean;
  currentUser?: AdminUser | null;
  currentCamper?: CamperRegistration | null;
  onCamperClick?: () => void;
  onActivateClick?: () => void;
  onOpenAdminDrawer?: () => void;
  onNavigateToChurches?: () => void;
  activeTab: 'dashboard' | 'churches' | 'admin';
}

export const Header: FC<HeaderProps> = ({
  onLogoClick,
  onSignInClick,
  isAdminAuthenticated,
  currentUser,
  currentCamper,
  onCamperClick,
  onActivateClick,
  onOpenAdminDrawer,
  onNavigateToChurches,
  activeTab,
}) => {
  const avatarSelfie = currentUser?.selfie_url || currentCamper?.selfie_url;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Admin Drawer Toggle (Admin Only) + Logo + Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdminAuthenticated && onOpenAdminDrawer && (
            <button
              onClick={onOpenAdminDrawer}
              title="Admin Menu (Left Drawer)"
              aria-label="Open Admin Menu"
              className="p-2 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer flex items-center justify-center -ml-1 sm:ml-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={onLogoClick}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-blue-100 transition-colors">
              ✝
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900">
                VLC <span className="text-blue-600">2027</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hidden xs:inline">
                PCCI Camp
              </span>
            </div>
          </div>

          {/* Navigation Link to Church Delegations */}
          {onNavigateToChurches && (
            <button
              onClick={onNavigateToChurches}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'churches'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Church Delegations</span>
            </button>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Arrival Fast Check-In Link */}
          {!isAdminAuthenticated && !currentCamper && onActivateClick && (
            <button
              onClick={onActivateClick}
              className="tap-pill hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200/80 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Arrived? Check In</span>
            </button>
          )}

          {/* Logged in as Admin / Staff */}
          {isAdminAuthenticated ? (
            <button
              onClick={onSignInClick}
              title={`Admin Portal (${currentUser?.name || 'Alexius'})`}
              aria-label="Admin Portal"
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all cursor-pointer shadow-xs ${activeTab === 'admin'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200'
                }`}
            >
              <div className="relative flex items-center justify-center">
                {avatarSelfie ? (
                  <img
                    src={avatarSelfie}
                    alt={currentUser?.name || 'Admin'}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/50 shadow-2xs"
                  />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                )}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full" />
              </div>
              <span className="text-xs font-semibold hidden sm:inline">
                {currentUser?.name || 'Alexius'}
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded hidden md:inline">
                {currentUser?.role || 'Admin'}
              </span>
            </button>
          ) : currentCamper ? (
            /* Logged in as Camper (Selfie Avatar Profile) */
            <button
              onClick={onCamperClick}
              title={`Camper Portal (${currentCamper.nickname})`}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#0b57d0] border border-[#d2e3fc] transition-all cursor-pointer shadow-2xs"
            >
              <div className="relative flex items-center justify-center">
                {currentCamper.selfie_url ? (
                  <img
                    src={currentCamper.selfie_url}
                    alt={currentCamper.nickname}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0b57d0]/40 shadow-2xs"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold text-xs">
                    {currentCamper.nickname.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#188038] text-white rounded-full p-0.5 ring-1 ring-white">
                  <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-900 hidden sm:inline">
                {currentCamper.nickname}
              </span>
              <span className="text-[10px] text-[#0b57d0] font-medium hidden md:inline">
                (My Pass)
              </span>
            </button>
          ) : (
            /* Not logged in: Single Sign-in Button */
            <button
              onClick={onSignInClick}
              title="Sign In to VLC 2027"
              aria-label="Sign In"
              className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
