import { useState, useEffect, type FC } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Flame, 
  RefreshCw
} from 'lucide-react';
import type { 
  CommunityPost, 
  CommunityStory, 
  CamperStoryGroup, 
  CamperRegistration,
  AllowedReactionEmoji
} from '../types';
import { apiService } from '../services/api';
import { StoryHighlightsBar } from './media/StoryHighlightsBar';
import { PostCard } from './media/PostCard';
import { StoryViewerModal } from './media/StoryViewerModal';
import { PostDetailModal } from './media/PostDetailModal';
import { MediaUploadModal } from './media/MediaUploadModal';

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
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [camperStories, setCamperStories] = useState<CamperStoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadDefaultType, setUploadDefaultType] = useState<'post' | 'story'>('post');

  const [activeStoryGroup, setActiveStoryGroup] = useState<CommunityStory[] | null>(null);
  const [storyInitialIndex, setStoryInitialIndex] = useState(0);

  const [activePost, setActivePost] = useState<CommunityPost | null>(null);

  const loadFeed = async (targetPage = 1, append = false) => {
    try {
      if (targetPage === 1 && !append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
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
          setPage(res.pagination.page);
          setTotalPages(res.pagination.total_pages);
        }
      }
    } catch (err) {
      console.error('Failed to load community feed:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed(1, false);
  }, [currentCamper?.id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadFeed(1, false);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !isLoadingMore) {
      loadFeed(page + 1, true);
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      {/* Top Banner / Feed Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider text-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>VLC 2027 Community Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Camp Highlights &amp; Fellowship
          </h2>
          <p className="text-xs text-blue-100 max-w-md">
            Celebrate what God is doing! Share moments, post vertical highlight reels, and encourage fellow campers.
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

          <button
            type="button"
            onClick={() => handleOpenUpload('post')}
            className="tap-pill px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-blue-700" />
            <span>Share Photo</span>
          </button>
        </div>
      </div>

      {/* Horizontal Story Highlights Bar */}
      <StoryHighlightsBar
        camperStories={camperStories}
        currentCamper={currentCamper}
        onOpenStory={handleOpenStories}
        onAddStoryClick={() => handleOpenUpload('story')}
      />

      {/* Quick Action Prompt Box */}
      {currentCamper ? (
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
      ) : (
        <div className="bg-blue-50 border border-blue-200/80 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="text-xs text-blue-900 font-medium">
              Registered for VLC 2027? Sign in with your Camp Pass to share photos, post highlights, and react!
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

      {/* Posts Stream */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-medium text-zinc-500">Loading community moments...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-zinc-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-zinc-800">No posts in the community feed yet</h4>
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
          {page < totalPages && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="tap-pill px-6 py-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-2"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Loading more posts...</span>
                  </>
                ) : (
                  <span>Load More Moments</span>
                )}
              </button>
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
    </div>
  );
};
