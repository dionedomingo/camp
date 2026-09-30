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
  Building2
} from 'lucide-react';
import type { Church, RegistrationStats, CampEvent } from '../types';
import { formatEventDateRange } from '../lib/utils';

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
    name: 'Rev. David Santos',
    title: 'General Overseer & Presiding Minister',
    affiliation: 'Pentecostal Christian Church Inc.',
    topic: 'Arise & Shine: Apostolic Mandate for 2027',
    category: 'Keynote',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Pioneering church planter and spiritual father overseeing over 50 congregations across Northern Luzon and beyond.',
    timeSlot: 'Opening Night • July 21, 7:00 PM',
  },
  {
    id: 'speaker-2',
    name: 'Pastor Joshua Lee',
    title: 'National NextGen & Youth Director',
    affiliation: 'PCCI Youth Alliance',
    topic: 'Unshakable Faith in a Shifting Culture',
    category: 'Leadership',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Passionate communicator dedicated to equipping student leaders, campus ministers, and young visionaries.',
    timeSlot: 'Morning Plenary • July 22, 9:00 AM',
  },
  {
    id: 'speaker-3',
    name: 'Dr. Abigail Cruz',
    title: 'Director of Compassion & Medical Missions',
    affiliation: 'Global Harvest Missions',
    topic: 'Holistic Service: Faith in Action & Healing',
    category: 'Missions',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Physician and missionary leading medical caravans and community empowerment initiatives across the archipelago.',
    timeSlot: 'Afternoon Workshop • July 22, 2:30 PM',
  },
  {
    id: 'speaker-4',
    name: 'Pastor Caleb Ramos',
    title: 'Northern Luzon Regional Coordinator',
    affiliation: 'Jesus Is Alive Center - Bambang',
    topic: 'The Altar of Revival: Awakening a Generation',
    category: 'Keynote',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Local host and revivalist who has championed inter-church youth prayer gatherings and camp movements for over 15 years.',
    timeSlot: 'Evening Rally • July 23, 7:00 PM',
  },
  {
    id: 'speaker-5',
    name: 'Elijah Marcus Tan',
    title: 'Worship Pastor & Creative Director',
    affiliation: 'PCCI Sound & Worship Collective',
    topic: 'The Sound of Prophetic Praise & Holy Fire',
    category: 'Worship',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Songwriter and worship leader igniting youth culture through transformative, presence-centered worship encounters.',
    timeSlot: 'Worship Masterclass • July 23, 10:30 AM',
  },
  {
    id: 'speaker-6',
    name: 'Hannah Joy Mendoza',
    title: 'Marketplace Missionary & Campus Evangelist',
    affiliation: 'Campus Ignite Philippines',
    topic: 'Bold Witness: Carrying the Light into School & Career',
    category: 'Discipleship',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Tech entrepreneur and campus evangelist inspiring thousands of university students to stand firm in faith.',
    timeSlot: 'Leadership Lab • July 24, 9:00 AM',
  },
];

interface FestiventLandingPageProps {
  event: CampEvent | null;
  stats: RegistrationStats | null;
  churches: Church[];
  onStartSignup: (church?: Church, event?: CampEvent) => void;
  onNavigateToSchedule: () => void;
  onNavigateToChurches: () => void;
  onOpenActivation: () => void;
}

export const FestiventLandingPage: FC<FestiventLandingPageProps> = ({
  event,
  stats,
  churches,
  onStartSignup,
  onNavigateToSchedule,
  onNavigateToChurches,
  onOpenActivation,
}) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Parallax and scroll bulge references
  const bulgeRef = useRef<HTMLDivElement>(null);
  const parallaxImgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

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

          // 1. Media parallax translateY and scale
          if (parallaxImgRef.current) {
            const translateY = scrollY * 0.25;
            const scale = 1.05 + Math.min(scrollY * 0.00025, 0.12);
            parallaxImgRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
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
      {/* 1. TOP ANNOUNCEMENT TICKER (Festivent style) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 text-white text-[11px] sm:text-xs font-bold py-2.5 overflow-hidden border-b border-white/10 sticky top-16 z-20 shadow-md">
        <div className="animate-marquee-scroll whitespace-nowrap flex items-center gap-8">
          <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-300" /> VICTORY LEADERSHIP CAMP 2027</span>
          <span className="text-blue-300">•</span>
          <span>{dateRangeDisplay.toUpperCase()}</span>
          <span className="text-blue-300">•</span>
          <span>{venueDisplay.toUpperCase()}</span>
          <span className="text-blue-300">•</span>
          <span className="text-amber-300 font-extrabold">EARLY BIRD REGISTRATION NOW OPEN</span>
          <span className="text-blue-300">•</span>
          <span>JOIN YOUR CHURCH DELEGATION TODAY</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-300" /> VICTORY LEADERSHIP CAMP 2027</span>
          <span className="text-blue-300">•</span>
          <span>{dateRangeDisplay.toUpperCase()}</span>
          <span className="text-blue-300">•</span>
          <span>{venueDisplay.toUpperCase()}</span>
        </div>
      </div>

      {/* 2. HERO SECTION WITH GIANT FESTIVAL TYPOGRAPHY */}
      <section className="relative min-h-[85vh] flex flex-col justify-between pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden">
        {/* Atmospheric Floating Blur Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse-ambient"></div>
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-ambient" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse-ambient" style={{ animationDelay: '-5s' }}></div>

        <div ref={heroTextRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center items-center transition-opacity duration-300">
          {/* Overline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{dateRangeDisplay}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{venueDisplay}</span>
          </div>

          {/* Massive Festival Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 max-w-5xl leading-[1.05] mb-5">
            Victory Leadership <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Camp 2027</span>
          </h1>

          {/* Theme Tagline */}
          <p className="text-sm sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-normal mb-8 leading-relaxed">
            {event?.description || "Awakening a generation of bold spiritual leaders, worshipers, and world-changers across Northern Luzon. 4 unforgettable days of apostolic fire, intimate worship, and deep fellowship."}
          </p>

          {/* Jumbo CTA Button Group (Festivent Glow style) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onStartSignup(undefined, event || undefined)}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Register Your Delegate Pass</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onNavigateToSchedule}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer text-center"
            >
              Official Itinerary
            </button>
          </div>

          {/* Live Countdown Clock Bar */}
          <div className="mt-12 w-full max-w-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="text-[11px] uppercase tracking-widest text-blue-400 font-bold mb-3 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Countdown to Camp Opening</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-white">{timeLeft.days}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">Days</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-white">{timeLeft.hours}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">Hours</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-white">{timeLeft.minutes}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">Mins</div>
              </div>
              <div className="bg-white/5 rounded-xl py-2 sm:py-3 border border-white/5">
                <div className="text-2xl sm:text-4xl font-black text-blue-400">{timeLeft.seconds}</div>
                <div className="text-[10px] sm:text-xs uppercase font-medium text-zinc-400 mt-1">Secs</div>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-zinc-300">
                  <strong className="text-white font-bold">{totalRegistrations}</strong> campers registered of <strong className="text-white font-bold">{targetCapacity}</strong> capacity across <strong className="text-blue-400 font-bold">{churchesCount}</strong> churches
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

      {/* 3. FULL-WIDTH HERO IMAGE CONTAINER WITH BULGE & PARALLAX SCROLL ANIMATION (Festivent c-bulge) */}
      <div className="w-full px-2 sm:px-6 lg:px-10 transition-all duration-300">
        <div 
          ref={bulgeRef} 
          className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[88vh] overflow-hidden rounded-3xl sm:rounded-[3rem] border border-white/15 shadow-2xl transition-all duration-500 ease-out"
        >
          {/* Parallax Image */}
          <img
            ref={parallaxImgRef}
            src={heroImageUrl}
            alt="VLC 2027 Camp Worship Atmosphere"
            className="w-full h-full object-cover scale-105 origin-center will-change-transform"
          />
          {/* Deep Cinematic Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

          {/* Floating Atmospheric Badge */}
          <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 max-w-md bg-slate-900/85 backdrop-blur-xl border border-white/15 p-5 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>Campground Experience</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200">
              "For where two or three are gathered in my name, there am I with them." Experience unforgettable worship and prayer under the mountain skies of Bambang.
            </p>
          </div>

          {/* Scroll Down Hint */}
          <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-300">
            <span>Scroll to discover speakers & zones</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-blue-400" />
          </div>
        </div>
      </div>

      {/* 4. KEYNOTE SPEAKERS MARQUEE (Festivent Artistes Marquee Style) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Apostolic & NextGen Ministers</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">Keynote Speakers</h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">
            Anointed leaders and ministers imparting visionary leadership, spiritual fire, and practical ministry tools into every camper.
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
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Four Dynamic Atmospheres</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">Camp Experience Zones</h2>
            <p className="text-zinc-400 text-sm">
              From high-voltage evening rallies to strategic leadership workshops and campfire worship under open skies, every moment is crafted to empower your walk with God.
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
                <h3 className="text-2xl font-black uppercase text-white mb-3">Evening Revival Rallies</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  Electrifying praise, apostolic ministry, life-altering altar encounters, and the fresh baptism of the Holy Spirit. Hundreds of youth crying out in unison for a national spiritual awakening.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>Every Night • 7:00 PM</span>
                <span className="text-blue-400 font-bold">Main Tabernacle</span>
              </div>
            </div>

            {/* Zone 2 */}
            <div className="glow-card rounded-3xl bg-slate-900/80 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold mb-6 text-xl">
                  💡
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">NextGen Leadership Labs</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  Intensive masterclasses for student leaders, campus evangelists, media creatives, and worship teams. Learn actionable frameworks to impact your local church and school campuses.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>Day 2 & 3 • 2:00 PM</span>
                <span className="text-indigo-400 font-bold">Training Pavilions</span>
              </div>
            </div>

            {/* Zone 3 */}
            <div className="glow-card rounded-3xl bg-slate-900/80 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold mb-6 text-xl">
                  🏆
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">Tribal Wars & Sports Olympics</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  High-energy team obstacle challenges, relay courses, volleyball tournaments, and tribal cheers. Forge unbreakable bonds across delegations and celebrate healthy teamwork.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>Day 3 • 3:30 PM</span>
                <span className="text-cyan-400 font-bold">Camp Athletic Field</span>
              </div>
            </div>

            {/* Zone 4 */}
            <div className="glow-card rounded-3xl bg-slate-900/80 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mb-6 text-xl">
                  ✨
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">Campfire & Acoustic Worship</h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  Gather around the crackling campfire beneath the mountain night stars for heartfelt testimonies, acoustic worship melodies, s'mores, and personal covenant prayers.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-zinc-400 font-medium">
                <span>Closing Night • 9:30 PM</span>
                <span className="text-amber-400 font-bold">Pine Grove Hillside</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRACTICAL CAMP GUIDE / INFOS PRATIQUES (Festivent Accordion Style) */}
      <section className="py-20 relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Prepare For Your Visit</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">Practical Camp Guide</h2>
          <p className="text-zinc-400 text-sm">Everything you need to know to ensure a smooth, comfortable, and life-changing camp experience.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "What to Pack (Camp Essentials Checklist)",
              content: "Bring your Bible, notebook and pens, modest comfortable clothing suitable for active games and evening rallies, warm jacket or hoodie (mountain evenings get cold), personal toiletries, towel, bedding or sleeping bag, personal water bottle, and any prescription medications."
            },
            {
              title: "Location, Arrival & Shuttle Information",
              content: "Victory Leadership Camp 2027 is hosted at Buag Campgrounds in Bambang, Nueva Vizcaya. Coordinated church delegation vans and chartered buses will arrive on Wednesday morning between 8:00 AM and 1:00 PM. Designated camp staff and ushers will guide arrivals to the check-in desk."
            },
            {
              title: "Fast On-Arrival Check-In with Scannable QR",
              content: "Upon completing your online registration, your unique Camper ID and activation QR code will be generated. Simply show your badge QR to the check-in desk on arrival to claim your camp kit and bunk assignment instantly!"
            },
            {
              title: "Meals, Accommodations & Medical Support",
              content: "All registered delegates receive full dormitory accommodation and full meal catering (Breakfast, Lunch, Dinner, and Evening Snacks). Our certified volunteer medical team and nurses are on-site 24/7 at the First Aid Pavilion."
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
            Registration Closing Soon
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
            Claim Your Spot at <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              VLC 2027 Today
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Join hundreds of delegates from over 20 regional churches for this divine appointment. Coordinate with your church delegation or register as an open delegate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartSignup(undefined, event || undefined)}
              className="w-full sm:w-auto px-10 py-5 rounded-full text-base sm:text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3"
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onNavigateToChurches}
              className="w-full sm:w-auto px-8 py-5 rounded-full text-base font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Browse Church Delegations</span>
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2027 Pentecostal Christian Church Inc. • Victory Leadership Camp</p>
            <div className="flex items-center gap-6">
              <button onClick={onOpenActivation} className="hover:text-blue-400 cursor-pointer">On-Arrival Fast Check-In</button>
              <button onClick={onNavigateToSchedule} className="hover:text-blue-400 cursor-pointer">Official Schedule</button>
              <button onClick={onNavigateToChurches} className="hover:text-blue-400 cursor-pointer">Church Directory</button>
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
                <p className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-1">Session Topic</p>
                <p className="text-sm font-semibold text-white">"{selectedSpeaker.topic}"</p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                {selectedSpeaker.bio}
              </p>

              <button
                onClick={() => setSelectedSpeaker(null)}
                className="w-full py-3 rounded-full text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
