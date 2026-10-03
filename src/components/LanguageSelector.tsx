import { useState, useRef, useEffect, type FC } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../lib/i18n';

interface LanguageSelectorProps {
  variant?: 'header' | 'hero' | 'minimal' | 'drawer';
}

export const LanguageSelector: FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  if (variant === 'drawer') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('drawer.language')}</span>
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            {currentOption.flag} {currentOption.nativeName}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-sm leading-none">{lang.flag}</span>
                <span className="truncate">{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15 text-xs font-semibold">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              language === lang.code
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language (English / Tagalog / Ilokano)"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          variant === 'hero'
            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-xs'
            : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 hover:text-zinc-900 border border-zinc-200/80 shadow-2xs'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-[11px] font-bold tracking-tight">{currentOption.flag}</span>
        <span className="hidden xs:inline">{currentOption.nativeName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-zinc-200 dark:border-white/15 shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-white/5 mb-1">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div>
                    <div className="leading-tight">{lang.nativeName}</div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500">{lang.label}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
