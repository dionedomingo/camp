import { useState, useEffect, useMemo, type FC } from 'react';
import {
  Printer,
  Search,
  CheckCircle2,
  RotateCcw,
  Sliders,
  Loader2,
  Eye,
  CheckSquare,
  Square,
  ShieldAlert
} from 'lucide-react';
import { 
  type Church, 
  type AdminUser, 
  type QueueDelegate, 
  type BadgeQueueResponse, 
  type BadgeThemeConfig,
  DEFAULT_BADGE_CONFIG 
} from '../types';
import { apiService } from '../services/api';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ThemeableBadgeCard } from './ThemeableBadgeCard';

interface AdminIdPrintQueueProps {
  churches: Church[];
  currentUser: AdminUser | null;
}

export const AdminIdPrintQueue: FC<AdminIdPrintQueueProps> = ({ churches, currentUser }) => {
  const [delegates, setDelegates] = useState<QueueDelegate[]>([]);
  const [stats, setStats] = useState<BadgeQueueResponse['stats']>({
    total_in_queue: 0,
    unprinted_count: 0,
    printed_count: 0,
    reprint_count: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unprinted' | 'printed' | 'reprint'>('unprinted');
  const [churchFilter, setChurchFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('');

  // Selected for batch print
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Theme Designer state
  const [themeConfig, setThemeConfig] = useState<BadgeThemeConfig>(() => {
    const saved = localStorage.getItem('vlc_badge_theme_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_BADGE_CONFIG;
      }
    }
    return DEFAULT_BADGE_CONFIG;
  });

  const [isDesignerOpen, setIsDesignerOpen] = useState(false);

  // Single Delegate Preview & Print
  const [previewDelegate, setPreviewDelegate] = useState<QueueDelegate | null>(null);

  // Reprint Dialog
  const [reprintTarget, setReprintTarget] = useState<QueueDelegate | null>(null);
  const [reprintReason, setReprintReason] = useState<string>('Lost badge replacement');
  const [isSubmittingPrint, setIsSubmittingPrint] = useState(false);

  // Batch Print Sheet Modal
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);

  // Save theme config to localStorage
  const handleSaveTheme = (newConfig: BadgeThemeConfig) => {
    setThemeConfig(newConfig);
    localStorage.setItem('vlc_badge_theme_config', JSON.stringify(newConfig));
  };

  // Load Queue Data
  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getBadgeQueue({
        event_id: eventFilter,
        church_id: churchFilter === 'all' ? undefined : churchFilter,
        print_status: statusFilter,
        search: search.trim() || undefined,
      });

      if (res.success) {
        setDelegates(res.delegates || []);
        setStats(res.stats);
      }
    } catch (err) {
      console.error('[AdminIdPrintQueue] Failed to load queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    apiService.getBadgeQueue({
      event_id: eventFilter,
      church_id: churchFilter === 'all' ? undefined : churchFilter,
      print_status: statusFilter,
      search: search.trim() || undefined,
    })
      .then((res) => {
        if (!isCurrent) return;
        if (res.success) {
          setDelegates(res.delegates || []);
          setStats(res.stats);
        }
      })
      .catch((err) => {
        console.error('[AdminIdPrintQueue] Failed to load queue:', err);
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [eventFilter, churchFilter, statusFilter, search]);

  // Multi-select helpers
  const allDelegateIds = useMemo(() => delegates.map((d) => d.registration_id), [delegates]);
  const isAllSelected = delegates.length > 0 && selectedIds.length === delegates.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allDelegateIds);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Record Print Action (Single)
  const handlePrintBadge = async (delegate: QueueDelegate, reason?: string) => {
    setIsSubmittingPrint(true);
    try {
      const res = await apiService.recordBadgePrint({
        registration_ids: [delegate.registration_id],
        admin_id: currentUser?.id || 'admin',
        reason: reason || undefined,
      });

      if (res.success) {
        setReprintTarget(null);
        await loadQueue();
      }
    } catch (err) {
      console.error('[AdminIdPrintQueue] Print recording failed:', err);
    } finally {
      setIsSubmittingPrint(false);
    }
  };

  // Record Print Action (Batch)
  const handleBatchPrint = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmittingPrint(true);
    try {
      const res = await apiService.recordBadgePrint({
        registration_ids: selectedIds,
        admin_id: currentUser?.id || 'admin',
      });

      if (res.success) {
        setIsPrintSheetOpen(false);
        setSelectedIds([]);
        await loadQueue();
      }
    } catch (err) {
      console.error('[AdminIdPrintQueue] Batch print recording failed:', err);
    } finally {
      setIsSubmittingPrint(false);
    }
  };

  // Reset Print Count
  const handleResetPrint = async (delegate: QueueDelegate) => {
    if (!window.confirm(`Reset print count to 0 for ${delegate.nickname} (${delegate.full_name})?`)) return;
    try {
      const res = await apiService.recordBadgePrint({
        registration_ids: [delegate.registration_id],
        action: 'reset',
        admin_id: currentUser?.id || 'admin',
      });
      if (res.success) {
        await loadQueue();
      }
    } catch (err) {
      console.error('[AdminIdPrintQueue] Reset print failed:', err);
    }
  };

  // Open physical browser print window
  const triggerBrowserPrint = () => {
    window.print();
  };

  const selectedDelegates = useMemo(
    () => delegates.filter((d) => selectedIds.includes(d.registration_id)),
    [delegates, selectedIds]
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              ID Badge Printing Queue
            </h1>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
              Badge Station
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Batch badge production, public profile QR code generation &amp; reprint audit tracking.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDesignerOpen(true)}
            className="text-xs font-semibold gap-1.5 h-9 bg-white cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Badge Designer &amp; Theme</span>
          </Button>

          {selectedIds.length > 0 && (
            <Button
              size="sm"
              onClick={() => setIsPrintSheetOpen(true)}
              className="text-xs font-semibold gap-1.5 h-9 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Selected ({selectedIds.length})</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">In Queue</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">
            {stats.total_in_queue}
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Total eligible delegates</p>
        </Card>

        <Card className="p-4 border-amber-200 bg-amber-50/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">Unprinted</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              0
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">
            {stats.unprinted_count}
          </div>
          <p className="text-[11px] text-amber-700 mt-0.5">Awaiting initial card print</p>
        </Card>

        <Card className="p-4 border-emerald-200 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800">Printed (1x)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900">
            {stats.printed_count}
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">Badges successfully issued</p>
        </Card>

        <Card className="p-4 border-purple-200 bg-purple-50/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-800">Reprints (2+)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-900">
            {stats.reprint_count}
          </div>
          <p className="text-[11px] text-purple-700 mt-0.5">Duplicate / security re-issues</p>
        </Card>
      </div>

      {/* Filter Bar & Controls */}
      <Card className="p-4 border-zinc-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex rounded-xl bg-zinc-100 p-1 text-xs font-semibold">
            {(
              [
                { id: 'unprinted', label: 'Unprinted', count: stats.unprinted_count },
                { id: 'all', label: 'All Queue', count: stats.total_in_queue },
                { id: 'printed', label: 'Printed', count: stats.printed_count },
                { id: 'reprint', label: 'Reprints', count: stats.reprint_count },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-200/60 text-zinc-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search name, code, or church..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Church & Event Selectors */}
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 flex-wrap text-xs">
          <span className="text-[11px] font-semibold text-zinc-500">Filter Delegation:</span>
          <select
            value={churchFilter}
            onChange={(e) => setChurchFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Church Delegations ({churches.length})</option>
            {churches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.province})
              </option>
            ))}
          </select>

          <span className="text-[11px] font-semibold text-zinc-500 ml-2">Event:</span>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Camp Gatherings</option>
            <option value="vlc-2027">VLC 2027 (Arise &amp; Shine)</option>
            <option value="vlc-2029">VLC 2029 (Greater Glory)</option>
          </select>

          <span className="ml-auto text-[11px] text-zinc-500">
            Showing <strong>{delegates.length}</strong> delegate(s)
          </span>
        </div>
      </Card>

      {/* Main Delegates Queue Table */}
      <Card className="border-zinc-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs">Loading ID badge printing queue...</span>
          </div>
        ) : delegates.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
            <h3 className="font-semibold text-sm text-zinc-900">
              No delegates match current filter
            </h3>
            <p className="text-xs text-zinc-500">
              Try switching status filters or clearing the search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
                <tr>
                  <th className="p-3.5 pl-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="cursor-pointer text-zinc-500 hover:text-zinc-900"
                      title={isAllSelected ? 'Deselect all' : 'Select all'}
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5">Delegate</th>
                  <th className="p-3.5">Delegation Church</th>
                  <th className="p-3.5">Pass Code</th>
                  <th className="p-3.5">Print Status</th>
                  <th className="p-3.5">Last Printed</th>
                  <th className="p-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {delegates.map((d) => {
                  const isSelected = selectedIds.includes(d.registration_id);

                  return (
                    <tr
                      key={d.registration_id}
                      className={`hover:bg-zinc-50/80 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <td className="p-3.5 pl-4">
                        <button
                          type="button"
                          onClick={() => toggleSelect(d.registration_id)}
                          className="cursor-pointer text-zinc-500 hover:text-zinc-900"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-400" />
                          )}
                        </button>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                            {d.selfie_url ? (
                              <img
                                src={d.selfie_url}
                                alt={d.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-zinc-600 text-xs">
                                {d.nickname ? d.nickname.charAt(0) : d.full_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 line-clamp-1">
                              &ldquo;{d.nickname}&rdquo;
                            </div>
                            <div className="text-[11px] text-zinc-500 line-clamp-1">
                              {d.full_name}
                            </div>
                            <span className="inline-block mt-0.5 text-[9px] uppercase font-semibold text-zinc-600 px-1.5 py-0.2 rounded bg-zinc-100">
                              {d.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-zinc-800 line-clamp-1">
                            {d.church_name || 'Independent Delegation'}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {d.province} &bull; {d.city || 'Philippines'}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md border border-zinc-200">
                          {d.activation_code}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {d.print_count === 0 ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 font-semibold text-[10px]">
                            Unprinted
                          </Badge>
                        ) : d.print_count === 1 ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold text-[10px]">
                            Printed (1x)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 font-bold text-[10px] flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-purple-600" />
                            <span>Reprint #{d.print_count}</span>
                          </Badge>
                        )}
                      </td>

                      <td className="p-3.5 text-zinc-500">
                        {d.last_printed_at ? (
                          <div>
                            <div className="text-[11px] text-zinc-700 font-mono">
                              {new Date(d.last_printed_at).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              by {d.last_printed_by || 'Admin'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">Never</span>
                        )}
                      </td>

                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewDelegate(d)}
                            className="h-8 px-2 text-zinc-600 hover:text-zinc-900 cursor-pointer"
                            title="Preview Badge"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          {d.print_count === 0 ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setPreviewDelegate(d);
                                handlePrintBadge(d);
                              }}
                              className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReprintTarget(d)}
                              className="h-8 px-3 rounded-lg border-purple-300 text-purple-800 hover:bg-purple-50 font-semibold text-xs cursor-pointer gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reprint</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL 1: Badge Theme Designer Drawer / Dialog */}
      <Dialog open={isDesignerOpen} onOpenChange={setIsDesignerOpen}>
        <DialogContent className="max-w-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-zinc-900">
                  ID Badge Theme &amp; Layout Designer
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Select color themes, card orientation, and toggle layout elements for card printing.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Left Controls */}
            <div className="md:col-span-6 space-y-5">
              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-900 block">
                  Design Theme Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'gold', label: 'Arise & Shine (VLC 2027)', desc: 'Gold & Obsidian' },
                      { id: 'emerald', label: 'Greater Glory (VLC 2029)', desc: 'Emerald & Teal' },
                      { id: 'heritage', label: 'PCCI Heritage', desc: 'Royal Blue Card' },
                      { id: 'monochrome', label: 'Modern Graphite', desc: 'Minimalist Black/White' },
                      { id: 'sunset', label: 'Vibrant Youth', desc: 'Sunset Coral' },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSaveTheme({ ...themeConfig, preset: p.id })}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        themeConfig.preset === p.id
                          ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 font-bold text-zinc-900'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-[10px] text-zinc-400 font-normal">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-900 block">
                  Badge Orientation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'vertical', label: 'Portrait (Lanyard / Pouch)' },
                      { id: 'horizontal', label: 'Landscape (Clip Card)' },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => handleSaveTheme({ ...themeConfig, orientation: o.id })}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        themeConfig.orientation === o.id
                          ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 text-zinc-900'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggleable Layout Elements */}
              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <label className="text-xs font-bold text-zinc-900 block">
                  Included Layout Elements
                </label>
                <div className="space-y-1.5 text-xs text-zinc-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeConfig.showQrCode}
                      onChange={(e) =>
                        handleSaveTheme({ ...themeConfig, showQrCode: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Camper Public Profile QR Code</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeConfig.showPhoto}
                      onChange={(e) =>
                        handleSaveTheme({ ...themeConfig, showPhoto: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Delegate Selfie / Avatar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeConfig.showVerse}
                      onChange={(e) =>
                        handleSaveTheme({ ...themeConfig, showVerse: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Scripture Anchor Verse</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeConfig.showChurch}
                      onChange={(e) =>
                        handleSaveTheme({ ...themeConfig, showChurch: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Church Delegation Name</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Live Sample Preview */}
            <div className="md:col-span-6 flex flex-col items-center justify-center bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Live Badge Preview
              </span>
              <div className="scale-90 origin-top">
                <ThemeableBadgeCard
                  camper={
                    delegates[0] || {
                      registration_id: 'sample',
                      event_id: 'vlc-2027',
                      camper_id: 'sample',
                      full_name: 'Joshua Miguel Valdez',
                      nickname: 'Josh',
                      gender: 'male',
                      age: 20,
                      email: 'josh@example.com',
                      phone: '+63 917 123 4567',
                      province: 'Nueva Vizcaya',
                      favorite_verse: 'Jeremiah 29:11',
                      activation_code: 'VLC-7K8P',
                      activation_token: 'sample_token',
                      role: 'camper',
                      status: 'registered',
                      print_count: 0,
                      kit_claimed: 0,
                      church_id: 'ch_sample',
                      church_name: 'Jesus Is Alive - Buag',
                    }
                  }
                  config={themeConfig}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-end">
            <Button
              size="sm"
              onClick={() => setIsDesignerOpen(false)}
              className="bg-zinc-900 text-white font-semibold text-xs px-5 rounded-xl cursor-pointer"
            >
              Done &amp; Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Single Badge Live Preview & Print */}
      <Dialog open={Boolean(previewDelegate)} onOpenChange={(open) => !open && setPreviewDelegate(null)}>
        <DialogContent className="max-w-md p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 text-center">
              Print Badge Preview
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 text-center">
              Official delegate badge card with public profile QR code.
            </DialogDescription>
          </DialogHeader>

          {previewDelegate && (
            <div className="flex flex-col items-center justify-center pt-2 space-y-4">
              <ThemeableBadgeCard
                camper={previewDelegate}
                config={themeConfig}
                isPrintPreview={true}
              />

              <div className="w-full flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewDelegate(null)}
                  className="text-xs cursor-pointer"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  {previewDelegate.print_count > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleResetPrint(previewDelegate);
                        setPreviewDelegate(null);
                      }}
                      className="text-xs text-zinc-500 hover:text-zinc-800"
                    >
                      Reset Count
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={isSubmittingPrint}
                    onClick={() => {
                      handlePrintBadge(previewDelegate);
                      triggerBrowserPrint();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl px-5 cursor-pointer gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Send to Card Printer</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Reprint Reason Dialog */}
      <Dialog open={Boolean(reprintTarget)} onOpenChange={(open) => !open && setReprintTarget(null)}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-zinc-900">
                  Confirm Badge Reprint
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  This badge has already been printed {reprintTarget?.print_count} time(s).
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {reprintTarget && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="font-bold text-zinc-900">
                  {reprintTarget.full_name} (&ldquo;{reprintTarget.nickname}&rdquo;)
                </div>
                <div className="text-zinc-500">
                  Code: <strong className="font-mono">{reprintTarget.activation_code}</strong> &bull; {reprintTarget.church_name}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 block">
                  Select Reason for Reprint (Security Audit) *
                </label>
                <select
                  value={reprintReason}
                  onChange={(e) => setReprintReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Lost badge replacement">Lost / misplaced badge replacement</option>
                  <option value="Damaged card stock">Damaged PVC / laminated card</option>
                  <option value="Role or name update">Role or delegation name update</option>
                  <option value="Printer smudge / defect">Printer error or ribbon defect</option>
                  <option value="Special authorization">Special admin re-issue</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px] leading-relaxed">
                Reprinting will increment the badge count to <strong>#{reprintTarget.print_count + 1}</strong> and render an official security watermark pill on the badge.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReprintTarget(null)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isSubmittingPrint}
                  onClick={() => {
                    handlePrintBadge(reprintTarget, reprintReason);
                    triggerBrowserPrint();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl px-4 cursor-pointer gap-1.5"
                >
                  {isSubmittingPrint ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
                  <span>Authorize &amp; Print Reprint</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Batch Print Sheet View (Print Multi-Up) */}
      <Dialog open={isPrintSheetOpen} onOpenChange={setIsPrintSheetOpen}>
        <DialogContent className="max-w-4xl p-6 max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-bold text-zinc-900">
                  Batch Print Sheet ({selectedDelegates.length} Badges)
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Ready to print. Formatted for standard card printers or multi-badge card sheets.
                </DialogDescription>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  triggerBrowserPrint();
                  handleBatchPrint();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl px-5 cursor-pointer gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print All {selectedDelegates.length} Badges</span>
              </Button>
            </div>
          </DialogHeader>

          {/* Printable Sheet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 mt-2 print:p-0 print:bg-white print:border-none print:grid-cols-2">
            {selectedDelegates.map((del) => (
              <div key={del.registration_id} className="flex justify-center">
                <ThemeableBadgeCard
                  camper={del}
                  config={themeConfig}
                  isPrintPreview={true}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
