import { useState, useEffect, useMemo, type FC } from 'react';
import {
  Clock,
  MapPin,
  UserCheck,
  Sparkles,
  ArrowRight,
  Printer,
  Search,
  CheckCircle2,
  Church as ChurchIcon,
  Flame,
  Compass,
  Loader2,
  X,
  ShieldCheck
} from 'lucide-react';
import type { CampEvent, EventScheduleItem, CamperRegistration, Church, RegistrationStats, AdminUser } from '../types';
import { Badge } from './ui/badge';
import { apiService } from '../services/api';
import { ChurchDirectory } from './ChurchDirectory';

interface OfficialSchedulePageProps {
  currentCamper: CamperRegistration | null;
  currentUser?: AdminUser | null;
  activeChurch: Church | null;
  churches?: Church[];
  stats?: RegistrationStats | null;
  onStartSignup: (church?: Church, event?: CampEvent) => void;
  onSelectChurch?: (church: Church) => void;
  onNavigateToOverview: () => void;
  onNavigateToChurches: () => void;
  onOpenCamperHub: () => void;
  onOpenActivation: () => void;
  onViewCamperProfile?: (camperId: string) => void;
  onNavigateToAdmin?: () => void;
}

export const OfficialSchedulePage: FC<OfficialSchedulePageProps> = ({
  currentCamper,
  currentUser,
  activeChurch,
  churches = [],
  stats = null,
  onStartSignup,
  onSelectChurch,
  onNavigateToOverview,
  onNavigateToChurches,
  onOpenCamperHub,
  onOpenActivation,
  onViewCamperProfile,
  onNavigateToAdmin,
}) => {
  const isLoggedIn = Boolean(currentCamper || currentUser);
  // Events and Active Event State
  const [events, setEvents] = useState<CampEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('vlc-2027');

  // Schedules State
  const [schedules, setSchedules] = useState<EventScheduleItem[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Events List
  useEffect(() => {
    let isMounted = true;
    apiService.getEvents()
      .then((res) => {
        if (!isMounted) return;
        if (res.events && res.events.length > 0) {
          setEvents(res.events);
          const active = res.active_event || res.events.find(e => e.status === 'active') || res.events[0];
          setSelectedEventId(active.id);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Schedule for the Selected Event
  useEffect(() => {
    let isMounted = true;

    apiService.getEventSchedule(selectedEventId)
      .then((res) => {
        if (!isMounted) return;
        if (res.schedules) {
          setSchedules(res.schedules);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoadingSchedule(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);

  // Active event object
  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || null;
  }, [events, selectedEventId]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return schedules.filter((item) => {
      // Day filter
      if (selectedDay !== 'all' && item.day_number !== selectedDay) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const itemType = item.session_type || 'general';
        if (selectedCategory === 'rallies' && itemType !== 'rally') return false;
        if (selectedCategory === 'plenaries' && itemType !== 'plenary') return false;
        if (selectedCategory === 'workshops' && itemType !== 'workshop') return false;
        if (selectedCategory === 'fellowship' && itemType !== 'fellowship') return false;
        if (selectedCategory === 'meals' && itemType !== 'meal') return false;
        if (selectedCategory === 'sports' && itemType !== 'sports') return false;
        if (selectedCategory === 'general' && itemType !== 'general') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesSpeaker = (item.speaker || '').toLowerCase().includes(q);
        const matchesLocation = (item.location || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSpeaker && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [schedules, selectedDay, selectedCategory, searchQuery]);


  const dayDatesMap: Record<number, string> = {
    1: 'Wednesday, July 21, 2027',
    2: 'Thursday, July 22, 2027',
    3: 'Friday, July 23, 2027',
    4: 'Saturday, July 24, 2027',
  };

  const dayTitlesMap: Record<number, string> = {
    1: 'Arrival, Gate Verification & Opening Rally',
    2: 'Leadership Tracks, Workshops & Holy Fire',
    3: 'Empowerment, Bible Bowl & Fellowship Night',
    4: 'Grand Commissioning, Communion & Send-Off',
  };

  return (
    <div className="space-y-10 pb-24 max-w-5xl mx-auto">
      {/* 
        Hero Header: Official Schedule & Upcoming Gatherings
        Google I/O & Sommercamp Inspired Modern Clean Aesthetic
      */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-10 shadow-[0_12px_36px_rgba(15,23,42,0.18)]">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Micro-Badges Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              PCCI National Summer Assembly &bull; Bambang, Nueva Vizcaya
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 backdrop-blur-md text-yellow-200 text-xs font-semibold border border-yellow-300/30">
              <Compass className="w-3.5 h-3.5 text-yellow-300" />
              Official Event Itinerary
            </span>
            {currentCamper && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md text-emerald-200 text-xs font-medium border border-emerald-400/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                Signed in as <strong>{currentCamper.nickname}</strong>
              </span>
            )}
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Schedule &amp; Camp Gatherings
            </h1>
            <p className="text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed font-light">
              Explore the confirmed 4-day session program for <strong>Vision &amp; Leadership Camp 2027: Arise &amp; Shine</strong>, browse upcoming national assemblies, or verify your delegate pass.
            </p>
          </div>

          {/* Fast Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-xs text-slate-300">Gathering Duration</div>
              <div className="text-base sm:text-lg font-bold text-white">4 Full Days</div>
              <div className="text-[11px] text-yellow-300">July 21 &ndash; 24, 2027</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-xs text-slate-300">National Headquarters</div>
              <div className="text-base sm:text-lg font-bold text-white">Buag Campus</div>
              <div className="text-[11px] text-slate-300">Bambang, Nueva Vizcaya</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-xs text-slate-300">Sessions &amp; Tracks</div>
              <div className="text-base sm:text-lg font-bold text-white">{schedules.length || 21} Sessions</div>
              <div className="text-[11px] text-emerald-300">Plenaries, Rallies &amp; Tracks</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-xs text-slate-300">Church Delegations</div>
              <div className="text-base sm:text-lg font-bold text-white">21 Congregations</div>
              <div className="text-[11px] text-blue-200">Across Cagayan Valley</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => onStartSignup(activeChurch || undefined)}
                className="tap-pill inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#0b57d0] font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#0b57d0]" />
                <span>Register for VLC 2027</span>
                <ArrowRight className="w-4 h-4 text-[#0b57d0]" />
              </button>
            ) : currentCamper ? (
              <button
                onClick={onOpenCamperHub}
                className="tap-pill inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View My Digital Camper Pass</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateToAdmin ? onNavigateToAdmin() : onOpenCamperHub()}
                className="tap-pill inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Portal</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="tap-pill inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Schedule</span>
            </button>

            <button
              onClick={onNavigateToOverview}
              className="tap-pill inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>Camp Overview &amp; Speakers</span>
            </button>

            <button
              onClick={onNavigateToChurches}
              className="tap-pill inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
            >
              <ChurchIcon className="w-4 h-4 text-blue-300" />
              <span>Church Delegations</span>
            </button>
          </div>
        </div>
      </section>




      {/* 
        SECTION 2: OFFICIAL SCHEDULE ITINERARY
        Moved out from modal into full-screen responsive page
      */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Official Assembly Schedule
              </span>
              <span className="text-xs font-bold text-zinc-900">
                {activeEvent?.name || 'Vision & Leadership Camp 2027'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              4-Day Program &amp; Session Itinerary
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Every morning devotions, keynote plenaries, ministry workshops, afternoon challenges, and evening Holy Fire altar encounters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isLoadingSchedule && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Syncing schedule...</span>
              </div>
            )}
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Select Day:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3, 4].map((dayNum) => {
              const isSelected = selectedDay === dayNum;
              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`tap-pill px-4 py-2 rounded-2xl font-semibold text-xs transition-all cursor-pointer shrink-0 text-left ${isSelected
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                >
                  <div className="font-bold">Day {dayNum}</div>
                  <div className={`text-[10px] font-normal ${isSelected ? 'text-blue-100' : 'text-zinc-500'}`}>
                    {dayDatesMap[dayNum]?.split(',')[1]?.trim() || `July ${20 + dayNum}`}
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => setSelectedDay('all')}
              className={`tap-pill px-4 py-2 rounded-2xl font-semibold text-xs transition-all cursor-pointer shrink-0 text-left ${selectedDay === 'all'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
            >
              <div className="font-bold">All 4 Days</div>
              <div className={`text-[10px] font-normal ${selectedDay === 'all' ? 'text-blue-100' : 'text-zinc-500'}`}>
                Full Assembly Itinerary
              </div>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions, speakers, workshops, or locations..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'rallies', label: 'Rallies 🔥' },
              { id: 'plenaries', label: 'Plenaries 📖' },
              { id: 'workshops', label: 'Workshops 🛠' },
              { id: 'fellowship', label: 'Fellowship 🤝' },
              { id: 'meals', label: 'Meals 🍽' },
              { id: 'sports', label: 'Sports 🏆' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`tap-pill px-3 py-1.5 rounded-xl font-medium text-[11px] whitespace-nowrap transition-colors cursor-pointer ${isSelected
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600'
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Info Banner */}
        {selectedDay !== 'all' && (
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                D{selectedDay}
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900">
                  Day {selectedDay}: {dayTitlesMap[selectedDay]}
                </h3>
                <p className="text-[11px] text-zinc-600">{dayDatesMap[selectedDay]}</p>
              </div>
            </div>

            <div className="text-xs font-semibold text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
              {filteredSessions.length} sessions listed
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3 pt-1">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => {
              const typeColor =
                session.session_type === 'rally'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : session.session_type === 'plenary'
                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                    : session.session_type === 'workshop'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : session.session_type === 'meal'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : session.session_type === 'sports'
                          ? 'bg-orange-100 text-orange-900 border-orange-300'
                          : session.session_type === 'fellowship'
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                            : 'bg-zinc-100 text-zinc-800 border-zinc-300';

              return (
                <div
                  key={session.id}
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedDay === 'all' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            Day {session.day_number}
                          </span>
                        )}
                        <h4 className="text-sm sm:text-base font-bold text-zinc-900">
                          {session.title}
                        </h4>
                      </div>
                      {session.description && (
                        <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
                          {session.description}
                        </p>
                      )}
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 font-semibold px-2.5 py-0.5 uppercase tracking-wide rounded-md ${typeColor}`}
                    >
                      {session.session_type || 'General'}
                    </Badge>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-zinc-600 pt-1 border-t border-zinc-100">
                    <span className="flex items-center gap-1.5 font-mono font-medium text-zinc-800">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{session.time_display || `${session.time_start} - ${session.time_end}`}</span>
                    </span>

                    {session.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{session.location}</span>
                      </span>
                    )}

                    {session.speaker && (
                      <span className="flex items-center gap-1.5 font-medium text-blue-700">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>{session.speaker}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 rounded-2xl border-2 border-dashed border-zinc-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto text-lg">
                🔍
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-zinc-900">No sessions match your search or filter</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try adjusting the session category, search query, or selecting &ldquo;All 4 Days&rdquo; to browse the whole program.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedDay(1);
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="tap-pill text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-900 text-white cursor-pointer hover:bg-zinc-800"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 
        SECTION 3: ON-ARRIVAL CHECK-IN DESK
      */}
      <section className="bg-gradient-to-br from-white to-emerald-50/40 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-zinc-900">
              On-Arrival Fast Desk Check-In
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-xl">
              Already arrived at the PCCI Headquarters in Bambang? Scan the gate QR code or enter your 4-character pass code to claim your official badge and kit in seconds.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenActivation}
          className="tap-pill shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Open Arrival Check-In Desk</span>
        </button>
      </section>

      {/* 
        SECTION 4: CHURCH DELEGATIONS & INVITE LINKS
      */}
      <section id="delegations" className="pt-2">
        <ChurchDirectory
          churches={churches || []}
          stats={stats}
          activeChurch={activeChurch}
          onSelectChurch={onSelectChurch}
          onStartSignup={(c) => onStartSignup(c)}
          onViewCamperProfile={onViewCamperProfile}
          isEmbedded={true}
          currentCamper={currentCamper}
          currentUser={currentUser}
        />
      </section>
    </div>
  );
};
