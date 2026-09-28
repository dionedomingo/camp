import { useState, type FC } from 'react';
import { 
  Search, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Church as ChurchIcon, 
  MapPin, 
  User, 
  Users,
  ExternalLink
} from 'lucide-react';
import type { Church, RegistrationStats } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ChurchDirectoryProps {
  churches: Church[];
  stats: RegistrationStats | null;
  activeChurch: Church | null;
  onSelectChurch?: (church: Church) => void;
  onStartSignup: (church: Church) => void;
  onBackToHome: () => void;
}

export const ChurchDirectory: FC<ChurchDirectoryProps> = ({
  churches,
  stats,
  activeChurch,
  onSelectChurch,
  onStartSignup,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const provinces = ['all', 'Cagayan', 'Nueva Vizcaya', 'Open / Other'];

  // Map breakdown counts from stats if available
  const churchCountsMap = new Map<string, number>();
  if (stats?.churchBreakdown) {
    stats.churchBreakdown.forEach((b) => {
      churchCountsMap.set(b.id, b.count);
    });
  }

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

  const handleCopyLink = (slug: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?church=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToHome}
            className="text-xs text-zinc-600 hover:text-zinc-900 gap-1.5 -ml-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Camp Overview</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0b57d0] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {pcciChurches.length} Congregations Synced
            </span>
          </div>
        </div>

        {/* Page Title & Mission */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0b57d0] border border-blue-100 flex items-center justify-center shadow-2xs shrink-0">
              <ChurchIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                  Church Delegations &amp; Invite Links
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 uppercase font-mono">
                  Live Quotas
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
                Find your Jesus Is Alive Worship Center delegation, track registration standings against delegate quotas, or copy your delegation&apos;s unique invitation link to rally your youth and leaders.
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
      </div>

      {/* Churches Grid with Live Quota and Copy Link */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 px-1">
          <span>Showing {filtered.length} of {pcciChurches.length} delegations</span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Click any delegation to set as active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((church, idx) => {
            const isSelected = activeChurch?.id === church.id;
            const registeredCount = churchCountsMap.get(church.id) ?? church.registered_count ?? 0;
            const quota = church.target_quota || 35;
            const percentFilled = Math.min(100, Math.round((registeredCount / quota) * 100));

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

                    {isSelected && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#c2e7ff] text-[#001d35] shrink-0">
                        Selected
                      </span>
                    )}
                  </div>

                  {church.pastor_name && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 p-2 rounded-xl">
                      <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">Pastor: <strong>{church.pastor_name}</strong></span>
                    </div>
                  )}

                  {/* Quota Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 text-[11px] font-medium">Delegation Quota</span>
                      <span className="font-semibold text-zinc-900 text-xs">
                        <strong>{registeredCount}</strong> / {quota} delegates ({percentFilled}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentFilled >= 100
                            ? 'bg-emerald-500'
                            : percentFilled >= 50
                            ? 'bg-[#0b57d0]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, percentFilled)}%` }}
                      />
                    </div>
                  </div>

                  {/* Shareable Invite Link Box */}
                  <div className="bg-zinc-50/80 rounded-xl p-2.5 border border-zinc-200/70 flex items-center justify-between text-xs gap-2">
                    <span className="font-mono text-[11px] text-zinc-600 truncate">
                      ?church={church.slug}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(church.slug, e)}
                      className={`tap-pill px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                        copiedSlug === church.slug
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white hover:bg-zinc-100 text-[#0b57d0] border-zinc-200 shadow-2xs'
                      }`}
                    >
                      {copiedSlug === church.slug ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Action CTA */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChurch?.(church);
                      onStartSignup(church);
                    }}
                    className="tap-pill flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                    <span>Register with this Delegation</span>
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
    </div>
  );
};
