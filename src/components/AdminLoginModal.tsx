import { useState, type FC, type FormEvent } from 'react';
import { 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Shield, 
  User as UserIcon, 
  Sparkles,
  QrCode
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import type { AdminUser, CamperRegistration } from '../types';
import { apiService } from '../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
  onCamperSuccess?: (camper: CamperRegistration) => void;
  onOpenActivation?: () => void;
  defaultTab?: 'camper' | 'admin';
}

export const AdminLoginModal: FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onCamperSuccess,
  onOpenActivation,
  defaultTab = 'camper',
}) => {
  const [authMode, setAuthMode] = useState<'camper' | 'admin'>(defaultTab);

  // Admin form state
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');

  // Camper form state
  const [camperIdentifier, setCamperIdentifier] = useState('');
  const [camperPassword, setCamperPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Admin Sign In
  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiService.loginAdmin(adminIdentifier, adminPasscode);
      if (res.success && res.user) {
        sessionStorage.setItem('vlc_admin_authenticated', 'true');
        sessionStorage.setItem('vlc_admin_user', JSON.stringify(res.user));
        setAdminPasscode('');
        onSuccess(res.user);
      } else {
        setError(res.error || 'Invalid username or passcode.');
      }
    } catch {
      setError('An error occurred during authentication. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Camper Sign In
  const handleCamperLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiService.loginCamper(camperIdentifier, camperPassword);
      if (res.success && res.camper) {
        sessionStorage.setItem('vlc_camper_user', JSON.stringify(res.camper));
        setCamperPassword('');
        if (onCamperSuccess) {
          onCamperSuccess(res.camper);
        }
        onClose();
      } else {
        setError(res.error || 'Camper not found. Please verify your pass code or email.');
      }
    } catch {
      setError('An error occurred during sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-md p-6 sm:p-8">
        <DialogHeader className="space-y-3 items-center text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xs ${
            authMode === 'camper' ? 'bg-[#0b57d0]' : 'bg-zinc-900'
          }`}>
            {authMode === 'camper' ? <UserIcon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-semibold">
                VLC 2027 Portal
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
              {authMode === 'camper' ? 'Camper Sign In' : 'Admin & Staff Sign In'}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-1">
              {authMode === 'camper'
                ? 'Access your official digital pass, room details, and camp schedule.'
                : 'Restricted to authorized VLC 2027 leadership and registration staff.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center pt-1">
          <div className="inline-flex rounded-xl bg-zinc-100 p-1 text-xs w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMode('camper');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                authMode === 'camper' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Camper Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('admin');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                authMode === 'admin' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Admin &amp; Staff
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* CAMPER SIGN IN FORM */}
        {authMode === 'camper' && (
          <form onSubmit={handleCamperLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 block">
                Pass Code or Email Address *
              </label>
              <div className="relative">
                <QrCode className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  required
                  placeholder="e.g. VLC-8842 or camper@email.com"
                  value={camperIdentifier}
                  onChange={(e) => setCamperIdentifier(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 block">
                  Password
                </label>
                <span className="text-[10px] text-zinc-400">Created upon activation</span>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  value={camperPassword}
                  onChange={(e) => setCamperPassword(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In as Camper'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Arrival Activation Callout */}
            {onOpenActivation && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenActivation();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#0b57d0] font-semibold hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
                  <span>Arrived at camp? Activate your pass here &rarr;</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* ADMIN SIGN IN FORM */}
        {authMode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 block">
                Username or Email
              </label>
              <div className="relative">
                <UserIcon className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  required
                  placeholder="e.g. alexius@pcci.ph or Alexius"
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter password..."
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-10 gap-2 text-xs">
              <span>{isLoading ? 'Verifying...' : 'Sign In as Admin'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="pt-2 text-center text-[11px] text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3 w-3 text-zinc-500" />
                Admin authentication verified against database
              </span>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
