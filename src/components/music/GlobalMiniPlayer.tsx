import type { FC } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Maximize2,
  X,
  Music,
  Heart,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

interface GlobalMiniPlayerProps {
  onExpandToMusic: () => void;
  activeTab: string;
  isLoggedIn?: boolean;
}

export const GlobalMiniPlayer: FC<GlobalMiniPlayerProps> = ({
  onExpandToMusic,
  activeTab,
  isLoggedIn = false,
}) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextTrack,
    dismissPlayer,
    isFavorite,
    toggleFavorite,
    isPlayerInitialized,
    isDismissed,
  } = useMusicPlayer();

  // 1. Available ONLY for logged-in users
  if (!isLoggedIn) {
    return null;
  }

  // 2. Only available if initialized from the music page
  if (!isPlayerInitialized) {
    return null;
  }

  // 3. If closed/dismissed by user, keep it closed
  if (isDismissed) {
    return null;
  }

  // 4. Do not show when on the full music page (has its own full docked player bar)
  if (activeTab === 'music') {
    return null;
  }

  // 5. Must have an active track loaded
  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = isFavorite(currentTrack.id);

  return (
    <aside
      aria-label="Floating Audio Mini-Player"
      className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96 z-40 bg-[#16181f]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2.5 sm:p-3 text-white transition-all transform animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Title (clickable to expand to /music) */}
        <div
          onClick={onExpandToMusic}
          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
          title="Click to open full player"
        >
          {/* Thumbnail with Equalizer */}
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 shrink-0 ring-1 ring-white/10 group-hover:ring-[#1db954] transition-all">
            {currentTrack.cover_art_url ? (
              <img
                src={currentTrack.cover_art_url}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                <Music className="w-5 h-5" />
              </div>
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-[#1db954] rounded-full animate-bounce h-2" />
                  <span className="w-0.5 bg-[#1db954] rounded-full animate-bounce h-3 delay-75" />
                  <span className="w-0.5 bg-[#1db954] rounded-full animate-bounce h-1.5 delay-150" />
                </div>
              </div>
            )}
          </div>

          {/* Title & Artist */}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-[#1db954] transition-colors">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] text-zinc-400 truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
              }`}
            />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-8 h-8 rounded-full bg-white hover:bg-zinc-100 text-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            )}
          </button>

          {/* Next Track Button */}
          <button
            onClick={nextTrack}
            title="Next song"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Maximize to /music Page */}
          <button
            onClick={onExpandToMusic}
            title="Open full Praise & Worship Player"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-[#1db954] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Dismiss Player */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissPlayer();
            }}
            title="Stop & close mini player"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="mt-2 w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
        <div
          className="bg-[#1db954] h-full transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </aside>
  );
};
