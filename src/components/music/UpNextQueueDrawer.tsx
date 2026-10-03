import type { FC } from 'react';
import {
  X,
  Play,
  Music,
  Heart,
  ListMusic,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export const UpNextQueueDrawer: FC = () => {
  const {
    currentTrack,
    isPlaying,
    activeQueue,
    isQueueOpen,
    setIsQueueOpen,
    playTrack,
    isFavorite,
    toggleFavorite,
  } = useMusicPlayer();

  if (!isQueueOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsQueueOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-Up Drawer Panel */}
      <aside
        aria-label="Up Next Song Queue"
        className="fixed bottom-0 inset-x-0 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 w-full sm:max-w-md bg-[#16181f] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] text-white animate-in slide-in-from-bottom duration-300 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1db954]/20 border border-[#1db954]/30 text-[#1db954] flex items-center justify-center">
              <ListMusic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Playback Queue</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-zinc-300">
                  {activeQueue.length} songs
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">Upcoming songs in sequence</p>
            </div>
          </div>

          <button
            onClick={() => setIsQueueOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* NOW PLAYING SECTION */}
          {currentTrack && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1db954] mb-2 block">
                Now Playing
              </span>
              <div className="p-3 rounded-2xl bg-[#1db954]/10 border border-[#1db954]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-800 shrink-0 ring-1 ring-white/10">
                    {currentTrack.cover_art_url ? (
                      <img
                        src={currentTrack.cover_art_url}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
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

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1db954] truncate">
                      {currentTrack.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleFavorite(currentTrack.id)}
                    className="p-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorite(currentTrack.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-zinc-400'
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {currentTrack.duration_display}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* UP NEXT LIST */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2 block">
              Up Next
            </span>
            <div className="divide-y divide-white/5 space-y-0.5">
              {activeQueue.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const isFav = isFavorite(track.id);

                return (
                  <div
                    key={`${track.id}_${idx}`}
                    onClick={() => playTrack(idx)}
                    className={`group p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-white/10 text-white'
                        : 'hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    {/* Index or Icon */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-5 text-center text-xs font-mono text-zinc-500 shrink-0">
                        {idx + 1}
                      </span>

                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-zinc-800 shrink-0 ring-1 ring-white/10">
                        {track.cover_art_url ? (
                          <img
                            src={track.cover_art_url}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500">
                            <Music className="w-4 h-4" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h5
                          className={`text-xs font-bold truncate leading-tight ${
                            isCurrent ? 'text-[#1db954]' : 'text-white'
                          }`}
                        >
                          {track.title}
                        </h5>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    {/* Right: Favorite & Duration */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                        className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'
                          }`}
                        />
                      </button>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {track.duration_display}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
