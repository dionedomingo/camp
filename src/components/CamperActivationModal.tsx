import { useState, type FC, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Church as ChurchIcon,
  ShieldCheck,
  Eye,
  EyeOff,
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
import type { CamperRegistration } from '../types';
import { apiService } from '../services/api';

interface CamperActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  initialToken?: string;
  onSuccess: (camper: CamperRegistration) => void;
}

export const CamperActivationModal: FC<CamperActivationModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
  initialToken = '',
  onSuccess,
}) => {
  const [passCode, setPassCode] = useState(initialCode);
  const [token] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activatedCamper, setActivatedCamper] = useState<CamperRegistration | null>(null);



  if (!isOpen) return null;

  const handleActivate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = passCode.trim().toUpperCase();
    if (!cleanCode && !token) {
      setError('Please enter your 6-character Pass Code (e.g. VLC-8842).');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiService.activateCamper({
        code: cleanCode,
        token: token || undefined,
        password,
      });

      if (res.success && res.camper) {
        setIsSuccess(true);
        setActivatedCamper(res.camper);

        // Store camper user session
        sessionStorage.setItem('vlc_camper_user', JSON.stringify(res.camper));

        // Celebratory confetti explosion
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0b57d0', '#188038', '#f29900', '#7b1fa2'],
          });
        } catch {
          // Non-blocking
        }

        setTimeout(() => {
          onSuccess(res.camper!);
        }, 1600);
      } else {
        setError(res.error || 'Activation failed. Please check your pass code or see staff.');
      }
    } catch {
      setError('An error occurred during activation. Please try again or visit check-in desk.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-md p-6 sm:p-8">
        <DialogHeader className="space-y-3 items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b57d0] text-white shadow-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-semibold text-[#0b57d0] border-[#d2e3fc] bg-[#e8f0fe]">
                Arrival Check-In &bull; VLC 2027
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
              {isSuccess ? "You're Activated! 🎉" : 'Activate Your Camper Pass'}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-1">
              {isSuccess
                ? 'Welcome to camp! Redirecting to your personal Camper Hub...'
                : 'Welcome to VLC 2027! Verify your pass and set your password to log in.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && activatedCamper ? (
          <div className="space-y-4 py-4 text-center animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#e6f4ea] border border-[#ceead6] space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#188038] text-white flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="font-bold text-sm text-[#137333]">
                {activatedCamper.nickname} is Officially Checked In!
              </h3>
              <p className="text-xs text-[#1e8e3e]">
                {activatedCamper.church_name || 'PCCI Delegation'} &bull; {activatedCamper.province}
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              Logging you into the camp site...
            </p>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="space-y-4 pt-1">
            {/* Pass Code Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 block">
                  Activation / Pass Code *
                </label>
                <span className="text-[10px] text-zinc-400 font-mono">Found on your digital pass</span>
              </div>
              <div className="relative">
                <QrCode className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  required
                  placeholder="e.g. VLC-8842"
                  value={passCode}
                  onChange={(e) => setPassCode(e.target.value.toUpperCase())}
                  className="pl-9 h-11 font-mono uppercase tracking-wider text-sm font-semibold"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 block">
                  Create Your Password *
                </label>
                <span className="text-[10px] text-zinc-400">Min. 4 characters</span>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Choose a password you'll remember"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 h-10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 block">
                Confirm Password *
              </label>
              <div className="relative">
                <ShieldCheck className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              <span>{isLoading ? 'Verifying & Activating...' : 'Activate Pass & Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        <div className="mt-2 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <ChurchIcon className="h-3 w-3" />
            PCCI National Camp 2027
          </span>
          <span className="font-mono text-[10px]">Isaiah 60:1</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
