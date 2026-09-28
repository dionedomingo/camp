import { useState, useEffect, type FC } from 'react';
import { 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock, 
  Eye, 
  EyeOff,
  ShieldCheck
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
import { apiService } from '../services/api';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
  initialToken?: string | null;
}

export const ResetPasswordModal: FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
  initialToken,
}) => {
  // Resolve active reset token from prop or fallback to URL query parameters
  const resolveToken = () => {
    if (initialToken && initialToken.trim()) return initialToken.trim();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken =
        params.get('reset_token') ||
        params.get('resetToken') ||
        (!params.get('activate_token') && !params.get('code') && !params.get('activate') ? params.get('token') : null);
      if (urlToken && urlToken.trim()) return urlToken.trim();
    }
    return '';
  };

  const activeToken = resolveToken();
  const mode = activeToken ? 'reset' : 'request';
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(Boolean(activeToken));
  const [targetUserName, setTargetUserName] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // When activeToken is provided, verify it
  useEffect(() => {
    if (!activeToken) return;
    let isMounted = true;

    apiService.verifyResetToken(activeToken)
      .then((res) => {
        if (!isMounted) return;
        if (res.valid) {
          setTargetUserName(res.full_name || res.email || null);
        } else {
          setErrorMessage(res.error || 'This reset link has expired or is invalid.');
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to verify reset token.';
        setErrorMessage(msg);
      })
      .finally(() => {
        if (isMounted) setIsVerifyingToken(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeToken]);

  if (!isOpen) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await apiService.forgotPassword(email.trim());
      if (res.success) {
        setIsSuccess(true);
        setStatusMessage(
          res.message || 'If an account exists with this email address, a password reset link has been dispatched to your inbox.'
        );
      } else {
        setErrorMessage(res.error || 'Failed to request password reset.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeToken) {
      setErrorMessage('Reset token is required.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await apiService.resetPassword(activeToken, newPassword);
      if (res.success) {
        setIsSuccess(true);
        setStatusMessage(res.message || 'Your password has been reset successfully!');
      } else {
        setErrorMessage(res.error || 'Failed to reset password. Link may have expired.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormState = () => {
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSuccess(false);
  };

  const handleReturnToLogin = () => {
    resetFormState();
    onClose();
    onBackToLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetFormState();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs mb-1">
            <KeyRound className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            {mode === 'request' ? 'Reset Your Password' : 'Create New Password'}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-zinc-500">
            {mode === 'request'
              ? 'Enter your registered email address to receive a secure password reset link.'
              : targetUserName
              ? `Choose a new secure password for ${targetUserName}.`
              : 'Choose a new secure password for your VLC 2027 account.'}
          </DialogDescription>
        </DialogHeader>

        {isVerifyingToken ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-xs text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Verifying password reset security token...</span>
          </div>
        ) : isSuccess ? (
          <div className="py-4 space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold text-xs leading-relaxed">
                {statusMessage}
              </p>
              {mode === 'request' && (
                <p className="text-[11px] text-emerald-700">
                  Be sure to check your spam/junk folder if the email does not arrive within 2 minutes.
                </p>
              )}
            </div>

            <Button
              onClick={handleReturnToLogin}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs h-10 rounded-xl"
            >
              Sign In with New Password
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {mode === 'request' ? (
              <form onSubmit={handleRequestReset} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 block">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="email"
                      placeholder="e.g. camper@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 text-xs h-10"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    We will send a 60-minute password reset link to this address.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 rounded-xl gap-2 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Password Reset Email</span>
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleExecuteReset} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 block">
                    New Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9 pr-9 text-xs h-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 text-xs h-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 rounded-xl gap-2 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Update &amp; Secure Account</span>
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-center">
              <button
                type="button"
                onClick={handleReturnToLogin}
                className="text-xs text-zinc-500 hover:text-zinc-800 font-medium flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
