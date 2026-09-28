import { useEffect, type FC } from 'react';
import {
  QrCode,
  Users,
  Building2,
  LayoutDashboard,
  BookOpen,
  Calendar,
  X,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
  HardDrive,
  Printer
} from 'lucide-react';
import type { AdminUser } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export type AdminTab = 'arrival' | 'print_queue' | 'users' | 'churches' | 'events' | 'media' | 'overview' | 'campers';

interface AdminLeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser | null;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onReturnToSite: () => void;
  onSignOut: () => void;
}

export const AdminLeftDrawer: FC<AdminLeftDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeTab,
  onSelectTab,
  onReturnToSite,
  onSignOut,
}) => {
  // Enforce access control: only users with admin/staff roles can view drawer
  const isAdminOrStaff = Boolean(
    currentUser && ['admin', 'staff', 'coordinator'].includes(currentUser.role)
  );

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

  // Lock background scroll when open
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

  if (!isOpen || !isAdminOrStaff || !currentUser) {
    return null;
  }

  const navItems: Array<{
    id: AdminTab;
    label: string;
    description: string;
    icon: typeof QrCode;
    badgeColor?: string;
    badgeText?: string;
  }> = [
      {
        id: 'arrival',
        label: 'Arrival Desk',
        description: 'Check-in scanner & kit distribution',
        icon: QrCode,
        badgeText: 'Live Desk',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        id: 'print_queue',
        label: 'ID Printing Queue',
        description: 'Batch badge printer & reprint tracking',
        icon: Printer,
        badgeText: 'Badges',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        id: 'users',
        label: 'User Management',
        description: 'Manage roles & promote delegates',
        icon: Users,
      },
      {
        id: 'churches',
        label: 'Churches & Delegations',
        description: 'Quotas, cities & synced centers',
        icon: Building2,
      },
      {
        id: 'events',
        label: 'Camp Event & Schedule',
        description: 'Entity metadata & session builder',
        icon: Calendar,
        badgeText: 'Dynamic',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        id: 'media',
        label: 'Media Vault (R2)',
        description: 'Cloudflare R2 images & video library',
        icon: HardDrive,
        badgeText: 'R2 Cloud',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      {
        id: 'overview',
        label: 'Camp Overview',
        description: 'Live statistics & recent signups',
        icon: LayoutDashboard,
      },
      {
        id: 'campers',
        label: 'Registered Campers',
        description: 'Delegate roster & scripture verses',
        icon: BookOpen,
      },
    ];

  const handleItemClick = (tabId: AdminTab) => {
    onSelectTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Slide-out Left Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 border-r border-zinc-200 animate-in slide-in-from-left duration-250 ease-out">
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <img src="https://pcci-53421.wasmer.app/images/pcci-wordmark.png" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-zinc-900">
                  VLC <span className="text-blue-600">2027</span>
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-zinc-900 border-zinc-300">
                  Admin
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500">Management &amp; Leadership Suite</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Chip */}
        <div className="px-5 py-4 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-zinc-900 truncate">
                  {currentUser.name}
                </span>
                <Badge variant="secondary" className="text-[10px] capitalize font-semibold px-1.5 py-0">
                  <ShieldCheck className="w-2.5 h-2.5 mr-0.5 text-emerald-600 inline" />
                  {currentUser.role}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Admin Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${isActive
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-900'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs truncate">
                        {item.label}
                      </span>
                      {item.badgeText && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${isActive
                            ? 'bg-zinc-800 text-emerald-400 border-zinc-700'
                            : item.badgeColor || 'bg-zinc-100 text-zinc-600'
                          }`}>
                          {item.badgeText}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-zinc-400 translate-x-0.5' : 'text-zinc-300 group-hover:text-zinc-500'
                  }`} />
              </button>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50/70 space-y-2">
          <Button
            variant="outline"
            onClick={() => {
              onReturnToSite();
              onClose();
            }}
            className="w-full justify-start gap-2 h-9 text-xs text-zinc-700 bg-white hover:bg-zinc-100 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            <span>Public Registration Site</span>
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="w-full justify-start gap-2 h-9 text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock &amp; Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
