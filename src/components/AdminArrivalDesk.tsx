import { useState, useEffect, useRef, type FC } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  Camera, 
  CameraOff, 
  Check, 
  RotateCcw,
  Users,
  AlertCircle,
  Mail,
  Loader2
} from 'lucide-react';
import type { CamperRegistration, Church, CheckInStats } from '../types';
import { apiService } from '../services/api';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Input } from './ui/input';

interface AdminArrivalDeskProps {
  churches: Church[];
}

export const AdminArrivalDesk: FC<AdminArrivalDeskProps> = ({ churches }) => {
  const [campers, setCampers] = useState<CamperRegistration[]>([]);
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'checked_in'>('all');
  const [churchFilter, setChurchFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailNotification, setEmailNotification] = useState<string | null>(null);

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [lastScannedResult, setLastScannedResult] = useState<string | null>(null);
  const [scannedCamper, setScannedCamper] = useState<CamperRegistration | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Load data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [camperList, checkInStats] = await Promise.all([
        apiService.getCheckInCampers(),
        apiService.getCheckInStats(),
      ]);
      setCampers(camperList);
      setStats(checkInStats);
    } catch (e) {
      console.error('Failed to load check-in data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      apiService.getCheckInCampers(),
      apiService.getCheckInStats(),
    ]).then(([camperList, checkInStats]) => {
      if (active) {
        setCampers(camperList);
        setStats(checkInStats);
        setIsLoading(false);
      }
    }).catch((e) => {
      console.error('Failed to load check-in data:', e);
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  // Handle camera QR scanner start/stop
  const startScanner = async () => {
    setScannerError(null);
    setIsScanning(true);

    try {
      // Small delay to ensure DOM element exists
      setTimeout(async () => {
        try {
          const qrCodeId = 'qr-reader-container';
          const html5QrCode = new Html5Qrcode(qrCodeId);
          html5QrCodeRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              handleQrScanSuccess(decodedText);
            },
            () => {
              // Non-blocking frame scan error
            }
          );
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Camera access error';
          setScannerError(`Camera error: ${msg}. Please grant camera permissions or type pass code.`);
          setIsScanning(false);
        }
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scanner initialization failed';
      setScannerError(msg);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping QR scanner:', err);
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Process Scanned QR Code
  const handleQrScanSuccess = async (decodedText: string) => {
    if (decodedText === lastScannedResult) return;
    setLastScannedResult(decodedText);

    // Extract code or token from scanned URL or raw code
    let codeOrToken = decodedText.trim();
    try {
      if (decodedText.includes('activate_token=') || decodedText.includes('code=')) {
        const url = new URL(decodedText);
        codeOrToken = url.searchParams.get('activate_token') || url.searchParams.get('code') || codeOrToken;
      }
    } catch {
      // Not a full URL
    }

    try {
      const res = await apiService.checkInCamper({
        code_or_token: codeOrToken,
        action: 'check_in',
        kit_claimed: true,
      });

      if (res.success && res.camper) {
        setScannedCamper(res.camper);
        loadData();
      } else {
        setScannerError(`Scanned "${codeOrToken}", but no matching camper was found.`);
      }
    } catch {
      setScannerError(`Check-in failed for scanned code "${codeOrToken}".`);
    }
  };

  // Manual Check-in Action
  const handleCheckInToggle = async (camper: CamperRegistration, isCheckIn: boolean) => {
    try {
      await apiService.checkInCamper({
        camper_id: camper.id,
        action: isCheckIn ? 'check_in' : 'undo_check_in',
        kit_claimed: isCheckIn ? true : false,
      });
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Toggle Kit Distribution
  const handleToggleKit = async (camper: CamperRegistration) => {
    try {
      await apiService.checkInCamper({
        camper_id: camper.id,
        action: 'toggle_kit',
      });
      loadData();
    } catch (err) {
      console.error('Failed to toggle kit:', err);
    }
  };

  const handleResendEmail = async (camper: CamperRegistration) => {
    setSendingEmailId(camper.id || null);
    setEmailNotification(null);
    try {
      const res = await apiService.resendCamperEmail({
        camper_id: camper.id,
        email: camper.email,
        code: camper.activation_code,
      });
      if (res.success) {
        setEmailNotification(`Passport email successfully dispatched to ${camper.nickname} (${camper.email})!`);
      } else {
        setEmailNotification(`Email send error: ${res.error || 'Failed to dispatch'}`);
      }
    } catch {
      setEmailNotification('Failed to dispatch email');
    } finally {
      setSendingEmailId(null);
      setTimeout(() => setEmailNotification(null), 6000);
    }
  };

  // Filter campers
  const filteredCampers = campers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.full_name?.toLowerCase().includes(q) ||
      c.nickname?.toLowerCase().includes(q) ||
      c.activation_code?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      (c.church_name && c.church_name.toLowerCase().includes(q));

    const isChecked = c.status === 'activated' || Boolean(c.checked_in_at);
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'checked_in' && isChecked) ||
      (statusFilter === 'pending' && !isChecked);

    const matchChurch = churchFilter === 'all' || c.church_id === churchFilter;

    return matchSearch && matchStatus && matchChurch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {emailNotification && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{emailNotification}</span>
          </div>
          <button type="button" onClick={() => setEmailNotification(null)} className="text-blue-500 hover:text-blue-700 ml-2 cursor-pointer font-bold">✕</button>
        </div>
      )}

      {/* Top Arrival Desk Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs font-medium text-zinc-500">Arrivals Checked In</span>
          <div className="mt-2 text-3xl font-bold text-emerald-600 flex items-baseline gap-2">
            <span>{stats?.totalCheckedIn || 0}</span>
            <span className="text-sm font-normal text-zinc-400">/ {stats?.totalRegistered || campers.length}</span>
          </div>
          <div className="mt-2 w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.percentCheckedIn || 0}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">{stats?.percentCheckedIn || 0}% on site</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium text-zinc-500">Pending Delegates</span>
          <div className="mt-2 text-3xl font-bold text-amber-600">
            {(stats?.totalRegistered || campers.length) - (stats?.totalCheckedIn || 0)}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Expected at registration gate</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium text-zinc-500">Camp Kits Claimed</span>
          <div className="mt-2 text-3xl font-bold text-[#0b57d0] flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-[#0b57d0]" />
            <span>{stats?.totalKitsClaimed || 0}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Physical ID kits &amp; lanyards handed out</p>
        </Card>

        <Card className="p-5 bg-zinc-900 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400">Staff Fast Action</span>
            <div className="mt-1 text-sm font-bold text-white">Live Camera QR Scanner</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Scan delegate passes via webcam</p>
          </div>
          <div className="mt-3">
            {isScanning ? (
              <Button
                variant="destructive"
                onClick={stopScanner}
                className="w-full text-xs gap-1.5 h-9 font-semibold"
              >
                <CameraOff className="h-4 w-4" />
                <span>Close Camera</span>
              </Button>
            ) : (
              <Button
                onClick={startScanner}
                className="w-full text-xs gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                <Camera className="h-4 w-4" />
                <span>Launch QR Scanner</span>
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Live Camera Scanner Box */}
      {isScanning && (
        <Card className="p-6 border-2 border-emerald-500/50 bg-zinc-950 text-white animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-80 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Scanner Active</span>
              </div>
              <p className="text-xs text-zinc-400">
                Position delegate&apos;s digital pass or printed QR code in front of the lens.
              </p>
              {scannerError && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{scannerError}</span>
                </div>
              )}
            </div>

            {/* Camera Viewport */}
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-zinc-700 bg-black aspect-square flex items-center justify-center">
              <div id="qr-reader-container" className="w-full h-full" />
            </div>

            {/* Last Scanned Delegate Quick Card */}
            <div className="w-full md:w-80">
              {scannedCamper ? (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check-in Verified!</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                      {scannedCamper.selfie_url ? (
                        <img src={scannedCamper.selfie_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white">
                          {scannedCamper.nickname.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{scannedCamper.nickname} ({scannedCamper.full_name})</h4>
                      <p className="text-[11px] text-zinc-400">{scannedCamper.church_name}</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        Role: {scannedCamper.role.replace('_', ' ')} &bull; Code: {scannedCamper.activation_code}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">
                    Checked in at {new Date().toLocaleTimeString()}
                  </Badge>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                  <QrCode className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <span>Waiting for delegate pass scan...</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Main Roster Management Card */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-700" />
                <span>On-Site Arrival &amp; Check-In Desk</span>
              </CardTitle>
              <CardDescription>
                Verify arriving delegates, issue camp kits &amp; merchandise, and activate camper portal accounts.
              </CardDescription>
            </div>

            <Button
              variant="outline"
              onClick={loadData}
              disabled={isLoading}
              className="text-xs h-9 gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Roster</span>
            </Button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:max-w-xs">
              <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search name, code, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Filter */}
              <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 bg-zinc-50 text-xs">
                {(['all', 'pending', 'checked_in'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                      statusFilter === s
                        ? 'bg-white text-zinc-900 shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {s === 'checked_in' ? 'Checked In' : s}
                  </button>
                ))}
              </div>

              {/* Church Filter */}
              <select
                value={churchFilter}
                onChange={(e) => setChurchFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-700 cursor-pointer"
              >
                <option value="all">All Churches ({churches.length})</option>
                {churches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delegate Name &amp; Photo</TableHead>
                <TableHead>Church Delegation</TableHead>
                <TableHead>Role &amp; Category</TableHead>
                <TableHead>Pass Code</TableHead>
                <TableHead>Arrival Status</TableHead>
                <TableHead>Camp Kit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-zinc-500">
                    No delegates found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCampers.map((camper) => {
                  const isChecked = camper.status === 'activated' || Boolean(camper.checked_in_at);
                  const kitGiven = Boolean(camper.kit_claimed);

                  return (
                    <TableRow key={camper.id} className={isChecked ? 'bg-emerald-50/20' : ''}>
                      {/* Name & Photo */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                            {camper.selfie_url ? (
                              <img src={camper.selfie_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0b57d0]">
                                {camper.nickname.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-zinc-900 flex items-center gap-1.5">
                              <span>{camper.nickname}</span>
                              <span className="text-[10px] text-zinc-400 font-normal">({camper.full_name})</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {camper.phone} &bull; Age {camper.age}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Church */}
                      <TableCell>
                        <div className="text-xs font-medium text-zinc-800">{camper.church_name}</div>
                        <div className="text-[10px] text-zinc-400">{camper.province}</div>
                      </TableCell>

                      {/* Role & Category */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="capitalize text-[10px]">
                            {camper.role.replace('_', ' ')}
                          </Badge>
                          <span className="text-[10px] text-zinc-500 capitalize">
                            {camper.gender}
                          </span>
                        </div>
                      </TableCell>

                      {/* Pass Code */}
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-zinc-800 bg-zinc-100 px-2 py-1 rounded-md">
                          {camper.activation_code || camper.id?.substring(0, 8)}
                        </span>
                      </TableCell>

                      {/* Arrival Status */}
                      <TableCell>
                        {isChecked ? (
                          <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Checked In</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-700 text-xs">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Pending</span>
                          </div>
                        )}
                        {camper.checked_in_at && (
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            {new Date(camper.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </TableCell>

                      {/* Camp Kit Claimed */}
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggleKit(camper)}
                          className={`tap-pill px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                            kitGiven
                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                              : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <PackageCheck className="w-3 h-3" />
                          <span>{kitGiven ? 'Claimed ✓' : 'Mark Given'}</span>
                        </button>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={sendingEmailId === camper.id}
                            onClick={() => handleResendEmail(camper)}
                            className="text-[11px] h-8 w-8 p-0 text-zinc-500 hover:text-[#0b57d0] hover:bg-blue-50 cursor-pointer"
                            title={`Resend Passport email to ${camper.email}`}
                          >
                            {sendingEmailId === camper.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0b57d0]" />
                            ) : (
                              <Mail className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          {isChecked ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCheckInToggle(camper, false)}
                              className="text-[11px] h-8 text-zinc-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Undo arrival check-in"
                            >
                              Undo
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleCheckInToggle(camper, true)}
                              className="text-xs h-8 gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify &amp; Check In</span>
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
    </div>
  );
};
