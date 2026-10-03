import type { FC } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../lib/i18n';

interface LanguageSelectorProps {
  variant?: 'header' | 'hero' | 'minimal' | 'drawer';
}

export const LanguageSelector: FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, t } = useLanguage();

  const currentIndex = LANGUAGES.findIndex((l) => l.code === language);
  const currentOption = currentIndex >= 0 ? LANGUAGES[currentIndex] : LANGUAGES[0];
  const nextOption = LANGUAGES[(currentIndex + 1) % LANGUAGES.length];

  const cycleLanguage = () => {
    setLanguage(nextOption.code);
  };

  if (variant === 'drawer') {
    return (
      <button
        type="button"
        onClick={cycleLanguage}
        className="w-full py-2.5 px-3.5 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-all cursor-pointer group"
        title={`Language: ${currentOption.nativeName} (click to switch to ${nextOption.nativeName})`}
      >
        <span className="flex items-center gap-2 font-medium">
          <Globe className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-45 transition-transform" />
          <span>{t('drawer.language')}</span>
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-all">
          {currentOption.nativeName}
        </span>
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={cycleLanguage}
        title={`Language: ${currentOption.nativeName} (click to switch to ${nextOption.nativeName})`}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-white backdrop-blur-md border border-white/15 text-xs font-semibold transition-all cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-blue-300" />
        <span>{currentOption.nativeName}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleLanguage}
      title={`Language: ${currentOption.nativeName} (click to switch to ${nextOption.nativeName})`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
        variant === 'hero'
          ? 'bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-xs'
          : 'bg-zinc-100 hover:bg-zinc-200/80 active:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200/80 shadow-2xs'
      }`}
    >
      <Globe className="w-3.5 h-3.5 text-blue-500" />
      <span>{currentOption.nativeName}</span>
    </button>
  );
};
