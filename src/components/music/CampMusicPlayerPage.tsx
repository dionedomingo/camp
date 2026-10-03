import { useState, useEffect, useRef, type FC, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Music,
  Disc3,
  ExternalLink,
  Plus,
  Trash2,
  FileAudio,
  Search,
  Lock,
  Radio,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Mic2
} from 'lucide-react';
import type { CamperRegistration, AdminUser, MusicTrack, MusicPlaylist, MusicCategory } from '../../types';
import { apiService } from '../../services/api';

interface CampMusicPlayerPageProps {
  currentCamper: CamperRegistration | null;
  currentUser: AdminUser | null;
  onOpenLogin: () => void;
  onOpenDigitalPass?: () => void;
}

export const CampMusicPlayerPage: FC<CampMusicPlayerPageProps> = ({
  currentCamper,
  currentUser,
  onOpenLogin,
}) => {
  const isLoggedIn = Boolean(currentCamper || currentUser);
  const isAdmin = Boolean(
    currentUser ||
    currentCamper?.role === 'admin' ||
    currentCamper?.role === 'staff' ||
    currentCamper?.role === 'coordinator' ||
    currentCamper?.is_admin
  );

  // Music state
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MusicCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback state
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [audioError, setAudioError] = useState<string | null>(null);

  // Modals & Panels
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false);
  const [lyricsTrack, setLyricsTrack] = useState<MusicTrack | null>(null);

  // Upload Form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadArtist, setUploadArtist] = useState('VLC Worship Team');
  const [uploadAlbum, setUploadAlbum] = useState('VLC 2027: Arise & Shine');
  const [uploadCategory, setUploadCategory] = useState<MusicTrack['category']>('worship');
  const [uploadLyrics, setUploadLyrics] = useState('');
  const [uploadSpotifyUrl, setUploadSpotifyUrl] = useState('');
  const [uploadYoutubeUrl, setUploadYoutubeUrl] = useState('');
  const [uploadAudioFile, setUploadAudioFile] = useState<File | null>(null);
  const [uploadCoverFile, setUploadCoverFile] = useState<File | null>(null);
  const [uploadDurationDisplay, setUploadDurationDisplay] = useState('3:45');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // HTML Audio Element Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch tracks & curated playlists
  const loadMusic = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiService.getMusicTracks();
      if (res.success && res.tracks) {
        setTracks(res.tracks);
        setPlaylists(res.playlists || []);
      }
    } catch (err: unknown) {
      console.error('[CampMusicPlayerPage] Failed to fetch music:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isLoggedIn) {
      apiService.getMusicTracks().then((res) => {
        if (!isMounted) return;
        if (res.success && res.tracks) {
          setTracks(res.tracks);
          setPlaylists(res.playlists || []);
        }
        setIsLoading(false);
      }).catch((err) => {
        if (!isMounted) return;
        console.error('[CampMusicPlayerPage] Failed to fetch music:', err);
        setIsLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // Filtered tracks based on active category and search
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesCategory =
        selectedCategory === 'all' || track.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [tracks, selectedCategory, searchQuery]);

  const currentTrack: MusicTrack | null = useMemo(() => {
    if (filteredTracks.length === 0) return tracks[0] || null;
    return filteredTracks[currentTrackIndex] || filteredTracks[0] || null;
  }, [filteredTracks, currentTrackIndex, tracks]);

  // Handle Play / Pause
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
          setAudioError('Unable to stream this audio track. Check network connection.');
        });
    }
  }, [currentTrack, isPlaying]);

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setAudioError(null);
    setCurrentTime(0);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback error:', err);
            setIsPlaying(false);
            setAudioError('Audio playback was prevented by browser policy or file format.');
          });
      }
    }, 50);
  };

  const handleNextTrack = () => {
    if (filteredTracks.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * filteredTracks.length);
      playTrack(randomIndex);
      return;
    }
    const nextIndex = (currentTrackIndex + 1) % filteredTracks.length;
    playTrack(nextIndex);
  };

  const handlePrevTrack = () => {
    if (filteredTracks.length === 0) return;
    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }
    const prevIndex = (currentTrackIndex - 1 + filteredTracks.length) % filteredTracks.length;
    playTrack(prevIndex);
  };

  // Audio event listeners
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
      handleNextTrack();
    } else {
      if (currentTrackIndex < filteredTracks.length - 1) {
        handleNextTrack();
      } else {
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Auto detect duration on file selection
  const handleAudioFileChange = (file: File | null) => {
    setUploadAudioFile(file);
    if (!file) return;

    try {
      const tempAudio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      tempAudio.src = objectUrl;
      tempAudio.addEventListener('loadedmetadata', () => {
        const secs = tempAudio.duration;
        if (secs && !isNaN(secs)) {
          setUploadDurationDisplay(formatTime(secs));
        }
        URL.revokeObjectURL(objectUrl);
      });
      // Fallback title from filename
      if (!uploadTitle) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setUploadTitle(cleanTitle);
      }
    } catch {
      // Ignored
    }
  };

  // Admin submit upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadError('Please provide a song title.');
      return;
    }
    if (!uploadAudioFile) {
      setUploadError('Please choose an MP3 audio file to upload.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccessMessage(null);

      const formData = new FormData();
      formData.append('title', uploadTitle.trim());
      formData.append('artist', uploadArtist.trim() || 'VLC Worship Team');
      formData.append('album', uploadAlbum.trim() || 'VLC 2027 Worship');
      formData.append('category', uploadCategory);
      formData.append('duration_display', uploadDurationDisplay);
      formData.append('lyrics', uploadLyrics.trim());
      formData.append('spotify_url', uploadSpotifyUrl.trim());
      formData.append('youtube_url', uploadYoutubeUrl.trim());
      formData.append('uploaded_by', currentUser?.name || currentCamper?.nickname || 'admin');
      formData.append('audio_file', uploadAudioFile);

      if (uploadCoverFile) {
        formData.append('cover_file', uploadCoverFile);
      }

      const result = await apiService.uploadMusicTrack(formData);
      if (result.success && result.track) {
        setUploadSuccessMessage(`Successfully uploaded "${result.track.title}"!`);
        // Refresh music list and select newly uploaded track
        await loadMusic();
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setUploadTitle('');
          setUploadAudioFile(null);
          setUploadCoverFile(null);
          setUploadLyrics('');
          setUploadSuccessMessage(null);
        }, 1200);
      } else {
        setUploadError(result.error || 'Failed to upload song');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading audio file';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Admin delete song
  const handleDeleteTrack = async (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${track.title}"?`)) {
      return;
    }

    try {
      const res = await apiService.deleteMusicTrack(track.id);
      if (res.success) {
        setTracks((prev) => prev.filter((t) => t.id !== track.id));
        if (currentTrack?.id === track.id) {
          setIsPlaying(false);
        }
      } else {
        alert(res.error || 'Failed to delete song');
      }
    } catch {
      alert('Network error while deleting song');
    }
  };

  // Keyboard shortcut: Spacebar to toggle playback when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          togglePlayPause();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  // Render Gatekeeper if logged out
  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Hero Gatekeeper Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181a20] via-[#12141a] to-[#0c0d12] border border-white/10 p-8 sm:p-12 text-center shadow-2xl">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#1db954]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Glowing Vinyl Center Icon */}
          <div className="relative mx-auto mb-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-800 p-1 shadow-2xl ring-4 ring-white/10 flex items-center justify-center group animate-pulse">
            <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center border-4 border-dashed border-zinc-700/60">
              <Disc3 className="w-12 h-12 text-[#1db954] animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1db954]/15 border border-[#1db954]/30 text-[#1db954] text-xs font-bold uppercase tracking-wider mb-4">
            <Radio className="w-3.5 h-3.5" />
            <span>Members &amp; Delegates Exclusive</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            VLC 2027 Praise &amp; Worship Music
          </h1>

          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Experience our camp anthems, live praise recordings, choir sessions, and acoustic night recordings. 
            Access is reserved for registered delegates and church ministers.
          </p>

          {/* Action Sign In Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black font-extrabold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#1db954]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Music className="w-4 h-4 fill-black" />
              <span>Sign In to Open Music Player</span>
            </button>
          </div>

          {/* Teaser Public Links (Spotify & YouTube) */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <a
              href="https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#1db954]/10 border border-[#1db954]/25 hover:border-[#1db954] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1db954] text-black flex items-center justify-center font-black">
                  <Music className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#1db954] transition-colors">
                    Official Spotify Playlist
                  </h4>
                  <p className="text-xs text-zinc-400">Stream on external Spotify</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-red-600/10 border border-red-500/25 hover:border-red-500 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    YouTube Music Playlist
                  </h4>
                  <p className="text-xs text-zinc-400">Stream on YouTube Music</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Active audio URL
  const audioSrc = currentTrack?.audio_url || '';

  return (
    <div className="w-full pb-36 animate-fadeIn">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
        onError={() => {
          if (audioSrc) {
            setAudioError('Failed to load audio stream. Please check format or connection.');
            setIsPlaying(false);
          }
        }}
        preload="metadata"
      />

      {/* Main Spotify-Dark Container */}
      <div className="rounded-3xl bg-gradient-to-b from-[#181a20] via-[#121318] to-[#0c0d10] border border-white/10 p-4 sm:p-7 shadow-2xl text-white">
        
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1db954]/20 text-[#1db954] border border-[#1db954]/30">
                <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping" />
                Camp Audio Player
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                VLC 2027 &bull; Buag Campgrounds
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Praise &amp; Worship Hub</span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-5">
                  <span className="w-1 bg-[#1db954] rounded-full animate-bounce h-4" />
                  <span className="w-1 bg-[#1db954] rounded-full animate-bounce h-5 delay-75" />
                  <span className="w-1 bg-[#1db954] rounded-full animate-bounce h-3 delay-150" />
                </div>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Official camp recordings, anthem tracks, and live worship sets.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {isAdmin && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Upload Song (MP3)</span>
              </button>
            )}

            <button
              onClick={() => {
                if (currentTrack) {
                  setLyricsTrack(currentTrack);
                  setIsLyricsModalOpen(true);
                }
              }}
              disabled={!currentTrack}
              className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Mic2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Lyrics</span>
            </button>
          </div>
        </div>

        {/* Featured External Playlist Cards (Spotify & YouTube Music) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Official Spotify Playlist */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1db954]/25 via-[#1db954]/10 to-transparent border border-[#1db954]/40 p-4 sm:p-5 flex items-center justify-between group hover:border-[#1db954] transition-all shadow-lg shadow-[#1db954]/10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[#1db954] text-black flex items-center justify-center font-black shadow-md shadow-[#1db954]/30 shrink-0 group-hover:scale-105 transition-transform">
                <Music className="w-6 h-6 fill-black text-black" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1db954]">
                    Official Spotify Playlist
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#1db954]/20 text-[#1db954]">
                    Synced
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
                  VLC 2027: Arise &amp; Shine
                </h3>
                <p className="text-xs text-zinc-400 truncate">
                  Stream full high-fidelity album on Spotify
                </p>
              </div>
            </div>

            <a
              href={playlists.find((p) => p.platform === 'spotify')?.url || 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO'}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-pill shrink-0 ml-3 px-3.5 py-2 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>Listen</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          {/* Official YouTube Music Playlist */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600/25 via-red-600/10 to-transparent border border-red-500/40 p-4 sm:p-5 flex items-center justify-between group hover:border-red-500 transition-all shadow-lg shadow-red-600/10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-md shadow-red-600/30 shrink-0 group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    YouTube Music Playlist
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600/20 text-red-400">
                    Live
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
                  PCCI Worship &amp; Youth Gathering
                </h3>
                <p className="text-xs text-zinc-400 truncate">
                  Live conference recordings and lyrics videos
                </p>
              </div>
            </div>

            <a
              href={playlists.find((p) => p.platform === 'youtube')?.url || 'https://music.youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-pill shrink-0 ml-3 px-3.5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>Listen</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {(
              [
                { id: 'all', label: 'All Tracks' },
                { id: 'anthem', label: 'Anthem' },
                { id: 'worship', label: 'Worship' },
                { id: 'praise', label: 'Praise' },
                { id: 'acoustic', label: 'Acoustic' },
                { id: 'reflection', label: 'Reflection' },
              ] as { id: MusicCategory; label: string }[]
            ).map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search song, artist, album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 focus:border-[#1db954] rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Audio Error Alert if any */}
        {audioError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{audioError}</span>
            </div>
            <button
              onClick={() => setAudioError(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Track List Table */}
        <div className="mt-2 divide-y divide-white/5">
          {isLoading ? (
            <div className="py-16 text-center text-zinc-500 text-xs">
              <Disc3 className="w-8 h-8 text-[#1db954] animate-spin mx-auto mb-2" />
              Loading camp music library...
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="py-14 text-center text-zinc-500 text-xs">
              <Music className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              No songs found matching your search.
            </div>
          ) : (
            filteredTracks.map((track, idx) => {
              const isCurrentPlaying = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(idx)}
                  className={`group px-3 sm:px-4 py-3 rounded-2xl flex items-center justify-between gap-3 sm:gap-4 transition-all cursor-pointer ${
                    isCurrentPlaying
                      ? 'bg-white/10 text-white'
                      : 'hover:bg-white/5 text-zinc-300'
                  }`}
                >
                  {/* Left: Index / Play Icon + Cover + Title */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Index or Live Equalizer */}
                    <div className="w-6 text-center text-xs font-mono font-bold shrink-0">
                      {isCurrentPlaying && isPlaying ? (
                        <div className="flex items-end justify-center gap-0.5 h-3.5">
                          <span className="w-1 bg-[#1db954] rounded-full animate-bounce h-2.5" />
                          <span className="w-1 bg-[#1db954] rounded-full animate-bounce h-3.5 delay-75" />
                          <span className="w-1 bg-[#1db954] rounded-full animate-bounce h-2 delay-150" />
                        </div>
                      ) : (
                        <span className="group-hover:hidden text-zinc-500">{idx + 1}</span>
                      )}
                      <Play className="w-3.5 h-3.5 text-white fill-white hidden group-hover:inline mx-auto" />
                    </div>

                    {/* Cover Art Thumbnail */}
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-800 shrink-0 ring-1 ring-white/10">
                      {track.cover_art_url ? (
                        <img
                          src={track.cover_art_url}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-500">
                          <Music className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Title & Artist */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold truncate leading-tight ${
                            isCurrentPlaying ? 'text-[#1db954]' : 'text-white'
                          }`}
                        >
                          {track.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {track.artist} &bull; <span className="text-zinc-500">{track.album}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Category Tag (Hidden on small mobile) */}
                  <div className="hidden sm:block shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        track.category === 'anthem'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : track.category === 'worship'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : track.category === 'praise'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : track.category === 'acoustic'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                      }`}
                    >
                      {track.category}
                    </span>
                  </div>

                  {/* Right: Actions & Duration */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Lyrics Preview Button */}
                    {track.lyrics && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLyricsTrack(track);
                          setIsLyricsModalOpen(true);
                        }}
                        title="View song lyrics"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Mic2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* External links if available */}
                    {track.spotify_url && (
                      <a
                        href={track.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Open in Spotify"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-[#1db954] hover:bg-white/10 transition-colors hidden md:inline-flex"
                      >
                        <Music className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Admin Delete Action */}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteTrack(track, e)}
                        title="Delete song"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Duration */}
                    <span className="text-xs font-mono text-zinc-400 w-10 text-right">
                      {track.duration_display || '3:30'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FIXED DOCKED SPOTIFY-LIKE PLAYER BAR */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-2xl border-t border-white/10 px-4 sm:px-6 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* 1. Left Section: Track Info & Cover */}
            <div className="flex items-center gap-3 w-1/4 min-w-[140px] sm:min-w-[200px]">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 ring-1 ring-white/10">
                {currentTrack.cover_art_url ? (
                  <img
                    src={currentTrack.cover_art_url}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                    <Music className="w-6 h-6" />
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight hover:underline cursor-pointer">
                  {currentTrack.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* 2. Middle Section: Playback Controls & Timeline Slider */}
            <div className="flex-1 max-w-xl flex flex-col items-center">
              {/* Primary Buttons */}
              <div className="flex items-center gap-4 sm:gap-6 mb-1.5">
                {/* Shuffle Button */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  title={isShuffle ? 'Shuffle on' : 'Shuffle off'}
                  className={`p-1 transition-colors cursor-pointer ${
                    isShuffle ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Previous Track */}
                <button
                  onClick={handlePrevTrack}
                  title="Previous song"
                  className="p-1 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                {/* Play / Pause Toggle Button */}
                <button
                  onClick={togglePlayPause}
                  title={isPlaying ? 'Pause' : 'Play'}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-white/10 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-black" />
                  ) : (
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  )}
                </button>

                {/* Next Track */}
                <button
                  onClick={handleNextTrack}
                  title="Next song"
                  className="p-1 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                {/* Repeat Button */}
                <button
                  onClick={() => {
                    if (repeatMode === 'off') setRepeatMode('all');
                    else if (repeatMode === 'all') setRepeatMode('one');
                    else setRepeatMode('off');
                  }}
                  title={`Repeat mode: ${repeatMode}`}
                  className={`p-1 transition-colors cursor-pointer ${
                    repeatMode !== 'off' ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Timeline Slider with Timestamps */}
              <div className="w-full flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-zinc-400 w-8 text-right shrink-0">
                  {formatTime(currentTime)}
                </span>

                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#1db954] hover:h-1.5 transition-all"
                />

                <span className="text-[11px] font-mono text-zinc-400 w-8 shrink-0">
                  {formatTime(duration) || currentTrack.duration_display}
                </span>
              </div>
            </div>

            {/* 3. Right Section: Volume & Lyrics */}
            <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
              {/* Lyrics button */}
              <button
                onClick={() => {
                  setLyricsTrack(currentTrack);
                  setIsLyricsModalOpen(true);
                }}
                title="Lyrics"
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Mic2 className="w-4 h-4" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ADMIN UPLOAD MP3 MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#181a20] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-black">
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload Praise &amp; Worship Song</h3>
                  <p className="text-xs text-zinc-400">Stores MP3 into Cloudflare R2 bucket</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error or Success notification */}
            {uploadError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            {uploadSuccessMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
              {/* Audio File Picker */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  MP3 Audio File <span className="text-rose-400">*</span>
                </label>
                <div className="relative border-2 border-dashed border-white/15 hover:border-[#1db954] rounded-2xl p-4 text-center bg-white/[0.02] transition-colors">
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a"
                    onChange={(e) => handleAudioFileChange(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {uploadAudioFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-[#1db954] font-semibold">
                      <FileAudio className="w-5 h-5" />
                      <span className="truncate max-w-xs">{uploadAudioFile.name}</span>
                      <span className="text-zinc-500">
                        ({(uploadAudioFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <FileAudio className="w-8 h-8 text-zinc-500 mx-auto" />
                      <p className="text-xs text-zinc-300 font-medium">
                        Click or drag &amp; drop MP3 track here
                      </p>
                      <p className="text-[10px] text-zinc-500">Supports .mp3, .wav, .m4a</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Artist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Song Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arise & Shine"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1db954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Worship Team / Artist
                  </label>
                  <input
                    type="text"
                    placeholder="VLC Worship Team"
                    value={uploadArtist}
                    onChange={(e) => setUploadArtist(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1db954]"
                  />
                </div>
              </div>

              {/* Album & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Album Name
                  </label>
                  <input
                    type="text"
                    placeholder="VLC 2027: Arise & Shine"
                    value={uploadAlbum}
                    onChange={(e) => setUploadAlbum(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1db954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as MusicTrack['category'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#20222a] border border-white/10 text-xs text-white focus:outline-none focus:border-[#1db954]"
                  >
                    <option value="worship">Worship</option>
                    <option value="praise">Praise</option>
                    <option value="anthem">Anthem</option>
                    <option value="acoustic">Acoustic</option>
                    <option value="reflection">Reflection</option>
                  </select>
                </div>
              </div>

              {/* Cover Art Image */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Cover Art Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                />
              </div>

              {/* External Spotify / YouTube URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Spotify Track URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/track/..."
                    value={uploadSpotifyUrl}
                    onChange={(e) => setUploadSpotifyUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1db954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    YouTube URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://music.youtube.com/..."
                    value={uploadYoutubeUrl}
                    onChange={(e) => setUploadYoutubeUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Lyrics */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Lyrics &amp; Scripture Chords (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste song lyrics, chorus, bridge..."
                  value={uploadLyrics}
                  onChange={(e) => setUploadLyrics(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1db954] resize-none font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#1db954]/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Disc3 className="w-4 h-4 animate-spin" />
                      <span>Uploading to R2...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Publish Song</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LYRICS MODAL */}
      {isLyricsModalOpen && lyricsTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#181a20] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                  {lyricsTrack.cover_art_url ? (
                    <img
                      src={lyricsTrack.cover_art_url}
                      alt={lyricsTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <Music className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white truncate">{lyricsTrack.title}</h3>
                  <p className="text-xs text-zinc-400">{lyricsTrack.artist}</p>
                </div>
              </div>

              <button
                onClick={() => setIsLyricsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lyrics Content */}
            <div className="flex-1 overflow-y-auto py-5 pr-2 space-y-4">
              {lyricsTrack.lyrics ? (
                <div className="text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-line tracking-wide">
                  {lyricsTrack.lyrics}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  <Mic2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  No lyrics added for this track yet.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
              <span>VLC 2027 Hymnal &amp; Praise Archive</span>
              <button
                onClick={() => setIsLyricsModalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
