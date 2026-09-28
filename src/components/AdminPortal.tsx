import { useState, type FC } from 'react';
import { 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  BookOpen, 
  Users,
  Search,
  PanelLeft
} from 'lucide-react';
import type { Church, RegistrationStats, AdminUser } from '../types';
import type { AdminTab } from './AdminLeftDrawer';
import { AdminChurchManager } from './AdminChurchManager';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminArrivalDesk } from './AdminArrivalDesk';
import { AdminEventManager } from './AdminEventManager';
import { AdminMediaManager } from './AdminMediaManager';
import { AdminIdPrintQueue } from './AdminIdPrintQueue';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';

interface AdminPortalProps {
  currentUser: AdminUser | null;
  churches: Church[];
  stats: RegistrationStats | null;
  onChurchesUpdated: () => void;
  onExitAdmin: () => void;
  onReturnToSite: () => void;
  activeAdminTab: AdminTab;
  onSelectAdminTab: (tab: AdminTab) => void;
  onOpenDrawer?: () => void;
}

export const AdminPortal: FC<AdminPortalProps> = ({
  currentUser,
  churches,
  stats,
  onChurchesUpdated,
  onExitAdmin,
  onReturnToSite,
  activeAdminTab,
  onSelectAdminTab,
  onOpenDrawer,
}) => {
  const [camperSearch, setCamperSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const tabLabels: Record<AdminTab, string> = {
    arrival: 'Arrival Desk',
    print_queue: 'ID Printing Queue',
    users: 'User Management',
    churches: 'Churches & Delegations',
    events: 'Camp Event & Schedule',
    media: 'Media Vault (Cloudflare R2)',
    overview: 'Camp Overview',
    campers: 'Registered Campers',
  };
  const currentTabLabel = tabLabels[activeAdminTab] || 'Admin Module';

  const adminName = currentUser?.name || 'Alexius';
  const adminEmail = currentUser?.email || 'alexius@pcci.ph';
  const adminRole = currentUser?.role || 'admin';

  const recentCampers = stats?.recentSignups || [];
  const filteredCampers = recentCampers.filter((c) => {
    const matchName = c.nickname.toLowerCase().includes(camperSearch.toLowerCase()) ||
      c.church_name.toLowerCase().includes(camperSearch.toLowerCase());
    const matchRole = roleFilter === 'all' || c.role === roleFilter;
    return matchName && matchRole;
  });

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Admin User Profile Banner */}
      <div className="bg-zinc-900 text-zinc-50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-100 flex items-center justify-center font-bold text-xl shadow-xs">
            {adminName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {adminName}
              </h1>
              <Badge variant="outline" className="bg-zinc-800 text-zinc-200 border-zinc-700 uppercase tracking-wider text-[10px]">
                <ShieldCheck className="h-3 w-3 mr-1 text-emerald-400" />
                {adminRole}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {adminEmail} &bull; PCCI National Headquarters
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenDrawer && (
            <Button
              variant="outline"
              onClick={onOpenDrawer}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 text-xs gap-1.5 h-9 cursor-pointer"
              title="Open left drawer navigation"
            >
              <PanelLeft className="h-3.5 w-3.5 text-zinc-300" />
              <span>Left Drawer</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onReturnToSite}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 text-xs gap-1.5 h-9"
            title="View public registration landing page"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public Site</span>
          </Button>

          <Button
            variant="destructive"
            onClick={onExitAdmin}
            className="text-xs gap-1.5 h-9"
            title="Lock and sign out of admin session"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Lock &amp; Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Admin Module Header & Left Drawer Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          {onOpenDrawer && (
            <Button
              variant="outline"
              onClick={onOpenDrawer}
              className="gap-2 h-9 text-xs font-semibold bg-white border-zinc-300 shadow-2xs hover:bg-zinc-50 cursor-pointer"
            >
              <PanelLeft className="w-4 h-4 text-zinc-700" />
              <span>Admin Menu (Left Drawer)</span>
            </Button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-900">
              {currentTabLabel}
            </span>
            <Badge variant="outline" className="text-[10px] uppercase font-mono bg-zinc-50">
              Active Module
            </Badge>
          </div>
        </div>

        <span className="text-xs text-zinc-500 hidden sm:inline">
          VLC 2027 Admin Suite &bull; PCCI
        </span>
      </div>

      {/* 0. Arrival Check-In Desk Tab */}
      {activeAdminTab === 'arrival' && (
        <AdminArrivalDesk churches={churches} />
      )}

      {/* ID Badge Printing Queue Tab */}
      {activeAdminTab === 'print_queue' && (
        <AdminIdPrintQueue churches={churches} currentUser={currentUser} />
      )}

      {/* 1. User Management Tab */}
      {activeAdminTab === 'users' && (
        <AdminUserManagement currentUser={currentUser} churches={churches} />
      )}

      {/* 2. Churches & Delegations Management Tab */}
      {activeAdminTab === 'churches' && (
        <AdminChurchManager
          churches={churches}
          onChurchesUpdated={onChurchesUpdated}
        />
      )}

      {/* 3. Camp Event Entity & Dynamic Schedule Builder */}
      {activeAdminTab === 'events' && (
        <AdminEventManager />
      )}

      {/* 4. Cloudflare R2 Media & Assets Vault */}
      {activeAdminTab === 'media' && (
        <AdminMediaManager />
      )}

      {/* 4. Camp Overview Tab */}
      {activeAdminTab === 'overview' && stats && (
        <div className="space-y-6 animate-fadeIn">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-5">
              <span className="text-xs font-medium text-zinc-500">Total Registered</span>
              <div className="mt-2 text-3xl font-bold text-zinc-900">
                {stats.totalRegistered} <span className="text-sm font-normal text-zinc-400">/ {stats.targetCapacity}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{stats.percentFilled}% capacity filled</p>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-medium text-zinc-500">Official Delegations</span>
              <div className="mt-2 text-3xl font-bold text-zinc-900">{stats.churchBreakdown.length}</div>
              <p className="text-xs text-zinc-500 mt-1">Jesus Is Alive worship centers</p>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-medium text-zinc-500">Provinces Reached</span>
              <div className="mt-2 text-3xl font-bold text-zinc-900">{stats.provinceBreakdown.length}</div>
              <p className="text-xs text-zinc-500 mt-1">Northern Luzon delegations</p>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-medium text-zinc-500">Remaining Slots</span>
              <div className="mt-2 text-3xl font-bold text-zinc-900">{stats.targetCapacity - stats.totalRegistered}</div>
              <p className="text-xs text-emerald-600 mt-1">Open for online signup</p>
            </Card>
          </div>

          {/* Quick Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Delegations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Church Delegations</CardTitle>
                <CardDescription>Delegations with confirmed attendee registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-zinc-100">
                  {stats.churchBreakdown.slice(0, 6).map((church, idx) => (
                    <div key={church.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-100 font-bold flex items-center justify-center text-zinc-600 text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-zinc-900">{church.name}</span>
                          <p className="text-zinc-400 text-[10px]">{church.city}, {church.province}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-zinc-900">
                        {church.count} <span className="font-normal text-zinc-400">/ {church.target_quota}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attendee Roles Distribution</CardTitle>
                <CardDescription>Breakdown by camper role classification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.roleBreakdown.map((item) => (
                    <div key={item.role} className="flex items-center justify-between text-xs">
                      <span className="capitalize font-medium text-zinc-700">{item.role.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.count} delegates</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Delegate Signups Feed (Admin Only) */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold">Recent Delegate Signups</CardTitle>
                  <Badge variant="outline" className="text-[10px] bg-zinc-100 border-zinc-200 text-zinc-700 font-medium">
                    Admin Access Only
                  </Badge>
                </div>
                <CardDescription className="text-xs text-zinc-500 mt-1">
                  Live registration stream from D1 database with role, church delegation, and favorite scriptures.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectAdminTab('campers')}
                className="text-xs gap-1.5 h-8 self-start sm:self-auto cursor-pointer"
              >
                <span>Full Roster</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stats.recentSignups.map((camper, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-2 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                          {camper.nickname.charAt(0)}
                        </div>
                        <span className="font-semibold text-sm text-zinc-900">{camper.nickname}</span>
                      </div>
                      <Badge variant="secondary" className="capitalize text-[10px] px-2 py-0.5">
                        {camper.role.replace('_', ' ')}
                      </Badge>
                    </div>

                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {camper.church_name} &bull; {camper.province}
                    </p>

                    {(camper.age || camper.birthdate) && (
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {camper.age ? `${camper.age} yrs` : ''} {camper.birthdate ? `(🎂 ${camper.birthdate})` : ''}
                      </div>
                    )}

                    <div className="pt-2 border-t border-zinc-200/60 flex items-center gap-1.5 text-[11px] text-zinc-600 italic">
                      <BookOpen className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="truncate">&ldquo;{camper.favorite_verse}&rdquo;</span>
                    </div>

                    <div className="text-[10px] text-zinc-400 text-right">
                      {camper.created_at ? new Date(camper.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4. Registered Campers Tab */}
      {activeAdminTab === 'campers' && (
        <Card className="animate-fadeIn">
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl font-bold">Registered Delegates Roster</CardTitle>
                <CardDescription>
                  Confirmed campers, counselors, pastors, and guest delegates with scripture reflections.
                </CardDescription>
              </div>

              <Badge variant="outline" className="gap-1 font-semibold text-xs self-start sm:self-auto">
                <Users className="h-3 w-3 text-zinc-500" />
                Live D1 Roster
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:max-w-xs">
                <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search camper or church..."
                  value={camperSearch}
                  onChange={(e) => setCamperSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <Tabs value={roleFilter} onValueChange={setRoleFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="camper">Campers</TabsTrigger>
                  <TabsTrigger value="counselor">Counselors</TabsTrigger>
                  <TabsTrigger value="pastor">Pastors</TabsTrigger>
                  <TabsTrigger value="worship">Worship</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delegate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Age &amp; Birthday</TableHead>
                  <TableHead>Delegation &amp; Province</TableHead>
                  <TableHead>Favorite Scripture</TableHead>
                  <TableHead className="text-right">Registered At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                      No registered campers matching filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCampers.map((camper, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {camper.nickname.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900">{camper.nickname}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {camper.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-zinc-900">
                          {camper.age ? `${camper.age} yrs` : '—'}
                        </div>
                        {camper.birthdate && (
                          <div className="text-[11px] text-zinc-500 font-mono">
                            🎂 {camper.birthdate}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium text-zinc-800">{camper.church_name}</div>
                        <div className="text-[11px] text-zinc-500">{camper.province}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-zinc-700 italic">
                          &ldquo;{camper.favorite_verse}&rdquo;
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs text-zinc-500">
                        {camper.created_at ? new Date(camper.created_at).toLocaleDateString() : 'Recent'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
