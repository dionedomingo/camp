import { type FC } from 'react';
import { 
  Church as ChurchIcon, 
  BookOpen, 
  Phone,
  ShieldAlert
} from 'lucide-react';
import { 
  type CamperRegistration, 
  type CamperRole, 
  type BadgeThemeConfig, 
  type QueueDelegate,
  DEFAULT_BADGE_CONFIG 
} from '../types';
import { QRCodeCanvas } from './ui/QRCodeCanvas';
import { Code128Barcode } from './ui/Code128Barcode';

export interface ThemeableBadgeCardProps {
  camper: CamperRegistration | QueueDelegate;
  config?: Partial<BadgeThemeConfig>;
  className?: string;
  isPrintPreview?: boolean;
}

export const ThemeableBadgeCard: FC<ThemeableBadgeCardProps> = ({
  camper,
  config = {},
  className = '',
  isPrintPreview = false,
}) => {
  const mergedConfig: BadgeThemeConfig = { ...DEFAULT_BADGE_CONFIG, ...config };
  const { preset, orientation, showPhoto, showChurch, showRole, showVerse, showBarcode, showQrCode, showEmergencyContact } = mergedConfig;

  const roleStyles: Record<CamperRole, { label: string; badgeClass: string }> = {
    admin: { label: 'CAMP ADMINISTRATOR', badgeClass: 'bg-zinc-900 text-amber-300 border-amber-400/40' },
    staff: { label: 'CAMP STAFF / OPERATIONS', badgeClass: 'bg-amber-500 text-zinc-950 font-bold' },
    coordinator: { label: 'DELEGATION COORDINATOR', badgeClass: 'bg-blue-600 text-white font-bold' },
    camper: { label: 'REGULAR CAMPER', badgeClass: 'bg-blue-500/20 text-blue-700 border-blue-300' },
    first_timer: { label: 'FIRST-TIMER CAMPER 🌿', badgeClass: 'bg-emerald-500 text-white font-bold' },
    counselor: { label: 'CABIN COUNSELOR', badgeClass: 'bg-purple-600 text-white font-bold' },
    pastor: { label: 'PASTOR / MINISTER', badgeClass: 'bg-red-600 text-white font-bold' },
    worship: { label: 'WORSHIP & ARTS', badgeClass: 'bg-sky-500 text-white font-bold' },
    medical: { label: 'FIRST AID & MEDIC', badgeClass: 'bg-rose-600 text-white font-bold' },
  };

  const currentRole = roleStyles[camper.role] || roleStyles.camper;
  const passCode = camper.activation_code || 'VLC-PASS';
  const printCount = camper.print_count || 0;
  const isReprint = printCount > 1;

  // Activation URL for 2D QR Code
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://summer-camp-vlc2027.pages.dev';
  const qrUrl = `${origin}/?activate_token=${camper.activation_token || ''}&code=${passCode}&event_id=${camper.event_id || ''}`;

  // Theme-specific styling definitions
  const themeStyles = {
    gold: {
      cardBg: 'bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#020617] text-white border-amber-500/40 shadow-[0_10px_35px_rgba(217,119,6,0.15)]',
      headerBg: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-zinc-950',
      headerText: 'text-zinc-950 font-black',
      headerSub: 'text-zinc-900 font-semibold',
      accentColor: '#f59e0b',
      barcodeBg: 'bg-white/95 rounded-xl p-2',
      barcodeColor: '#090d16',
      qrBorder: 'border-amber-400/50',
      verseBox: 'bg-white/5 border border-amber-500/20 text-amber-100',
      reprintBadge: 'bg-amber-400 text-zinc-950 border-amber-300 font-black',
      avatarRing: 'ring-2 ring-amber-400/70',
      eventName: 'VISION & LEADERSHIP CAMP 2027',
      eventTheme: 'ARISE & SHINE (ISAIAH 60:1)',
    },
    emerald: {
      cardBg: 'bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] text-white border-emerald-500/40 shadow-[0_10px_35px_rgba(16,185,129,0.15)]',
      headerBg: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-zinc-950',
      headerText: 'text-zinc-950 font-black',
      headerSub: 'text-emerald-950 font-semibold',
      accentColor: '#10b981',
      barcodeBg: 'bg-white/95 rounded-xl p-2',
      barcodeColor: '#022c22',
      qrBorder: 'border-emerald-400/50',
      verseBox: 'bg-white/5 border border-emerald-400/20 text-emerald-100',
      reprintBadge: 'bg-emerald-400 text-zinc-950 border-emerald-300 font-black',
      avatarRing: 'ring-2 ring-emerald-400/70',
      eventName: 'VISION & LEADERSHIP CAMP 2029',
      eventTheme: 'GREATER GLORY (HAGGAI 2:9)',
    },
    heritage: {
      cardBg: 'bg-white text-zinc-900 border-zinc-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
      headerBg: 'bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#0d47a1] text-white',
      headerText: 'text-white font-bold',
      headerSub: 'text-blue-100',
      accentColor: '#1565c0',
      barcodeBg: 'bg-zinc-50 border border-zinc-200 rounded-xl p-2',
      barcodeColor: '#1f2937',
      qrBorder: 'border-zinc-300',
      verseBox: 'bg-blue-50/60 border border-blue-200/80 text-blue-950',
      reprintBadge: 'bg-red-600 text-white border-red-700 font-bold',
      avatarRing: 'ring-2 ring-[#1565c0]',
      eventName: 'PCCI VISION & LEADERSHIP CAMP',
      eventTheme: 'PENTECOSTAL CHRISTIAN CHURCHES INC.',
    },
    monochrome: {
      cardBg: 'bg-white text-zinc-950 border-2 border-zinc-900 shadow-md',
      headerBg: 'bg-zinc-950 text-white',
      headerText: 'text-white font-black tracking-wider',
      headerSub: 'text-zinc-400 font-mono',
      accentColor: '#18181b',
      barcodeBg: 'bg-zinc-100 border border-zinc-300 rounded-xl p-2',
      barcodeColor: '#09090b',
      qrBorder: 'border-zinc-900',
      verseBox: 'bg-zinc-100 border border-zinc-300 text-zinc-800',
      reprintBadge: 'bg-zinc-950 text-white border-zinc-800 font-mono font-bold',
      avatarRing: 'ring-2 ring-zinc-900',
      eventName: 'NATIONAL DELEGATE BADGE',
      eventTheme: 'PCCI NATIONAL YOUTH ASSEMBLY',
    },
    sunset: {
      cardBg: 'bg-gradient-to-b from-[#431407] via-[#7c2d12] to-[#1c1917] text-white border-orange-500/40 shadow-[0_10px_35px_rgba(249,115,22,0.15)]',
      headerBg: 'bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 text-zinc-950',
      headerText: 'text-zinc-950 font-black',
      headerSub: 'text-orange-950 font-bold',
      accentColor: '#f97316',
      barcodeBg: 'bg-white/95 rounded-xl p-2',
      barcodeColor: '#431407',
      qrBorder: 'border-orange-400/50',
      verseBox: 'bg-white/10 border border-orange-400/30 text-orange-100',
      reprintBadge: 'bg-rose-500 text-white border-rose-400 font-bold',
      avatarRing: 'ring-2 ring-orange-400',
      eventName: 'VLC YOUTH EMPOWERMENT CAMP',
      eventTheme: 'COMMISSIONED & EMPOWERED',
    },
  };

  const theme = themeStyles[preset] || themeStyles.gold;

  // Custom event display text
  const displayEvent = ('event_name' in camper && camper.event_name ? camper.event_name : (camper as CamperRegistration).active_event_name)?.toUpperCase() || theme.eventName;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border print:border-black print:shadow-none transition-all ${
        orientation === 'horizontal' ? 'w-full max-w-[480px] min-h-[300px]' : 'w-full max-w-[340px] min-h-[500px]'
      } ${theme.cardBg} ${className}`}
      style={{
        pageBreakInside: 'avoid',
      }}
    >
      {/* Security Reprint Badge Indicator */}
      {isReprint && (
        <div className="absolute top-2 right-2 z-20">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-sm border ${theme.reprintBadge}`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>REPRINT #{printCount}</span>
          </span>
        </div>
      )}

      {/* PORTRAIT / VERTICAL LAYOUT */}
      {orientation === 'vertical' && (
        <div className="flex flex-col h-full justify-between p-5 space-y-4">
          {/* Header Band */}
          <div className={`-mx-5 -mt-5 p-4 text-center rounded-t-3xl shadow-xs ${theme.headerBg}`}>
            <span className={`text-[10px] uppercase tracking-widest block ${theme.headerSub}`}>
              OFFICIAL DELEGATE IDENTIFICATION
            </span>
            <h1 className={`text-xs sm:text-sm font-bold tracking-tight uppercase line-clamp-1 ${theme.headerText}`}>
              {displayEvent}
            </h1>
          </div>

          {/* Delegate Photo & Identity */}
          <div className="flex flex-col items-center text-center space-y-2 pt-1">
            <div className="relative">
              {showPhoto && camper.selfie_url ? (
                <img
                  src={camper.selfie_url}
                  alt={camper.full_name}
                  className={`w-24 h-24 rounded-full object-cover shadow-md ${theme.avatarRing}`}
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl shadow-md ${
                    preset === 'heritage' || preset === 'monochrome'
                      ? 'bg-zinc-100 text-zinc-800 border-2 border-zinc-300'
                      : 'bg-white/10 text-white border-2 border-white/20'
                  }`}
                >
                  {camper.nickname ? camper.nickname.charAt(0) : camper.full_name.charAt(0)}
                </div>
              )}

              {/* Lanyard Hole Guide in print preview */}
              {isPrintPreview && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-dashed border-zinc-400 bg-white/40" />
              )}
            </div>

            <div className="space-y-0.5">
              <h2 className="text-xl font-black tracking-tight leading-tight">
                &ldquo;{camper.nickname}&rdquo;
              </h2>
              <p className="text-xs font-medium opacity-90 line-clamp-1">
                {camper.full_name}
              </p>
            </div>

            {/* Role & Delegation */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
              {showRole && (
                <span
                  className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-xs ${currentRole.badgeClass}`}
                >
                  {currentRole.label}
                </span>
              )}
              {showChurch && camper.church_name && (
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    preset === 'heritage' || preset === 'monochrome'
                      ? 'bg-zinc-100 text-zinc-700'
                      : 'bg-white/15 text-white/90'
                  }`}
                >
                  <ChurchIcon className="w-3 h-3 text-amber-400" />
                  <span className="line-clamp-1 max-w-[170px]">{camper.church_name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Scripture Anchor Verse */}
          {showVerse && camper.favorite_verse && (
            <div className={`p-2.5 rounded-2xl text-center space-y-0.5 ${theme.verseBox}`}>
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
                <BookOpen className="w-3 h-3" />
                <span>Scripture Anchor</span>
              </div>
              <p className="text-xs font-bold leading-tight">
                &ldquo;{camper.favorite_verse}&rdquo;
              </p>
            </div>
          )}

          {/* Scannable Dual Codes: 1D Barcode & 2D QR Code Included Directly in Layout */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            {/* 1D Linear Barcode for Laser Scanners & Pass Code */}
            {showBarcode && (
              <div className={`flex-1 flex flex-col items-center justify-center ${theme.barcodeBg}`}>
                <Code128Barcode
                  value={passCode}
                  height={34}
                  showText={true}
                  barColor={theme.barcodeColor}
                  textColor={theme.barcodeColor}
                />
              </div>
            )}

            {/* 2D QR Code for Fast Mobile Arrival Scanning */}
            {showQrCode && (
              <div className={`p-1.5 bg-white rounded-2xl shrink-0 border ${theme.qrBorder} shadow-2xs`}>
                <QRCodeCanvas value={qrUrl} size={70} />
              </div>
            )}
          </div>

          {/* Optional Emergency Contact Footer */}
          {showEmergencyContact && camper.emergency_name && (
            <div className="text-[10px] opacity-75 pt-1 border-t border-white/10 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>ICE: {camper.emergency_name}</span>
              </span>
              <span className="font-mono">{camper.emergency_phone}</span>
            </div>
          )}
        </div>
      )}

      {/* LANDSCAPE / HORIZONTAL LAYOUT */}
      {orientation === 'horizontal' && (
        <div className="flex flex-col h-full justify-between p-5 space-y-3">
          {/* Top Banner Header */}
          <div className={`-mx-5 -mt-5 p-3 px-5 flex items-center justify-between rounded-t-3xl shadow-xs ${theme.headerBg}`}>
            <div>
              <span className={`text-[9px] uppercase tracking-widest block ${theme.headerSub}`}>
                PCCI OFFICIAL BADGE
              </span>
              <h1 className={`text-xs sm:text-sm font-black tracking-tight uppercase line-clamp-1 ${theme.headerText}`}>
                {displayEvent}
              </h1>
            </div>
            {showRole && (
              <span
                className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-xs ${currentRole.badgeClass}`}
              >
                {currentRole.label}
              </span>
            )}
          </div>

          {/* Center Content: Avatar + Names on Left, Codes on Right */}
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Left Column: Avatar + Names */}
            <div className="col-span-7 flex items-center gap-3">
              {showPhoto && camper.selfie_url ? (
                <img
                  src={camper.selfie_url}
                  alt={camper.full_name}
                  className={`w-18 h-18 rounded-full object-cover shrink-0 shadow-md ${theme.avatarRing}`}
                />
              ) : (
                <div
                  className={`w-18 h-18 rounded-full flex items-center justify-center font-bold text-2xl shrink-0 shadow-md ${
                    preset === 'heritage' || preset === 'monochrome'
                      ? 'bg-zinc-100 text-zinc-800 border-2 border-zinc-300'
                      : 'bg-white/10 text-white border-2 border-white/20'
                  }`}
                >
                  {camper.nickname ? camper.nickname.charAt(0) : camper.full_name.charAt(0)}
                </div>
              )}

              <div className="space-y-0.5">
                <h2 className="text-lg font-black tracking-tight leading-tight">
                  &ldquo;{camper.nickname}&rdquo;
                </h2>
                <p className="text-xs font-semibold opacity-90 line-clamp-1">
                  {camper.full_name}
                </p>
                {showChurch && camper.church_name && (
                  <p className="text-[10px] opacity-80 flex items-center gap-1 line-clamp-1 mt-0.5">
                    <ChurchIcon className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{camper.church_name}</span>
                  </p>
                )}
                {showVerse && camper.favorite_verse && (
                  <p className="text-[10px] italic font-medium opacity-75 line-clamp-1 pt-0.5">
                    Anchor: {camper.favorite_verse}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Scannable 1D Barcode & 2D QR Code */}
            <div className="col-span-5 flex items-center justify-end gap-2">
              {showBarcode && (
                <div className={`flex flex-col items-center justify-center ${theme.barcodeBg}`}>
                  <Code128Barcode
                    value={passCode}
                    height={38}
                    width={110}
                    showText={true}
                    barColor={theme.barcodeColor}
                    textColor={theme.barcodeColor}
                  />
                </div>
              )}
              {showQrCode && (
                <div className={`p-1 bg-white rounded-xl shrink-0 border ${theme.qrBorder} shadow-2xs`}>
                  <QRCodeCanvas value={qrUrl} size={64} />
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] opacity-80">
            <span>Pass: <strong className="font-mono tracking-wider">{passCode}</strong></span>
            <span>Delegation: {camper.province || 'Philippines'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
