import { useState, useEffect, type FC } from 'react';
import { 
  Church as ChurchIcon, 
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  HardDrive,
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import type { Church, RegistrationStats, CampEvent, CamperRegistration, AdminUser } from '../types';
import { apiService } from '../services/api';
import { getRegistrationStatus, formatDateReadable, formatDateShort, formatEventDateRange } from '../lib/utils';
import { KeynoteSpeakers } from './KeynoteSpeakers';
import { ChurchDirectory } from './ChurchDirectory';

interface LiveDashboardProps {
  stats: RegistrationStats | null;
  activeChurch: Church | null;
  activeEvent?: CampEvent | null;
  churches?: Church[];
  onStartSignup: (church?: Church) => void;
  onSelectChurch: (church: Church) => void;
  onNavigateToChurches: () => void;
  onNavigateToSchedule?: () => void;
  onViewCamperProfile?: (camperId: string) => void;
  currentCamper?: CamperRegistration | null;
  currentUser?: AdminUser | null;
  onOpenDigitalPass?: () => void;
  onNavigateToAdmin?: () => void;
}

export const LiveDashboard: FC<LiveDashboardProps> = ({
  stats,
  activeChurch,
  activeEvent: propEvent,
  churches = [],
  onStartSignup,
  onSelectChurch,
  onNavigateToChurches,
  onNavigateToSchedule,
  onViewCamperProfile,
  currentCamper,
  currentUser,
  onOpenDigitalPass,
  onNavigateToAdmin,
}) => {
  const isLoggedIn = Boolean(currentCamper || currentUser);
  const [fetchedEvent, setFetchedEvent] = useState<CampEvent | null>(null);
  const event = propEvent || fetchedEvent;

  useEffect(() => {
    if (propEvent) return;
    apiService.getEvents('vlc-2027').then((res) => {
      if (res.active_event) {
        setFetchedEvent(res.active_event);
      }
    }).catch(console.error);
  }, [propEvent]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0b57d0]/20 border-t-[#0b57d0] rounded-full animate-spin" />
          <p className="text-[#5e5e5e] text-xs">Loading VLC 2027 stats...</p>
        </div>
      </div>
    );
  }

  const isIndependent = activeChurch?.id === 'ch_open_delegate';
  const heroImageUrl = event?.primary_image_url || event?.banner_url || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80';
  const isR2Hosted = Boolean(event?.primary_image_url && event.primary_image_url.includes('/api/media/'));

  const regInfo = getRegistrationStatus(event);

  const eventDatesDisplay = formatEventDateRange(
    event?.start_date || '2027-07-21',
    event?.end_date || '2027-07-24'
  );

  const venueDisplay = `${event?.venue_name || 'Buag Campgrounds'}, ${event?.city || 'Bambang'}, ${event?.province || 'Nueva Vizcaya'}`;

  // Days to camp opening
  const today = new Date();
  const campDate = new Date(event?.start_date || '2027-07-21');
  const daysToCamp = Math.max(0, Math.ceil((campDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      {/* 
        Big Atmospheric Camp Hero Banner
        Inspired by Sommercamp.nu (wide atmospheric camp community photo, open sky, warm golden light)
        and Google I/O (clean typography, crisp badges, focused CTA)
      */}
      <section className="relative rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] bg-slate-900 text-white min-h-[520px] flex flex-col justify-end p-6 sm:p-12">
        {/* Background Image with optimized loading & gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 hover:scale-105"
          style={{
            backgroundImage: `url('${heroImageUrl}')`,
          }}
        />
        {/* Dark cinematic gradient for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />

        {/* Hero Content */}
        <div className="relative z-10 space-y-6 max-w-3xl">
          {/* Top Micro-Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              PCCI National Summer Camp
            </span>

            {/* Registration Status Pill */}
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
              regInfo.status === 'open'
                ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40'
                : regInfo.status === 'upcoming'
                ? 'bg-amber-500/25 text-amber-200 border-amber-400/40'
                : 'bg-rose-500/25 text-rose-200 border-rose-400/40'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{regInfo.label}</span>
            </span>

            {isR2Hosted && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/25 backdrop-blur-md text-orange-200 text-xs font-medium border border-orange-400/40">
                <HardDrive className="w-3 h-3 text-orange-300" />
                Cloudflare R2 Media
              </span>
            )}

            {activeChurch && (
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                isIndependent
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                  : 'bg-blue-500/20 text-blue-200 border-blue-400/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isIndependent ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span>Selected: <strong>{activeChurch.name}</strong></span>
              </span>
            )}
          </div>

          {/* Preliminary English Text inspired by Sommercamp.nu */}
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest text-slate-300 font-medium">
              Gathering Under the Open Sky
            </p>
            <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-white leading-tight">
              {event?.name ? (
                <>
                  {event.name.split(':')[0]}: <span className="font-bold text-yellow-300">{event.theme?.split('(')[0] || 'Arise & Shine'}</span>
                </>
              ) : (
                <>
                  VLC 2027: <span className="font-bold text-yellow-300">Arise &amp; Shine</span>
                </>
              )}
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-light">
            {event?.description || 'A week where hundreds of young people, leaders, and church delegations gather for unforgettable days filled with vibrant worship, authentic fellowship, and life-changing encounters. Step out of the ordinary, join your delegation or register as a guest delegate, and arise into your God-given calling.'}
          </p>

          {/* Quick Info Bar with Dynamic Event and Registration Allowed Dates */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-yellow-300" />
              {eventDatesDisplay}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-yellow-300" />
              {venueDisplay}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-yellow-300" />
              {daysToCamp > 0 ? `${daysToCamp} Days to Camp Opening` : 'Camp Opening!'}
            </span>
            {event?.registration_end_date && (
              <span className={`flex items-center gap-1.5 ${
                regInfo.status === 'open' ? 'text-emerald-300 font-medium' : regInfo.status === 'upcoming' ? 'text-amber-300 font-medium' : 'text-rose-300 font-medium'
              }`}>
                <CalendarCheck className="w-4 h-4" />
                {regInfo.status === 'open' 
                  ? `Registration Allowed Until ${formatDateShort(event.registration_end_date)} (${regInfo.badgeText})`
                  : regInfo.status === 'upcoming'
                  ? `Registration Opens ${formatDateReadable(event.registration_start_date)}`
                  : `Registration Closed on ${formatDateReadable(event.registration_end_date)}`
                }
              </span>
            )}
          </div>

          {/* Google I/O Minimalist Call to Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isLoggedIn ? (
              regInfo.isAllowed ? (
                <button
                  onClick={() => onStartSignup(activeChurch || undefined)}
                  className="tap-pill inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0b57d0] font-semibold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0b57d0]" />
                  <span>Register Now {activeChurch ? `(${activeChurch.name.split(' ')[0]})` : ''}</span>
                  <ArrowRight className="w-4 h-4 text-[#0b57d0]" />
                </button>
              ) : regInfo.status === 'upcoming' ? (
                <button
                  onClick={() => alert(`Registration for ${event?.name || 'VLC 2027'} officially opens on ${formatDateReadable(event?.registration_start_date)} leading up to the camp event.`)}
                  className="tap-pill inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm shadow-lg transition-all cursor-pointer"
                  title={`Registration opens on ${formatDateReadable(event?.registration_start_date)}`}
                >
                  <Clock className="w-4 h-4 text-zinc-950" />
                  <span>Registration Opens {formatDateShort(event?.registration_start_date)}</span>
                </button>
              ) : (
                <button
                  onClick={() => alert(`Registration for ${event?.name || 'VLC 2027'} closed on ${formatDateReadable(event?.registration_end_date)} leading up to the camp event.`)}
                  className="tap-pill inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 font-semibold text-sm border border-zinc-700 transition-all cursor-pointer"
                  title={`Registration closed on ${formatDateReadable(event?.registration_end_date)}`}
                >
                  <AlertCircle className="w-4 h-4 text-zinc-400" />
                  <span>Registration Closed</span>
                </button>
              )
            ) : currentCamper && onOpenDigitalPass ? (
              <button
                onClick={onOpenDigitalPass}
                className="tap-pill inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View My Digital Pass</span>
              </button>
            ) : currentUser && onNavigateToAdmin ? (
              <button
                onClick={onNavigateToAdmin}
                className="tap-pill inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Portal</span>
              </button>
            ) : null}

            <a
              href="#speakers"
              className="tap-pill inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm border border-white/25 transition-all text-center"
            >
              Meet the Speakers ↓
            </a>

            {onNavigateToSchedule && (
              <button
                onClick={onNavigateToSchedule}
                className="tap-pill inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-medium text-sm border border-white/25 transition-all text-center cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-yellow-300" />
                <span>Official Schedule &amp; Gatherings</span>
              </button>
            )}

            <button
              onClick={onNavigateToChurches}
              className="tap-pill inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm border border-white/25 transition-all text-center cursor-pointer"
            >
              <ChurchIcon className="w-4 h-4 text-yellow-300" />
              <span>Church Delegations &amp; Links</span>
            </button>

            {!isLoggedIn && !isIndependent && regInfo.isAllowed && (
              <button
                onClick={() => {
                  const openChurch: Church = {
                    id: 'ch_open_delegate',
                    slug: 'independent',
                    name: 'Independent Delegate / Other Fellowship',
                    province: 'Open / Other',
                    city: 'Various Cities',
                    target_quota: 100,
                  };
                  onSelectChurch(openChurch);
                  onStartSignup(openChurch);
                }}
                className="tap-pill inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-medium text-xs backdrop-blur-md cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Guest / Independent Delegate</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Google Minimalist 3-Metric Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Capacity metric */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1e3e1] space-y-3 shadow-[0_1px_3px_rgba(60,64,67,0.06)]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#747775]">Camp Capacity</span>
            <span className="font-bold text-[#0b57d0]">{stats.percentFilled}% Full</span>
          </div>
          <div className="text-3xl font-bold text-[#1f1f1f]">
            {stats.totalRegistered} <span className="text-sm font-normal text-[#747775]">/ {stats.targetCapacity}</span>
          </div>
          <div className="w-full bg-[#f1f3f4] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#0b57d0] h-full rounded-full transition-all duration-700" 
              style={{ width: `${stats.percentFilled}%` }}
            />
          </div>
          <p className="text-[11px] text-[#747775]">
            {regInfo.isAllowed
              ? event?.registration_end_date
                ? `${stats.targetCapacity - stats.totalRegistered} slots remaining before registration closes on ${formatDateReadable(event.registration_end_date)}`
                : `${stats.targetCapacity - stats.totalRegistered} slots remaining before registration closes`
              : regInfo.status === 'upcoming'
              ? `Registration opens on ${formatDateReadable(event?.registration_start_date)} (${stats.targetCapacity} total capacity)`
              : `Registration closed on ${formatDateReadable(event?.registration_end_date)} leading up to camp`
            }
          </p>
        </div>

        {/* Delegations metric */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1e3e1] space-y-3 shadow-[0_1px_3px_rgba(60,64,67,0.06)]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#747775]">Church Delegations</span>
            <span className="font-bold text-[#188038]">21 Congregations</span>
          </div>
          <div className="text-3xl font-bold text-[#1f1f1f]">
            {stats.churchBreakdown.length} <span className="text-sm font-normal text-[#747775]">Delegations</span>
          </div>
          <p className="text-xs text-[#444746] pt-1">
            Official Jesus Is Alive Centers representing Northern Luzon &amp; guest delegations.
          </p>
        </div>

        {/* Regions metric */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1e3e1] space-y-3 shadow-[0_1px_3px_rgba(60,64,67,0.06)]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#747775]">Regional Reach</span>
            <span className="font-bold text-[#0b57d0]">Cagayan Valley</span>
          </div>
          <div className="text-3xl font-bold text-[#1f1f1f]">
            {stats.provinceBreakdown.length} <span className="text-sm font-normal text-[#747775]">Key Provinces</span>
          </div>
          <p className="text-xs text-[#444746] pt-1">
            Delegates traveling from Nueva Vizcaya, Cagayan, Isabela, and independent fellowships.
          </p>
        </div>
      </section>

      {/* Keynote Speakers Section (Google I/O Style Layout) */}
      <KeynoteSpeakers />

      {/* Church Delegations Section on the Front */}
      <section id="delegations" className="pt-2">
        <ChurchDirectory
          churches={churches || []}
          stats={stats}
          activeChurch={activeChurch}
          onSelectChurch={onSelectChurch}
          onStartSignup={onStartSignup}
          onViewCamperProfile={onViewCamperProfile}
          isEmbedded={true}
          currentCamper={currentCamper}
          currentUser={currentUser}
        />
      </section>
    </div>
  );
};
