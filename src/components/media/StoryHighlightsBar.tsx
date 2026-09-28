import type { FC } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import type { CamperStoryGroup, CamperRegistration, CommunityStory } from '../../types';

interface StoryHighlightsBarProps {
  camperStories: CamperStoryGroup[];
  currentCamper: CamperRegistration | null;
  onOpenStory: (stories: CommunityStory[], initialIndex?: number) => void;
  onAddStoryClick: () => void;
}

export const StoryHighlightsBar: FC<StoryHighlightsBarProps> = ({
  camperStories,
  currentCamper,
  onOpenStory,
  onAddStoryClick,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl p-3 sm:p-4 border border-zinc-200/90 shadow-2xs">
      <div className="flex items-center justify-between pb-2.5 px-1 border-b border-zinc-100 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Camper Highlights &amp; Stories</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Permanent Highlights
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none select-none text-left">
        {/* Current camper's Add Story bubble */}
        {currentCamper && (
          <button
            type="button"
            onClick={onAddStoryClick}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
          >
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400">
              <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                {currentCamper.selfie_url ? (
                  <img
                    src={currentCamper.selfie_url}
                    alt={currentCamper.nickname}
                    className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center font-bold text-amber-600 text-lg">
                    {currentCamper.nickname?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 max-w-[64px] truncate text-center">
              Your Story
            </span>
          </button>
        )}

        {/* Other Campers with Stories */}
        {camperStories.map((group) => {
          const hasStories = group.stories && group.stories.length > 0;
          if (!hasStories) return null;

          return (
            <button
              key={group.camper.id}
              type="button"
              onClick={() => onOpenStory(group.stories, 0)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 transition-all shadow-2xs group-hover:shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                  {group.camper.selfie_url ? (
                    <img
                      src={group.camper.selfie_url}
                      alt={group.camper.nickname}
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-lg">
                      {group.camper.nickname?.charAt(0) || 'C'}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center max-w-[68px]">
                <span className="text-[11px] font-bold text-zinc-900 truncate block leading-tight">
                  {group.camper.nickname}
                </span>
                <span className="text-[9px] text-zinc-400 font-semibold block">
                  {group.stories.length} {group.stories.length === 1 ? 'reel' : 'reels'}
                </span>
              </div>
            </button>
          );
        })}

        {camperStories.length === 0 && !currentCamper && (
          <div className="py-2 px-4 text-xs text-zinc-400 italic">
            No highlights posted yet. Sign in with your Camp Pass to share a highlight story!
          </div>
        )}
      </div>
    </div>
  );
};
