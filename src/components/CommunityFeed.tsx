import { useState, useEffect, type FC } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Flame, 
  RefreshCw,
  HeartHandshake
} from 'lucide-react';
import type { 
  CommunityPost, 
  CommunityStory, 
  CamperStoryGroup, 
  CamperRegistration,
  AllowedReactionEmoji,
  PrayerRequest,
  Testimony
} from '../types';
import { apiService } from '../services/api';
import { StoryHighlightsBar } from './media/StoryHighlightsBar';
import { PostCard } from './media/PostCard';
import { StoryViewerModal } from './media/StoryViewerModal';
import { PostDetailModal } from './media/PostDetailModal';
import { MediaUploadModal } from './media/MediaUploadModal';
import { PrayerRequestCard } from './prayer/PrayerRequestCard';
import { CreatePrayerModal } from './prayer/CreatePrayerModal';
import { TestimonyCard } from './testimony/TestimonyCard';
import { CreateTestimonyModal } from './testimony/CreateTestimonyModal';

type FeedTab = 'moments' | 'prayers' | 'testimonies';
type PrayerFilter = 'all' | 'open' | 'answered' | 'my_prayers' | 'my_delegation';

interface CommunityFeedProps {
  currentCamper: CamperRegistration | null;
  onNavigateToCamper?: (camperId: string) => void;
  onOpenLogin?: () => void;
}

export const CommunityFeed: FC<CommunityFeedProps> = ({
  currentCamper,
  onNavigateToCamper,
  onOpenLogin,
}) => {
  // Active Tab
  const [feedTab, setFeedTab] = useState<FeedTab>('moments');

  // Moments Posts & Stories State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [camperStories, setCamperStories] = useState<CamperStoryGroup[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);

  // Prayer Wall State
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);
  const [prayerFilter, setPrayerFilter] = useState<PrayerFilter>('all');
  const [isCreatePrayerOpen, setIsCreatePrayerOpen] = useState(false);

  // Testimonies State
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [isLoadingTestimonies, setIsLoadingTestimonies] = useState(false);
  const [isCreateTestimonyOpen, setIsCreateTestimonyOpen] = useState(false);

  // Modals state for media
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadDefaultType, setUploadDefaultType] = useState<'post' | 'story'>('post');
  const [activeStoryGroup, setActiveStoryGroup] = useState<CommunityStory[] | null>(null);
  const [storyInitialIndex, setStoryInitialIndex] = useState(0);
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);

  // 1. Load Moments Feed
  const loadPosts = async (targetPage = 1, append = false) => {
    try {
      if (targetPage === 1 && !append) {
        setIsLoadingPosts(true);
      } else {
        setIsLoadingMorePosts(true);
      }

      const res = await apiService.getCommunityFeed(targetPage, 15, currentCamper?.id);
      if (res.success) {
        if (append) {
          setPosts((prev) => [...prev, ...(res.posts || [])]);
        } else {
          setPosts(res.posts || []);
          if (res.camper_stories) {
            setCamperStories(res.camper_stories);
          }
        }
        if (res.pagination) {
          setPostsPage(res.pagination.page);
          setPostsTotalPages(res.pagination.total_pages);
        }
      }
    } catch (err) {
      console.error('Failed to load community feed:', err);
    } finally {
      setIsLoadingPosts(false);
      setIsLoadingMorePosts(false);
      setIsRefreshing(false);
    }
  };

  // 2. Load Prayer Requests
  const loadPrayers = async (filter: PrayerFilter = prayerFilter) => {
    try {
      setIsLoadingPrayers(true);
      let statusParam = 'all';
      let filterParam = 'all';

      if (filter === 'open') statusParam = 'open';
      if (filter === 'answered') statusParam = 'answered';
      if (filter === 'my_prayers') filterParam = 'my_prayers';
      if (filter === 'my_delegation') filterParam = 'my_delegation';

      const res = await apiService.getPrayerRequests({
        status: statusParam,
        filter: filterParam,
        viewerId: currentCamper?.id,
      });

      if (res.success && res.prayers) {
        setPrayers(res.prayers);
      }
    } catch (err) {
      console.error('Failed to load prayer requests:', err);
    } finally {
      setIsLoadingPrayers(false);
      setIsRefreshing(false);
    }
  };

  // 3. Load Testimonies
  const loadTestimonies = async () => {
    try {
      setIsLoadingTestimonies(true);
      const res = await apiService.getTestimonies({
        viewerId: currentCamper?.id,
      });
      if (res.success && res.testimonies) {
        setTestimonies(res.testimonies);
      }
    } catch (err) {
      console.error('Failed to load testimonies:', err);
    } finally {
      setIsLoadingTestimonies(false);
      setIsRefreshing(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadPosts(1, false);
  }, [currentCamper?.id]);

  // Load tab data when switching tabs
  useEffect(() => {
    if (feedTab === 'prayers') {
      loadPrayers(prayerFilter);
    } else if (feedTab === 'testimonies') {
      loadTestimonies();
    }
  }, [feedTab, currentCamper?.id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (feedTab === 'moments') {
      loadPosts(1, false);
    } else if (feedTab === 'prayers') {
      loadPrayers(prayerFilter);
    } else if (feedTab === 'testimonies') {
      loadTestimonies();
    }
  };

  const handlePrayerFilterChange = (filter: PrayerFilter) => {
    setPrayerFilter(filter);
    loadPrayers(filter);
  };

  const handleLoadMorePosts = () => {
    if (postsPage < postsTotalPages && !isLoadingMorePosts) {
      loadPosts(postsPage + 1, true);
    }
  };

  const handleOpenUpload = (type: 'post' | 'story') => {
    if (!currentCamper) {
      if (onOpenLogin) onOpenLogin();
      else alert('Please sign in with your Camp Pass to upload photos!');
      return;
    }
    setUploadDefaultType(type);
    setIsUploadOpen(true);
  };

  const handleOpenCreatePrayer = () => {
    if (!currentCamper) {
      if (onOpenLogin) onOpenLogin();
      else alert('Please sign in with your Camp Pass to share a prayer request!');
      return;
    }
    setIsCreatePrayerOpen(true);
  };

  const handleOpenCreateTestimony = () => {
    if (!currentCamper) {
      if (onOpenLogin) onOpenLogin();
      else alert('Please sign in with your Camp Pass to share a praise report!');
      return;
    }
    setIsCreateTestimonyOpen(true);
  };

  // Post Handlers
  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleStoryCreated = (newStory: CommunityStory) => {
    setCamperStories((prev) => {
      const camperId = newStory.camper_id;
      const existingGroup = prev.find((g) => g.camper.id === camperId);
      if (existingGroup) {
        return prev.map((g) =>
          g.camper.id === camperId
            ? { ...g, latest_story_at: newStory.created_at, stories: [...g.stories, newStory] }
            : g
        );
      }
      return [
        {
          camper: newStory.camper,
          latest_story_at: newStory.created_at,
          stories: [newStory],
        },
        ...prev,
      ];
    });
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleStoryDeleted = (storyId: string) => {
    setCamperStories((prev) =>
      prev
        .map((g) => ({
          ...g,
          stories: g.stories.filter((s) => s.id !== storyId),
        }))
        .filter((g) => g.stories.length > 0)
    );
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

  const handleOpenStories = (stories: CommunityStory[], initialIndex = 0) => {
    setActiveStoryGroup(stories);
    setStoryInitialIndex(initialIndex);
  };

  // Prayer Handlers
  const handlePrayerCreated = (newPrayer: PrayerRequest) => {
    setPrayers((prev) => [newPrayer, ...prev]);
  };

  const handlePrayerUpdated = (updated: PrayerRequest) => {
    setPrayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handlePrayerDeleted = (prayerId: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== prayerId));
  };

  // Testimony Handlers
  const handleTestimonyCreated = (newTestimony: Testimony) => {
    setTestimonies((prev) => [newTestimony, ...prev]);
  };

  const handleTestimonyDeleted = (testimonyId: string) => {
    setTestimonies((prev) => prev.filter((t) => t.id !== testimonyId));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      {/* Top Banner / Feed Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider text-amber-200">
            {feedTab === 'moments' && <Flame className="w-3.5 h-3.5 text-amber-300" />}
            {feedTab === 'prayers' && <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />}
            {feedTab === 'testimonies' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            <span>
              {feedTab === 'moments'
                ? 'VLC 2027 Community Feed'
                : feedTab === 'prayers'
                ? 'VLC 2027 Prayer Wall'
                : 'VLC 2027 Praise & Testimonies'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {feedTab === 'moments'
              ? 'Camp Highlights & Fellowship'
              : feedTab === 'prayers'
              ? 'Intercession & Burdens'
              : 'Praise Reports & Testimonies'}
          </h2>

          <p className="text-xs text-blue-100 max-w-md">
            {feedTab === 'moments'
              ? 'Celebrate what God is doing! Share moments, post vertical highlight reels, and encourage fellow campers.'
              : feedTab === 'prayers'
              ? 'Bear one another\'s burdens in prayer. Stand in faith for breakthrough, healing, and spiritual renewal.'
              : 'Give glory to God for answered prayers, salvations, and miraculous life-changing breakthroughs!'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="tap-pill p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {feedTab === 'moments' && (
            <button
              type="button"
              onClick={() => handleOpenUpload('post')}
              className="tap-pill px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4 text-blue-700" />
              <span>Share Photo</span>
            </button>
          )}

          {feedTab === 'prayers' && (
            <button
              type="button"
              onClick={handleOpenCreatePrayer}
              className="tap-pill px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <HeartHandshake className="w-4 h-4 text-blue-700" />
              <span>Request Prayer</span>
            </button>
          )}

          {feedTab === 'testimonies' && (
            <button
              type="button"
              onClick={handleOpenCreateTestimony}
              className="tap-pill px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Share Praise</span>
            </button>
          )}
        </div>
      </div>

      {/* Dedicated Feed Tabs Switcher */}
      <div className="flex items-center gap-1 p-1.5 bg-zinc-100/90 rounded-2xl border border-zinc-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setFeedTab('moments')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            feedTab === 'moments'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Moments</span>
        </button>

        <button
          type="button"
          onClick={() => setFeedTab('prayers')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            feedTab === 'prayers'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-zinc-600 hover:text-blue-700'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
          <span>Prayer Wall</span>
        </button>

        <button
          type="button"
          onClick={() => setFeedTab('testimonies')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            feedTab === 'testimonies'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-zinc-600 hover:text-amber-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Testimonies</span>
        </button>
      </div>

      {/* Guest Sign-in Prompt if Not Logged In */}
      {!currentCamper && (
        <div className="bg-blue-50 border border-blue-200/80 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="text-xs text-blue-900 font-medium">
              Registered for VLC 2027? Sign in with your Camp Pass to post, stand in prayer, and share testimonies!
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenLogin}
            className="tap-pill px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            Camp Pass Sign In
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: MOMENTS FEED                                                       */}
      {/* ========================================================================= */}
      {feedTab === 'moments' && (
        <div className="space-y-6">
          {/* Horizontal Story Highlights Bar */}
          <StoryHighlightsBar
            camperStories={camperStories}
            currentCamper={currentCamper}
            onOpenStory={handleOpenStories}
            onAddStoryClick={() => handleOpenUpload('story')}
          />

          {/* Quick Action Prompt Box */}
          {currentCamper && (
            <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-2xs flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shrink-0 bg-zinc-100">
                {currentCamper.selfie_url ? (
                  <img
                    src={currentCamper.selfie_url}
                    alt={currentCamper.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-blue-600">
                    {currentCamper.nickname?.charAt(0) || 'C'}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenUpload('post')}
                className="flex-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-2xl px-4 py-2.5 text-xs text-zinc-500 font-medium text-left transition-colors cursor-pointer"
              >
                Share a camp moment, photo, or verse reflection...
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenUpload('post')}
                  title="Upload standard post"
                  className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenUpload('story')}
                  title="Add vertical highlight story"
                  className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Posts Stream */}
          {isLoadingPosts ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-medium text-zinc-500">Loading community moments...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-zinc-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-800">No posts in the moments feed yet</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Be the very first camper to share a moment from your delegation or camp prep!
              </p>
              <button
                type="button"
                onClick={() => handleOpenUpload('post')}
                className="tap-pill px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Share the First Post</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentCamper={currentCamper}
                  onOpenDetail={(p) => setActivePost(p)}
                  onCamperClick={onNavigateToCamper}
                  onReactionUpdated={handleReactionUpdated}
                />
              ))}

              {/* Load More Button */}
              {postsPage < postsTotalPages && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMorePosts}
                    disabled={isLoadingMorePosts}
                    className="tap-pill px-6 py-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-2"
                  >
                    {isLoadingMorePosts ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Loading more moments...</span>
                      </>
                    ) : (
                      <span>Load More Moments</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRAYER WALL                                                        */}
      {/* ========================================================================= */}
      {feedTab === 'prayers' && (
        <div className="space-y-6">
          {/* Quick Request Prayer Prompt */}
          {currentCamper && (
            <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-2xs flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>

              <button
                type="button"
                onClick={handleOpenCreatePrayer}
                className="flex-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-2xl px-4 py-2.5 text-xs text-zinc-500 font-medium text-left transition-colors cursor-pointer truncate"
              >
                What can our camp family pray for you today?
              </button>

              <button
                type="button"
                onClick={handleOpenCreatePrayer}
                className="tap-pill px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                + Request
              </button>
            </div>
          )}

          {/* Sub-Filters for Prayer Requests */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-left">
            <button
              type="button"
              onClick={() => handlePrayerFilterChange('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                prayerFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All Requests
            </button>

            <button
              type="button"
              onClick={() => handlePrayerFilterChange('open')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                prayerFilter === 'open'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span>🙏 Seeking Prayer</span>
            </button>

            <button
              type="button"
              onClick={() => handlePrayerFilterChange('answered')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                prayerFilter === 'answered'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>God Has Answered</span>
            </button>

            {currentCamper && (
              <>
                <button
                  type="button"
                  onClick={() => handlePrayerFilterChange('my_prayers')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    prayerFilter === 'my_prayers'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  My Requests
                </button>

                {currentCamper.church_name && (
                  <button
                    type="button"
                    onClick={() => handlePrayerFilterChange('my_delegation')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      prayerFilter === 'my_delegation'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Delegation Only
                  </button>
                )}
              </>
            )}
          </div>

          {/* Prayers Stream */}
          {isLoadingPrayers ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-medium text-zinc-500">Loading prayer requests...</p>
            </div>
          ) : prayers.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-zinc-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-800">No prayer requests in this view</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Share a personal petition or church need so the whole camp can agree in prayer!
              </p>
              <button
                type="button"
                onClick={handleOpenCreatePrayer}
                className="tap-pill px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Share a Prayer Need</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {prayers.map((prayer) => (
                <PrayerRequestCard
                  key={prayer.id}
                  prayer={prayer}
                  currentCamper={currentCamper}
                  onNavigateToCamper={onNavigateToCamper}
                  onPrayerUpdated={handlePrayerUpdated}
                  onPrayerDeleted={handlePrayerDeleted}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TESTIMONIES FEED                                                   */}
      {/* ========================================================================= */}
      {feedTab === 'testimonies' && (
        <div className="space-y-6">
          {/* Quick Share Testimony Prompt */}
          {currentCamper && (
            <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-2xs flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>

              <button
                type="button"
                onClick={handleOpenCreateTestimony}
                className="flex-1 bg-amber-50/50 hover:bg-amber-100/50 border border-amber-200/80 rounded-2xl px-4 py-2.5 text-xs text-amber-900 font-medium text-left transition-colors cursor-pointer truncate"
              >
                Declare what the Lord has done! Share a praise report...
              </button>

              <button
                type="button"
                onClick={handleOpenCreateTestimony}
                className="tap-pill px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                + Praise
              </button>
            </div>
          )}

          {/* Testimonies Stream */}
          {isLoadingTestimonies ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <p className="text-xs font-medium text-zinc-500">Loading praise reports...</p>
            </div>
          ) : testimonies.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-amber-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-800">No testimonies published yet</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Did God answer your prayer or work a miracle in your life? Give Him praise and encourage the church!
              </p>
              <button
                type="button"
                onClick={handleOpenCreateTestimony}
                className="tap-pill px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Share First Praise Report</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonies.map((testimony) => (
                <TestimonyCard
                  key={testimony.id}
                  testimony={testimony}
                  currentCamper={currentCamper}
                  onNavigateToCamper={onNavigateToCamper}
                  onTestimonyDeleted={handleTestimonyDeleted}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pre-signed R2 Media Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentCamper={currentCamper}
        defaultType={uploadDefaultType}
        onPostCreated={handlePostCreated}
        onStoryCreated={handleStoryCreated}
      />

      {/* Vertical Story Reel Viewer Modal */}
      {activeStoryGroup && (
        <StoryViewerModal
          isOpen={Boolean(activeStoryGroup)}
          onClose={() => setActiveStoryGroup(null)}
          stories={activeStoryGroup}
          initialIndex={storyInitialIndex}
          currentCamper={currentCamper}
          onStoryDeleted={handleStoryDeleted}
        />
      )}

      {/* Post Detail & Comments Modal */}
      {activePost && (
        <PostDetailModal
          isOpen={Boolean(activePost)}
          onClose={() => setActivePost(null)}
          post={activePost}
          currentCamper={currentCamper}
          onPostDeleted={handlePostDeleted}
          onReactionUpdated={handleReactionUpdated}
          onNavigateToCamper={onNavigateToCamper}
        />
      )}

      {/* Create Prayer Request Modal */}
      {isCreatePrayerOpen && (
        <CreatePrayerModal
          isOpen={isCreatePrayerOpen}
          onClose={() => setIsCreatePrayerOpen(false)}
          currentCamper={currentCamper}
          onPrayerCreated={handlePrayerCreated}
        />
      )}

      {/* Create Testimony Modal */}
      {isCreateTestimonyOpen && (
        <CreateTestimonyModal
          isOpen={isCreateTestimonyOpen}
          onClose={() => setIsCreateTestimonyOpen(false)}
          currentCamper={currentCamper}
          onTestimonyCreated={handleTestimonyCreated}
        />
      )}
    </div>
  );
};
