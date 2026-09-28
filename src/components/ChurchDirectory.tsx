import { useState, type FC } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowLeft, 
  Church as ChurchIcon, 
  MapPin, 
  User, 
  Users,
  ExternalLink,
  Share2
} from 'lucide-react';
import type { Church, RegistrationStats } from '../types';
import { Button } from './ui/button';
import { ShareChurchModal } from './ShareChurchModal';

interface ChurchDirectoryProps {
  churches: Church[];
  stats?: RegistrationStats | null;
  activeChurch: Church | null;
  onSelectChurch?: (church: Church) => void;
  onStartSignup: (church: Church) => void;
  onBackToHome?: () => void;
  onViewCamperProfile?: (camperId: string) => void;
  isEmbedded?: boolean;
}

const ROLE_BADGE_STYLES: Record<string, string> = {
  counselor: 'bg-purple-100 text-purple-800 border-purple-200',
  camper: 'bg-blue-100 text-blue-800 border-blue-200',
  first_timer: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  worship: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  staff: 'bg-amber-100 text-amber-800 border-amber-200',
  coordinator: 'bg-sky-100 text-sky-800 border-sky-200',
  admin: 'bg-zinc-900 text-amber-300 border-zinc-700',
  pastor: 'bg-rose-100 text-rose-800 border-rose-200',
  medical: 'bg-red-100 text-red-800 border-red-200',
};

const ROLE_LABELS: Record<string, string> = {
  counselor: 'Counselor',
  camper: 'Camper',
  first_timer: 'First-Timer 🌿',
  worship: 'Worship',
  staff: 'Staff',
  coordinator: 'Coordinator',
  admin: 'Admin',
  pastor: 'Pastor',
  medical: 'Medic',
};

export const ChurchDirectory: FC<ChurchDirectoryProps> = ({
  churches,
  activeChurch,
  onSelectChurch,
  onStartSignup,
  onBackToHome,
  onViewCamperProfile,
  isEmbedded = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [sharingChurch, setSharingChurch] = useState<Church | null>(null);
  const [activePopoverCamperId, setActivePopoverCamperId] = useState<string | null>(null);

  const provinces = ['all', 'Cagayan', 'Nueva Vizcaya', 'Open / Other'];

  // Separate regular PCCI churches from independent delegate
  const pcciChurches = churches.filter((c) => c.id !== 'ch_open_delegate');
  const openDelegateChurch = churches.find((c) => c.id === 'ch_open_delegate') || {
    id: 'ch_open_delegate',
    slug: 'independent',
    name: 'Independent Delegate / Other Fellowship',
    province: 'Open / Other',
    city: 'Various Cities',
    target_quota: 100,
    registered_count: 14,
  };

  const filtered = pcciChurches.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q) ||
      (c.pastor_name && c.pastor_name.toLowerCase().includes(q));
    const matchesProvince =
      selectedProvince === 'all' ||
      c.province.toLowerCase() === selectedProvince.toLowerCase();
    return matchesSearch && matchesProvince;
  });

  return (
    <div id="delegations" className="space-y-8 pb-20 max-w-5xl mx-auto animate-fadeIn scroll-mt-20">
      {/* Top Navigation & Header */}
      {!isEmbedded && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {onBackToHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="text-xs text-zinc-600 hover:text-zinc-900 gap-1.5 -ml-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Official Schedule</span>
              </Button>
            )}
          </div>
        </div>
      )}

        {/* Page Title & Mission */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0b57d0] border border-blue-100 flex items-center justify-center shadow-2xs shrink-0">
              <ChurchIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Church Delegations &amp; Invite Links
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
                Find your Jesus Is Alive Worship Center delegation, meet your fellow delegates, or share your delegation&apos;s unique invitation link to rally your youth and leaders.
              </p>
            </div>
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100">
            <div className="w-full sm:max-w-md relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by church, pastor, city, or province..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#0b57d0] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {provinces.map((prov) => (
                <button
                  key={prov}
                  onClick={() => setSelectedProvince(prov)}
                  className={`tap-pill px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                    selectedProvince === prov
                      ? 'bg-[#0b57d0] text-white shadow-2xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {prov === 'all' ? 'All Delegations' : prov}
                </button>
              ))}
            </div>
          </div>
        </div>

      {/* Simplified Churches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 px-1">
          <span>Showing {filtered.length} of {pcciChurches.length} delegations</span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Click any delegation to set as active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((church, idx) => {
            const isSelected = activeChurch?.id === church.id;
            const signups = church.signups || [];
            const isQuotaReached = Boolean(
              church.target_quota &&
              church.target_quota > 0 &&
              ((church.registered_count || signups.length || 0) >= church.target_quota)
            );

            return (
              <div
                key={church.id}
                onClick={() => onSelectChurch?.(church)}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer group ${
                  isSelected
                    ? 'border-[#0b57d0] ring-2 ring-[#0b57d0]/30 bg-blue-50/20'
                    : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  {/* Church Top Identity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-700 group-hover:bg-[#0b57d0] group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#0b57d0] transition-colors leading-snug">
                          {church.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0 text-zinc-400" />
                          <span>{church.city}, {church.province}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      {isQuotaReached && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Quota Reached &bull; Waitlist
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#c2e7ff] text-[#001d35]">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {church.pastor_name && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 p-2 rounded-xl">
                      <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">Pastor: <strong>{church.pastor_name}</strong></span>
                    </div>
                  )}

                  {/* Delegates / Signups Section with Selfies & Expanded Popover */}
                  <div className="pt-2 border-t border-zinc-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Registered Delegates ({signups.length})</span>
                      </span>
                      {signups.length > 0 && (
                        <span className="text-[10px] text-zinc-400">
                          Hover or tap for badge
                        </span>
                      )}
                    </div>

                    {signups.length > 0 ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {signups.slice(0, 6).map((camper) => {
                          const isPopoverOpen = activePopoverCamperId === camper.id;
                          return (
                            <div
                              key={camper.id}
                              className="relative"
                              onMouseEnter={() => setActivePopoverCamperId(camper.id)}
                              onMouseLeave={() => setActivePopoverCamperId(null)}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewCamperProfile?.(camper.id);
                                }}
                                onMouseEnter={() => setActivePopoverCamperId(camper.id)}
                                className="group/avatar relative w-10 h-10 rounded-full ring-2 ring-white hover:ring-[#0b57d0] hover:scale-110 transition-all cursor-pointer shadow-2xs overflow-hidden shrink-0 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#0b57d0]"
                                aria-label={`View ${camper.nickname}'s badge and profile`}
                              >
                                {camper.selfie_url ? (
                                  <img
                                    src={camper.selfie_url}
                                    alt={camper.nickname}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0b57d0]">
                                    {camper.nickname ? camper.nickname.charAt(0).toUpperCase() : 'C'}
                                  </div>
                                )}
                              </button>

                              {/* Expanded Popover */}
                              {isPopoverOpen && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white rounded-2xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-zinc-200 z-50 text-left animate-fadeIn"
                                >
                                  {/* Popover Arrow */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-white" />

                                  <div className="flex items-start gap-3">
                                    {/* Delegate Selfie Preview */}
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-zinc-200 bg-zinc-50 shadow-2xs">
                                      {camper.selfie_url ? (
                                        <img
                                          src={camper.selfie_url}
                                          alt={camper.nickname}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#0b57d0]">
                                          {camper.nickname ? camper.nickname.charAt(0).toUpperCase() : 'C'}
                                        </div>
                                      )}
                                    </div>

                                    <div className="space-y-1 min-w-0 flex-1">
                                      {/* Official Badge Name (prominent nickname display) */}
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 inline-block">
                                          Official Badge Name
                                        </span>
                                      </div>
                                      <h4 className="font-extrabold text-base text-zinc-900 truncate leading-snug">
                                        &ldquo;{camper.nickname}&rdquo;
                                      </h4>

                                      {/* Full Name & Role Badge (Counselor, Camper, First-Timer, Worship, Staff) */}
                                      <div className="flex flex-col gap-0.5">
                                        {camper.full_name && camper.full_name !== camper.nickname && (
                                          <p className="text-xs text-zinc-600 truncate font-medium">
                                            {camper.full_name}
                                          </p>
                                        )}
                                        {camper.role && (
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block w-fit mt-0.5 ${ROLE_BADGE_STYLES[camper.role.toLowerCase()] || 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>
                                            {ROLE_LABELS[camper.role.toLowerCase()] || camper.role.replace('_', ' ')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Direct link: camper/{id} */}
                                  <a
                                    href={`/camper/${camper.id}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActivePopoverCamperId(null);
                                      onViewCamperProfile?.(camper.id);
                                    }}
                                    className="mt-3.5 w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0b57d0] text-xs font-semibold flex items-center justify-between transition-colors border border-blue-200/80 cursor-pointer shadow-2xs"
                                  >
                                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                                      <User className="w-3.5 h-3.5 shrink-0" />
                                      camper/{camper.id}
                                    </span>
                                    <span className="text-[11px] flex items-center gap-1 font-bold">
                                      View Profile <ExternalLink className="w-3 h-3" />
                                    </span>
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {signups.length > 6 && (
                          <span className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold text-xs flex items-center justify-center shrink-0">
                            +{signups.length - 6}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="bg-zinc-50/70 rounded-xl p-2.5 border border-dashed border-zinc-200 flex items-center gap-2 text-xs text-zinc-500">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>No signups yet &bull; Be the first delegate from this church!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simplified Card Actions: Share Button & Register Button */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSharingChurch(church);
                    }}
                    className="tap-pill py-2.5 px-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                    title="Share delegation invite link"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#0b57d0]" />
                    <span>Share</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChurch?.(church);
                      onStartSignup(church);
                    }}
                    className={`tap-pill flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs ${
                      isQuotaReached
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-[#0b57d0] hover:bg-[#0842a0] text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                    <span>{isQuotaReached ? 'Join Delegation Waitlist' : 'Register with Delegation'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-3">
            <ChurchIcon className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="font-bold text-base text-zinc-900">No Church Delegations Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              We couldn&apos;t find any church delegation matching &ldquo;{searchTerm}&rdquo;. Try another search term or reset filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedProvince('all');
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Down-prioritized: Independent Delegate Welcoming Banner at the Bottom */}
      <section className="bg-gradient-to-r from-zinc-50 via-white to-amber-50/50 rounded-3xl p-6 sm:p-7 border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white text-zinc-700 border border-zinc-200 flex items-center justify-center shadow-2xs shrink-0">
            <Users className="w-5 h-5 text-[#0b57d0]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-zinc-900">
              Not affiliated with a listed PCCI church delegation?
            </h3>
            <p className="text-xs text-zinc-600 max-w-xl leading-relaxed">
              Everyone is welcome at VLC 2027! You can sign up as an Independent / Guest Delegate without needing a church invite link.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onSelectChurch?.(openDelegateChurch);
            onStartSignup(openDelegateChurch);
          }}
          className="tap-pill shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Join as Independent Delegate</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Share Modal showing the link and sharing it */}
      <ShareChurchModal
        isOpen={Boolean(sharingChurch)}
        church={sharingChurch}
        onClose={() => setSharingChurch(null)}
      />
    </div>
  );
};
