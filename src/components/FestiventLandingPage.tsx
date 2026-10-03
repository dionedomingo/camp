import { useState, useEffect, useRef, type FC } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Flame,
  ChevronDown,
  X,
  Building2,
  Volume2,
  VolumeX,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import type { Church, RegistrationStats, CampEvent, CamperRegistration, AdminUser } from '../types';
import { formatEventDateRange } from '../lib/utils';
import { useLanguage } from '../lib/i18n';
import { LanguageSelector } from './LanguageSelector';
import { UserRightDrawer } from './UserRightDrawer';

interface Speaker {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  topic: string;
  category: 'Keynote' | 'Leadership' | 'Worship' | 'Missions' | 'Discipleship';
  photoUrl: string;
  bio: string;
  timeSlot: string;
}

const SPEAKERS_DATA: Speaker[] = [
  {
    id: 'speaker-1',
    name: 'Bishop Dan Domingo',
    title: 'General Overseer & Presiding Minister',
    affiliation: 'Pentecostal Christian Church Inc.',
    topic: 'Arise & Shine: Apostolic Mandate',
    category: 'Keynote',
    photoUrl: 'https://pcci-53421.wasmer.app/storage/board-members/01M2ZW0R81F7FVRKXE9502J7DP.jpg',
    bio: 'Pioneering church planter and spiritual father overseeing over 50 congregations across Northern Luzon and beyond.',
    timeSlot: 'Opening Night • July 21, 7:00 PM',
  },
  {
    id: 'speaker-2',
    name: 'Rev. Jimmy Umpatang',
    title: 'General Overseer & Presiding Minister',
    affiliation: 'Pentecostal Christian Church Inc.',
    topic: 'Arise & Shine: Apostolic Mandate for 2027',
    category: 'Keynote',
    photoUrl: 'https://pcci-53421.wasmer.app/storage/board-members/01M2ZWDB5VG157EDV8CQBYPXG8.jpg',
    bio: 'Pioneering church planter and spiritual father overseeing over 50 congregations across Northern Luzon and beyond.',
    timeSlot: 'Opening Night • July 21, 7:00 PM',
  },
  {
    id: 'speaker-2',
    name: 'Ptra. Rowena Bansan Domingo',
    title: 'General Overseer & Presiding Minister',
    affiliation: 'Pentecostal Christian Church Inc.',
    topic: 'Arise & Shine: Apostolic Mandate for 2027',
    category: 'Keynote',
    photoUrl: 'https://pcci-53421.wasmer.app/storage/board-members/01M2ZWY6N7YS2ZP0JT18TQGDVJ.jpg',
    bio: 'Pioneering church planter and spiritual father overseeing over 50 congregations across Northern Luzon and beyond.',
    timeSlot: 'Opening Night • July 21, 7:00 PM',
  }
];

interface FestiventLandingPageProps {
  event: CampEvent | null;
  stats: RegistrationStats | null;
  churches: Church[];
  onStartSignup: (church?: Church, event?: CampEvent) => void;
  onNavigateToSchedule: () => void;
  onNavigateToChurches: () => void;
  onOpenActivation: () => void;
  onOpenLogin?: () => void;
  currentCamper?: CamperRegistration | null;
  currentUser?: AdminUser | null;
  onSignOut?: () => void;
  onViewCamperProfile?: (camperId: string) => void;
  onOpenDigitalPass?: () => void;
  onOpenAccount?: () => void;
  onNavigateToAdmin?: () => void;
  onOpenUserDrawer?: () => void;
}

export const FestiventLandingPage: FC<FestiventLandingPageProps> = ({
  event,
  stats,
  churches,
  onStartSignup,
  onNavigateToSchedule,
  onNavigateToChurches,
  onOpenActivation,
  onOpenLogin,
  currentCamper,
  currentUser,
  onSignOut,
  onViewCamperProfile,
  onOpenDigitalPass,
  onOpenAccount,
  onNavigateToAdmin,
  onOpenUserDrawer,
}) => {
  const { t } = useLanguage();
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = Boolean(currentCamper || currentUser);

  // Video playback & mute state
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax and scroll bulge references
  const bulgeRef = useRef<HTMLDivElement>(null);
  const parallaxImgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Auto-play muted video safely on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Calculate live countdown to camp
  const startDateStr = event?.start_date || '2027-07-21T08:00:00';
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(startDateStr).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [startDateStr]);

  // Festivent-inspired scroll bulge and multiplane parallax animation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 50);

          // 1. Media parallax translateY and scale on both video and fallback image
          const mediaEl = videoRef.current || parallaxImgRef.current;
          if (mediaEl) {
            const isMobile = window.innerWidth < 640;
            if (!isMobile) {
              const translateY = scrollY * 0.25;
              const scale = 1.05 + Math.min(scrollY * 0.00025, 0.12);
              mediaEl.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            } else {
              mediaEl.style.transform = 'translate3d(0, 0, 0)';
            }
          }

          // 2. Festivent-style bulge / expansion effect on the hero media container
          if (bulgeRef.current) {
            const progress = Math.min(scrollY / 500, 1);
            // Smoothly morph container corner curvature from 48px to 16px as it fills the screen
            const radius = Math.max(16, 48 - (progress * 32));
            bulgeRef.current.style.borderRadius = `${radius}px`;
          }

          // 3. Subtle text fade on scroll
          if (heroTextRef.current) {
            const opacity = Math.max(0.1, 1 - (scrollY / 550));
            heroTextRef.current.style.opacity = `${opacity}`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroImageUrl =
    event?.primary_image_url ||
    event?.banner_url ||
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2400&q=85';

  const dateRangeDisplay = formatEventDateRange(
    event?.start_date || '2027-07-21',
    event?.end_date || '2027-07-24'
  );

  const venueDisplay = `${event?.venue_name || 'Buag Campgrounds'}, ${event?.city || 'Bambang'}, ${event?.province || 'Nueva Vizcaya'}`;
  const totalRegistrations = stats?.totalRegistered || 0;
  const targetCapacity = event?.target_capacity || stats?.targetCapacity || 600;
  const capacityPercent = Math.min(100, Math.round((totalRegistrations / targetCapacity) * 100));
  const churchesCount = churches.length > 0 ? churches.length : (stats?.churchBreakdown?.length || 20);

  return (
    <div className="w-full bg-slate-950 text-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* FRONT PAGE DEDICATED HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-slate-950/85 backdrop-blur-lg shadow-xl border-b border-white/10' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className={`font-black uppercase tracking-widest text-white transition-all ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl drop-shadow-md'}`}>VLC 2027</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={onNavigateToSchedule} className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all text-xs sm:text-sm uppercase tracking-wider cursor-pointer">
              {t('nav.schedule')}
            </button>
            {(currentCamper || currentUser) ? (
              <button
                onClick={onOpenUserDrawer || (() => setIsUserDrawerOpen(true))}
                title={t('drawer.accountTitle')}
                aria-label={t('drawer.accountTitle')}
                className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 sm:py-1 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-blue-500/50 hover:border-blue-400 shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="relative shrink-0">
                  {currentCamper?.selfie_url || currentUser?.selfie_url ? (
                    <img
                      src={currentCamper?.selfie_url || currentUser?.selfie_url || ''}
                      alt={currentCamper?.nickname || currentUser?.name || 'Profile'}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-blue-500"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-xs ring-2 ring-blue-500/60 shadow-md">
                      {(currentCamper?.nickname || currentUser?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Active online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors leading-none truncate max-w-[110px]">
                    {currentCamper?.nickname || currentUser?.name || 'Delegate'}
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold leading-tight capitalize">
                    {currentUser?.role || currentCamper?.role || 'Camper'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-5 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
              >
                {t('nav.signIn')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 1. TOP ANNOUNCEMENT TICKER (Festivent style) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 text-white text-[11px] sm:text-xs font-bold py-2.5 overflow-hidden border-b border-white/10 relative z-20 mt-[80px] sm:mt-[100px]">
        <div className="animate-marquee-scroll whitespace-nowrap flex items-center gap-8">
          <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-300" /> {t('ticker.title')}</span>
          <span className="text-blue-300">•</span>
          <span>{dateRangeDisplay.toUpperCase()}</span>
          <span className="text-blue-300">•</span>
          <span>{venueDisplay.toUpperCase()}</span>
          <span className="text-blue-300">•</span>
          <span className="text-amber-300 font-extrabold">{t('ticker.registrationOpen')}</span>
          <span className="text-blue-300">•</span>
          <span>{t('ticker.joinDelegation')}</span>
          <span className="text-blue-300">•</span>
          <span>{t('ticker.capacityBanner')}</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-300" /> {t('ticker.title')}</span>
          <span className="text-blue-300">•</span>
          <span>{dateRangeDisplay.toUpperCase()}</span>
          <span className="text-blue-300">•</span>
          <span>{venueDisplay.toUpperCase()}</span>
        </div>
      </div>

      {/* 2. HERO SECTION WITH GIANT FESTIVAL TYPOGRAPHY */}
      <section className="relative min-h-[80vh] flex flex-col justify-between pt-8 pb-12 sm:pb-20 overflow-hidden">
        {/* Atmospheric Floating Blur Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse-ambient"></div>
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-ambient" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse-ambient" style={{ animationDelay: '-5s' }}></div>

        <div ref={heroTextRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center items-center transition-opacity duration-300">
          {/* Overline Badge with Language Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-300 text-xs sm:text-sm font-semibold shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{dateRangeDisplay}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{venueDisplay}</span>
            </div>
            <LanguageSelector variant="minimal" />
          </div>


          <img src="/images/vlc-transparent.png" />

          {/* Theme Tagline */}
          <p className="text-sm sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-normal mb-8 leading-relaxed">
            {event?.description || t('hero.tagline')}
          </p>

          {/* Jumbo CTA Button Group (Festivent Glow style) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {!isLoggedIn && (
              <button
                onClick={() => onStartSignup(undefined, event || undefined)}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('hero.registerBtn')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {currentCamper && onOpenDigitalPass && (
              <button
                onClick={onOpenDigitalPass}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('drawer.digitalPass')}</span>
              </button>
            )}
            {currentUser && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{t('drawer.adminPortal')}</span>
              </button>
            )}
            <button
              onClick={onNavigateToSchedule}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer text-center"
            >
              {t('hero.itineraryBtn')}
            </button>
          </div>

          {/* Live Countdown Clock Bar */}
          <div className="mt-12 w-full max-w-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="text-[11px] uppercase tracking-widest text-blue-400 font-bold mb-3 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('hero.countdownTitle')}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-white">{timeLeft.days}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">{t('hero.days')}</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-white">{timeLeft.hours}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">{t('hero.hours')}</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-white">{timeLeft.minutes}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">{t('hero.minutes')}</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-blue-400">{timeLeft.seconds}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">{t('hero.seconds')}</div>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-zinc-300">
                  <strong className="text-white font-bold">{totalRegistrations}</strong> {t('hero.campersRegistered')} <strong className="text-white font-bold">{targetCapacity}</strong> {t('hero.capacity')} <strong className="text-blue-400 font-bold">{churchesCount}</strong> {t('hero.churches')}
                </span>
              </div>
              <div className="w-full sm:w-48 bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FULL-WIDTH HERO VIDEO CONTAINER WITH BULGE & PARALLAX SCROLL ANIMATION (Festivent c-bulge) */}
      <div className="w-full px-2 sm:px-6 lg:px-10 transition-all duration-300">
        <div
          ref={bulgeRef}
          className="relative w-full aspect-video sm:aspect-auto sm:h-[78vh] lg:h-[90vh] overflow-hidden rounded-2xl sm:rounded-[3rem] border border-white/15 shadow-2xl transition-all duration-500 ease-out bg-slate-950"
        >
          {/* Muted Autoplay Repeated Placeholder Video */}
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            {...({ 'webkit-playsinline': 'true' } as any)}
            poster={heroImageUrl}
            className="absolute inset-0 w-full h-full object-cover origin-center will-change-transform filter brightness-[0.9] sm:brightness-[0.85]"
            style={{ objectFit: 'cover' }}
          >
            <source src="/videos/camp-teaser.mp4" type="video/mp4" />
            <source src="/videos/hero-placeholder.mp4" type="video/mp4" />
            <img
              ref={parallaxImgRef}
              src={heroImageUrl}
              alt="VLC 2027 Camp Worship Atmosphere"
              className="w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
            />
          </video>

          {/* Deep Cinematic Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 sm:from-slate-950 via-slate-950/10 sm:via-slate-950/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 sm:from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>

          {/* Video Audio Control: Mute / Unmute */}
          <div className="absolute top-2.5 right-2.5 sm:top-8 sm:right-8 z-20">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                }
                setIsMuted(!isMuted);
              }}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-xs text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              title={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-300" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
              <span className="text-[10px] sm:text-[11px] font-semibold">{isMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>

          {/* Floating Atmospheric Badge & Live Experience */}
          <div className="absolute bottom-3 left-3 sm:bottom-12 sm:left-12 max-w-lg z-20 pr-3">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-3 backdrop-blur-md">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>{t('hero.atmosphereBadge')}</span>
            </div>
            <h3 className="text-base sm:text-5xl lg:text-6xl font-black uppercase text-white drop-shadow-2xl leading-none mb-1 sm:mb-3">
              Feel The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
                Atmosphere
              </span>
            </h3>
            <p className="hidden sm:block text-xs sm:text-sm text-zinc-200 backdrop-blur-md bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-white/10 shadow-xl max-w-md">
              {t('hero.atmosphereQuote')}
            </p>
          </div>

          {/* Scroll Down Hint */}
          <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-300 z-20">
            <span>{t('hero.scrollHint')}</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-blue-400" />
          </div>
        </div>

        {/* Mobile Atmosphere Quote below video */}
        <div className="sm:hidden mt-3 px-2">
          <p className="text-xs text-zinc-300 backdrop-blur-md bg-slate-900/60 p-3 rounded-2xl border border-white/10 shadow-lg text-center italic">
            "{t('hero.atmosphereQuote')}"
          </p>
        </div>
      </div>

      {/* 4. KEYNOTE SPEAKERS MARQUEE (Festivent Artistes Marquee Style) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">{t('speakers.overline')}</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">{t('speakers.title')}</h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">
            {t('speakers.subtitle')}
          </p>
        </div>

        {/* Continuous Horizontal Auto-Scrolling Marquee */}
        <div className="overflow-hidden py-4">
          <div className="animate-marquee-scroll flex items-center gap-6">
            {SPEAKERS_DATA.concat(SPEAKERS_DATA).map((speaker, index) => (
              <div
                key={`${speaker.id}-${index}`}
                onClick={() => setSelectedSpeaker(speaker)}
                className="w-72 sm:w-80 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl group hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all cursor-pointer shrink-0"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={speaker.photoUrl}
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                    {speaker.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-2 font-medium">{speaker.affiliation}</p>
                  <p className="text-xs text-zinc-300 line-clamp-2">{speaker.topic}</p>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-400 font-semibold">
                    <span>{speaker.timeSlot}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAMP EXPERIENCE ZONES (Festivent "Zones Expérience" Style) */}
      <section className="py-20 relative bg-slate-900/40 border-t border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">{t('zones.overline')}</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">{t('zones.title')}</h2>
            <p className="text-zinc-400 text-sm">
              {t('zones.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Zone 1 */}
            <div className="glow-card rounded-3xl bg-slate-900/80 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-6 text-xl">
                  🔥
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">{t('zones.rally.title')}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {t('zones.rally.desc')}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>{t('zones.rally.time')}</span>
                <span className="text-blue-400 font-bold">{t('zones.rally.loc')}</span>
              </div>
            </div>

            {/* Zone 2 */}
            <div className="glow-card rounded-3xl bg-slate-900/80 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold mb-6 text-xl">
                  💡
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">{t('zones.labs.title')}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {t('zones.labs.desc')}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>{t('zones.labs.time')}</span>
                <span className="text-indigo-400 font-bold">{t('zones.labs.loc')}</span>
              </div>
            </div>

            {/* Zone 3 */}
            <div className="glow-card rounded-3xl bg-slate-900/80 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold mb-6 text-xl">
                  🏆
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">{t('zones.sports.title')}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {t('zones.sports.desc')}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>{t('zones.sports.time')}</span>
                <span className="text-cyan-400 font-bold">{t('zones.sports.loc')}</span>
              </div>
            </div>

            {/* Zone 4 */}
            <div className="glow-card rounded-3xl bg-slate-900/80 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mb-6 text-xl">
                  ✨
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">{t('zones.campfire.title')}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {t('zones.campfire.desc')}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>{t('zones.campfire.time')}</span>
                <span className="text-amber-400 font-bold">{t('zones.campfire.loc')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRACTICAL CAMP GUIDE / INFOS PRATIQUES (Festivent Accordion Style) */}
      <section className="py-20 relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">{t('guide.overline')}</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">{t('guide.title')}</h2>
          <p className="text-zinc-400 text-sm">{t('guide.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: t('guide.packing.title'),
              content: t('guide.packing.desc')
            },
            {
              title: t('guide.arrival.title'),
              content: t('guide.arrival.desc')
            },
            {
              title: t('guide.qr.title'),
              content: t('guide.qr.desc')
            },
            {
              title: t('guide.meals.title'),
              content: t('guide.meals.desc')
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>{item.title}</span>
                <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180 text-blue-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. JUMBO FESTIVAL FOOTER CTA (Festivent "Rejoins la fête" Style) */}
      <footer className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            {t('footer.badge')}
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
            {t('footer.titleLine1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              {t('footer.titleLine2')}
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            {t('footer.desc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoggedIn && (
              <button
                onClick={() => onStartSignup(undefined, event || undefined)}
                className="w-full sm:w-auto px-10 py-5 rounded-full text-base sm:text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3"
              >
                <span>{t('footer.registerBtn')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {currentCamper && onOpenDigitalPass && (
              <button
                onClick={onOpenDigitalPass}
                className="w-full sm:w-auto px-10 py-5 rounded-full text-base sm:text-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('drawer.digitalPass')}</span>
              </button>
            )}
            {currentUser && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="w-full sm:w-auto px-10 py-5 rounded-full text-base sm:text-lg font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{t('drawer.adminPortal')}</span>
              </button>
            )}
            <button
              onClick={onNavigateToChurches}
              className="w-full sm:w-auto px-8 py-5 rounded-full text-base font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>{t('footer.delegationsBtn')}</span>
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>{t('footer.copyright')}</p>
            <div className="flex items-center gap-6">
              <button onClick={onOpenActivation} className="hover:text-blue-400 cursor-pointer">{t('footer.checkIn')}</button>
              <button onClick={onNavigateToSchedule} className="hover:text-blue-400 cursor-pointer">{t('footer.schedule')}</button>
              <button onClick={onNavigateToChurches} className="hover:text-blue-400 cursor-pointer">{t('footer.churches')}</button>
            </div>
          </div>
        </div>
      </footer>

      {/* SPEAKER DETAILS MODAL */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-64 sm:h-72">
              <img
                src={selectedSpeaker.photoUrl}
                alt={selectedSpeaker.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                  {selectedSpeaker.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10">
                  {selectedSpeaker.timeSlot}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-black text-white">{selectedSpeaker.name}</h3>
              <p className="text-xs text-blue-400 font-semibold mb-1">{selectedSpeaker.title}</p>
              <p className="text-xs text-zinc-400 mb-4">{selectedSpeaker.affiliation}</p>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-4">
                <p className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-1">{t('speakers.sessionTopic')}</p>
                <p className="text-sm font-semibold text-white">"{selectedSpeaker.topic}"</p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                {selectedSpeaker.bio}
              </p>

              <button
                onClick={() => setSelectedSpeaker(null)}
                className="w-full py-3 rounded-full text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
              >
                {t('speakers.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT DRAWER FOR USER OPTIONS (Fallback if not handled by root App) */}
      {!onOpenUserDrawer && (
        <UserRightDrawer
          isOpen={isUserDrawerOpen}
          onClose={() => setIsUserDrawerOpen(false)}
          camper={currentCamper}
          adminUser={currentUser}
          onViewProfile={() => {
            if (currentCamper?.id && onViewCamperProfile) {
              onViewCamperProfile(currentCamper.id);
            } else if (onOpenAccount) {
              onOpenAccount();
            }
          }}
          onOpenAccount={() => onOpenAccount?.()}
          onOpenDigitalPass={() => onOpenDigitalPass?.()}
          onSignOut={() => onSignOut?.()}
          onOpenAdmin={() => onNavigateToAdmin?.()}
        />
      )}
    </div>
  );
};
