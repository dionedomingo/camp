import { useState, type FC, type FormEvent } from 'react';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  QrCode,
  UserCheck
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
import type { CamperRegistration } from '../types';
import { apiService } from '../services/api';

interface UnifiedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CamperRegistration) => void;
  onOpenActivation?: () => void;
  onOpenSignup?: () => void;
  onForgotPassword?: () => void;
}

export const UnifiedLoginModal: FC<UnifiedLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenActivation,
  onOpenSignup,
  onForgotPassword,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiService.login(identifier, password);
      if (res.success && res.user) {
        // Universal user session storage
        sessionStorage.setItem('vlc_user', JSON.stringify(res.user));

        const isAdminOrStaff = res.user.role === 'admin' || res.user.role === 'staff' || res.user.role === 'coordinator' || Boolean(res.user.is_admin);

        if (isAdminOrStaff) {
          sessionStorage.setItem('vlc_admin_authenticated', 'true');
          sessionStorage.setItem('vlc_admin_user', JSON.stringify({
            id: res.user.id || 'usr_admin',
            name: res.user.full_name || res.user.nickname,
            nickname: res.user.nickname,
            email: res.user.email,
            role: res.user.role,
            church_id: res.user.church_id,
            church_name: res.user.church_name,
            is_active: res.user.is_active ?? 1,
            last_login_at: res.user.last_login_at || new Date().toISOString(),
          }));
        } else {
          sessionStorage.removeItem('vlc_admin_authenticated');
          sessionStorage.removeItem('vlc_admin_user');
        }

        sessionStorage.setItem('vlc_camper_user', JSON.stringify(res.user));

        setPassword('');
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Account not found. Please verify your email or password.');
      }
    } catch {
      setError('An error occurred during authentication. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setIdentifier('alexius@pcci.ph');
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-md p-6 sm:p-8">
        <DialogHeader className="space-y-3 items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xs">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
              Sign In
            </DialogTitle>
          </div>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Email, Nickname, or Code
            </label>
            <Input
              required
              type="text"
              autoFocus
              placeholder="e.g. alexius@pcci.ph or your nickname"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700">
                Password
              </label>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onForgotPassword();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <Input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 text-sm"
            />
          </div>

          {/* Quick Admin Helper Chip */}
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
            >
              <UserCheck className="h-3 w-3 text-zinc-400" />
              <span>Fill Admin (Alexius)</span>
            </button>
            <span className="text-zinc-400">Strict database match</span>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 gap-2 font-semibold shadow-xs"
          >
            <span>{isLoading ? 'Verifying credentials...' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Additional helpful links */}
        <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col gap-2.5 text-center text-xs">
          {onOpenActivation && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenActivation();
              }}
              className="inline-flex items-center justify-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-medium transition-colors cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Arrived at camp? Activate badge code here</span>
            </button>
          )}

          {onOpenSignup && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSignup();
              }}
              className="inline-flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Not registered yet? Register for VLC 2027</span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
