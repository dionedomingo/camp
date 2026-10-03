import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type FC,
  type ReactNode,
} from 'react';
import type { MusicTrack, MusicPlaylist } from '../types';
import { apiService } from '../services/api';

const CACHE_NAME = 'vlc2027-music-v1';
const FAVORITES_STORAGE_KEY = 'vlc_music_favorites';
const OFFLINE_TRACKS_KEY = 'vlc_offline_tracks';

export interface MusicPlayerContextType {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  favorites: string[];
  offlineTrackIds: string[];
  isQueueOpen: boolean;
  isLoading: boolean;
  audioError: string | null;
  activeQueue: MusicTrack[];
  
  // Actions
  playTrack: (index: number, customQueue?: MusicTrack[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  cacheTrackOffline: (track: MusicTrack) => Promise<boolean>;
  downloadTrackMp3: (track: MusicTrack) => Promise<void>;
  refreshTracks: () => Promise<void>;
  setIsQueueOpen: (open: boolean) => void;
  dismissPlayer: () => void;
  setAudioError: (error: string | null) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const MusicPlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeQueue, setActiveQueue] = useState<MusicTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Local Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Offline Cached Track IDs
  const [offlineTrackIds, setOfflineTrackIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(OFFLINE_TRACKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load Tracks & Playlists
  const refreshTracks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiService.getMusicTracks();
      if (res.success && res.tracks) {
        setTracks(res.tracks);
        setPlaylists(res.playlists || []);
        setActiveQueue((prev) => (prev.length === 0 ? res.tracks : prev));
      }
    } catch (err: unknown) {
      console.warn('[MusicPlayerContext] Load tracks error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTracks();
  }, [refreshTracks]);

  // Current track derivation
  const currentTrack: MusicTrack | null = useMemo(() => {
    if (activeQueue.length === 0) return tracks[currentTrackIndex] || null;
    return activeQueue[currentTrackIndex] || activeQueue[0] || null;
  }, [activeQueue, currentTrackIndex, tracks]);

  // Handle Play/Pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(null);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
          setAudioError('Playback failed. Please check your connection.');
        });
    }
  }, [currentTrack, isPlaying]);

  // Play Specific Track
  const playTrack = useCallback(
    (index: number, customQueue?: MusicTrack[]) => {
      const queueToUse = customQueue || (activeQueue.length > 0 ? activeQueue : tracks);
      if (queueToUse.length === 0) return;

      const safeIndex = Math.max(0, Math.min(index, queueToUse.length - 1));
      setActiveQueue(queueToUse);
      setCurrentTrackIndex(safeIndex);
      setCurrentTime(0);
      setAudioError(null);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('Playback error on playTrack:', err);
              setIsPlaying(false);
              setAudioError('Audio playback was prevented by browser policy or file format.');
            });
        }
      }, 50);
    },
    [activeQueue, tracks]
  );

  // Next Track
  const nextTrack = useCallback(() => {
    const queue = activeQueue.length > 0 ? activeQueue : tracks;
    if (queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playTrack(randomIndex, queue);
      return;
    }

    const nextIndex = (currentTrackIndex + 1) % queue.length;
    playTrack(nextIndex, queue);
  }, [activeQueue, tracks, isShuffle, currentTrackIndex, playTrack]);

  // Previous Track
  const prevTrack = useCallback(() => {
    const queue = activeQueue.length > 0 ? activeQueue : tracks;
    if (queue.length === 0) return;

    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }

    const prevIndex = (currentTrackIndex - 1 + queue.length) % queue.length;
    playTrack(prevIndex, queue);
  }, [activeQueue, tracks, currentTime, currentTrackIndex, playTrack]);

  // Seek
  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  // Volume
  const setVolume = useCallback((vol: number) => {
    const safeVol = Math.max(0, Math.min(1, vol));
    setVolumeState(safeVol);
    setIsMuted(safeVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = safeVol;
    }
  }, []);

  // Mute toggle
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Favorites toggle
  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignored
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (trackId: string) => favorites.includes(trackId),
    [favorites]
  );

  // Offline Cache via Cache API
  const cacheTrackOffline = useCallback(async (track: MusicTrack): Promise<boolean> => {
    if (typeof window === 'undefined' || !('caches' in window)) {
      alert('Offline storage is not supported in this browser.');
      return false;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      // Fetch audio file and put into cache
      const response = await fetch(track.audio_url, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await cache.put(track.audio_url, response.clone());

      // If cover art exists, cache it too
      if (track.cover_art_url) {
        try {
          const coverRes = await fetch(track.cover_art_url, { mode: 'cors' });
          if (coverRes.ok) await cache.put(track.cover_art_url, coverRes);
        } catch {
          // Non-critical
        }
      }

      setOfflineTrackIds((prev) => {
        const next = Array.from(new Set([...prev, track.id]));
        try {
          localStorage.setItem(OFFLINE_TRACKS_KEY, JSON.stringify(next));
        } catch {
          // Ignored
        }
        return next;
      });

      return true;
    } catch (err: unknown) {
      console.warn('Failed to cache track offline:', err);
      return false;
    }
  }, []);

  // Direct MP3 Download
  const downloadTrackMp3 = useCallback(async (track: MusicTrack) => {
    try {
      const res = await fetch(track.audio_url);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanFileName = `${track.title} - ${track.artist}`.replace(/[^a-zA-Z0-9_\- ]/g, '');
      a.download = `${cleanFileName}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      console.warn('Failed to download track:', err);
      // Fallback: open URL in new window
      window.open(track.audio_url, '_blank');
    }
  }, []);

  // Dismiss player
  const dismissPlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  // Native Audio Event Listeners
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const onAudioEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || isShuffle) {
      nextTrack();
    } else {
      if (currentTrackIndex < activeQueue.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    }
  };

  // Sync MediaSession API (Lock screen, smartwatch, and car Bluetooth controls)
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || !currentTrack) {
      return;
    }

    try {
      const artwork = currentTrack.cover_art_url
        ? [
            { src: currentTrack.cover_art_url, sizes: '96x96', type: 'image/jpeg' },
            { src: currentTrack.cover_art_url, sizes: '192x192', type: 'image/jpeg' },
            { src: currentTrack.cover_art_url, sizes: '512x512', type: 'image/jpeg' },
          ]
        : [];

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || 'VLC 2027: Arise & Shine',
        artwork,
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) seekTo(details.seekTime);
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        seekTo(Math.max(currentTime - (details.seekOffset || 10), 0));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        seekTo(Math.min(currentTime + (details.seekOffset || 10), duration));
      });
    } catch {
      // Ignored
    }
  }, [currentTrack, isPlaying, currentTime, duration, togglePlayPause, prevTrack, nextTrack, seekTo]);

  // Sync MediaSession position state for scrub bar on lock screen
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'mediaSession' in navigator &&
      'setPositionState' in navigator.mediaSession &&
      duration > 0
    ) {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: 1.0,
          position: Math.min(currentTime, duration),
        });
      } catch {
        // Ignored
      }
    }
  }, [currentTime, duration]);

  const value = useMemo<MusicPlayerContextType>(
    () => ({
      tracks,
      playlists,
      currentTrack,
      currentTrackIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      favorites,
      offlineTrackIds,
      isQueueOpen,
      isLoading,
      audioError,
      activeQueue,
      playTrack,
      togglePlayPause,
      nextTrack,
      prevTrack,
      seekTo,
      setVolume,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      toggleFavorite,
      isFavorite,
      cacheTrackOffline,
      downloadTrackMp3,
      refreshTracks,
      setIsQueueOpen,
      dismissPlayer,
      setAudioError,
    }),
    [
      tracks,
      playlists,
      currentTrack,
      currentTrackIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      favorites,
      offlineTrackIds,
      isQueueOpen,
      isLoading,
      audioError,
      activeQueue,
      playTrack,
      togglePlayPause,
      nextTrack,
      prevTrack,
      seekTo,
      setVolume,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      toggleFavorite,
      isFavorite,
      cacheTrackOffline,
      downloadTrackMp3,
      refreshTracks,
      dismissPlayer,
    ]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {/* Root Persistent HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.audio_url || ''}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
        onError={() => {
          if (currentTrack?.audio_url) {
            setAudioError('Failed to load audio stream. Please check connection.');
            setIsPlaying(false);
          }
        }}
        preload="metadata"
      />
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
