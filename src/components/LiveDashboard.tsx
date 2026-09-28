import type { FC } from 'react';
import { 
  Church as ChurchIcon, 
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import type { Church, RegistrationStats } from '../types';
import { KeynoteSpeakers } from './KeynoteSpeakers';

interface LiveDashboardProps {
  stats: RegistrationStats | null;
  activeChurch: Church | null;
  onStartSignup: (church?: Church) => void;
  onSelectChurch: (church: Church) => void;
  onNavigateToChurches: () => void;
}

export const LiveDashboard: FC<LiveDashboardProps> = ({
  stats,
  activeChurch,
  onStartSignup,
  onSelectChurch,
  onNavigateToChurches,
}) => {
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
            backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80')`,
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

            {activeChurch && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
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
              VLC 2027: <span className="font-bold text-yellow-300">Arise &amp; Shine</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-light">
            A week where hundreds of young people, leaders, and church delegations gather for unforgettable days filled with vibrant worship, authentic fellowship, and life-changing encounters. Step out of the ordinary, join your delegation or register as a guest delegate, and arise into your God-given calling.
          </p>

          {/* Quick Info Bar */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-yellow-300" />
              July 15 &ndash; 19, 2027
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-yellow-300" />
              Bambang, Nueva Vizcaya, Philippines
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-yellow-300" />
              292 Days to Camp Opening
            </span>
          </div>

          {/* Google I/O Minimalist Call to Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onStartSignup(activeChurch || undefined)}
              className="tap-pill inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0b57d0] font-semibold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0b57d0]" />
              <span>Register Now {activeChurch ? `(${activeChurch.name.split(' ')[0]})` : ''}</span>
              <ArrowRight className="w-4 h-4 text-[#0b57d0]" />
            </button>

            <a
              href="#speakers"
              className="tap-pill inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm border border-white/25 transition-all text-center"
            >
              Meet the Speakers ↓
            </a>

            <button
              onClick={onNavigateToChurches}
              className="tap-pill inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm border border-white/25 transition-all text-center cursor-pointer"
            >
              <ChurchIcon className="w-4 h-4 text-yellow-300" />
              <span>Church Delegations &amp; Links</span>
            </button>

            {!isIndependent && (
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
            {stats.targetCapacity - stats.totalRegistered} slots remaining before registration closes
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

      {/* Independent Delegate Welcoming Banner */}
      <section className="bg-gradient-to-r from-[#e8f0fe] via-white to-[#fef7e0] rounded-3xl p-6 sm:p-8 border border-[#d2e3fc] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_1px_3px_rgba(60,64,67,0.06)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#0b57d0] flex items-center justify-center shadow-xs shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-white text-[#0b57d0] text-[10px] font-bold uppercase tracking-wider shadow-xs mb-1">
              Open Fellowship
            </div>
            <h3 className="font-bold text-base text-[#1f1f1f]">
              Not affiliated with a listed PCCI church delegation?
            </h3>
            <p className="text-xs sm:text-sm text-[#5e5e5e] max-w-xl leading-relaxed">
              Everyone is welcome at VLC 2027! Register as an Independent Delegate without requiring a church-specific invite link. We have accommodations and small groups ready for you.
            </p>
          </div>
        </div>

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
          className="tap-pill shrink-0 whitespace-nowrap px-6 py-3 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Join as Independent Delegate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Navigation Card to Church Delegations & Invite Links Page */}
      <section className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl p-6 sm:p-8 border border-blue-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0b57d0] border border-blue-100 flex items-center justify-center shadow-2xs shrink-0">
            <ChurchIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Delegations &amp; Quotas
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                {stats.churchBreakdown.length} Delegations Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              Church Delegations &amp; Invite Links
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed">
              Find your home Jesus Is Alive Worship Center delegation across Cagayan and Nueva Vizcaya, view live registration quotas, or copy your delegation&apos;s unique invitation link to rally your youth.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToChurches}
          className="tap-pill shrink-0 whitespace-nowrap px-6 py-3.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-xs shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <span>Explore Church Delegations &amp; Links</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
