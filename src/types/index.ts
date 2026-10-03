export type CamperRole = 
  | 'admin'
  | 'staff'
  | 'coordinator'
  | 'camper' 
  | 'first_timer' 
  | 'counselor' 
  | 'pastor' 
  | 'worship' 
  | 'medical';

export interface ChurchSignupSummary {
  id: string;
  nickname: string;
  full_name?: string;
  role?: CamperRole;
  selfie_url?: string;
}

export interface Church {
  id: string;
  slug: string;
  name: string;
  province: string;
  city: string;
  pastor_name?: string;
  contact_email?: string;
  target_quota: number;
  registered_count?: number;
  signups?: ChurchSignupSummary[];
}

export interface CamperRegistration {
  id?: string;
  church_id: string;
  church_name?: string;
  church_slug?: string;
  role: CamperRole;
  full_name: string;
  nickname: string;
  gender: 'male' | 'female' | 'unspecified';
  age: number;
  birthdate?: string;
  email: string;
  phone: string;
  province: string;
  city?: string;
  dietary_needs?: string;
  emergency_name: string;
  emergency_phone: string;
  emergency_relation: string;
  ministry_interests: string[];
  favorite_verse: string;
  verse_reflection?: string;
  selfie_url?: string;
  event_id?: string;
  activation_code?: string;
  activation_token?: string;
  reset_token?: string;
  reset_token_expires_at?: string;
  status?: 'registered' | 'activated' | 'cancelled';
  checked_in_at?: string;
  checked_in_by?: string;
  kit_claimed?: boolean | number;
  print_count?: number;
  last_printed_at?: string;
  last_printed_by?: string;
  reprint_reason?: string;
  password?: string;
  password_hash?: string;
  is_active?: boolean | number;
  last_login_at?: string;
  is_admin?: boolean;
  is_staff?: boolean;
  registrations?: EventRegistration[];
  active_event_name?: string;
  listening_status?: CamperListeningStatus | null;
  created_at?: string;
}

export interface CamperListeningStatus {
  track_id: string;
  title: string;
  artist: string;
  album?: string;
  cover_art_url?: string | null;
  is_playing: boolean;
  updated_at: string;
}

export interface RegistrationStats {
  campName: string;
  campTheme: string;
  targetCapacity: number;
  totalRegistered: number;
  percentFilled: number;
  churchBreakdown: Array<{
    id: string;
    name: string;
    slug: string;
    province: string;
    city: string;
    target_quota: number;
    count: number;
  }>;
  provinceBreakdown: Array<{
    province: string;
    count: number;
  }>;
  roleBreakdown: Array<{
    role: CamperRole;
    count: number;
  }>;
  recentSignups: Array<{
    nickname: string;
    role: CamperRole;
    province: string;
    church_name: string;
    favorite_verse: string;
    created_at: string;
    age?: number;
    birthdate?: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
  widgetType?: 'role' | 'basics' | 'care' | 'selfie' | 'ministry' | 'verse' | 'review';
}

export type AdminRole = 'admin' | 'staff' | 'coordinator';

export interface AdminUser {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  role: CamperRole | AdminRole | string;
  church_id?: string;
  church_name?: string;
  is_active: boolean | number;
  password_hash?: string;
  selfie_url?: string;
  created_at?: string;
  last_login_at?: string;
}

export interface CamperUser {
  id: string;
  email: string;
  full_name: string;
  nickname: string;
  role: CamperRole;
  church_id: string;
  church_name?: string;
  church_slug?: string;
  province: string;
  city?: string;
  dietary_needs?: string;
  emergency_name: string;
  emergency_phone: string;
  emergency_relation: string;
  favorite_verse: string;
  verse_reflection?: string;
  selfie_url?: string;
  activation_code: string;
  status: 'registered' | 'activated' | 'cancelled';
  checked_in_at?: string;
  kit_claimed?: boolean | number;
  created_at?: string;
}

export interface CheckInStats {
  totalRegistered: number;
  totalCheckedIn: number;
  percentCheckedIn: number;
  totalKitsClaimed: number;
  delegationStats: Array<{
    church_id: string;
    church_name: string;
    total: number;
    checkedIn: number;
  }>;
}

export interface CampEvent {
  id: string;
  slug: string;
  name: string;
  theme: string;
  tagline?: string;
  description?: string;
  start_date: string;
  end_date: string;
  venue_name: string;
  venue_address?: string;
  city: string;
  province: string;
  country?: string;
  target_capacity?: number;
  banner_url?: string;
  primary_image_url?: string;
  registration_start_date?: string | null;
  registration_end_date?: string | null;
  registration_status?: 'open' | 'upcoming' | 'closed';
  is_registration_allowed?: boolean;
  status: 'active' | 'upcoming' | 'completed' | 'archived';
  created_at?: string;
}

export interface MediaItem {
  id: string;
  r2_key: string;
  url: string;
  file_name: string;
  file_type: string;
  media_type: 'image' | 'video';
  file_size: number;
  event_id?: string;
  title?: string;
  description?: string;
  is_primary?: boolean | number;
  uploaded_by?: string;
  created_at?: string;
}

export interface EventScheduleItem {
  id: string;
  event_id: string;
  day_number: number;
  day_title: string;
  date: string;
  time_start: string;
  time_end: string;
  time_display: string;
  title: string;
  description?: string;
  location?: string;
  speaker?: string;
  session_type?: 'rally' | 'workshop' | 'plenary' | 'meal' | 'fellowship' | 'sports' | 'general';
  sort_order: number;
  created_at?: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  event_name?: string;
  event_slug?: string;
  event_theme?: string;
  event_dates?: string;
  event_venue?: string;
  event_city?: string;
  camper_id: string;
  church_id: string;
  church_name?: string;
  church_slug?: string;
  role: CamperRole;
  activation_code: string;
  activation_token: string;
  status: 'registered' | 'activated' | 'cancelled';
  checked_in_at?: string;
  checked_in_by?: string;
  kit_claimed: number | boolean;
  print_count?: number;
  last_printed_at?: string;
  last_printed_by?: string;
  reprint_reason?: string;
  created_at?: string;
}

export type BadgeThemePreset = 'gold' | 'emerald' | 'heritage' | 'monochrome' | 'sunset';
export type BadgeOrientation = 'vertical' | 'horizontal';

export interface BadgeThemeConfig {
  preset: BadgeThemePreset;
  orientation: BadgeOrientation;
  primaryColor?: string;
  accentColor?: string;
  showPhoto: boolean;
  showChurch: boolean;
  showRole: boolean;
  showVerse: boolean;
  showQrCode: boolean;
  showEmergencyContact: boolean;
  headerStyle: 'solid' | 'gradient' | 'minimal';
}

export const DEFAULT_BADGE_CONFIG: BadgeThemeConfig = {
  preset: 'gold',
  orientation: 'vertical',
  showPhoto: true,
  showChurch: true,
  showRole: true,
  showVerse: true,
  showQrCode: true,
  showEmergencyContact: false,
  headerStyle: 'gradient',
};

export interface QueueDelegate {
  registration_id: string;
  event_id: string;
  event_name?: string;
  event_slug?: string;
  event_theme?: string;
  event_dates?: string;
  event_venue?: string;
  event_city?: string;
  camper_id: string;
  full_name: string;
  nickname: string;
  gender: string;
  age: number;
  birthdate?: string;
  email: string;
  phone: string;
  province: string;
  city?: string;
  dietary_needs?: string;
  emergency_name: string;
  emergency_phone: string;
  emergency_relation: string;
  favorite_verse: string;
  verse_reflection?: string;
  selfie_url?: string;
  activation_code: string;
  activation_token: string;
  role: CamperRole;
  status: string;
  print_count: number;
  last_printed_at?: string;
  last_printed_by?: string;
  reprint_reason?: string;
  checked_in_at?: string;
  kit_claimed: number | boolean;
  church_id: string;
  church_name?: string;
  church_slug?: string;
  created_at?: string;
}

export interface BadgeQueueResponse {
  success: boolean;
  stats: {
    total_in_queue: number;
    unprinted_count: number;
    printed_count: number;
    reprint_count: number;
  };
  delegates: QueueDelegate[];
  error?: string;
}

export type AllowedReactionEmoji = '👍' | '❤️' | '🔥' | '⛺' | '🌲' | '🎉';

export interface ReactionCounts {
  '👍': number;
  '❤️': number;
  '🔥': number;
  '⛺': number;
  '🌲': number;
  '🎉': number;
  total: number;
  [key: string]: number;
}

export interface CommunityCamperSummary {
  id: string;
  full_name: string;
  nickname: string;
  role: string;
  selfie_url?: string | null;
  church_name?: string | null;
}

export interface CommunityPost {
  id: string;
  camper_id: string;
  media_url: string;
  caption?: string;
  created_at: string;
  updated_at: string;
  camper: CommunityCamperSummary;
  reaction_counts: ReactionCounts;
  user_reaction: AllowedReactionEmoji | null;
  comments_count: number;
}

export interface CommunityStory {
  id: string;
  camper_id: string;
  media_url: string;
  caption?: string | null;
  created_at: string;
  updated_at: string;
  camper: CommunityCamperSummary;
  reaction_counts: ReactionCounts;
  user_reaction: AllowedReactionEmoji | null;
}

export interface CamperStoryGroup {
  camper: CommunityCamperSummary;
  latest_story_at: string;
  stories: CommunityStory[];
}

export interface PostComment {
  id: string;
  post_id: string;
  camper_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  camper: CommunityCamperSummary;
  reaction_counts: ReactionCounts;
  user_reaction: AllowedReactionEmoji | null;
}

export interface PresignUploadResult {
  success: boolean;
  upload_url: string;
  key: string;
  media_url: string;
  file_type: string;
  file_size: number;
  expires_in: number;
  error?: string;
}

export type MusicCategory = 'all' | 'popular' | 'worship' | 'praise' | 'anthem' | 'acoustic' | 'reflection';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  duration_display: string;
  audio_url: string;
  cover_art_url?: string | null;
  category: 'worship' | 'praise' | 'anthem' | 'acoustic' | 'reflection';
  lyrics?: string | null;
  spotify_url?: string | null;
  youtube_url?: string | null;
  uploaded_by?: string;
  sort_order: number;
  play_count?: number;
  is_published: number;
  created_at: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  platform: 'spotify' | 'youtube' | 'apple' | 'custom';
  url: string;
  description?: string | null;
  cover_url?: string | null;
  is_featured: number;
  sort_order: number;
  created_at: string;
}

export type PrayerCategory = 
  | 'spiritual_growth'
  | 'healing_health'
  | 'family_personal'
  | 'academic_career'
  | 'salvation_evangelism'
  | 'camp_breakthrough'
  | 'general';

export type PrayerPrivacyLevel = 
  | 'public'
  | 'church_delegation'
  | 'pastors_counselors'
  | 'anonymous_author';

export type PrayerStatus = 'open' | 'answered' | 'archived';

export interface PrayerParticipantSummary {
  camper_id: string | null;
  nickname: string;
  selfie_url?: string | null;
  church_name?: string | null;
  prayer_count?: number;
  last_prayed_at: string;
}

export interface PrayerParticipantDetail {
  id: string;
  camper_id: string | null;
  nickname: string;
  role: string;
  selfie_url?: string | null;
  church_name?: string | null;
  reaction_type: string;
  prayer_count: number;
  last_prayed_at: string;
  created_at: string;
}

export interface PrayerRequest {
  id: string;
  camper_id: string | null;
  event_id?: string;
  title: string;
  description: string;
  category: PrayerCategory;
  scripture_reference?: string | null;
  privacy_level: PrayerPrivacyLevel;
  is_anonymous: boolean;
  status: PrayerStatus;
  prayer_count: number;
  answered_at?: string | null;
  resolution_notes?: string | null;
  linked_testimony_id?: string | null;
  created_at: string;
  updated_at: string;
  author: CommunityCamperSummary;
  has_prayed: boolean;
  has_prayed_today: boolean;
  user_prayer_count: number;
  recent_participants: PrayerParticipantSummary[];
  is_owner?: boolean;
}

export type TestimonyCategory = 
  | 'answered_prayer'
  | 'salvation'
  | 'healing'
  | 'spiritual_milestone'
  | 'delegation_story'
  | 'general';

export interface Testimony {
  id: string;
  camper_id: string | null;
  prayer_request_id?: string | null;
  event_id?: string;
  title: string;
  content: string;
  scripture_reference?: string | null;
  media_url?: string | null;
  category: TestimonyCategory;
  praise_count: number;
  is_featured: boolean;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  author: CommunityCamperSummary;
  user_reaction?: string | null;
  has_praised?: boolean;
  linked_prayer?: {
    id: string;
    title: string;
    prayer_count: number;
    answered_at?: string | null;
  } | null;
  is_owner?: boolean;
}


