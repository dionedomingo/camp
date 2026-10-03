import { useState, useEffect, type FC } from 'react';
import {
  LogOut,
  Sparkles,
  Church as ChurchIcon,
  Phone,
  HeartHandshake,
  Calendar,
  Key,
  UserCog,
  Mail,
  Loader2,
  Clock,
  MapPin,
  UserCheck,
  Layers,
  PlusCircle,
  ArrowRight,
  Image as ImageIcon,
  MessageCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { 
  CamperRegistration, 
  EventScheduleItem, 
  EventRegistration, 
  CampEvent,
  CommunityPost,
  CommunityStory
} from '../types';
import { CampPassCard } from './CampPassCard';
import { getRegistrationStatus, formatDateReadable, formatEventDateRange } from '../lib/utils';
import { EditProfileForm } from './EditProfileModal';
import { apiService } from '../services/api';
import { MediaUploadModal } from './media/MediaUploadModal';
import { StoryViewerModal } from './media/StoryViewerModal';
import { PostDetailModal } from './media/PostDetailModal';

export type CamperHubTab = 'pass' | 'events' | 'schedule' | 'profile' | 'media' | 'details';

interface CamperHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  camper: CamperRegistration | null;
  onSignOut: () => void;
  onInviteFriend: () => void;
  onProfileUpdated?: (updated: CamperRegistration) => void;
  onNavigateToSchedule?: () => void;
  onViewCamperProfile?: (camperId: string) => void;
  initialTab?: CamperHubTab;
}

export const CamperHubModal: FC<CamperHubModalProps> = ({
  isOpen,
  onClose,
  camper,
  onSignOut,
  onInviteFriend,
  onProfileUpdated,
  onNavigateToSchedule,
  onViewCamperProfile,
  initialTab = 'pass',
}) => {
  const [activeTab, setActiveTab] = useState<CamperHubTab>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<EventScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  // Camper Media State
  const [mediaPosts, setMediaPosts] = useState<CommunityPost[]>([]);
  const [mediaStories, setMediaStories] = useState<CommunityStory[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [mediaUploadType, setMediaUploadType] = useState<'post' | 'story'>('post');
  const [hubStoryIndex, setHubStoryIndex] = useState<number | null>(null);
  const [hubSelectedPost, setHubSelectedPost] = useState<CommunityPost | null>(null);

  const loadCamperMedia = async () => {
    if (!camper?.id) return;
    setIsLoadingMedia(true);
    try {
      const [postsRes, storiesRes] = await Promise.all([
        apiService.getCampersPosts(camper.id, 1, 30, camper.id),
        apiService.getCampersStories(camper.id, camper.id),
      ]);
      if (postsRes.success && postsRes.posts) setMediaPosts(postsRes.posts);
      if (storiesRes.success && storiesRes.stories) setMediaStories(storiesRes.stories);
    } catch (err) {
      console.error('Failed to load camper media:', err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Multi-Event State
  const [registrations, setRegistrations] = useState<EventRegistration[]>(camper?.registrations || []);
  const [availableEvents, setAvailableEvents] = useState<CampEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(camper?.event_id || 'vlc-2027');
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isJoiningEvent, setIsJoiningEvent] = useState<string | null>(null);
  const [joinStatusMsg, setJoinStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load camper's registrations and available next events
  useEffect(() => {
    let isMounted = true;
    if (!camper?.id) return;

    apiService.getCamperEvents(camper.id)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setRegistrations(res.registrations);
          setAvailableEvents(res.available_events);
          if (res.registrations.length > 0) {
            setSelectedEventId((prev) => {
              const hasSelected = res.registrations.some((r) => r.event_id === prev);
              return hasSelected ? prev : res.registrations[0].event_id;
            });
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoadingEvents(false);
      });

    return () => {
      isMounted = false;
    };
  }, [camper?.id]);

  // Load schedule dynamically for the selected event
  useEffect(() => {
    let isMounted = true;
    if (activeTab === 'schedule') {
      apiService.getEventSchedule(selectedEventId || 'vlc-2027')
        .then((res) => {
          if (isMounted && res.schedules) {
            setSchedules(res.schedules);
          }
        })
        .catch(console.error)
        .finally(() => {
          if (isMounted) setIsLoadingSchedule(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, selectedEventId]);

  if (!isOpen || !camper) return null;

  // Active registration based on selected event pass
  const activeReg = registrations.find((r) => r.event_id === selectedEventId) || registrations[0];

  const activeCamperPass: CamperRegistration = activeReg
    ? {
      ...camper,
      event_id: activeReg.event_id,
      activation_code: activeReg.activation_code || camper.activation_code,
      activation_token: activeReg.activation_token || camper.activation_token,
      role: activeReg.role || camper.role,
      status: activeReg.status || camper.status,
      checked_in_at: activeReg.checked_in_at || camper.checked_in_at,
      kit_claimed: activeReg.kit_claimed ?? camper.kit_claimed,
      active_event_name: activeReg.event_name || (activeReg.event_id === 'vlc-2029' ? 'Vision & Leadership Camp 2029' : 'Vision & Leadership Camp 2027'),
    }
    : camper;

  const isCheckedIn = activeCamperPass.status === 'activated' || Boolean(activeCamperPass.checked_in_at);

  const handleJoinEvent = async (evt: CampEvent) => {
    if (!camper.id) return;
    setIsJoiningEvent(evt.id);
    setJoinStatusMsg(null);
    try {
      const res = await apiService.joinEvent(
        camper.id,
        evt.id,
        camper.church_id,
        camper.role
      );

      if (res.success && res.registration) {
        setJoinStatusMsg({
          type: 'success',
          text: res.message || `Successfully joined ${evt.name}! Your official pass code is ${res.registration.activation_code}.`,
        });

        const newRegistrations = [res.registration, ...registrations.filter((r) => r.event_id !== evt.id)];
        setRegistrations(newRegistrations);
        setAvailableEvents((prev) => prev.filter((e) => e.id !== evt.id));
        setSelectedEventId(evt.id);

        const updatedProfile: CamperRegistration = {
          ...camper,
          event_id: evt.id,
          activation_code: res.registration.activation_code,
          activation_token: res.registration.activation_token,
          registrations: newRegistrations,
          active_event_name: evt.name,
        };
        onProfileUpdated?.(updatedProfile);
      } else {
        setJoinStatusMsg({
          type: 'error',
          text: res.error || 'Failed to join event',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while joining event';
      setJoinStatusMsg({ type: 'error', text: msg });
    } finally {
      setIsJoiningEvent(null);
    }
  };

  const handleResendEmail = async () => {
    setIsSendingEmail(true);
    setEmailStatusMsg(null);
    try {
      const res = await apiService.resendCamperEmail({
        camper_id: camper.id,
        email: camper.email,
        code: activeCamperPass.activation_code,
      });
      if (res.success) {
        setEmailStatusMsg('Passport email dispatched successfully! Please check your inbox.');
      } else {
        setEmailStatusMsg(res.error || 'Failed to dispatch email');
      }
    } catch {
      setEmailStatusMsg('An unexpected error occurred while sending email');
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailStatusMsg(null), 5000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-3 items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f0fe] text-[#0b57d0] shadow-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-semibold text-[#188038] border-[#ceead6] bg-[#e6f4ea]">
                {isCheckedIn ? '✓ Verified & Checked In' : 'Registered Delegate'}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900">
              Welcome, {camper.nickname}! 👋
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-1">
              Your official {activeCamperPass.active_event_name || 'VLC 2027'} portal &amp; delegation hub.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Tab Controls */}
        <div className="flex items-center justify-center border-b border-zinc-100 pb-3">
          <div className="inline-flex rounded-xl bg-zinc-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('pass')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${activeTab === 'pass' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              Digital Pass
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'events' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#0b57d0]" />
              <span>Camp Events</span>
              {availableEvents.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('schedule');
                if (schedules.length === 0) setIsLoadingSchedule(true);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${activeTab === 'schedule' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'profile' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              <UserCog className="w-3.5 h-3.5 text-[#0b57d0]" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('media');
                loadCamperMedia();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'media' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>My Media</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${activeTab === 'details' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              Delegation
            </button>
          </div>
        </div>

        {/* Tab 1: Pass & QR */}
        {activeTab === 'pass' && (
          <div className="space-y-4 pt-1">
            {/* Event Switcher Strip if multi-event */}
            {registrations.length > 1 && (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
                <span className="text-[11px] font-bold text-zinc-500 pl-1">Selected Pass:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {registrations.map((reg) => {
                    const isSelected = reg.event_id === selectedEventId;
                    return (
                      <button
                        key={reg.event_id}
                        type="button"
                        onClick={() => setSelectedEventId(reg.event_id)}
                        className={`px-3 py-1 rounded-xl font-bold text-xs transition-all cursor-pointer ${isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                          }`}
                      >
                        {reg.event_name ? (reg.event_name.includes('2029') ? 'VLC 2029' : 'VLC 2027') : reg.event_id.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <CampPassCard
              camper={activeCamperPass}
              eventName={activeCamperPass.active_event_name || 'VLC 2027'}
              onInviteFriend={onInviteFriend}
            />

            {/* Promotion for Upcoming Camp Events if not yet joined */}
            {availableEvents.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-100 text-[#0b57d0]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      Next: Vision &amp; Leadership Camp 2029
                    </div>
                    <p className="text-[11px] text-zinc-600">Register in 1 click with your existing account</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab('events')}
                  className="text-xs font-semibold gap-1 h-8 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-xl px-3"
                >
                  <span>Join Next Camp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            {/* Quick Link to Edit Profile */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#0b57d0]">
                  <UserCog className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">
                    Delegate Profile
                  </div>
                  <p className="text-[11px] text-zinc-500">Update your badge photo, identity &amp; verse</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('profile')}
                className="text-xs font-semibold gap-1.5 h-8 bg-white cursor-pointer"
              >
                <UserCog className="w-3.5 h-3.5 text-[#0b57d0]" />
                <span>Edit Profile</span>
              </Button>
            </div>

            {/* Outbound Confirmation Email Action */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      Digital Camper Passport ({activeCamperPass.active_event_name || 'VLC'})
                    </div>
                    <p className="text-[11px] text-zinc-500">Registered to {camper.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSendingEmail}
                  onClick={handleResendEmail}
                  className="text-xs font-semibold gap-1.5 h-8 bg-white cursor-pointer"
                >
                  {isSendingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0b57d0]" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-[#0b57d0]" />
                  )}
                  <span>{isSendingEmail ? 'Sending...' : 'Resend Email'}</span>
                </Button>
              </div>
              {emailStatusMsg && (
                <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                  {emailStatusMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Multi-Camp Events Hub */}
        {activeTab === 'events' && (
          <div className="space-y-4 pt-1 text-xs">
            {joinStatusMsg && (
              <div className={`p-3 rounded-2xl text-xs font-medium border ${joinStatusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                {joinStatusMsg.text}
              </div>
            )}

            {onNavigateToSchedule && (
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-2">
                <div className="text-[11px] text-blue-900 leading-snug">
                  <strong>Moved to Homepage:</strong> All camp assemblies and multi-day schedules are now directly available on the homepage.
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onNavigateToSchedule();
                  }}
                  className="text-xs h-7 px-3 bg-white text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer shrink-0"
                >
                  <span>Open Full Page</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}

            {/* Persistent Account Banner */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs">
                <Layers className="w-4 h-4 text-[#0b57d0]" />
                <span>Single Account &bull; Multi-Camp Delegate Access</span>
              </div>
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                Your profile, badge photo, emergency contacts, and password are saved under your camper account (<strong>{camper.email}</strong>). You can join future assemblies with 1-click and switch between event passes anytime.
              </p>
            </div>

            {/* Section 1: Registered Camp Gatherings */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Your Registered Camp Assemblies ({registrations.length})
                </h3>
                {isLoadingEvents && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
              </div>

              <div className="space-y-2.5">
                {registrations.map((reg) => {
                  const isSelected = reg.event_id === selectedEventId;
                  const isRegCheckedIn = reg.status === 'activated' || Boolean(reg.checked_in_at);
                  return (
                    <div
                      key={reg.event_id}
                      className={`p-4 rounded-2xl border transition-all ${isSelected
                          ? 'border-blue-500 bg-blue-50/20 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-zinc-900 text-sm">
                              {reg.event_name || reg.event_id.toUpperCase()}
                            </span>
                            {isSelected && (
                              <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5">
                                Current Active Pass
                              </Badge>
                            )}
                            <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 ${isRegCheckedIn
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                              {isRegCheckedIn ? '✓ Verified & Checked In' : 'Registered Delegate'}
                            </Badge>
                          </div>
                          {reg.event_theme && (
                            <p className="text-xs text-blue-700 font-medium mt-0.5">
                              &ldquo;{reg.event_theme}&rdquo;
                            </p>
                          )}
                          <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2 flex-wrap">
                            <span>🗓 {reg.event_dates || (reg.event_id === 'vlc-2029' ? 'July 25-28, 2029' : 'July 21-24, 2027')}</span>
                            <span>&bull;</span>
                            <span>📍 {reg.event_venue || (reg.event_id === 'vlc-2029' ? 'Tagaytay Retreat Center' : 'Baguio Convention Center')}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-[10px] text-zinc-400 uppercase">Pass Code:</span>
                          <span className="font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">
                            {reg.activation_code}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => {
                            setSelectedEventId(reg.event_id);
                            setActiveTab('pass');
                          }}
                          className={`text-xs h-7 px-3 rounded-lg cursor-pointer ${isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                            }`}
                        >
                          {isSelected ? 'View Digital Pass' : 'Switch & View Pass'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Upcoming Assemblies to Join */}
            {availableEvents.length > 0 ? (
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Upcoming Camp Gatherings Open for Registration
                </h3>

                <div className="space-y-3">
                  {availableEvents.map((evt) => {
                    const isJoining = isJoiningEvent === evt.id;
                    const regInfo = getRegistrationStatus(evt);
                    return (
                      <div
                        key={evt.id}
                        className="p-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/50 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                Official Gathering
                              </span>
                              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${regInfo.status === 'open'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : regInfo.status === 'upcoming'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}>
                                <Clock className="w-2.5 h-2.5" />
                                {regInfo.label}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-zinc-900">
                              {evt.name}
                            </h4>
                            <p className="text-xs text-blue-800 font-medium">
                              Theme: {evt.theme}
                            </p>
                          </div>
                        </div>

                        <div className="text-[11px] text-zinc-600 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Camp: {formatEventDateRange(evt.start_date, evt.end_date)}</span>
                          </p>
                          {evt.registration_end_date && (
                            <p className={`flex items-center gap-1.5 ${regInfo.status === 'open' ? 'text-emerald-700 font-medium' : regInfo.status === 'upcoming' ? 'text-amber-700 font-medium' : 'text-rose-700 font-medium'
                              }`}>
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                {regInfo.status === 'open'
                                  ? `Registration Allowed Until: ${formatDateReadable(evt.registration_end_date)} (${regInfo.badgeText})`
                                  : regInfo.status === 'upcoming'
                                    ? `Registration Opens: ${formatDateReadable(evt.registration_start_date)}`
                                    : `Registration Cutoff Passed: ${formatDateReadable(evt.registration_end_date)}`
                                }
                              </span>
                            </p>
                          )}
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{evt.venue_name}, {evt.city}</span>
                          </p>
                        </div>

                        {evt.description && (
                          <p className="text-xs text-zinc-600 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-blue-100">
                            {evt.description}
                          </p>
                        )}

                        <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[11px] text-zinc-500 italic">
                            {regInfo.isAllowed
                              ? '1-Click Signup • Uses your saved profile & contacts'
                              : regInfo.description
                            }
                          </span>
                          <Button
                            size="sm"
                            disabled={isJoining || !regInfo.isAllowed}
                            onClick={() => {
                              if (!regInfo.isAllowed) {
                                alert(regInfo.description);
                                return;
                              }
                              handleJoinEvent(evt);
                            }}
                            className={`font-semibold text-xs rounded-xl px-4 h-8 ${regInfo.isAllowed
                                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                : 'bg-zinc-200 text-zinc-500 cursor-not-allowed border border-zinc-300'
                              }`}
                          >
                            {isJoining ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                <span>Joining...</span>
                              </>
                            ) : !regInfo.isAllowed ? (
                              <span>{regInfo.badgeText}</span>
                            ) : (
                              <>
                                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                <span>Join {evt.name.includes('2029') ? 'VLC 2029' : evt.name}</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center text-zinc-500 text-xs">
                You are registered for all available camp gatherings! Stay tuned for future assemblies.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Edit Profile Form */}
        {activeTab === 'profile' && (
          <div className="pt-1">
            <EditProfileForm
              camper={camper}
              onProfileUpdated={(updated) => {
                onProfileUpdated?.(updated);
              }}
            />
          </div>
        )}

        {/* Tab 2: Delegation Details */}
        {activeTab === 'details' && (
          <div className="space-y-4 pt-2 text-xs">
            {/* Church Delegation Card */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 font-bold">
                <ChurchIcon className="w-4 h-4 text-[#0b57d0]" />
                <span>Home Delegation</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-zinc-800 text-sm">{camper.church_name || 'Independent Delegate'}</p>
                <p className="text-zinc-500">{camper.province} &bull; {camper.city || 'Various Cities'}</p>
              </div>
            </div>

            {/* Camp Essentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                  <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
                  <span>Delegate Kit Status</span>
                </div>
                <p className="font-bold text-sm text-zinc-900">
                  {camper.kit_claimed ? 'Claimed ✓' : 'Pending Claim'}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {camper.kit_claimed ? 'Badge & lanyard received' : 'Collect at Arrival Desk'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                  <HeartHandshake className="w-3.5 h-3.5 text-red-500" />
                  <span>Dietary Requirements</span>
                </div>
                <p className="font-semibold text-zinc-800">{camper.dietary_needs || 'None reported'}</p>
                <p className="text-[10px] text-zinc-500">Notified to camp catering</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                <Phone className="w-3.5 h-3.5 text-zinc-600" />
                <span>Emergency Contact Person</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-zinc-900">{camper.emergency_name}</p>
                  <p className="text-[11px] text-zinc-500">{camper.emergency_relation}</p>
                </div>
                <span className="font-mono text-zinc-700 bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                  {camper.emergency_phone}
                </span>
              </div>
            </div>

            {/* Security Note */}
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2 text-[11px]">
              <Key className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <span>
                Your camper account is password-protected. Keep your pass code (<strong>{camper.activation_code}</strong>) handy during meal times and session check-ins.
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Schedule */}
        {activeTab === 'schedule' && (
          <div className="space-y-3 pt-2 text-xs">
            {onNavigateToSchedule && (
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-2">
                <div className="text-[11px] text-blue-900 leading-snug">
                  <strong>Moved to Homepage:</strong> The full schedule is now available directly on the homepage.
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onNavigateToSchedule();
                  }}
                  className="text-xs h-7 px-3 bg-white text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer shrink-0"
                >
                  <span>Open Full Page</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-200 font-semibold text-zinc-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0b57d0]" />
                <span>{activeCamperPass.active_event_name || 'VLC 2027'} &bull; Schedule</span>
              </div>
              {isLoadingSchedule && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
              )}
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[1, 2, 3, 4].map((dayNum) => {
                const dayDates = ['July 21', 'July 22', 'July 23', 'July 24'];
                const isSelected = selectedDay === dayNum;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDay(dayNum)}
                    className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-colors shrink-0 ${isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                      }`}
                  >
                    Day {dayNum} <span className={isSelected ? 'text-blue-100 font-normal' : 'text-zinc-400 font-normal'}>({dayDates[dayNum - 1]})</span>
                  </button>
                );
              })}
            </div>

            {/* Sessions List for Selected Day */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {schedules.length > 0 ? (
                schedules
                  .filter((s) => s.day_number === selectedDay)
                  .map((item) => {
                    const typeColor =
                      item.session_type === 'rally'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : item.session_type === 'plenary'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : item.session_type === 'workshop'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : item.session_type === 'meal'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : item.session_type === 'sports'
                                ? 'bg-orange-100 text-orange-800 border-orange-200'
                                : 'bg-zinc-100 text-zinc-700 border-zinc-200';

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-zinc-200/90 bg-white shadow-sm hover:border-zinc-300 transition-all space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="font-bold text-zinc-900 block text-xs">
                              {item.title}
                            </span>
                            {item.description && (
                              <p className="text-zinc-500 text-[11px] leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className={`text-[10px] shrink-0 font-medium px-2 py-0.5 capitalize ${typeColor}`}>
                            {item.session_type || 'General'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-zinc-500 pt-0.5">
                          <span className="flex items-center gap-1 font-mono font-medium text-zinc-700">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {item.time_display || `${item.time_start} - ${item.time_end}`}
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-zinc-400" />
                              {item.location}
                            </span>
                          )}
                          {item.speaker && (
                            <span className="flex items-center gap-1 text-blue-700 font-medium">
                              <UserCheck className="w-3 h-3 text-blue-500" />
                              {item.speaker}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
              ) : (
                // Fallback while loading or offline
                <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1.5 text-center">
                  <div className="font-bold text-zinc-900 text-xs">
                    {activeCamperPass.active_event_name || 'Camp Assembly'} Schedule
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    {isLoadingSchedule
                      ? 'Loading verified schedule sessions from Event Registry...'
                      : `Detailed session itineraries for Day ${selectedDay} will be published closer to the gathering dates.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: My Media & Highlights */}
        {activeTab === 'media' && (
          <div className="space-y-5 pt-1 text-left animate-fadeIn">
            {/* Top Media Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50 via-zinc-50 to-amber-50/50 p-4 rounded-3xl border border-zinc-200/80">
              <div>
                <h4 className="font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>My Media &amp; Highlights</span>
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Posts and stories persist permanently on your profile and appear in the community feed.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMediaUploadType('post');
                    setIsMediaUploadOpen(true);
                  }}
                  className="tap-pill px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Upload Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaUploadType('story');
                    setIsMediaUploadOpen(true);
                  }}
                  className="tap-pill px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add Highlight</span>
                </button>
              </div>
            </div>

            {isLoadingMedia ? (
              <div className="py-16 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs">Loading your media...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Permanent Highlights Row */}
                <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Permanent Highlights ({mediaStories.length})</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      Chronological order &bull; Never expires
                    </span>
                  </div>

                  {mediaStories.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-3 text-center">
                      No story highlights yet. Click 'Add Highlight' to share a vertical highlight reel!
                    </p>
                  ) : (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {mediaStories.map((story, idx) => (
                        <button
                          key={story.id}
                          type="button"
                          onClick={() => setHubStoryIndex(idx)}
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

                {/* 2. Permanent Posts Grid */}
                <div className="bg-white rounded-3xl p-4 border border-zinc-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Your Feed Posts ({mediaPosts.length})</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      Permanent camper profile feed
                    </span>
                  </div>

                  {mediaPosts.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-6 text-center">
                      You haven't posted any photos yet. Click 'Upload Post' to share your camp experiences!
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {mediaPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => setHubSelectedPost(post)}
                          className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 cursor-pointer group shadow-2xs hover:shadow-md transition-all border border-zinc-200"
                        >
                          <img
                            src={post.media_url}
                            alt={post.caption || 'Post'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white font-bold text-xs p-2">
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>{post.reaction_counts?.total || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4 text-white" />
                              <span>{post.comments_count || 0}</span>
                            </div>
                          </div>

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
              </div>
            )}

            {/* Media Upload Modal */}
            <MediaUploadModal
              isOpen={isMediaUploadOpen}
              onClose={() => setIsMediaUploadOpen(false)}
              currentCamper={camper}
              defaultType={mediaUploadType}
              onPostCreated={(newPost) => setMediaPosts((prev) => [newPost, ...prev])}
              onStoryCreated={(newStory) => setMediaStories((prev) => [...prev, newStory])}
            />

            {/* Story Viewer Modal */}
            {hubStoryIndex !== null && mediaStories.length > 0 && (
              <StoryViewerModal
                isOpen={hubStoryIndex !== null}
                onClose={() => setHubStoryIndex(null)}
                stories={mediaStories}
                initialIndex={hubStoryIndex}
                currentCamper={camper}
                onStoryDeleted={(id) => setMediaStories((prev) => prev.filter((s) => s.id !== id))}
              />
            )}

            {/* Post Detail Modal */}
            {hubSelectedPost && (
              <PostDetailModal
                isOpen={Boolean(hubSelectedPost)}
                onClose={() => setHubSelectedPost(null)}
                post={hubSelectedPost}
                currentCamper={camper}
                onPostDeleted={(id) => setMediaPosts((prev) => prev.filter((p) => p.id !== id))}
                onReactionUpdated={(id, emoji, counts) =>
                  setMediaPosts((prev) =>
                    prev.map((p) =>
                      p.id === id ? { ...p, user_reaction: emoji, reaction_counts: counts } : p
                    )
                  )
                }
                onNavigateToCamper={(camperId) => {
                  setHubSelectedPost(null);
                  onClose();
                  onViewCamperProfile?.(camperId);
                }}
              />
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>

          <Button
            size="sm"
            onClick={onClose}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-5"
          >
            Close Portal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
