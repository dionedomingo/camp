import { useState, type FC, type FormEvent } from 'react';
import { 
  Plus, 
  RefreshCw, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Church as ChurchIcon,
  ExternalLink,
  Lock,
  Users,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import type { Church } from '../types';
import { apiService } from '../services/api';
import { getBaseUrl } from '../lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface AdminChurchManagerProps {
  churches: Church[];
  onChurchesUpdated: () => void;
  onExitAdmin?: () => void;
}

export const AdminChurchManager: FC<AdminChurchManagerProps> = ({
  churches,
  onChurchesUpdated,
  onExitAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChurch, setEditingChurch] = useState<Church | null>(null);
  const [formData, setFormData] = useState<Partial<Church>>({
    name: '',
    slug: '',
    province: 'Cagayan',
    city: '',
    pastor_name: '',
    contact_email: '',
    target_quota: 40,
  });

  const provinces = ['all', 'Cagayan', 'Nueva Vizcaya', 'Open / Other'];

  const filtered = churches.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince =
      selectedProvince === 'all' ||
      c.province.toLowerCase() === selectedProvince.toLowerCase();
    return matchesSearch && matchesProvince;
  });

  const totalQuota = churches.reduce((sum, c) => sum + (c.target_quota || 0), 0);
  const totalRegistered = churches.reduce((sum, c) => sum + (c.registered_count || 0), 0);

  const handleCopyLink = (slug: string) => {
    const url = `${getBaseUrl()}/join?church=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleSyncPcci = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await apiService.syncPcciChurches();
      setSyncStatus(`Successfully synchronized ${res.syncedCount} official PCCI churches.`);
      onChurchesUpdated();
      setTimeout(() => setSyncStatus(null), 4000);
    } catch {
      setSyncStatus('Sync encountered an issue; offline fallback retained.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingChurch(null);
    setFormData({
      name: '',
      slug: '',
      province: 'Cagayan',
      city: '',
      pastor_name: '',
      contact_email: '',
      target_quota: 40,
    });
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (church: Church) => {
    setEditingChurch(church);
    setFormData({ ...church });
    setIsFormOpen(true);
  };

  const handleDelete = async (church: Church) => {
    if (church.id === 'ch_open_delegate') {
      alert('The Independent Delegate option cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to remove "${church.name}" from VLC 2027 delegations?`)) {
      await apiService.deleteChurch(church.id);
      onChurchesUpdated();
    }
  };

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.province || !formData.city) {
      alert('Please fill in Church Name, Province, and City.');
      return;
    }

    const generatedSlug = (formData.slug || formData.name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    if (editingChurch) {
      await apiService.updateChurch({
        ...formData,
        id: editingChurch.id,
        slug: generatedSlug,
      } as Church);
    } else {
      await apiService.createChurch({
        ...formData,
        slug: generatedSlug,
      });
    }

    setIsFormOpen(false);
    onChurchesUpdated();
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Header Card */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 font-semibold text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-900" />
                PCCI Administration
              </Badge>
              <span className="text-xs text-zinc-500">SEC Reg. No. 81696</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Church &amp; Delegation Management
            </CardTitle>
            <CardDescription>
              Configure participating congregations, invite links, target quotas, and sync with the PCCI national registry.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleSyncPcci}
              disabled={isSyncing}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync PCCI Registry'}</span>
            </Button>

            <Button onClick={handleOpenAddModal} className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Church</span>
            </Button>

            {onExitAdmin && (
              <Button
                variant="destructive"
                onClick={onExitAdmin}
                className="gap-1.5 text-xs"
                title="Lock Admin Portal and return to Overview"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Lock Portal</span>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Active Delegations</span>
            <Building2 className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">{churches.length}</div>
          <p className="text-xs text-zinc-500 mt-1">Jesus Is Alive worship centers</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Total Delegations Quota</span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">{totalQuota}</div>
          <p className="text-xs text-zinc-500 mt-1">Target camper capacity</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Registered Delegates</span>
            <ChurchIcon className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">{totalRegistered}</div>
          <p className="text-xs text-zinc-500 mt-1">Confirmed signups across all churches</p>
        </Card>
      </div>

      {/* Main Table Card with Search & Province Tabs */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search delegations or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Province Filter Tabs */}
            <Tabs value={selectedProvince} onValueChange={setSelectedProvince}>
              <TabsList>
                {provinces.map((prov) => (
                  <TabsTrigger key={prov} value={prov} className="capitalize">
                    {prov === 'all' ? 'All Regions' : prov}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Delegation Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Pastor &amp; Contact</TableHead>
                <TableHead className="text-center">Quota &amp; Reg</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                    No church delegations found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((church) => {
                  const isSpecial = church.id === 'ch_open_delegate';
                  const percentFilled = church.target_quota > 0 
                    ? Math.round(((church.registered_count || 0) / church.target_quota) * 100) 
                    : 0;

                  return (
                    <TableRow key={church.id}>
                      {/* Name & Slug */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900">{church.name}</span>
                            {isSpecial && (
                              <Badge variant="secondary" className="text-[10px]">
                                Open Delegate
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                            <span>?church={church.slug}</span>
                            <button
                              onClick={() => handleCopyLink(church.slug)}
                              title="Copy invite URL"
                              className="text-zinc-400 hover:text-zinc-700 cursor-pointer p-0.5"
                            >
                              {copiedSlug === church.slug ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <div className="text-xs text-zinc-700 font-medium">{church.city}</div>
                        <div className="text-[11px] text-zinc-500">{church.province}</div>
                      </TableCell>

                      {/* Pastor & Email */}
                      <TableCell>
                        <div className="text-xs text-zinc-700">{church.pastor_name || '—'}</div>
                        <div className="text-[11px] text-zinc-400">{church.contact_email || '—'}</div>
                      </TableCell>

                      {/* Quota & Capacity */}
                      <TableCell className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-semibold text-xs text-zinc-900">
                            {church.registered_count || 0} / {church.target_quota}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {percentFilled}% full
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(church.slug)}
                            className="h-8 gap-1 text-xs"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span className="hidden sm:inline">
                              {copiedSlug === church.slug ? 'Copied' : 'Link'}
                            </span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditModal(church)}
                            title="Edit Delegation"
                            className="h-8 w-8"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-zinc-600" />
                          </Button>

                          {!isSpecial && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(church)}
                              title="Delete Delegation"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Church Dialog Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent onClose={() => setIsFormOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingChurch ? 'Edit Church Delegation' : 'Add New Church Delegation'}
            </DialogTitle>
            <DialogDescription>
              {editingChurch
                ? 'Update delegation details, target quota, or contact person.'
                : 'Register a new participating church delegation for VLC 2027.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Church Name *</label>
              <Input
                required
                placeholder="e.g. Jesus Is Alive Worship Center - Bambang"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Province *</label>
                <select
                  value={formData.province || 'Cagayan'}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="Cagayan">Cagayan</option>
                  <option value="Nueva Vizcaya">Nueva Vizcaya</option>
                  <option value="Metro Manila">Metro Manila</option>
                  <option value="Open / Other">Open / Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">City / Municipality *</label>
                <Input
                  required
                  placeholder="e.g. Bambang"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Invite Slug</label>
                <Input
                  placeholder="e.g. jia-bambang"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Target Quota</label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.target_quota || 40}
                  onChange={(e) => setFormData({ ...formData, target_quota: parseInt(e.target.value) || 40 })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Pastor / Coordinator Name</label>
              <Input
                placeholder="e.g. Pastor Caleb Ramos"
                value={formData.pastor_name || ''}
                onChange={(e) => setFormData({ ...formData, pastor_name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Contact Email</label>
              <Input
                type="email"
                placeholder="pastor@pcci.ph"
                value={formData.contact_email || ''}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingChurch ? 'Save Changes' : 'Create Delegation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
