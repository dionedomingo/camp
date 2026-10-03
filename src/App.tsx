import { useState, useEffect } from 'react';
import { Header, type AppTab } from './components/Header';
import { FestiventLandingPage } from './components/FestiventLandingPage';
import { OfficialSchedulePage } from './components/OfficialSchedulePage';
import { LiveDashboard } from './components/LiveDashboard';
import { ChurchDirectory } from './components/ChurchDirectory';
import { AdminPortal } from './components/AdminPortal';
import { UnifiedLoginModal } from './components/UnifiedLoginModal';
import { AgenticSignupModal } from './components/AgenticSignup/AgenticSignupModal';
import { InviteFriendModal } from './components/InviteFriendModal';
import { CamperActivationModal } from './components/CamperActivationModal';
import { CamperHubModal, type CamperHubTab } from './components/CamperHubModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { PublicCamperProfilePage } from './components/PublicCamperProfilePage';
import { CommunityFeed } from './components/CommunityFeed';
import { AdminLeftDrawer, type AdminTab } from './components/AdminLeftDrawer';
import { UserRightDrawer } from './components/UserRightDrawer';
import { DigitalPassModal } from './components/DigitalPassModal';
import { CampMusicPlayerPage } from './components/music/CampMusicPlayerPage';
import { AccountPage } from './components/AccountPage';
import { GlobalMiniPlayer } from './components/music/GlobalMiniPlayer';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import type { Church, RegistrationStats, CamperRegistration, AdminUser, CampEvent } from './types';
import { apiService } from './services/api';

export function App() {
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [activeEvent, setActiveEvent] = useState<CampEvent | null>(null);
  const [churches, setChurches] = useState<Church[]>([]);
  const [activeChurch, setActiveChurch] = useState<Church | null>(null);
  // Dedicated SPA routing supporting /, /schedule, /join, /overview, /admin, and /camper/:id
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.startsWith('/camper/')) {
        return 'profile';
      }
      if (pathname === '/feed' || pathname === '/community') {
        return 'feed';
      }
      if (pathname === '/account' || pathname === '/settings' || pathname === '/profile/edit') {
        return 'account';
      }
      if (pathname === '/music' || pathname === '/praise' || pathname === '/worship' || pathname === '/player') {
        return 'music';
      }
      if (pathname === '/join' || pathname === '/join/' || pathname.startsWith('/join/') || pathname === '/churches') {
        return 'churches';
      }
      if (pathname === '/overview' || pathname === '/dashboard') {
        return 'dashboard';
      }
      if (pathname === '/admin') {
        return 'admin';
      }
      if (pathname === '/schedule') {
        return 'schedule';
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('church')) {
        return 'churches';
      }
      const isAdmin = sessionStorage.getItem('vlc_admin_authenticated') === 'true';
      if (isAdmin && pathname === '/') return 'admin';
    }
    return 'home';
  });

  // Track previous tab for smooth fullscreen player minimize return
  const [previousTab, setPreviousTab] = useState<AppTab>('home');

  const navigateToTab = (tab: AppTab, options?: { churchSlug?: string; camperId?: string; replace?: boolean }) => {
    if (tab === 'music' && activeTab !== 'music') {
      setPreviousTab(activeTab);
    }
    setActiveTab(tab);
    if (typeof window === 'undefined') return;

    let targetPath = '/';
    if (tab === 'home') {
      targetPath = '/';
    } else if (tab === 'schedule') {
      targetPath = '/schedule';
    } else if (tab === 'churches') {
      targetPath = options?.churchSlug ? `/join?church=${options.churchSlug}` : '/join';
    } else if (tab === 'dashboard') {
      targetPath = '/overview';
    } else if (tab === 'admin') {
      targetPath = '/admin';
    } else if (tab === 'feed') {
      targetPath = '/feed';
    } else if (tab === 'music') {
      targetPath = '/music';
    } else if (tab === 'account') {
      targetPath = '/account';
    } else if (tab === 'profile') {
      targetPath = options?.camperId ? `/camper/${options.camperId}` : '/camper';
    }

    const currentPathWithSearch = window.location.pathname + window.location.search;
    if (currentPathWithSearch !== targetPath) {
      if (options?.replace) {
        window.history.replaceState({ tab }, '', targetPath);
      } else {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  const handleMinimizeMusic = () => {
    const returnTab = previousTab === 'music' ? 'home' : previousTab;
    navigateToTab(returnTab);
  };

  // Camper user state
  const [currentCamper, setCurrentCamper] = useState<CamperRegistration | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('vlc_camper_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isCamperHubOpen, setIsCamperHubOpen] = useState(false);
  const [camperHubTab, setCamperHubTab] = useState<CamperHubTab>('pass');
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [isDigitalPassModalOpen, setIsDigitalPassModalOpen] = useState(false);

  // Camper On-Arrival Activation Modal state
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationToken, setActivationToken] = useState('');

  // Unified authentication state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('vlc_admin_authenticated') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('vlc_admin_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    if (sessionStorage.getItem('vlc_admin_authenticated') === 'true') {
      return {
        id: 'usr_admin_alexius',
        name: 'Alexius',
        email: 'alexius@pcci.ph',
        role: 'admin',
        is_active: 1,
      };
    }
    return null;
  });

  // Admin Drawer & Tab state
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('arrival');

  // Modals state
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [lastRegisteredCamper, setLastRegisteredCamper] = useState<CamperRegistration | null>(null);
  const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (
        params.get('reset_token') ||
        params.get('resetToken') ||
        (!params.get('activate_token') && !params.get('code') && !params.get('activate') ? params.get('token') : null) ||
        null
      );
    }
    return null;
  });
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(
        params.get('reset_token') ||
        params.get('resetToken') ||
        (!params.get('activate_token') && !params.get('code') && !params.get('activate') && params.get('token'))
      );
    }
    return false;
  });

  // Public Camper Profile Modal state (camper/:id or ?camper=:id)
  const [selectedCamperProfileId, setSelectedCamperProfileId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/camper/')) {
        const id = pathname.replace('/camper/', '').split('/')[0]?.split('?')[0];
        if (id) return id;
      }
      const params = new URLSearchParams(window.location.search);
      return params.get('camper') || null;
    }
    return null;
  });

  // Load initial stats & churches + handle URL parameters (church slug, activation token/code, reset token, camper profile)
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.startsWith('/camper/')) {
        const id = pathname.replace('/camper/', '').split('/')[0]?.split('?')[0];
        setSelectedCamperProfileId(id || null);
      } else {
        const params = new URLSearchParams(window.location.search);
        setSelectedCamperProfileId(params.get('camper') || null);
      }

      // Sync active tab with browser URL history
      if (pathname.startsWith('/camper/')) {
        setActiveTab('profile');
      } else if (pathname === '/account' || pathname === '/settings' || pathname === '/profile/edit') {
        setActiveTab('account');
      } else if (pathname === '/feed' || pathname === '/community') {
        setActiveTab('feed');
      } else if (pathname === '/music' || pathname === '/praise' || pathname === '/worship' || pathname === '/player') {
        setActiveTab((curr) => {
          if (curr !== 'music') setPreviousTab(curr);
          return 'music';
        });
      } else if (pathname === '/join' || pathname === '/join/' || pathname.startsWith('/join/') || pathname === '/churches') {
        setActiveTab('churches');
      } else if (pathname === '/overview' || pathname === '/dashboard') {
        setActiveTab('dashboard');
      } else if (pathname === '/admin') {
        setActiveTab('admin');
      } else if (pathname === '/schedule') {
        setActiveTab('schedule');
      } else if (pathname === '/' || pathname === '') {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);

    const initData = async () => {
      // 1. Fetch churches
      const churchList = await apiService.getChurches();
      setChurches(churchList);

      // 2. Check URL search params for church invite link or arrival activation
      const params = new URLSearchParams(window.location.search);
      const churchSlug = params.get('church');
      if (churchSlug) {
        const matched = churchList.find((c) => c.slug.toLowerCase() === churchSlug.toLowerCase());
        if (matched) {
          setActiveChurch(matched);
          setActiveTab('churches');
        }
      }

      // Check for on-arrival QR code activation in URL
      const hasResetTokenParam = Boolean(params.get('reset_token') || params.get('resetToken'));
      const tokenParam = params.get('activate_token') || (!hasResetTokenParam ? params.get('token') : null);
      const codeParam = params.get('code') || params.get('activate');
      if (tokenParam || codeParam) {
        if (tokenParam && !hasResetTokenParam) setActivationToken(tokenParam);
        if (codeParam) setActivationCode(codeParam);
        if (tokenParam || codeParam) setIsActivationOpen(true);
      }

      // Check for password reset token in URL (?reset_token=... or ?resetToken=... or ?token=...)
      const resetTokenParam =
        params.get('reset_token') ||
        params.get('resetToken') ||
        (!codeParam && !params.get('activate_token') ? params.get('token') : null);
      if (resetTokenParam) {
        setResetPasswordToken(resetTokenParam);
        setIsResetPasswordOpen(true);
      }

      // 3. Fetch live statistics & active event info
      const [liveStats, eventRes] = await Promise.all([
        apiService.getStats(),
        apiService.getEvents('vlc-2027'),
      ]);
      setStats(liveStats);
      if (eventRes.active_event) {
        setActiveEvent(eventRes.active_event);
      }
    };

    initData();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Refresh live statistics and active event when updates happen
  const refreshStats = async () => {
    const [updated, eventRes] = await Promise.all([
      apiService.getStats(),
      apiService.getEvents('vlc-2027'),
    ]);
    setStats(updated);
    if (eventRes.active_event) {
      setActiveEvent(eventRes.active_event);
    }
  };

  const handleStartSignup = (church?: Church, event?: CampEvent) => {
    if (currentCamper || currentUser || isAdminAuthenticated) {
      return;
    }
    if (church) {
      setActiveChurch(church);
    }
    if (event) {
      setActiveEvent(event);
    }
    setIsSignupOpen(true);
  };

  const handleCamperRegistered = (newCamper: CamperRegistration) => {
    setLastRegisteredCamper(newCamper);
    refreshStats();
  };

  const handleOpenInviteModal = (camper: CamperRegistration) => {
    setLastRegisteredCamper(camper);
    setIsInviteModalOpen(true);
  };

  // Public camper profile modal handlers (route /camper/:id)
  const handleOpenCamperProfile = (camperId: string) => {
    setSelectedCamperProfileId(camperId);
    navigateToTab('profile', { camperId });
  };

  const handleCloseCamperProfile = () => {
    setSelectedCamperProfileId(null);
    navigateToTab('churches');
  };

  const handleJoinDelegationFromProfile = (churchId: string) => {
    if (currentCamper || currentUser || isAdminAuthenticated) {
      return;
    }
    handleCloseCamperProfile();
    const church = churches.find((c) => c.id === churchId);
    if (church) {
      setActiveChurch(church);
      navigateToTab('churches', { churchSlug: church.slug });
      handleStartSignup(church);
    } else {
      navigateToTab('churches');
      handleStartSignup();
    }
  };

  // Camper authentication & activation handlers
  const handleCamperActivationSuccess = (camper: CamperRegistration) => {
    setCurrentCamper(camper);
    setIsActivationOpen(false);
    setIsCamperHubOpen(true);
    refreshStats();
  };

  const handleLoginSuccess = (user: CamperRegistration) => {
    const isAdminOrStaff = user.role === 'admin' || user.role === 'staff' || user.role === 'coordinator' || Boolean(user.is_admin);

    if (isAdminOrStaff) {
      const adminUser: AdminUser = {
        id: user.id || 'usr_admin',
        name: user.full_name || user.nickname,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        church_id: user.church_id,
        church_name: user.church_name,
        selfie_url: user.selfie_url,
        is_active: user.is_active ?? 1,
        last_login_at: user.last_login_at || new Date().toISOString(),
      };
      setCurrentUser(adminUser);
      setIsAdminAuthenticated(true);
      setCurrentCamper(user);
      navigateToTab('admin');
    } else {
      setCurrentCamper(user);
      setIsAdminAuthenticated(false);
      setCurrentUser(null);
      setIsCamperHubOpen(true);
    }
    setIsLoginOpen(false);
  };

  const handleCamperSignOut = () => {
    sessionStorage.removeItem('vlc_camper_user');
    sessionStorage.removeItem('vlc_user');
    setCurrentCamper(null);
    setIsCamperHubOpen(false);
  };

  const handleProfileUpdated = (updated: CamperRegistration) => {
    setCurrentCamper(updated);
    sessionStorage.setItem('vlc_camper_user', JSON.stringify(updated));
    refreshStats();
  };

  const handleOpenAuth = () => {
    if (isAdminAuthenticated) {
      navigateToTab(activeTab === 'admin' ? 'schedule' : 'admin');
    } else if (currentCamper) {
      setIsCamperHubOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleExitAdmin = () => {
    sessionStorage.removeItem('vlc_admin_authenticated');
    sessionStorage.removeItem('vlc_admin_user');
    sessionStorage.removeItem('vlc_camper_user');
    sessionStorage.removeItem('vlc_user');
    setCurrentUser(null);
    setCurrentCamper(null);
    setIsAdminAuthenticated(false);
    setIsAdminDrawerOpen(false);
    navigateToTab('home'); // Return to home landing page
  };

  const handleOpenCamperHubWithTab = (tab: CamperHubTab = 'pass') => {
    setCamperHubTab(tab);
    setIsCamperHubOpen(true);
  };

  const handleSignOutUnified = () => {
    if (isAdminAuthenticated) {
      handleExitAdmin();
    } else {
      handleCamperSignOut();
    }
  };

  const activeCamperForPass: CamperRegistration | null = currentCamper || (currentUser ? {
    id: currentUser.id,
    full_name: currentUser.name,
    nickname: currentUser.nickname || currentUser.name,
    email: currentUser.email,
    church_name: currentUser.church_name || 'Camp Administration',
    role: 'admin',
    phone: '',
    province: 'Nueva Vizcaya',
    emergency_name: 'Camp Administration',
    emergency_phone: '',
    emergency_relation: 'Administration',
    ministry_interests: ['Leadership', 'Operations'],
    favorite_verse: 'Isaiah 60:1',
    verse_reflection: 'Arise, shine, for your light has come, and the glory of the LORD rises upon you.',
    selfie_url: currentUser.selfie_url,
    status: 'activated',
    checked_in_at: new Date().toISOString(),
    activation_code: 'ADMIN-PASS',
  } as CamperRegistration : null);

  return (
    <MusicPlayerProvider currentCamper={currentCamper}>
      <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] flex flex-col font-sans selection:bg-[#c2e7ff] selection:text-[#001d35]">
      {/* Top Fixed Header with Schedule, Overview, Churches, and Sign-in */}
      {activeTab !== 'home' && activeTab !== 'music' && (
        <Header
          onLogoClick={() => navigateToTab(isAdminAuthenticated ? 'admin' : 'home')}
          onSignInClick={() => {
            if (isAdminAuthenticated || currentCamper) {
              setIsUserDrawerOpen(true);
            } else {
              handleOpenAuth();
            }
          }}
          isAdminAuthenticated={isAdminAuthenticated}
          currentUser={currentUser}
          currentCamper={currentCamper}
          onCamperClick={() => setIsUserDrawerOpen(true)}
          onActivateClick={() => setIsActivationOpen(true)}
          onOpenAdminDrawer={() => setIsAdminDrawerOpen(true)}
          onNavigateToHome={() => navigateToTab('home')}
          onNavigateToSchedule={() => navigateToTab('schedule')}
          onNavigateToOverview={() => navigateToTab('dashboard')}
          onNavigateToChurches={() => navigateToTab('churches')}
          onNavigateToFeed={() => navigateToTab('feed')}
          onNavigateToMusic={() => navigateToTab('music')}
          activeTab={activeTab}
        />
      )}

      {/* Main Content Area */}
      <main className={activeTab === 'home' || activeTab === 'music' ? 'flex-1 w-full p-0 m-0 max-w-none' : 'flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8'}>
        {/* Festivent-Inspired Full-Width Hero Landing Page (Default for /) */}
        {activeTab === 'home' && (
          <FestiventLandingPage
            event={activeEvent}
            stats={stats}
            churches={churches}
            onStartSignup={(church, event) => handleStartSignup(church, event)}
            onNavigateToSchedule={() => navigateToTab('schedule')}
            onNavigateToChurches={() => navigateToTab('churches')}
            onOpenActivation={() => setIsActivationOpen(true)}
            onOpenLogin={handleOpenAuth}
            currentCamper={currentCamper}
            currentUser={currentUser}
            onSignOut={handleSignOutUnified}
            onViewCamperProfile={handleOpenCamperProfile}
            onOpenDigitalPass={() => setIsDigitalPassModalOpen(true)}
            onOpenAccount={() => navigateToTab('account')}
            onNavigateToAdmin={() => navigateToTab('admin')}
            onOpenUserDrawer={() => setIsUserDrawerOpen(true)}
          />
        )}

        {/* Official Schedule & Upcoming Gatherings */}
        {activeTab === 'schedule' && (
          <OfficialSchedulePage
            currentCamper={currentCamper}
            currentUser={currentUser}
            activeChurch={activeChurch}
            churches={churches}
            stats={stats}
            onStartSignup={(church, event) => handleStartSignup(church, event)}
            onSelectChurch={(church) => {
              setActiveChurch(church);
              handleStartSignup(church);
            }}
            onNavigateToOverview={() => navigateToTab('dashboard')}
            onNavigateToChurches={() => navigateToTab('churches')}
            onOpenCamperHub={() => setIsCamperHubOpen(true)}
            onOpenActivation={() => setIsActivationOpen(true)}
            onViewCamperProfile={handleOpenCamperProfile}
            onNavigateToAdmin={() => navigateToTab('admin')}
          />
        )}

        {/* Camp Overview & Keynote Speakers Page */}
        {activeTab === 'dashboard' && (
          <LiveDashboard
            stats={stats}
            activeChurch={activeChurch}
            activeEvent={activeEvent}
            churches={churches}
            onStartSignup={handleStartSignup}
            onSelectChurch={(church) => {
              setActiveChurch(church);
              handleStartSignup(church);
            }}
            onNavigateToChurches={() => navigateToTab('churches')}
            onNavigateToSchedule={() => navigateToTab('schedule')}
            onViewCamperProfile={handleOpenCamperProfile}
            currentCamper={currentCamper}
            currentUser={currentUser}
            onOpenDigitalPass={() => setIsDigitalPassModalOpen(true)}
            onNavigateToAdmin={() => navigateToTab('admin')}
          />
        )}

        {/* Church Delegations Directory */}
        {activeTab === 'churches' && (
          <ChurchDirectory
            churches={churches}
            stats={stats}
            activeChurch={activeChurch}
            onSelectChurch={(c) => setActiveChurch(c)}
            onStartSignup={(c) => {
              setActiveChurch(c);
              handleStartSignup(c);
            }}
            onBackToHome={() => navigateToTab('schedule')}
            onViewCamperProfile={handleOpenCamperProfile}
            currentCamper={currentCamper}
            currentUser={currentUser}
          />
        )}

        {/* Admin Portal */}
        {activeTab === 'admin' && (
          isAdminAuthenticated ? (
            <AdminPortal
              currentUser={currentUser}
              churches={churches}
              stats={stats}
              onChurchesUpdated={async () => {
                const updatedList = await apiService.getChurches();
                setChurches(updatedList);
                refreshStats();
              }}
              onExitAdmin={handleExitAdmin}
              onReturnToSite={() => navigateToTab('schedule')}
              activeAdminTab={activeAdminTab}
              onSelectAdminTab={(tab) => {
                setActiveAdminTab(tab);
                navigateToTab('admin');
              }}
              onOpenDrawer={() => setIsAdminDrawerOpen(true)}
            />
          ) : (
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-zinc-200 shadow-sm max-w-md mx-auto my-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center mx-auto text-xl shadow-xs">
                🔒
              </div>
              <h2 className="text-xl font-bold text-zinc-900">Admin Access Required</h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Management portal is restricted to authorized personnel. Please sign in with your administrator account (Alexius) to proceed.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="tap-pill px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Sign In (Alexius)
                </button>
                <button
                  onClick={() => navigateToTab('schedule')}
                  className="tap-pill px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium cursor-pointer"
                >
                  Return to Schedule
                </button>
              </div>
            </div>
          )
        )}

        {/* Public Camper Profile Page */}
        {activeTab === 'profile' && (
          <PublicCamperProfilePage
            camperId={selectedCamperProfileId}
            onBack={handleCloseCamperProfile}
            onJoinDelegation={handleJoinDelegationFromProfile}
            onNavigateToAccount={() => navigateToTab('account')}
            onNavigateToCamper={handleOpenCamperProfile}
            currentCamper={currentCamper}
            currentUser={currentUser}
          />
        )}

        {/* Dedicated Account & Profile Details Page */}
        {activeTab === 'account' && (
          <AccountPage
            currentCamper={currentCamper}
            currentUser={currentUser}
            onProfileUpdated={handleProfileUpdated}
            onBack={() => {
              if (currentCamper?.id) {
                navigateToTab('profile', { camperId: currentCamper.id });
              } else {
                navigateToTab('schedule');
              }
            }}
            onViewPublicProfile={(camperId) => {
              setSelectedCamperProfileId(camperId);
              navigateToTab('profile', { camperId });
            }}
            onOpenDigitalPass={() => setIsDigitalPassModalOpen(true)}
            onOpenLogin={handleOpenAuth}
            onSignOut={handleSignOutUnified}
            onNavigateToAdmin={() => navigateToTab('admin')}
          />
        )}

        {/* Community Feed & Camper Media Hub */}
        {activeTab === 'feed' && (
          <CommunityFeed
            currentCamper={currentCamper}
            onNavigateToCamper={(camperId) => {
              setSelectedCamperProfileId(camperId);
              navigateToTab('profile', { camperId });
            }}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {/* Camp Praise & Worship Music Player */}
        {activeTab === 'music' && (
          <CampMusicPlayerPage
            currentCamper={currentCamper}
            currentUser={currentUser}
            onOpenLogin={handleOpenAuth}
            onOpenDigitalPass={() => setIsDigitalPassModalOpen(true)}
            onMinimize={handleMinimizeMusic}
            onOpenUserDrawer={() => setIsUserDrawerOpen(true)}
          />
        )}
      </main>

      {/* Clean Minimalist Footer */}
      {activeTab !== 'music' && (
        <footer className="border-t border-zinc-200/80 bg-white py-8 px-4 text-center text-xs text-zinc-500 space-y-2">
          <p>
            <strong className="text-zinc-900">VLC 2027</strong> &bull; Vision &amp; Leadership Camp &bull; <em>&ldquo;Arise &amp; Shine&rdquo; (Isaiah 60:1)</em>
          </p>
          <p>
            Organized by Pentecostal Christian Church Incorporated (PCCI) &bull; National Office: Bambang, Nueva Vizcaya
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-zinc-400">
            <span>Powered by Cloudflare Pages &amp; D1 SQLite</span>
            <span>&bull;</span>
            <span>Theme: &ldquo;Arise &amp; Shine&rdquo; (Isaiah 60:1)</span>
          </div>
        </footer>
      )}

      {/* Unified Single Login Modal (for both Campers and Admins) */}
      <UnifiedLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onOpenActivation={() => setIsActivationOpen(true)}
        onOpenSignup={() => handleStartSignup()}
        onForgotPassword={() => {
          setIsLoginOpen(false);
          setResetPasswordToken(null);
          setIsResetPasswordOpen(true);
        }}
      />

      {/* Password Reset Modal */}
      <ResetPasswordModal
        key={resetPasswordToken || (isResetPasswordOpen ? 'open' : 'closed')}
        isOpen={isResetPasswordOpen}
        onClose={() => {
          setIsResetPasswordOpen(false);
          setResetPasswordToken(null);
          // Clean reset_token / resetToken / token query parameter from URL cleanly
          if (typeof window !== 'undefined' && window.location.search) {
            const url = new URL(window.location.href);
            url.searchParams.delete('reset_token');
            url.searchParams.delete('resetToken');
            if (!url.searchParams.has('code') && !url.searchParams.has('activate_token')) {
              url.searchParams.delete('token');
            }
            window.history.replaceState({}, document.title, url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
          }
        }}
        onBackToLogin={() => {
          setIsResetPasswordOpen(false);
          setResetPasswordToken(null);
          if (typeof window !== 'undefined' && window.location.search) {
            const url = new URL(window.location.href);
            url.searchParams.delete('reset_token');
            url.searchParams.delete('resetToken');
            if (!url.searchParams.has('code') && !url.searchParams.has('activate_token')) {
              url.searchParams.delete('token');
            }
            window.history.replaceState({}, document.title, url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
          }
          setIsLoginOpen(true);
        }}
        initialToken={resetPasswordToken}
      />

      {/* Camper On-Arrival Activation Modal */}
      <CamperActivationModal
        key={`${activationCode}_${activationToken}_${isActivationOpen}`}
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
        initialCode={activationCode}
        initialToken={activationToken}
        onSuccess={handleCamperActivationSuccess}
      />

      {/* Camper Hub / Portal Modal */}
      <CamperHubModal
        isOpen={isCamperHubOpen}
        onClose={() => setIsCamperHubOpen(false)}
        camper={currentCamper}
        onSignOut={handleCamperSignOut}
        onInviteFriend={() => currentCamper && handleOpenInviteModal(currentCamper)}
        onProfileUpdated={handleProfileUpdated}
        onNavigateToSchedule={() => setActiveTab('schedule')}
        onViewCamperProfile={handleOpenCamperProfile}
        initialTab={camperHubTab}
      />

      {/* Agentic Signup Modal Wizard */}
      <AgenticSignupModal
        key={activeChurch?.id || 'general'}
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        initialChurch={activeChurch}
        allChurches={churches}
        activeEvent={activeEvent}
        onComplete={handleCamperRegistered}
        onOpenInviteModal={handleOpenInviteModal}
      />

      {/* Post-Signup Viral Friend Invite Modal */}
      {lastRegisteredCamper && (
        <InviteFriendModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          camper={lastRegisteredCamper}
        />
      )}

      {/* Admin Navigation Left Drawer - Accessible only by users with admin roles */}
      {isAdminAuthenticated && (
        <AdminLeftDrawer
          isOpen={isAdminDrawerOpen}
          onClose={() => setIsAdminDrawerOpen(false)}
          currentUser={currentUser}
          activeTab={activeAdminTab}
          onSelectTab={(tab) => {
            setActiveAdminTab(tab);
            setActiveTab('admin');
            setIsAdminDrawerOpen(false);
          }}
          onReturnToSite={() => {
            setIsAdminDrawerOpen(false);
            setActiveTab('schedule');
          }}
          onOpenMusic={() => {
            setIsAdminDrawerOpen(false);
            navigateToTab('music');
          }}
          onSignOut={() => {
            setIsAdminDrawerOpen(false);
            handleExitAdmin();
          }}
        />
      )}

      {/* User Right Drawer for all pages (both campers & admins, with extra link for admins) */}
      <UserRightDrawer
        isOpen={isUserDrawerOpen}
        onClose={() => setIsUserDrawerOpen(false)}
        camper={currentCamper}
        adminUser={currentUser}
        isAdminAuthenticated={isAdminAuthenticated}
        onViewProfile={() => {
          if (currentCamper?.id) {
            handleOpenCamperProfile(currentCamper.id);
          } else {
            handleOpenCamperHubWithTab('profile');
          }
        }}
        onOpenAccount={() => {
          setIsUserDrawerOpen(false);
          navigateToTab('account');
        }}
        onOpenDigitalPass={() => setIsDigitalPassModalOpen(true)}
        onOpenMusic={() => {
          setIsUserDrawerOpen(false);
          navigateToTab('music');
        }}
        onSignOut={handleSignOutUnified}
        onOpenAdmin={() => {
          setIsUserDrawerOpen(false);
          navigateToTab('admin');
        }}
      />

      {/* Dedicated Digital Pass Modal - solely displays the digital pass with minimized scripture & expandable option */}
      <DigitalPassModal
        isOpen={isDigitalPassModalOpen}
        onClose={() => setIsDigitalPassModalOpen(false)}
        camper={activeCamperForPass}
        onActivatePass={() => setIsActivationOpen(true)}
        onInviteFriend={() => currentCamper && handleOpenInviteModal(currentCamper)}
      />

      {/* Global Persistent Mini-Player - Keeps playing seamlessly across tabs */}
      <GlobalMiniPlayer
        onExpandToMusic={() => navigateToTab('music')}
        activeTab={activeTab}
      />

    </div>
    </MusicPlayerProvider>
  );
};

export default App;
