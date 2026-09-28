import { useState, useEffect, type FC } from 'react';
import { 
  Church as ChurchIcon, 
  MapPin, 
  BookOpen, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  ArrowLeft,
  Link2,
  Check,
  PlusCircle,
  Image as ImageIcon,
  MessageCircle
} from 'lucide-react';
import { QRCodeCanvas } from './ui/QRCodeCanvas';
import type { 
  CamperRegistration, 
  CamperRole, 
  CommunityPost, 
  CommunityStory, 
  AllowedReactionEmoji 
} from '../types';
import { apiService } from '../services/api';
import { StoryViewerModal } from './media/StoryViewerModal';
import { PostDetailModal } from './media/PostDetailModal';
import { MediaUploadModal } from './media/MediaUploadModal';

interface PublicCamperProfilePageProps {
  camperId: string | null;
  onBack: () => void;
  onJoinDelegation?: (churchId: string) => void;
  currentCamper?: CamperRegistration | null;
}

export const PublicCamperProfilePage: FC<PublicCamperProfilePageProps> = ({
  camperId,
  onBack,
  onJoinDelegation,
  currentCamper,
}) => {
  const [camper, setCamper] = useState<CamperRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(camperId));
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isProfileUrlCopied, setIsProfileUrlCopied] = useState(false);
  const [isPassCodeCopied, setIsPassCodeCopied] = useState(false);

  // Camper Media State: Highlights / Stories and Standard Posts
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Active view tab on profile
  const [activeMediaTab, setActiveMediaTab] = useState<'posts' | 'highlights' | 'badge'>('posts');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'post' | 'story'>('post');
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const isOwner = Boolean(currentCamper && camperId && currentCamper.id === camperId);

  // Load camper profile details
  useEffect(() => {
    if (!camperId) return;

    let isMounted = true;
    apiService.getCamperProfile(camperId)
      .then((res) => {
        if (isMounted) {
          if (res.success && res.camper) {
            setCamper(res.camper);
          } else {
            setError(res.error || 'Camper not found');
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load camper profile:', err);
          setError('Failed to load camper profile. They may have chosen to keep it private or the ID is incorrect.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [camperId]);

  // Load camper permanent stories/highlights
  useEffect(() => {
    if (!camperId) return;
    setIsLoadingStories(true);
    apiService.getCampersStories(camperId, currentCamper?.id)
      .then((res) => {
        if (res.success && res.stories) {
          setStories(res.stories);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingStories(false));
  }, [camperId, currentCamper?.id]);

  // Load camper posts
  useEffect(() => {
    if (!camperId) return;
    setIsLoadingPosts(true);
    apiService.getCampersPosts(camperId, 1, 24, currentCamper?.id)
      .then((res) => {
        if (res.success && res.posts) {
          setPosts(res.posts);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingPosts(false));
  }, [camperId, currentCamper?.id]);

  const handleCopyLink = () => {
    if (!camperId) return;
    const url = `${window.location.origin}/camper/${camperId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!camperId || !camper) return;
    const url = `${window.location.origin}/camper/${camperId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${camper.nickname}'s VLC 2027 Pass & Profile`,
          text: `Check out ${camper.nickname}'s profile and camp moments for Vision & Leadership Camp 2027!`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const getRoleBadge = (role: CamperRole = 'camper') => {
    switch (role) {
      case 'counselor': return { label: 'Counselor', badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200' };
      case 'first_timer': return { label: 'First-Timer', badge: 'bg-purple-100 text-purple-800 border border-purple-200' };
      case 'worship': return { label: 'Worship Team', badge: 'bg-amber-100 text-amber-800 border border-amber-200' };
      case 'staff': return { label: 'Camp Staff', badge: 'bg-zinc-800 text-zinc-100 border border-zinc-900' };
      case 'camper':
      default:
        return { label: 'Camper', badge: 'bg-blue-100 text-blue-800 border border-blue-200' };
    }
  };

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleStoryCreated = (newStory: CommunityStory) => {
    setStories((prev) => [...prev, newStory]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleStoryDeleted = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  const handleReactionUpdated = (
    postId: string,
    emoji: AllowedReactionEmoji | null,
    counts: any
  ) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, user_reaction: emoji, reaction_counts: counts }
          : p
      )
    );
  };

  const currentRole = getRoleBadge(camper?.role);
  const isActivated = camper?.status === 'activated';

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-28 space-y-6 text-left">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-xs font-semibold cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-zinc-500 text-sm font-medium">Loading camper profile...</p>
        </div>
      ) : error || !camper ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center space-y-4">
          <p className="font-semibold text-sm">{error || 'Camper not found'}</p>
          <button
            onClick={onBack}
            className="tap-pill px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Pass Brand Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
                VLC 2027 DELEGATE PROFILE
              </span>
              {isActivated ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase border border-emerald-200">
                  ✓ Activated
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase border border-blue-200">
                  Registered
                </span>
              )}
            </div>

            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${currentRole.badge}`}>
              {currentRole.label}
            </span>
          </div>

          {/* Profile Identity Card */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 bg-gradient-to-br from-blue-50/80 via-zinc-50/50 to-white p-5 rounded-3xl border border-blue-100/80 shadow-xs">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-zinc-100 shrink-0">
              {camper.selfie_url ? (
                <img
                  src={camper.selfie_url}
                  alt={camper.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#0b57d0]">
                  {camper.nickname?.charAt(0) || 'C'}
                </div>
              )}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight truncate leading-tight">
                  {camper.nickname}
                </h3>
                <span className="text-xs text-zinc-500 font-medium truncate">
                  ({camper.full_name})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                <ChurchIcon className="w-3.5 h-3.5 text-[#0b57d0] shrink-0" />
                <span className="truncate">{camper.church_name || 'PCCI Delegation'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{camper.city ? `${camper.city}, ` : ''}{camper.province}</span>
              </div>
            </div>

            {/* Owner Upload CTA */}
            {isOwner && (
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setUploadType('post');
                    setIsUploadOpen(true);
                  }}
                  className="tap-pill px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadType('story');
                    setIsUploadOpen(true);
                  }}
                  className="tap-pill px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add Story</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 1: Permanent Story Highlights Reel */}
          <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Permanent Story Highlights ({stories.length})</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold">
                Chronological vertical highlights
              </span>
            </div>

            {isLoadingStories ? (
              <div className="py-6 flex items-center justify-center text-xs text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Loading highlights...</span>
              </div>
            ) : stories.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-400 italic">
                {isOwner
                  ? "You haven't posted any story highlights yet. Click 'Add Story' above to post a vertical highlight!"
                  : "No highlight stories posted by this camper yet."}
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {stories.map((story, idx) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => setSelectedStoryIndex(idx)}
                    className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                  >
                    <div className="w-16 h-22 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 shadow-2xs group-hover:shadow-md transition-all">
                      <div className="w-full h-full rounded-[14px] overflow-hidden bg-black relative">
                        <img
                          src={story.media_url}
                          alt={story.caption || 'Highlight'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {story.reaction_counts && story.reaction_counts.total > 0 && (
                          <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[9px] text-white font-bold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            <span>{story.reaction_counts.total}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-semibold max-w-[64px] truncate">
                      {story.caption || `Highlight ${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Navigation Tabs for Profile Body (Posts Grid vs Official Pass Details) */}
          <div className="grid grid-cols-2 gap-2 bg-zinc-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveMediaTab('posts')}
              className={`tap-pill py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMediaTab === 'posts'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Posts ({posts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMediaTab('badge')}
              className={`tap-pill py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMediaTab === 'badge'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Pass &amp; Details</span>
            </button>
          </div>

          {/* View Tab: Camper Profile Posts Grid */}
          {activeMediaTab === 'posts' && (
            <div className="space-y-4">
              {isLoadingPosts ? (
                <div className="py-16 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs">Loading posts...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-zinc-200 text-center space-y-3">
                  <ImageIcon className="w-8 h-8 text-zinc-300 mx-auto" />
                  <h4 className="font-bold text-sm text-zinc-800">No profile posts yet</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    {isOwner
                      ? "Share your favorite moments, camp delegation photos, and praise reports!"
                      : "This camper hasn't published any posts yet."}
                  </p>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setUploadType('post');
                        setIsUploadOpen(true);
                      }}
                      className="tap-pill px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Upload First Post</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 cursor-pointer group shadow-2xs hover:shadow-md transition-all border border-zinc-200"
                    >
                      <img
                        src={post.media_url}
                        alt={post.caption || 'Camper post'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Hover Overlay with Reaction & Comment Badges */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs p-2">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>{post.reaction_counts?.total || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-white" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>

                      {/* Bottom Caption Pill */}
                      {post.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-[10px] text-white truncate px-1">
                            {post.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View Tab: Official Pass & Details */}
          {activeMediaTab === 'badge' && (
            <div className="space-y-4">
              {/* Favorite Bible Verse Quote Card */}
              {camper.favorite_verse && (
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>Favorite Verse: {camper.favorite_verse}</span>
                  </div>
                  {camper.verse_reflection && (
                    <p className="text-sm text-zinc-700 italic leading-relaxed">
                      &ldquo;{camper.verse_reflection}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* Ministry Interests */}
              {camper.ministry_interests && camper.ministry_interests.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-2xs space-y-2">
                  <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider">
                    Ministry Interests
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {camper.ministry_interests.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold bg-blue-50 text-[#0b57d0] border border-blue-100 px-3 py-1 rounded-full"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile QR Code & Pass */}
              {(() => {
                const passCode = camper.activation_code || camper.id || 'VLC-DELEGATE';
                const profileUrl = `${window.location.origin}/camper/${camper.id}`;
                return (
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
                        <span>Official Profile QR &amp; Pass</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        Camper QR
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                          Activation / Pass Code
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-zinc-900 tracking-wider">
                            {passCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(passCode);
                              setIsPassCodeCopied(true);
                              setTimeout(() => setIsPassCodeCopied(false), 2000);
                            }}
                            title="Copy Pass Code"
                            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
                          >
                            {isPassCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-tight">
                          Scan this QR code with any smartphone camera to open and share this public camper profile.
                        </p>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(profileUrl);
                              setIsProfileUrlCopied(true);
                              setTimeout(() => setIsProfileUrlCopied(false), 2000);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                          >
                            {isProfileUrlCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Profile Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link2 className="w-3.5 h-3.5" />
                                <span>Copy Public Profile Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="p-2 bg-white border border-zinc-200 rounded-2xl shrink-0 shadow-2xs">
                        <QRCodeCanvas value={profileUrl} size={92} />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Share Profile Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className={`tap-pill w-full sm:w-auto py-3 px-5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs shrink-0 ${
                isCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#0b57d0]" />
                  <span>Share Profile</span>
                </>
              )}
            </button>

            {onJoinDelegation && camper.church_id && (
              <button
                type="button"
                onClick={() => {
                  onJoinDelegation(camper.church_id!);
                }}
                className="tap-pill w-full flex-1 py-3 px-5 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Join this Delegation</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pre-signed R2 Media Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentCamper={currentCamper || null}
        defaultType={uploadType}
        onPostCreated={handlePostCreated}
        onStoryCreated={handleStoryCreated}
      />

      {/* Vertical Story Viewer Modal */}
      {selectedStoryIndex !== null && stories.length > 0 && (
        <StoryViewerModal
          isOpen={selectedStoryIndex !== null}
          onClose={() => setSelectedStoryIndex(null)}
          stories={stories}
          initialIndex={selectedStoryIndex}
          currentCamper={currentCamper || null}
          onStoryDeleted={handleStoryDeleted}
        />
      )}

      {/* Post Detail & Comments Modal */}
      {selectedPost && (
        <PostDetailModal
          isOpen={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          currentCamper={currentCamper || null}
          onPostDeleted={handlePostDeleted}
          onReactionUpdated={handleReactionUpdated}
        />
      )}
    </div>
  );
};
