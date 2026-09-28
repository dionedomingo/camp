import { useState, useEffect, type FC, type FormEvent } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle,
  KeyRound,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { AdminUser, CamperRole, Church } from '../types';
import { apiService } from '../services/api';
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

interface AdminUserManagementProps {
  currentUser: AdminUser | null;
  churches: Church[];
}

export const AdminUserManagement: FC<AdminUserManagementProps> = ({
  currentUser,
  churches,
}) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Dialog State: Add / Edit User
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: CamperRole | string;
    church_id: string;
    password: string;
    is_active: boolean;
  }>({
    name: '',
    email: '',
    role: 'staff',
    church_id: '',
    password: '',
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Dialog State: Promote to Admin Confirmation
  const [userToPromote, setUserToPromote] = useState<AdminUser | null>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoteSuccessMessage, setPromoteSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    const data = await apiService.getAdminUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    apiService.getAdminUsers().then((data) => {
      if (active) {
        setUsers(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredUsers = users.filter((u) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      (u.nickname && u.nickname.toLowerCase().includes(query)) ||
      u.email.toLowerCase().includes(query) ||
      (u.church_name && u.church_name.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (roleFilter === 'all') return true;
    if (roleFilter === 'admin') return u.role === 'admin';
    if (roleFilter === 'staff_coord') return u.role === 'staff' || u.role === 'coordinator';
    if (roleFilter === 'campers') return !['admin', 'staff', 'coordinator'].includes(u.role);
    return u.role === roleFilter;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      church_id: '',
      password: '',
      is_active: true,
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      church_id: user.church_id || '',
      password: '',
      is_active: user.is_active ? true : false,
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleOpenPromoteDialog = (user: AdminUser) => {
    setUserToPromote(user);
    setIsPromoteDialogOpen(true);
  };

  const handleConfirmPromote = async () => {
    if (!userToPromote) return;
    setIsPromoting(true);

    try {
      const res = await apiService.promoteUserRole(userToPromote.id, 'admin');
      if (res.success) {
        setPromoteSuccessMessage(`Successfully promoted ${userToPromote.name} to Administrator!`);
        await fetchUsers();
        setTimeout(() => {
          setPromoteSuccessMessage(null);
          setIsPromoteDialogOpen(false);
          setUserToPromote(null);
        }, 1500);
      } else {
        alert(res.error || 'Failed to promote user');
      }
    } catch {
      alert('An error occurred during promotion.');
    } finally {
      setIsPromoting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Name and email are required');
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      setFormError('Password is required when creating a new user');
      return;
    }

    try {
      if (editingUser) {
        await apiService.updateAdminUser({
          id: editingUser.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          church_id: formData.church_id || undefined,
          is_active: formData.is_active ? 1 : 0,
          password: formData.password ? formData.password : undefined,
        });
      } else {
        await apiService.createAdminUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          church_id: formData.church_id || undefined,
          password: formData.password.trim(),
        });
      }

      setIsDialogOpen(false);
      fetchUsers();
    } catch {
      setFormError('Failed to save user. Please check email uniqueness.');
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.id === 'usr_admin_alexius' || user.email === 'alexius@pcci.ph') {
      alert('The primary admin account (Alexius) cannot be deleted.');
      return;
    }

    if (currentUser?.id === user.id) {
      alert('You cannot delete your own active session.');
      return;
    }

    if (confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
      await apiService.deleteAdminUser(user.id);
      fetchUsers();
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="default" className="gap-1 bg-zinc-900 text-white hover:bg-zinc-800">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            Admin
          </Badge>
        );
      case 'staff':
        return (
          <Badge variant="secondary" className="gap-1 bg-purple-50 text-purple-700 border border-purple-200">
            <Shield className="h-3 w-3" />
            Staff
          </Badge>
        );
      case 'coordinator':
        return (
          <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
            <Users className="h-3 w-3" />
            Coordinator
          </Badge>
        );
      case 'counselor':
        return (
          <Badge variant="outline" className="gap-1 bg-teal-50 text-teal-700 border-teal-200">
            Counselor
          </Badge>
        );
      case 'pastor':
        return (
          <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 border-amber-200">
            Pastor
          </Badge>
        );
      case 'worship':
        return (
          <Badge variant="outline" className="gap-1 bg-rose-50 text-rose-700 border-rose-200">
            Praise &amp; Worship
          </Badge>
        );
      case 'medical':
        return (
          <Badge variant="outline" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
            Medical Team
          </Badge>
        );
      case 'first_timer':
        return (
          <Badge variant="outline" className="gap-1 bg-sky-50 text-sky-700 border-sky-200">
            First Timer
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 bg-zinc-50 text-zinc-700 border-zinc-200">
            Camper
          </Badge>
        );
    }
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const staffCoordCount = users.filter((u) => u.role === 'staff' || u.role === 'coordinator').length;
  const camperCount = users.filter((u) => !['admin', 'staff', 'coordinator'].includes(u.role)).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Total in Database</span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">{users.length}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Unified campers &amp; staff table</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Administrators</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">{adminCount}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Full management &amp; promote powers</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Staff &amp; Coordinators</span>
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">{staffCoordCount}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Desks, registrars &amp; church leads</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Registered Delegates</span>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900">{camperCount}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Eligible for admin promotion</p>
        </Card>
      </div>

      {/* Main Table Card with Search & Filters */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-bold">User &amp; Delegate Management</CardTitle>
              <CardDescription>
                Unified database of campers and leaders. Any admin can promote registered campers to administrator.
              </CardDescription>
            </div>

            <Button onClick={handleOpenAdd} className="gap-1.5 text-xs self-start sm:self-auto">
              <Plus className="h-3.5 w-3.5" />
              <span>Add New User</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:max-w-xs">
              <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search by name, email, or church..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <Tabs value={roleFilter} onValueChange={setRoleFilter}>
              <TabsList>
                <TabsTrigger value="all">All ({users.length})</TabsTrigger>
                <TabsTrigger value="admin">Admins ({adminCount})</TabsTrigger>
                <TabsTrigger value="staff_coord">Staff &amp; Coord ({staffCoordCount})</TabsTrigger>
                <TabsTrigger value="campers">Delegates ({camperCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">User Profile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Delegation Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sign-In</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                    Loading users list...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const isPrimary = user.id === 'usr_admin_alexius' || user.email === 'alexius@pcci.ph';
                  const isCurrent = currentUser?.id === user.id;
                  const isAdmin = user.role === 'admin';

                  return (
                    <TableRow key={user.id}>
                      {/* Name & Email */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-xs ${
                            isAdmin ? 'bg-zinc-900 text-amber-400' : 'bg-zinc-100 text-zinc-700'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                              <span>{user.name}</span>
                              {user.nickname && user.nickname !== user.name && (
                                <span className="text-xs text-zinc-400 font-normal">
                                  ({user.nickname})
                                </span>
                              )}
                              {isPrimary && (
                                <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 bg-amber-600 text-white">
                                  Primary Admin
                                </Badge>
                              )}
                              {isCurrent && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                  You
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-zinc-500">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role Badge */}
                      <TableCell>
                        {renderRoleBadge(user.role)}
                      </TableCell>

                      {/* Church Delegation */}
                      <TableCell>
                        <span className="text-xs text-zinc-600 line-clamp-1">
                          {user.church_name || 'Independent / General'}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                            Deactivated
                          </span>
                        )}
                      </TableCell>

                      {/* Last Login */}
                      <TableCell className="text-xs text-zinc-500">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never'}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* One-click Promote to Admin button */}
                          {!isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenPromoteDialog(user)}
                              title={`Promote ${user.name} to Administrator`}
                              className="h-8 gap-1 text-xs border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 cursor-pointer shadow-2xs"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                              <span className="hidden md:inline">Promote to Admin</span>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(user)}
                            title="Edit User & Roles"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-zinc-600" />
                          </Button>

                          {!isPrimary && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user)}
                              title="Delete User"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
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

      {/* Confirmation Dialog: Promote to Admin */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent onClose={() => setIsPromoteDialogOpen(false)} className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              Promote to Administrator?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-zinc-500">
              Granting admin privileges will allow this user full access to management features.
            </DialogDescription>
          </DialogHeader>

          {promoteSuccessMessage ? (
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{promoteSuccessMessage}</span>
            </div>
          ) : (
            userToPromote && (
              <div className="space-y-3 py-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="font-semibold text-zinc-900 text-sm">
                    {userToPromote.name} {userToPromote.nickname && `(${userToPromote.nickname})`}
                  </div>
                  <div className="text-zinc-500">{userToPromote.email}</div>
                  <div className="text-zinc-500">
                    Current Role: <span className="font-semibold capitalize text-zinc-800">{userToPromote.role}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  <p className="font-semibold flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Admin Permissions Included:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                    <li>Arrival desk verification &amp; kit check-in</li>
                    <li>Promote other delegates to administrators</li>
                    <li>Church and delegation quota management</li>
                    <li>Delegate credential reset</li>
                  </ul>
                </div>
              </div>
            )
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPromoteDialogOpen(false)}
              disabled={isPromoting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPromote}
              disabled={isPromoting || Boolean(promoteSuccessMessage)}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isPromoting ? 'Promoting...' : 'Confirm Promotion'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClose={() => setIsDialogOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? `Edit User: ${editingUser.name}` : 'Create New System User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update role, delegation access, or reset user passcode.'
                : 'Add a new administrator, staff member, or church delegation coordinator.'}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Full Name *</label>
              <Input
                required
                placeholder="e.g. Alexius Santos"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Email Address (Login Username) *</label>
              <Input
                required
                type="email"
                placeholder="e.g. alexius@pcci.ph"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Assigned Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="admin">Administrator (Full Control)</option>
                  <option value="staff">Camp Staff (Logistics &amp; Desk)</option>
                  <option value="coordinator">Delegation Coordinator</option>
                  <option value="pastor">Pastor / Minister</option>
                  <option value="counselor">Counselor</option>
                  <option value="worship">Praise &amp; Worship</option>
                  <option value="medical">Medical Team</option>
                  <option value="camper">Registered Camper</option>
                  <option value="first_timer">First-Timer Delegate</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Assigned Church</label>
                <select
                  value={formData.church_id}
                  onChange={(e) => setFormData({ ...formData, church_id: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="">All Churches (Global)</option>
                  {churches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 flex items-center justify-between">
                <span>{editingUser ? 'New Password (Optional)' : 'Account Password *'}</span>
                {editingUser && <span className="text-[10px] text-zinc-400 font-normal">Leave blank to keep current</span>}
              </label>
              <div className="relative">
                <KeyRound className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder={editingUser ? '••••••••' : 'Enter account password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-9"
                  required={!editingUser}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
              />
              <label htmlFor="is_active" className="text-xs text-zinc-700 font-medium cursor-pointer">
                Account Active &amp; Allowed to Log In
              </label>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
