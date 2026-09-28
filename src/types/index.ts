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
  password?: string;
  password_hash?: string;
  is_active?: boolean | number;
  last_login_at?: string;
  is_admin?: boolean;
  is_staff?: boolean;
  registrations?: EventRegistration[];
  active_event_name?: string;
  created_at?: string;
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
  status: 'active' | 'upcoming' | 'completed' | 'archived';
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
  created_at?: string;
}

