import type { 
  CamperRegistration, 
  CamperRole, 
  Church, 
  RegistrationStats, 
  AdminUser, 
  CheckInStats, 
  CampEvent, 
  EventScheduleItem, 
  EventRegistration, 
  MediaItem, 
  BadgeQueueResponse, 
  QueueDelegate,
  CommunityPost,
  CommunityStory,
  CamperStoryGroup,
  PostComment,
  AllowedReactionEmoji,
  PresignUploadResult,
  MusicTrack,
  MusicPlaylist
} from '../types';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr_admin_alexius',
    name: 'Alexius',
    email: 'alexius@pcci.ph',
    role: 'admin',
    is_active: 1,
    created_at: '2026-09-26T16:39:13.000Z',
    last_login_at: '2026-09-26T16:39:13.000Z',
  },
];

// Official PCCI "Jesus Is Alive Worship Center" churches list synchronized from https://pcci-53421.wasmer.app/churches
export const INITIAL_PCCI_CHURCHES: Church[] = [
  { id: 'ch_open_delegate', slug: 'independent', name: 'Independent Delegate / Other Fellowship', province: 'Open / Other', city: 'Various Cities', pastor_name: 'Camp Coordination Team', contact_email: 'info@pcci.org.ph', target_quota: 100, registered_count: 14 },
  // Cagayan
  { id: 'ch_jia_buguey', slug: 'jia-san-lorenzo-buguey', name: 'Jesus Is Alive Worship Center - San Lorenzo', province: 'Cagayan', city: 'Buguey', pastor_name: 'Pastor in Charge', contact_email: 'buguey@pcci.org.ph', target_quota: 40, registered_count: 18 },
  { id: 'ch_jia_amunitan', slug: 'jia-amunitan-gonzaga', name: 'Jesus Is Alive Worship Center - Amunitan', province: 'Cagayan', city: 'Gonzaga', pastor_name: 'Pastor in Charge', contact_email: 'amunitan@pcci.org.ph', target_quota: 35, registered_count: 12 },
  { id: 'ch_jia_ipil', slug: 'jia-ipil-gonzaga', name: 'Jesus Is Alive Worship Center - Purok 1 Ipil', province: 'Cagayan', city: 'Gonzaga', pastor_name: 'Pastor in Charge', contact_email: 'ipil@pcci.org.ph', target_quota: 35, registered_count: 15 },
  { id: 'ch_jia_tucalan', slug: 'jia-tucalan-lasam', name: 'Jesus Is Alive Worship Center - Tucalan Passing', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'tucalan@pcci.org.ph', target_quota: 30, registered_count: 9 },
  { id: 'ch_jia_nabannagan', slug: 'jia-nabannagan-lasam', name: 'Jesus Is Alive - Nabannagan West', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'nabannagan@pcci.org.ph', target_quota: 30, registered_count: 8 },
  { id: 'ch_jia_new_orlins', slug: 'jia-new-orlins-lasam', name: 'Jesus Is Alive Worship Center - New Orlins', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'neworlins@pcci.org.ph', target_quota: 30, registered_count: 11 },
  { id: 'ch_jia_callao', slug: 'jia-callao-sur-lasam', name: 'Jesus Is Alive Worship Center - Callao Sur', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'callao@pcci.org.ph', target_quota: 30, registered_count: 10 },
  { id: 'ch_jia_minanga', slug: 'jia-minanga-sur-lasam', name: 'Jesus Is Alive Worship Center - Minanga Sur', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'minanga@pcci.org.ph', target_quota: 30, registered_count: 14 },
  { id: 'ch_jia_ibj', slug: 'jia-ibj-lasam', name: 'Jesus Is Alive Worship Center - IBJ', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'ibj@pcci.org.ph', target_quota: 30, registered_count: 12 },
  { id: 'ch_jia_allannay', slug: 'jia-allannay-lasam', name: 'Jesus Is Alive Worship Center - Allannay', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'allannay@pcci.org.ph', target_quota: 30, registered_count: 13 },
  { id: 'ch_jia_centro1', slug: 'jia-centro1-lasam', name: 'Jesus Is Alive Worship Center - Centro 1', province: 'Cagayan', city: 'Lasam', pastor_name: 'Pastor in Charge', contact_email: 'centro1@pcci.org.ph', target_quota: 35, registered_count: 22 },
  { id: 'ch_jia_sanchez_mira', slug: 'jia-sanchez-mira', name: 'Jesus Is Alive Worship Center - Sanchez Mira', province: 'Cagayan', city: 'Sanchez Mira', pastor_name: 'Pastor in Charge', contact_email: 'sanchezmira@pcci.org.ph', target_quota: 40, registered_count: 25 },
  { id: 'ch_jia_sta_teresita', slug: 'jia-alucao-sta-teresita', name: 'Jesus Is Alive Worship Center - Alucao & Bungkag', province: 'Cagayan', city: 'Sta. Teresita', pastor_name: 'Pastor in Charge', contact_email: 'stateresita@pcci.org.ph', target_quota: 35, registered_count: 16 },
  // Nueva Vizcaya (National Headquarters)
  { id: 'ch_jia_buag', slug: 'jia-buag-bambang', name: 'Jesus Is Alive Worship Center - Buag (PCCI National HQ)', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Rev. Pastor in Charge', contact_email: 'bambang@pcci.org.ph', target_quota: 80, registered_count: 52 },
  { id: 'ch_jia_upacan', slug: 'jia-upacan-bambang', name: 'Jesus Is Alive - Upacan', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'upacan@pcci.org.ph', target_quota: 35, registered_count: 14 },
  { id: 'ch_jia_santo_domingo', slug: 'jia-santo-domingo-bambang', name: 'Jesus Is Alive - Santo Domingo', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'santodomingo@pcci.org.ph', target_quota: 35, registered_count: 15 },
  { id: 'ch_jia_gifta', slug: 'jia-gifta-almaguer-bambang', name: 'Jesus Is Alive - Gifta, Almaguer North', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'gifta@pcci.org.ph', target_quota: 30, registered_count: 11 },
  { id: 'ch_cog_almaguer', slug: 'cog-cf-jia-almaguer', name: 'Church of God Christian Fellowship (JIA Almaguer)', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'almaguer@pcci.org.ph', target_quota: 35, registered_count: 19 },
  { id: 'ch_jia_mauan', slug: 'jia-mauan-bambang', name: 'Jesus Is Alive - Mauan', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'mauan@pcci.org.ph', target_quota: 30, registered_count: 9 },
  { id: 'ch_jia_san_antonio', slug: 'jia-san-antonio-bambang', name: 'Jesus Is Alive - San Antonio North', province: 'Nueva Vizcaya', city: 'Bambang', pastor_name: 'Pastor in Charge', contact_email: 'sanantonio@pcci.org.ph', target_quota: 35, registered_count: 17 },
  { id: 'ch_jia_mangayang', slug: 'jia-mangayang-dupax', name: 'Jesus Is Alive - Mangayang', province: 'Nueva Vizcaya', city: 'Dupax Del Norte', pastor_name: 'Pastor in Charge', contact_email: 'mangayang@pcci.org.ph', target_quota: 35, registered_count: 12 },
];

export const INITIAL_CAMP_EVENTS: CampEvent[] = [
  {
    id: 'vlc-2027',
    slug: 'vlc-2027',
    name: 'Vision & Leadership Camp 2027',
    theme: 'Arise & Shine (Isaiah 60:1)',
    tagline: 'National Youth & Workers Leadership Gathering',
    description: 'Annual national gathering of youth delegates, church workers, worship ministers, and pastors across Pentecostal Churches of Christ, Inc. (PCCI) for spiritual renewal and kingdom empowerment.',
    start_date: '2027-07-21',
    end_date: '2027-07-24',
    venue_name: 'PCCI National Headquarters (Buag Campus)',
    venue_address: 'National Highway, Barangay Buag',
    city: 'Bambang',
    province: 'Nueva Vizcaya',
    country: 'Philippines',
    target_capacity: 600,
    status: 'active',
    registration_status: 'open',
    is_registration_allowed: true,
  },
  {
    id: 'vlc-2029',
    slug: 'vlc-2029',
    name: 'Vision & Leadership Camp 2029',
    theme: 'Greater Glory (Haggai 2:9)',
    tagline: 'Biennial National Youth & Workers Leadership Gathering',
    description: 'The next milestone national gathering of youth delegates, church workers, worship ministers, and pastors across Pentecostal Churches of Christ, Inc. (PCCI).',
    start_date: '2029-07-25',
    end_date: '2029-07-28',
    venue_name: 'PCCI National Headquarters (Buag Campus)',
    venue_address: 'National Highway, Barangay Buag',
    city: 'Bambang',
    province: 'Nueva Vizcaya',
    country: 'Philippines',
    target_capacity: 750,
    status: 'upcoming',
    registration_status: 'open',
    is_registration_allowed: true,
  },
];

export const INITIAL_EVENT_SCHEDULES: EventScheduleItem[] = [
  // Day 1
  {
    id: 'sch_d1_01',
    event_id: 'vlc-2027',
    day_number: 1,
    day_title: 'Day 1 • Arrival & Opening Rally',
    date: '2027-07-21',
    time_start: '12:00',
    time_end: '16:00',
    time_display: '12:00 PM – 4:00 PM',
    title: 'Arrival Desk & Badge Verification',
    description: 'Gate arrival, barcode scanning, official kit & lanyard distribution, and dorm check-in.',
    location: 'Main Secretariat Gate',
    speaker: 'Arrival Desk Team',
    session_type: 'general',
    sort_order: 1,
  },
  {
    id: 'sch_d1_02',
    event_id: 'vlc-2027',
    day_number: 1,
    day_title: 'Day 1 • Arrival & Opening Rally',
    date: '2027-07-21',
    time_start: '16:00',
    time_end: '17:30',
    time_display: '4:00 PM – 5:30 PM',
    title: 'Delegation Orientation & Cabin Fellowship',
    description: 'Meet your cabin leader, review camp house rules, and settle into dorm assignments.',
    location: 'Dormitory Pavilions',
    speaker: 'Camp Counselors',
    session_type: 'fellowship',
    sort_order: 2,
  },
  {
    id: 'sch_d1_03',
    event_id: 'vlc-2027',
    day_number: 1,
    day_title: 'Day 1 • Arrival & Opening Rally',
    date: '2027-07-21',
    time_start: '17:30',
    time_end: '18:45',
    time_display: '5:30 PM – 6:45 PM',
    title: 'Welcome Fellowship Dinner',
    description: 'Community meal with all participating PCCI church delegations.',
    location: 'Dining Hall',
    speaker: 'Kitchen Committee',
    session_type: 'meal',
    sort_order: 3,
  },
  {
    id: 'sch_d1_04',
    event_id: 'vlc-2027',
    day_number: 1,
    day_title: 'Day 1 • Arrival & Opening Rally',
    date: '2027-07-21',
    time_start: '19:00',
    time_end: '21:30',
    time_display: '7:00 PM – 9:30 PM',
    title: 'Opening Night Rally: "Arise & Shine"',
    description: 'Keynote assembly on Isaiah 60:1, high-energy worship, and banner presentation.',
    location: 'Main Sanctuary & Auditorium',
    speaker: 'Bishop & Keynote Speakers',
    session_type: 'rally',
    sort_order: 4,
  },
  // Day 2
  {
    id: 'sch_d2_01',
    event_id: 'vlc-2027',
    day_number: 2,
    day_title: 'Day 2 • Leadership Tracks & Holy Fire',
    date: '2027-07-22',
    time_start: '06:30',
    time_end: '07:30',
    time_display: '6:30 AM – 7:30 AM',
    title: 'Morning Devotion & Prayer Walk',
    description: 'Quiet time with scripture and sunrise intercession for the nation.',
    location: 'Camp Prayer Grounds',
    speaker: 'Pastoral Elders',
    session_type: 'fellowship',
    sort_order: 1,
  },
  {
    id: 'sch_d2_02',
    event_id: 'vlc-2027',
    day_number: 2,
    day_title: 'Day 2 • Leadership Tracks & Holy Fire',
    date: '2027-07-22',
    time_start: '07:30',
    time_end: '08:30',
    time_display: '7:30 AM – 8:30 AM',
    title: 'Camp Breakfast',
    description: 'Nutritious breakfast to fuel the day of training and rallies.',
    location: 'Dining Hall',
    speaker: 'Kitchen Committee',
    session_type: 'meal',
    sort_order: 2,
  },
  {
    id: 'sch_d2_03',
    event_id: 'vlc-2027',
    day_number: 2,
    day_title: 'Day 2 • Leadership Tracks & Holy Fire',
    date: '2027-07-22',
    time_start: '09:00',
    time_end: '11:30',
    time_display: '9:00 AM – 11:30 AM',
    title: 'Plenary 1: Kingdom Leadership in a Changing World',
    description: 'Building resilient Christian character, integrity, and biblical leadership acumen.',
    location: 'Main Sanctuary',
    speaker: 'Guest Speaker',
    session_type: 'plenary',
    sort_order: 3,
  },
  {
    id: 'sch_d2_04',
    event_id: 'vlc-2027',
    day_number: 2,
    day_title: 'Day 2 • Leadership Tracks & Holy Fire',
    date: '2027-07-22',
    time_start: '11:45',
    time_end: '13:15',
    time_display: '11:45 AM – 1:15 PM',
    title: 'Fellowship Lunch & Delegation Discussions',
    description: 'Group meal and reflection on plenary insights.',
    location: 'Dining Hall',
    speaker: 'Delegation Leaders',
    session_type: 'meal',
    sort_order: 4,
  },
  {
    id: 'sch_d2_05',
    event_id: 'vlc-2027',
    day_number: 2,
    day_title: 'Day 2 • Leadership Tracks & Holy Fire',
    date: '2027-07-22',
    time_start: '13:30',
    time_end: '16:00',
    time_display: '1:30 PM – 4:00 PM',
    title: 'Specialized Ministry Workshop Tracks',
    description: 'Concurrent breakout sessions: Praise & Worship, Media/Tech, Youth Ministry, Children Church.',
    location: 'Workshops Rooms A, B, C & D',
    speaker: 'Ministry Department Heads',
    session_type: 'workshop',
    sort_order: 5,
  },
  {
    id: 'sch_d2_06',
    event_id: 'vlc-2027',
    day_number: 2,
    day_title: 'Day 2 • Leadership Tracks & Holy Fire',
    date: '2027-07-22',
    time_start: '16:15',
    time_end: '17:45',
    time_display: '4:15 PM – 5:45 PM',
    title: 'Camp Team Challenges & Active Games',
    description: 'Fun, high-energy delegation team building challenges.',
    location: 'Camp Sports Field',
    speaker: 'Activities Committee',
    session_type: 'sports',
    sort_order: 6,
  },
  {
    id: 'sch_d2_07',
    event_id: 'vlc-2027',
    day_number: 2,
    day_title: 'Day 2 • Leadership Tracks & Holy Fire',
    date: '2027-07-22',
    time_start: '19:00',
    time_end: '22:00',
    time_display: '7:00 PM – 10:00 PM',
    title: 'Night of Praise, Worship & Altar Encounter',
    description: 'Extended worship, baptism of the Holy Spirit, and personal ministry prayer lines.',
    location: 'Main Sanctuary',
    speaker: 'VLC Worship Team',
    session_type: 'rally',
    sort_order: 7,
  },
  // Day 3
  {
    id: 'sch_d3_01',
    event_id: 'vlc-2027',
    day_number: 3,
    day_title: 'Day 3 • Empowerment & Fellowship Night',
    date: '2027-07-23',
    time_start: '06:30',
    time_end: '07:30',
    time_display: '6:30 AM – 7:30 AM',
    title: 'Dawn Watch Prayer & Worship',
    description: 'Corporate prayer for local churches and communities.',
    location: 'Prayer Pavilions',
    speaker: 'Youth Leaders',
    session_type: 'fellowship',
    sort_order: 1,
  },
  {
    id: 'sch_d3_02',
    event_id: 'vlc-2027',
    day_number: 3,
    day_title: 'Day 3 • Empowerment & Fellowship Night',
    date: '2027-07-23',
    time_start: '07:30',
    time_end: '08:30',
    time_display: '7:30 AM – 8:30 AM',
    title: 'Breakfast',
    description: 'Morning fellowship breakfast.',
    location: 'Dining Hall',
    speaker: 'Kitchen Committee',
    session_type: 'meal',
    sort_order: 2,
  },
  {
    id: 'sch_d3_03',
    event_id: 'vlc-2027',
    day_number: 3,
    day_title: 'Day 3 • Empowerment & Fellowship Night',
    date: '2027-07-23',
    time_start: '09:00',
    time_end: '11:30',
    time_display: '9:00 AM – 11:30 AM',
    title: 'Plenary 2: The Empowered Generation',
    description: 'Evangelism, campus ministry strategy, and community impact.',
    location: 'Main Sanctuary',
    speaker: 'National Youth Director',
    session_type: 'plenary',
    sort_order: 3,
  },
  {
    id: 'sch_d3_04',
    event_id: 'vlc-2027',
    day_number: 3,
    day_title: 'Day 3 • Empowerment & Fellowship Night',
    date: '2027-07-23',
    time_start: '11:45',
    time_end: '13:15',
    time_display: '11:45 AM – 1:15 PM',
    title: 'Lunch & Regional Delegation Meeting',
    description: 'Provincial delegation coordination and regional fellowship.',
    location: 'Dining Hall',
    speaker: 'Pastors & Coordinators',
    session_type: 'meal',
    sort_order: 4,
  },
  {
    id: 'sch_d3_05',
    event_id: 'vlc-2027',
    day_number: 3,
    day_title: 'Day 3 • Empowerment & Fellowship Night',
    date: '2027-07-23',
    time_start: '14:00',
    time_end: '16:30',
    time_display: '2:00 PM – 4:30 PM',
    title: 'National Bible Bowl & Scripture Showcase',
    description: 'Inter-church scripture memory quiz, creative presentations, and awards.',
    location: 'Auditorium',
    speaker: 'Academic & Education Committee',
    session_type: 'workshop',
    sort_order: 5,
  },
  {
    id: 'sch_d3_06',
    event_id: 'vlc-2027',
    day_number: 3,
    day_title: 'Day 3 • Empowerment & Fellowship Night',
    date: '2027-07-23',
    time_start: '19:00',
    time_end: '22:00',
    time_display: '7:00 PM – 10:00 PM',
    title: 'Campfire Acoustic Night & Testimony Rally',
    description: 'Outdoor praise around the campfire, delegate testimonies, and celebration of grace.',
    location: 'Open Campfire Grounds',
    speaker: 'All Delegations',
    session_type: 'rally',
    sort_order: 6,
  },
  // Day 4
  {
    id: 'sch_d4_01',
    event_id: 'vlc-2027',
    day_number: 4,
    day_title: 'Day 4 • Commissioning & Send-Off',
    date: '2027-07-24',
    time_start: '07:00',
    time_end: '08:00',
    time_display: '7:00 AM – 8:00 AM',
    title: 'Final Camp Breakfast',
    description: 'Final morning meal together with friends and mentors.',
    location: 'Dining Hall',
    speaker: 'Kitchen Committee',
    session_type: 'meal',
    sort_order: 1,
  },
  {
    id: 'sch_d4_02',
    event_id: 'vlc-2027',
    day_number: 4,
    day_title: 'Day 4 • Commissioning & Send-Off',
    date: '2027-07-24',
    time_start: '08:30',
    time_end: '11:30',
    time_display: '8:30 AM – 11:30 AM',
    title: 'Grand Commissioning Service & Holy Communion',
    description: 'Anointing of delegates, Holy Communion, certificate distribution, and send-off charge.',
    location: 'Main Sanctuary',
    speaker: 'PCCI General Presbytery',
    session_type: 'rally',
    sort_order: 2,
  },
  {
    id: 'sch_d4_03',
    event_id: 'vlc-2027',
    day_number: 4,
    day_title: 'Day 4 • Commissioning & Send-Off',
    date: '2027-07-24',
    time_start: '11:45',
    time_end: '13:00',
    time_display: '11:45 AM – 1:00 PM',
    title: 'Victory Luncheon & Delegation Photos',
    description: 'Official camp photo shoot per church and farewell banquet.',
    location: 'Courtyard & Grounds',
    speaker: 'Media Secretariat',
    session_type: 'meal',
    sort_order: 3,
  },
  {
    id: 'sch_d4_04',
    event_id: 'vlc-2027',
    day_number: 4,
    day_title: 'Day 4 • Commissioning & Send-Off',
    date: '2027-07-24',
    time_start: '13:00',
    time_end: '15:00',
    time_display: '1:00 PM – 3:00 PM',
    title: 'Delegation Departure & Travel Mercies',
    description: 'Cabin checkout and safe homeward journey across the provinces.',
    location: 'Gate Departure Terminal',
    speaker: 'Transport Committee',
    session_type: 'general',
    sort_order: 4,
  },
];

const INITIAL_CAMPERS: CamperRegistration[] = [
  {
    id: 'cmp_101',
    church_id: 'ch_jia_buag',
    church_name: 'Jesus Is Alive Worship Center - Buag (PCCI National HQ)',
    church_slug: 'jia-buag-bambang',
    role: 'counselor',
    full_name: 'Joshua Miguel Valdez',
    nickname: 'Josh',
    gender: 'male',
    age: 24,
    email: 'joshua.valdez@email.com',
    phone: '+639171112233',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Maria Valdez',
    emergency_phone: '+639170001122',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Youth Ministry'],
    favorite_verse: 'Joshua 1:9',
    verse_reflection: 'Be strong and courageous! God has prepared this season for you to lead fearlessly at VLC 2027.',
    selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-8842',
    activation_token: 'act_josh_101',
    status: 'activated',
    checked_in_at: new Date(Date.now() - 3600000).toISOString(),
    kit_claimed: 1,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'cmp_102',
    church_id: 'ch_jia_sanchez_mira',
    church_name: 'Jesus Is Alive Worship Center - Sanchez Mira',
    church_slug: 'jia-sanchez-mira',
    role: 'first_timer',
    full_name: 'Hannah Joy Mendoza',
    nickname: 'Hannah',
    gender: 'female',
    age: 18,
    email: 'hannah.mendoza@email.com',
    phone: '+639182223344',
    province: 'Cagayan',
    city: 'Sanchez Mira',
    dietary_needs: 'No shellfish',
    emergency_name: 'Roberto Mendoza',
    emergency_phone: '+639189998877',
    emergency_relation: 'Father',
    ministry_interests: ['Media & Video', 'Youth Ministry'],
    favorite_verse: 'Jeremiah 29:11',
    verse_reflection: 'For I know the plans I have for you—plans to give you hope and a bright future!',
    selfie_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-3914',
    activation_token: 'act_hannah_102',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'cmp_103',
    church_id: 'ch_open_delegate',
    church_name: 'Independent Delegate / Other Fellowship',
    church_slug: 'independent',
    role: 'camper',
    full_name: 'Elijah Marcus Ramos',
    nickname: 'Eli',
    gender: 'male',
    age: 21,
    email: 'eli.ramos@email.com',
    phone: '+639193334455',
    province: 'Open / Other',
    city: 'Quezon City',
    dietary_needs: 'None',
    emergency_name: 'Grace Ramos',
    emergency_phone: '+639198887766',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Sound & Production'],
    favorite_verse: 'Psalm 100:1-2',
    verse_reflection: 'Make a joyful noise to the Lord! Worship is your weapon and your joy.',
    selfie_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-5520',
    activation_token: 'act_eli_103',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'cmp_104',
    church_id: 'ch_jia_centro1',
    church_name: 'Jesus Is Alive Worship Center - Centro 1',
    church_slug: 'jia-centro1-lasam',
    role: 'worship',
    full_name: 'Chloe Danielle Santos',
    nickname: 'Chloe',
    gender: 'female',
    age: 20,
    email: 'chloe.santos@email.com',
    phone: '+639237778899',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Lorna Santos',
    emergency_phone: '+639234443322',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Vocalist'],
    favorite_verse: 'Isaiah 60:1',
    verse_reflection: 'Arise, shine, for your light has come, and the glory of the Lord rises upon you!',
    selfie_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-6192',
    activation_token: 'act_chloe_104',
    status: 'activated',
    kit_claimed: 1,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'cmp_105',
    church_id: 'ch_jia_buag',
    church_name: 'Jesus Is Alive Worship Center - Buag',
    church_slug: 'jia-buag-bambang',
    role: 'counselor',
    full_name: 'David Paul Villanueva',
    nickname: 'Dave',
    gender: 'male',
    age: 23,
    email: 'david.villanueva@email.com',
    phone: '+639174445566',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Cynthia Villanueva',
    emergency_phone: '+639178881122',
    emergency_relation: 'Mother',
    ministry_interests: ['Youth Leadership', 'Prayer & Intercession'],
    favorite_verse: '1 Timothy 4:12',
    verse_reflection: 'Don’t let anyone look down on you because you are young, but set an example for the believers.',
    selfie_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-7241',
    activation_token: 'act_dave_105',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'cmp_106',
    church_id: 'ch_jia_buguey',
    church_name: 'Jesus Is Alive Worship Center - San Lorenzo',
    church_slug: 'jia-san-lorenzo-buguey',
    role: 'first_timer',
    full_name: 'Sarah Joy Balisi',
    nickname: 'Sarah',
    gender: 'female',
    age: 19,
    email: 'sarah.balisi@email.com',
    phone: '+639185556677',
    province: 'Cagayan',
    city: 'Buguey',
    dietary_needs: 'None',
    emergency_name: 'Antonio Balisi',
    emergency_phone: '+639187779900',
    emergency_relation: 'Father',
    ministry_interests: ['Children Ministry', 'Media & Tech'],
    favorite_verse: 'Proverbs 3:5-6',
    verse_reflection: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    selfie_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-4489',
    activation_token: 'act_sarah_106',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'cmp_107',
    church_id: 'ch_cog_almaguer',
    church_name: 'Church of God Christian Fellowship (JIA Almaguer)',
    church_slug: 'cog-cf-jia-almaguer',
    role: 'worship',
    full_name: 'Grace Nicole Aquino',
    nickname: 'Grace',
    gender: 'female',
    age: 22,
    email: 'grace.aquino@email.com',
    phone: '+639201112244',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Elena Aquino',
    emergency_phone: '+639203334411',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Acoustic Guitar'],
    favorite_verse: 'Psalm 46:1',
    verse_reflection: 'God is our refuge and strength, an ever-present help in trouble.',
    selfie_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-9311',
    activation_token: 'act_grace_107',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'cmp_108',
    church_id: 'ch_jia_amunitan',
    church_name: 'Jesus Is Alive Worship Center - Amunitan',
    church_slug: 'jia-amunitan-gonzaga',
    role: 'worship',
    full_name: 'Nathaniel Joseph Perez',
    nickname: 'Nathan',
    gender: 'male',
    age: 21,
    email: 'nathan.perez@email.com',
    phone: '+639173332211',
    province: 'Cagayan',
    city: 'Gonzaga',
    dietary_needs: 'None',
    emergency_name: 'Marites Perez',
    emergency_phone: '+639178883344',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Bass Guitar'],
    favorite_verse: 'Psalm 150:6',
    verse_reflection: 'Let everything that has breath praise the Lord!',
    selfie_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-3321',
    activation_token: 'act_nathan_108',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: 'cmp_109',
    church_id: 'ch_jia_ipil',
    church_name: 'Jesus Is Alive Worship Center - Purok 1 Ipil',
    church_slug: 'jia-ipil-gonzaga',
    role: 'first_timer',
    full_name: 'Faith Angela Cruz',
    nickname: 'Faith',
    gender: 'female',
    age: 18,
    email: 'faith.cruz@email.com',
    phone: '+639194445566',
    province: 'Cagayan',
    city: 'Gonzaga',
    dietary_needs: 'None',
    emergency_name: 'Eduardo Cruz',
    emergency_phone: '+639192223311',
    emergency_relation: 'Father',
    ministry_interests: ['Creative Dance', 'Children Ministry'],
    favorite_verse: 'Hebrews 11:1',
    verse_reflection: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    selfie_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-8120',
    activation_token: 'act_faith_109',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 11).toISOString(),
  },
  {
    id: 'cmp_110',
    church_id: 'ch_jia_tucalan',
    church_name: 'Jesus Is Alive Worship Center - Tucalan Passing',
    church_slug: 'jia-tucalan-lasam',
    role: 'counselor',
    full_name: 'Mark Anthony Lopez',
    nickname: 'Mark',
    gender: 'male',
    age: 24,
    email: 'mark.lopez@email.com',
    phone: '+639186667788',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Luzviminda Lopez',
    emergency_phone: '+639184441122',
    emergency_relation: 'Mother',
    ministry_interests: ['Youth Discipleship', 'Camp Counseling'],
    favorite_verse: 'Philippians 4:13',
    verse_reflection: 'I can do all things through Christ who gives me strength.',
    selfie_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-1194',
    activation_token: 'act_mark_110',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
  {
    id: 'cmp_111',
    church_id: 'ch_jia_nabannagan',
    church_name: 'Jesus Is Alive - Nabannagan West',
    church_slug: 'jia-nabannagan-lasam',
    role: 'camper',
    full_name: 'Caleb Joshua Dizon',
    nickname: 'Caleb',
    gender: 'male',
    age: 20,
    email: 'caleb.dizon@email.com',
    phone: '+639225556677',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Jonathan Dizon',
    emergency_phone: '+639227778899',
    emergency_relation: 'Father',
    ministry_interests: ['Media & Tech', 'Logistics'],
    favorite_verse: 'Joshua 24:15',
    verse_reflection: 'As for me and my household, we will serve the Lord.',
    selfie_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-7742',
    activation_token: 'act_caleb_111',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    id: 'cmp_112',
    church_id: 'ch_jia_new_orlins',
    church_name: 'Jesus Is Alive Worship Center - New Orlins',
    church_slug: 'jia-new-orlins-lasam',
    role: 'camper',
    full_name: 'Kyla Mae Pascual',
    nickname: 'Kyla',
    gender: 'female',
    age: 19,
    email: 'kyla.pascual@email.com',
    phone: '+639178889900',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Virginia Pascual',
    emergency_phone: '+639172221100',
    emergency_relation: 'Mother',
    ministry_interests: ['Creative Arts', 'Ushering'],
    favorite_verse: 'Psalm 23:1',
    verse_reflection: 'The Lord is my shepherd, I lack nothing.',
    selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-5102',
    activation_token: 'act_kyla_112',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 15).toISOString(),
  },
  {
    id: 'cmp_113',
    church_id: 'ch_jia_callao',
    church_name: 'Jesus Is Alive Worship Center - Callao Sur',
    church_slug: 'jia-callao-sur-lasam',
    role: 'worship',
    full_name: 'James Matthew Tan',
    nickname: 'James',
    gender: 'male',
    age: 22,
    email: 'james.tan@email.com',
    phone: '+639193337788',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Rebecca Tan',
    emergency_phone: '+639194448899',
    emergency_relation: 'Mother',
    ministry_interests: ['Praise & Worship', 'Drums'],
    favorite_verse: 'Colossians 3:16',
    verse_reflection: 'Sing psalms, hymns, and spiritual songs with gratitude in your hearts to God.',
    selfie_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-6831',
    activation_token: 'act_james_113',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 9).toISOString(),
  },
  {
    id: 'cmp_114',
    church_id: 'ch_jia_minanga',
    church_name: 'Jesus Is Alive Worship Center - Minanga Sur',
    church_slug: 'jia-minanga-sur-lasam',
    role: 'first_timer',
    full_name: 'Joy Abigail Perez',
    nickname: 'Joy',
    gender: 'female',
    age: 18,
    email: 'joy.perez@email.com',
    phone: '+639206665544',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Marlon Perez',
    emergency_phone: '+639207771122',
    emergency_relation: 'Father',
    ministry_interests: ['Youth Fellowship', 'Hospitality'],
    favorite_verse: 'Nehemiah 8:10',
    verse_reflection: 'The joy of the Lord is your strength!',
    selfie_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-2940',
    activation_token: 'act_joy_114',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 25).toISOString(),
  },
  {
    id: 'cmp_115',
    church_id: 'ch_jia_ibj',
    church_name: 'Jesus Is Alive Worship Center - IBJ',
    church_slug: 'jia-ibj-lasam',
    role: 'staff',
    full_name: 'Gabriel Sean Ramos',
    nickname: 'Gabe',
    gender: 'male',
    age: 25,
    email: 'gabe.ramos@email.com',
    phone: '+639189991122',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Patricia Ramos',
    emergency_phone: '+639185552233',
    emergency_relation: 'Mother',
    ministry_interests: ['Camp Administration', 'Safety & Security'],
    favorite_verse: 'Galatians 6:9',
    verse_reflection: 'Let us not become weary in doing good, for at the proper time we will reap a harvest.',
    selfie_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-9012',
    activation_token: 'act_gabe_115',
    status: 'activated',
    kit_claimed: 1,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    id: 'cmp_116',
    church_id: 'ch_jia_allannay',
    church_name: 'Jesus Is Alive Worship Center - Allannay',
    church_slug: 'jia-allannay-lasam',
    role: 'camper',
    full_name: 'Bea Louise Torres',
    nickname: 'Bea',
    gender: 'female',
    age: 20,
    email: 'bea.torres@email.com',
    phone: '+639234445566',
    province: 'Cagayan',
    city: 'Lasam',
    dietary_needs: 'None',
    emergency_name: 'Danilo Torres',
    emergency_phone: '+639238889900',
    emergency_relation: 'Father',
    ministry_interests: ['Visual Arts', 'Decoration'],
    favorite_verse: 'Psalm 139:14',
    verse_reflection: 'I praise you because I am fearfully and wonderfully made.',
    selfie_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-3851',
    activation_token: 'act_bea_116',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 19).toISOString(),
  },
  {
    id: 'cmp_117',
    church_id: 'ch_jia_sta_teresita',
    church_name: 'Jesus Is Alive Worship Center - Alucao & Bungkag',
    church_slug: 'jia-alucao-sta-teresita',
    role: 'counselor',
    full_name: 'Timothy John Reyes',
    nickname: 'Timmy',
    gender: 'male',
    age: 23,
    email: 'timmy.reyes@email.com',
    phone: '+639177773322',
    province: 'Cagayan',
    city: 'Sta. Teresita',
    dietary_needs: 'None',
    emergency_name: 'Corazon Reyes',
    emergency_phone: '+639176664411',
    emergency_relation: 'Mother',
    ministry_interests: ['Cabin Mentoring', 'Youth Outreach'],
    favorite_verse: '2 Timothy 1:7',
    verse_reflection: 'For God has not given us a spirit of fear, but of power, love, and self-discipline.',
    selfie_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-4672',
    activation_token: 'act_timmy_117',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 13).toISOString(),
  },
  {
    id: 'cmp_118',
    church_id: 'ch_jia_upacan',
    church_name: 'Jesus Is Alive - Upacan',
    church_slug: 'jia-upacan-bambang',
    role: 'worship',
    full_name: 'Leah Marie Fernandez',
    nickname: 'Leah',
    gender: 'female',
    age: 21,
    email: 'leah.fernandez@email.com',
    phone: '+639198884433',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Bernardo Fernandez',
    emergency_phone: '+639191118877',
    emergency_relation: 'Father',
    ministry_interests: ['Praise & Worship', 'Violin / Strings'],
    favorite_verse: 'Psalm 91:1-2',
    verse_reflection: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.',
    selfie_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-7299',
    activation_token: 'act_leah_118',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 17).toISOString(),
  },
  {
    id: 'cmp_119',
    church_id: 'ch_jia_santo_domingo',
    church_name: 'Jesus Is Alive - Santo Domingo',
    church_slug: 'jia-santo-domingo-bambang',
    role: 'camper',
    full_name: 'Lucas Aaron Diaz',
    nickname: 'Luke',
    gender: 'male',
    age: 20,
    email: 'luke.diaz@email.com',
    phone: '+639205559988',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Teresa Diaz',
    emergency_phone: '+639203332211',
    emergency_relation: 'Mother',
    ministry_interests: ['Sports Ministry', 'Media'],
    favorite_verse: '1 Corinthians 9:24',
    verse_reflection: 'Run in such a way as to get the prize.',
    selfie_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-5820',
    activation_token: 'act_luke_119',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 21).toISOString(),
  },
  {
    id: 'cmp_120',
    church_id: 'ch_jia_gifta',
    church_name: 'Jesus Is Alive - Gifta, Almaguer North',
    church_slug: 'jia-gifta-almaguer-bambang',
    role: 'first_timer',
    full_name: 'Rachel Ann Castro',
    nickname: 'Rachel',
    gender: 'female',
    age: 18,
    email: 'rachel.castro@email.com',
    phone: '+639171119933',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Emilio Castro',
    emergency_phone: '+639174447788',
    emergency_relation: 'Father',
    ministry_interests: ['Creative Arts', 'Children Ministry'],
    favorite_verse: 'Romans 8:28',
    verse_reflection: 'In all things God works for the good of those who love him.',
    selfie_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-1456',
    activation_token: 'act_rachel_120',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'cmp_121',
    church_id: 'ch_jia_mauan',
    church_name: 'Jesus Is Alive - Mauan',
    church_slug: 'jia-mauan-bambang',
    role: 'camper',
    full_name: 'Philip Andrew Gomez',
    nickname: 'Philip',
    gender: 'male',
    age: 22,
    email: 'philip.gomez@email.com',
    phone: '+639182226677',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Clarissa Gomez',
    emergency_phone: '+639189993344',
    emergency_relation: 'Mother',
    ministry_interests: ['Evangelism', 'Ushering'],
    favorite_verse: 'Romans 1:16',
    verse_reflection: 'For I am not ashamed of the gospel, because it is the power of God that brings salvation.',
    selfie_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-6310',
    activation_token: 'act_philip_121',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'cmp_122',
    church_id: 'ch_jia_san_antonio',
    church_name: 'Jesus Is Alive - San Antonio North',
    church_slug: 'jia-san-antonio-bambang',
    role: 'worship',
    full_name: 'Abigail Faye Morales',
    nickname: 'Abby',
    gender: 'female',
    age: 20,
    email: 'abby.morales@email.com',
    phone: '+639197771122',
    province: 'Nueva Vizcaya',
    city: 'Bambang',
    dietary_needs: 'None',
    emergency_name: 'Vicente Morales',
    emergency_phone: '+639198886655',
    emergency_relation: 'Father',
    ministry_interests: ['Praise & Worship', 'Keyboard'],
    favorite_verse: 'Psalm 63:1',
    verse_reflection: 'You, God, are my God, earnestly I seek you; my whole being longs for you.',
    selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-8941',
    activation_token: 'act_abby_122',
    status: 'registered',
    kit_claimed: 0,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'cmp_123',
    church_id: 'ch_jia_mangayang',
    church_name: 'Jesus Is Alive - Mangayang',
    church_slug: 'jia-mangayang-dupax',
    role: 'staff',
    full_name: 'Daniel Keith Bautista',
    nickname: 'Dan',
    gender: 'male',
    age: 26,
    email: 'dan.bautista@email.com',
    phone: '+639208883344',
    province: 'Nueva Vizcaya',
    city: 'Dupax Del Norte',
    dietary_needs: 'None',
    emergency_name: 'Lorena Bautista',
    emergency_phone: '+639204447788',
    emergency_relation: 'Mother',
    ministry_interests: ['Camp Coordination', 'Youth Pastorate'],
    favorite_verse: 'Micah 6:8',
    verse_reflection: 'To act justly and to love mercy and to walk humbly with your God.',
    selfie_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    activation_code: 'VLC-2560',
    activation_token: 'act_dan_123',
    status: 'activated',
    kit_claimed: 1,
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
  }
];

class CampApiService {
  private getLocalCampers(): CamperRegistration[] {
    const raw = localStorage.getItem('vlc2027_campers');
    let list: CamperRegistration[];
    if (!raw) {
      list = [...INITIAL_CAMPERS];
    } else {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [...INITIAL_CAMPERS];
      }
    }
    // Ensure all campers have activation codes and valid status
    let modified = false;
    list = list.map((c, idx) => {
      let changed = false;
      const updated = { ...c };
      if (!updated.activation_code) {
        updated.activation_code = `VLC-${(2480 + idx * 79).toString().substring(0, 4)}`;
        changed = true;
      }
      if (!updated.activation_token) {
        updated.activation_token = `act_${updated.id || idx}_${Math.random().toString(36).substring(2, 8)}`;
        changed = true;
      }
      if (!updated.status) {
        updated.status = 'registered';
        changed = true;
      }
      if (updated.kit_claimed === undefined) {
        updated.kit_claimed = 0;
        changed = true;
      }
      if (changed) modified = true;
      return updated;
    });
    if (modified || !raw) {
      localStorage.setItem('vlc2027_campers', JSON.stringify(list));
    }
    return list;
  }

  private saveLocalCampers(campers: CamperRegistration[]) {
    localStorage.setItem('vlc2027_campers', JSON.stringify(campers));
  }

  private getLocalChurches(): Church[] {
    const raw = localStorage.getItem('vlc2027_pcci_churches');
    if (!raw) {
      localStorage.setItem('vlc2027_pcci_churches', JSON.stringify(INITIAL_PCCI_CHURCHES));
      return INITIAL_PCCI_CHURCHES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PCCI_CHURCHES;
    }
  }

  private saveLocalChurches(churches: Church[]) {
    localStorage.setItem('vlc2027_pcci_churches', JSON.stringify(churches));
  }

  // 1. Fetch live summary stats
  async getStats(): Promise<RegistrationStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }

    const campers = this.getLocalCampers();
    const churches = this.getLocalChurches();
    const targetCapacity = 600;
    const totalRegistered = campers.length + 345;

    const churchBreakdown = churches.map((ch) => {
      const localCount = campers.filter((c) => c.church_id === ch.id).length;
      return {
        id: ch.id,
        name: ch.name,
        slug: ch.slug,
        province: ch.province,
        city: ch.city,
        target_quota: ch.target_quota,
        count: (ch.registered_count || 0) + (localCount > 0 ? localCount - 1 : 0),
      };
    }).sort((a, b) => b.count - a.count);

    const provinceBreakdown = [
      { province: 'Nueva Vizcaya', count: 182 },
      { province: 'Cagayan', count: 142 },
      { province: 'Open / Other', count: 28 },
    ];

    const roleBreakdown: Array<{ role: CamperRole; count: number }> = [
      { role: 'camper', count: 194 },
      { role: 'first_timer', count: 72 },
      { role: 'counselor', count: 36 },
      { role: 'worship', count: 24 },
      { role: 'staff', count: 18 },
      { role: 'pastor', count: 14 },
      { role: 'medical', count: 8 },
    ];

    const recentSignups = campers.slice(0, 6).map((c) => ({
      nickname: c.nickname,
      role: c.role,
      province: c.province,
      church_name: c.church_name || 'PCCI Church',
      favorite_verse: c.favorite_verse,
      created_at: c.created_at || new Date().toISOString(),
    }));

    return {
      campName: 'VLC 2027',
      campTheme: 'Arise & Shine (Isaiah 60:1)',
      targetCapacity,
      totalRegistered,
      percentFilled: Math.min(100, Math.round((totalRegistered / targetCapacity) * 100)),
      churchBreakdown,
      provinceBreakdown,
      roleBreakdown,
      recentSignups,
    };
  }

  private enrichChurchesWithSignups(churches: Church[]): Church[] {
    const campers = this.getLocalCampers();
    return churches.map((ch) => {
      const existingSignups = ch.signups || [];
      const localSignups = campers
        .filter((c) => c.church_id === ch.id)
        .map((c) => ({
          id: c.id || '',
          nickname: c.nickname || c.full_name?.split(' ')[0] || 'Delegate',
          full_name: c.full_name,
          role: c.role,
          selfie_url: c.selfie_url,
        }));
      
      const signupMap = new Map<string, typeof existingSignups[0]>();
      for (const s of [...existingSignups, ...localSignups]) {
        if (s.id) signupMap.set(s.id, s);
      }
      return {
        ...ch,
        signups: Array.from(signupMap.values()),
      };
    });
  }

  // 2. Fetch churches
  async getChurches(slug?: string): Promise<Church[]> {
    try {
      const url = slug ? `/api/churches?slug=${encodeURIComponent(slug)}` : '/api/churches';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [data];
        if (list.length > 0) return this.enrichChurchesWithSignups(list);
      }
    } catch {
      // Fallback
    }

    const localList = this.enrichChurchesWithSignups(this.getLocalChurches());
    if (slug) {
      const found = localList.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
      return found ? [found] : [];
    }
    return localList;
  }

  // 3. Register camper
  async registerCamper(camperData: CamperRegistration): Promise<CamperRegistration> {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(camperData),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.camper) {
        return json.camper;
      }
      if (!res.ok && json?.error) {
        throw new Error(json.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        throw err;
      }
      // Fallback only for network errors
    }

    const churches = this.getLocalChurches();
    const church = churches.find((c) => c.id === camperData.church_id);
    
    const codeChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let codeSuffix = '';
    for (let i = 0; i < 4; i++) {
      codeSuffix += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
    }
    const activationCode = `VLC-${codeSuffix}`;
    const activationToken = 'act_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    const newCamper: CamperRegistration = {
      ...camperData,
      id: 'vlc_' + Math.random().toString(36).substring(2, 9),
      church_name: church?.name || 'PCCI Delegation',
      church_slug: church?.slug || 'independent',
      activation_code: activationCode,
      activation_token: activationToken,
      status: 'registered',
      kit_claimed: 0,
      created_at: new Date().toISOString(),
    };

    const existing = this.getLocalCampers();
    this.saveLocalCampers([newCamper, ...existing]);
    return newCamper;
  }

  // 4. Admin: Create Church
  async createChurch(church: Partial<Church>): Promise<Church> {
    const slug = (church.slug || church.name || 'church')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const id = 'ch_' + slug.replace(/-/g, '_');

    try {
      const res = await fetch('/api/churches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...church, id, slug }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const newChurch: Church = {
      id,
      slug,
      name: church.name || 'New Fellowship',
      province: church.province || 'Nueva Vizcaya',
      city: church.city || 'Bambang',
      pastor_name: church.pastor_name || 'Pastor in Charge',
      contact_email: church.contact_email || 'info@pcci.org.ph',
      target_quota: Number(church.target_quota) || 40,
      registered_count: 0,
    };

    const current = this.getLocalChurches();
    this.saveLocalChurches([newChurch, ...current]);
    return newChurch;
  }

  // 5. Admin: Update Church
  async updateChurch(church: Partial<Church> & { id: string }): Promise<Church> {
    try {
      const res = await fetch('/api/churches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(church),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = this.getLocalChurches();
    const updated = current.map((c) => (c.id === church.id ? { ...c, ...church } : c));
    this.saveLocalChurches(updated);
    return { ...church } as Church;
  }

  // 6. Admin: Delete Church
  async deleteChurch(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/churches?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    const current = this.getLocalChurches();
    this.saveLocalChurches(current.filter((c) => c.id !== id));
    return true;
  }

  // 7. Admin: Synchronize from PCCI
  async syncPcciChurches(): Promise<{ success: boolean; message: string; syncedCount: number }> {
    try {
      const res = await fetch('/api/sync-pcci', { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    this.saveLocalChurches(INITIAL_PCCI_CHURCHES);
    return {
      success: true,
      message: `Synchronized ${INITIAL_PCCI_CHURCHES.length} official PCCI churches into registry.`,
      syncedCount: INITIAL_PCCI_CHURCHES.length,
    };
  }

  // 8. Verse reflection
  async getVerseReflection(verse: string, camperData: Partial<CamperRegistration>): Promise<string> {
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reflect_verse',
          userInput: verse,
          camperData,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.reflection) return json.reflection;
      }
    } catch {
      // Fallback
    }

    return `"${verse}" is a powerful anchor for your soul! As you prepare for VLC 2027 with PCCI, get ready for God to ignite your light and commission you to arise and shine.`;
  }

  // 9. Friend Invite Copy
  async getInviteCopy(camperData: Partial<CamperRegistration>): Promise<{ headline: string; message: string }> {
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_invite',
          camperData,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.inviteCopy) return json.inviteCopy;
      }
    } catch {
      // Fallback
    }

    const church = camperData.church_name || 'our delegation';
    return {
      headline: 'Come with me to VLC 2027! 🔥',
      message: `Hey! I just registered for VLC 2027 with ${church}! It's going to be a transformative youth leadership assembly. Register here so we can sit together: `,
    };
  }

  // 10. Track invite share
  async trackInvite(church_id: string, platform: string, camper_id?: string) {
    try {
      await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ church_id, platform, camper_id }),
      });
    } catch {
      // Fallback
    }
  }

  // 11. Unified Login (for both Campers and Admins/Staff)
  async login(
    identifier: string,
    passcodeOrPassword: string
  ): Promise<{
    success: boolean;
    user?: CamperRegistration & { is_admin?: boolean; is_staff?: boolean };
    error?: string;
  }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password: passcodeOrPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch {
      // Local fallback: strictly check stored password hash without default password bypass
      const idClean = identifier.trim().toLowerCase();
      const adminUsers = this.getLocalAdminUsers();
      const admin = adminUsers.find(
        (u) =>
          (u.email.toLowerCase() === idClean || u.name.toLowerCase() === idClean) &&
          Boolean(u.is_active)
      );

      if (admin && admin.password_hash && admin.password_hash === passcodeOrPassword) {
        return {
          success: true,
          user: {
            id: admin.id,
            church_id: admin.church_id || 'ch_jia_buag',
            church_name: admin.church_name || 'Jesus Is Alive Worship Center - Buag (PCCI National HQ)',
            role: admin.role as CamperRole,
            full_name: admin.name,
            nickname: admin.name,
            gender: 'unspecified',
            age: 25,
            email: admin.email,
            phone: '+639170000000',
            province: 'Nueva Vizcaya',
            emergency_name: 'Camp Office',
            emergency_phone: '+639170000000',
            emergency_relation: 'Office',
            ministry_interests: ['Leadership'],
            favorite_verse: 'Isaiah 60:1',
            is_admin: admin.role === 'admin',
            is_staff: true,
            is_active: 1,
          },
        };
      }

      const campers = this.getLocalCampers();
      const camper = campers.find(
        (c) =>
          c.email.toLowerCase() === idClean ||
          c.nickname.toLowerCase() === idClean ||
          c.activation_code?.toLowerCase() === idClean ||
          c.id?.toLowerCase() === idClean
      );

      if (camper && camper.password_hash && camper.password_hash === passcodeOrPassword) {
        return {
          success: true,
          user: {
            ...camper,
            is_admin: camper.role === 'admin',
            is_staff: ['admin', 'staff', 'coordinator'].includes(camper.role),
          },
        };
      }

      return { success: false, error: 'Invalid email/username or password.' };
    }
  }

  // Admin Auth (wrapper pointing to unified login)
  async loginAdmin(identifier: string, passcode: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const res = await this.login(identifier, passcode);
    if (res.success && res.user) {
      const adminUser: AdminUser = {
        id: res.user.id || 'usr_admin',
        name: res.user.full_name || res.user.nickname,
        nickname: res.user.nickname,
        email: res.user.email,
        role: res.user.role,
        church_id: res.user.church_id,
        church_name: res.user.church_name,
        is_active: res.user.is_active ?? 1,
        last_login_at: res.user.last_login_at || new Date().toISOString(),
      };
      return { success: true, user: adminUser };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  }

  // Promote camper to admin or update role directly
  async promoteUserRole(userId: string, newRole: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update user role' };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  }

  // 12. User Management CRUD
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return this.getLocalAdminUsers();
  }

  async createAdminUser(userData: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.user;
      }
    } catch {
      // Fallback
    }
    const users = this.getLocalAdminUsers();
    const newUser: AdminUser = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'New Staff',
      email: (userData.email || 'staff@pcci.ph').toLowerCase(),
      role: userData.role || 'staff',
      church_id: userData.church_id,
      is_active: 1,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveLocalAdminUsers(users);
    return newUser;
  }

  async updateAdminUser(userData: Partial<AdminUser> & { id: string; password?: string }): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const users = this.getLocalAdminUsers();
    const idx = users.findIndex((u) => u.id === userData.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...userData };
      this.saveLocalAdminUsers(users);
      return true;
    }
    return false;
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const users = this.getLocalAdminUsers().filter((u) => u.id !== id);
    this.saveLocalAdminUsers(users);
    return true;
  }

  // 13. Camper Activation on Arrival
  async activateCamper(params: { token?: string; code?: string; password?: string }): Promise<{
    success: boolean;
    camper?: CamperRegistration;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/camper/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, camper: data.camper, message: data.message };
      }
      if (!res.ok) {
        return { success: false, error: data.error || 'Activation failed' };
      }
    } catch {
      // Fallback: local storage
    }

    const campers = this.getLocalCampers();
    const token = (params.token || '').trim();
    const code = (params.code || '').trim().toUpperCase();

    const idx = campers.findIndex(
      (c) =>
        (token && c.activation_token === token) ||
        (code && (c.activation_code?.toUpperCase() === code || c.id?.toUpperCase() === code))
    );

    if (idx === -1) {
      return {
        success: false,
        error: 'No matching camper registration found. Please check your code or consult the check-in desk.',
      };
    }

    campers[idx] = {
      ...campers[idx],
      status: 'activated',
      checked_in_at: campers[idx].checked_in_at || new Date().toISOString(),
    };
    this.saveLocalCampers(campers);

    return {
      success: true,
      message: `Welcome to VLC 2027, ${campers[idx].nickname}! Your pass is now active.`,
      camper: campers[idx],
    };
  }

  // 14. Camper Login (wrapper using unified login)
  async loginCamper(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; camper?: CamperRegistration; error?: string }> {
    const res = await this.login(identifier, password);
    if (res.success && res.user) {
      return { success: true, camper: res.user };
    }
    return { success: false, error: res.error || 'Camper account not found.' };
  }


  // 15. Admin Check-in Desk: Get Campers
  async getCheckInCampers(search?: string, status?: string): Promise<CamperRegistration[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const res = await fetch(`/api/admin/checkin?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    let list = this.getLocalCampers();
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.nickname.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.activation_code?.toLowerCase().includes(q) ||
          (c.church_name && c.church_name.toLowerCase().includes(q))
      );
    }
    if (status === 'checked_in') {
      list = list.filter((c) => c.status === 'activated' || c.checked_in_at);
    } else if (status === 'pending') {
      list = list.filter((c) => c.status !== 'activated' && !c.checked_in_at);
    }

    return list;
  }

  // 15b. Admin ID Printing Queue: Get Queue & Metrics
  async getBadgeQueue(params?: {
    event_id?: string;
    church_id?: string;
    print_status?: string;
    search?: string;
  }): Promise<BadgeQueueResponse> {
    try {
      const urlParams = new URLSearchParams();
      if (params?.event_id) urlParams.append('event_id', params.event_id);
      if (params?.church_id) urlParams.append('church_id', params.church_id);
      if (params?.print_status) urlParams.append('print_status', params.print_status);
      if (params?.search) urlParams.append('search', params.search);

      const res = await fetch(`/api/admin/badges/queue?${urlParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const campers = this.getLocalCampers();
    const delegates: QueueDelegate[] = campers.map((c) => ({
      registration_id: 'reg_' + (c.id || Math.random().toString(36).substring(2)),
      event_id: c.event_id || 'vlc-2027',
      camper_id: c.id || 'cmp_local',
      full_name: c.full_name,
      nickname: c.nickname,
      gender: c.gender,
      age: c.age,
      birthdate: c.birthdate,
      email: c.email,
      phone: c.phone,
      province: c.province,
      city: c.city,
      dietary_needs: c.dietary_needs,
      emergency_name: c.emergency_name,
      emergency_phone: c.emergency_phone,
      emergency_relation: c.emergency_relation,
      favorite_verse: c.favorite_verse,
      verse_reflection: c.verse_reflection,
      selfie_url: c.selfie_url,
      activation_code: c.activation_code || 'VLC-LOCAL',
      activation_token: c.activation_token || 'act_local',
      role: c.role,
      status: c.status || 'registered',
      print_count: c.print_count || 0,
      last_printed_at: c.last_printed_at,
      last_printed_by: c.last_printed_by,
      reprint_reason: c.reprint_reason,
      checked_in_at: c.checked_in_at,
      kit_claimed: c.kit_claimed || 0,
      church_id: c.church_id,
      church_name: c.church_name,
      created_at: c.created_at,
    }));

    return {
      success: true,
      stats: {
        total_in_queue: delegates.length,
        unprinted_count: delegates.filter((d) => d.print_count === 0).length,
        printed_count: delegates.filter((d) => d.print_count === 1).length,
        reprint_count: delegates.filter((d) => d.print_count > 1).length,
      },
      delegates,
    };
  }

  // 15c. Admin ID Printing Queue: Record Print / Reprint
  async recordBadgePrint(params: {
    registration_ids?: string[];
    camper_ids?: string[];
    event_id?: string;
    admin_id?: string;
    reason?: string;
    action?: 'print' | 'reprint' | 'reset';
  }): Promise<{ success: boolean; updated_count?: number; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/badges/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, error: data.error || 'Failed to record badge print' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error recording badge print';
      return { success: false, error: msg };
    }
  }

  // 16. Admin Check-in Desk: Perform Action
  async checkInCamper(params: {
    camper_id?: string;
    code_or_token?: string;
    admin_id?: string;
    kit_claimed?: boolean;
    action?: 'check_in' | 'undo_check_in' | 'toggle_kit' | 'reset_password';
    new_password?: string;
  }): Promise<{ success: boolean; camper?: CamperRegistration; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, camper: data.camper, message: data.message };
      }
      if (!res.ok) {
        return { success: false, error: data.error || 'Check-in failed' };
      }
    } catch {
      // Fallback
    }

    const campers = this.getLocalCampers();
    const idx = campers.findIndex(
      (c) =>
        (params.camper_id && c.id === params.camper_id) ||
        (params.code_or_token &&
          (c.activation_code?.toUpperCase() === params.code_or_token.toUpperCase() ||
            c.activation_token === params.code_or_token ||
            c.id?.toUpperCase() === params.code_or_token.toUpperCase()))
    );

    if (idx === -1) {
      return { success: false, error: 'Camper not found' };
    }

    const current = campers[idx];
    const action = params.action || 'check_in';

    if (action === 'check_in') {
      campers[idx] = {
        ...current,
        status: 'activated',
        checked_in_at: current.checked_in_at || new Date().toISOString(),
        checked_in_by: params.admin_id || 'Alexius',
        kit_claimed: params.kit_claimed !== undefined ? (params.kit_claimed ? 1 : 0) : 1,
      };
    } else if (action === 'undo_check_in') {
      campers[idx] = {
        ...current,
        status: 'registered',
        checked_in_at: undefined,
        checked_in_by: undefined,
      };
    } else if (action === 'toggle_kit') {
      campers[idx] = {
        ...current,
        kit_claimed: current.kit_claimed ? 0 : 1,
      };
    }

    this.saveLocalCampers(campers);
    return {
      success: true,
      camper: campers[idx],
      message: `Updated status for ${campers[idx].nickname}`,
    };
  }

  // 17. Retrieve Camper Profile
  async getCamperProfile(id: string, viewerId?: string): Promise<{ success: boolean; camper?: CamperRegistration; error?: string }> {
    try {
      const url = new URL('/api/camper/profile', window.location.origin);
      url.searchParams.set('id', id);
      if (viewerId) {
        url.searchParams.set('viewer_id', viewerId);
      }
      const res = await fetch(url.toString(), {
        headers: viewerId ? { 'x-camper-id': viewerId } : undefined,
      });
      if (res.ok) {
        const data = (await res.json()) as { success: boolean; camper?: CamperRegistration };
        if (data.camper) {
          return { success: true, camper: data.camper };
        }
      }
    } catch (e) {
      console.warn('API getCamperProfile failed, falling back to local storage:', e);
    }

    const campers = this.getLocalCampers();
    const found = campers.find((c) => c.id === id || c.activation_code?.toUpperCase() === id.toUpperCase());
    if (found) {
      // If caller is not owner, do not leak activation_code
      if (viewerId && viewerId !== found.id && viewerId.toUpperCase() !== found.activation_code?.toUpperCase()) {
        const sanitized = { ...found };
        delete sanitized.activation_code;
        return { success: true, camper: sanitized };
      }
      return { success: true, camper: found };
    }
    return { success: false, error: 'Camper profile not found' };
  }

  // 18. Update Camper Profile (Selfie, Personal info, Emergency, Verse)
  async updateProfile(
    camperId: string,
    updates: Partial<CamperRegistration>
  ): Promise<{ success: boolean; camper?: CamperRegistration; error?: string }> {
    try {
      const res = await fetch('/api/camper/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: camperId, ...updates }),
      });
      if (res.ok) {
        const data = (await res.json()) as { success: boolean; camper: CamperRegistration };
        if (data.camper) {
          // Update local cache
          const campers = this.getLocalCampers();
          const idx = campers.findIndex((c) => c.id === camperId);
          if (idx !== -1) {
            campers[idx] = { ...campers[idx], ...data.camper };
            this.saveLocalCampers(campers);
          }
          return { success: true, camper: data.camper };
        }
      } else {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        if (errData.error) {
          return { success: false, error: errData.error };
        }
      }
    } catch (e) {
      console.warn('API updateProfile failed, updating local storage:', e);
    }

    // Local storage fallback
    const campers = this.getLocalCampers();
    const idx = campers.findIndex((c) => c.id === camperId);
    if (idx !== -1) {
      campers[idx] = { ...campers[idx], ...updates };
      this.saveLocalCampers(campers);
      return { success: true, camper: campers[idx] };
    }

    return { success: false, error: 'Camper profile not found' };
  }

  // 18. Check-in Stats
  async getCheckInStats(): Promise<CheckInStats> {
    try {
      const res = await fetch('/api/admin/checkin-stats');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const campers = this.getLocalCampers();
    const churches = this.getLocalChurches();

    const totalRegistered = campers.length;
    const totalCheckedIn = campers.filter((c) => c.status === 'activated' || c.checked_in_at).length;
    const totalKitsClaimed = campers.filter((c) => Boolean(c.kit_claimed)).length;
    const percentCheckedIn = totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0;

    const delegationStats = churches
      .map((ch) => {
        const churchCampers = campers.filter((c) => c.church_id === ch.id);
        const checked = churchCampers.filter((c) => c.status === 'activated' || c.checked_in_at).length;
        return {
          church_id: ch.id,
          church_name: ch.name,
          total: churchCampers.length,
          checkedIn: checked,
        };
      })
      .filter((d) => d.total > 0)
      .sort((a, b) => b.checkedIn - a.checkedIn);

    return {
      totalRegistered,
      totalCheckedIn,
      percentCheckedIn,
      totalKitsClaimed,
      delegationStats,
    };
  }

  // 19. Resend Camper Passport Email
  async resendCamperEmail(params: { camper_id?: string; email?: string; code?: string }): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/camper/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json() as { success?: boolean; message?: string; error?: string };
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to dispatch email' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: msg };
    }
  }

  // 20. Get Email Deliveries Audit Log (Admin)
  async getEmailDeliveries(limit: number = 50): Promise<{
    success: boolean;
    deliveries: Array<Record<string, unknown>>;
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/admin/email-deliveries?limit=${limit}`);
      if (res.ok) {
        const data = await res.json() as { deliveries?: Array<Record<string, unknown>> };
        return { success: true, deliveries: data.deliveries || [] };
      }
      return { success: false, deliveries: [], error: 'Failed to fetch email logs' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return { success: false, deliveries: [], error: msg };
    }
  }

  // 19. Forgot Password (Dispatches Reset Email via Cloudflare Outbound)
  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (res.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to send reset link.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while requesting password reset.';
      return { success: false, error: msg };
    }
  }

  // 20. Verify Reset Token
  async verifyResetToken(token: string): Promise<{ valid: boolean; full_name?: string; email?: string; error?: string }> {
    try {
      const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
      const data = (await res.json()) as { valid?: boolean; full_name?: string; email?: string; error?: string };
      if (res.ok && data.valid) {
        return { valid: true, full_name: data.full_name, email: data.email };
      }
      return { valid: false, error: data.error || 'Password reset link is invalid or expired.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while validating token.';
      return { valid: false, error: msg };
    }
  }

  // 21. Reset Password Execution
  async resetPassword(token: string, password: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (res.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to update password.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error while resetting password.';
      return { success: false, error: msg };
    }
  }

  // 22. Get Events (Active or Specific)
  async getEvents(slug?: string): Promise<{ events: CampEvent[]; active_event: CampEvent | null; error?: string }> {
    try {
      const url = slug ? `/api/events?slug=${encodeURIComponent(slug)}` : '/api/events';
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as { events?: CampEvent[]; active_event?: CampEvent; event?: CampEvent };
        if (slug && data.event) {
          return { events: [data.event], active_event: data.event };
        }
        if (data.events && data.events.length > 0) {
          return { events: data.events, active_event: data.active_event || data.events.find(e => e.status === 'active') || data.events[0] };
        }
      }
      // Fallback to initial events
      const fallbackList = [...INITIAL_CAMP_EVENTS];
      const active = fallbackList.find(e => (slug ? e.slug === slug : e.status === 'active')) || fallbackList[0];
      return { events: fallbackList, active_event: active };
    } catch {
      const fallbackList = [...INITIAL_CAMP_EVENTS];
      const active = fallbackList.find(e => (slug ? e.slug === slug : e.status === 'active')) || fallbackList[0];
      return { events: fallbackList, active_event: active };
    }
  }

  // 23. Update Event Details
  async updateEvent(eventData: Partial<CampEvent>): Promise<{ success: boolean; event?: CampEvent; error?: string }> {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const data = (await res.json()) as { success?: boolean; event?: CampEvent; error?: string };
      if (res.ok && data.success) {
        return { success: true, event: data.event };
      }
      return { success: false, error: data.error || 'Failed to update event' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error saving event';
      return { success: false, error: msg };
    }
  }

  // 24. Get Event Dynamic Schedule
  async getEventSchedule(eventId: string = 'vlc-2027'): Promise<{ schedules: EventScheduleItem[]; event_id: string; error?: string }> {
    try {
      const res = await fetch(`/api/events/schedule?event_id=${encodeURIComponent(eventId)}`);
      if (res.ok) {
        const data = (await res.json()) as { schedules?: EventScheduleItem[]; event_id?: string };
        if (data.schedules && data.schedules.length > 0) {
          return { schedules: data.schedules, event_id: data.event_id || eventId };
        }
      }
      // Fallback to initial schedules matching event
      const fallback = INITIAL_EVENT_SCHEDULES.filter(s => s.event_id === eventId);
      return { schedules: fallback.length > 0 ? fallback : INITIAL_EVENT_SCHEDULES, event_id: eventId };
    } catch {
      const fallback = INITIAL_EVENT_SCHEDULES.filter(s => s.event_id === eventId);
      return { schedules: fallback.length > 0 ? fallback : INITIAL_EVENT_SCHEDULES, event_id: eventId };
    }
  }

  // 25. Save Schedule Session Item
  async saveScheduleItem(item: Partial<EventScheduleItem>): Promise<{ success: boolean; schedule?: EventScheduleItem; error?: string }> {
    try {
      const res = await fetch('/api/events/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = (await res.json()) as { success?: boolean; schedule?: EventScheduleItem; error?: string };
      if (res.ok && data.success) {
        return { success: true, schedule: data.schedule };
      }
      return { success: false, error: data.error || 'Failed to save schedule session' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error saving schedule session';
      return { success: false, error: msg };
    }
  }

  // 26. Delete Schedule Session Item
  async deleteScheduleItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/events/schedule?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete schedule session' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error deleting schedule session';
      return { success: false, error: msg };
    }
  }

  // 27. Get Camper's Multi-Event Registrations & Available Next Events
  async getCamperEvents(camperId: string): Promise<{
    success: boolean;
    registrations: EventRegistration[];
    available_events: CampEvent[];
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/camper/events?camper_id=${encodeURIComponent(camperId)}`);
      if (res.ok) {
        const data = (await res.json()) as {
          success: boolean;
          registrations?: EventRegistration[];
          available_events?: CampEvent[];
        };
        return {
          success: true,
          registrations: data.registrations || [],
          available_events: data.available_events || [],
        };
      }
      return { success: false, registrations: [], available_events: [], error: 'Failed to load camper events' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error loading camper events';
      return { success: false, registrations: [], available_events: [], error: msg };
    }
  }

  // 28. Join a New Camp Event using Existing Account
  async joinEvent(
    camperId: string,
    eventId: string,
    churchId?: string,
    role?: string
  ): Promise<{
    success: boolean;
    message?: string;
    already_registered?: boolean;
    registration?: EventRegistration;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/camper/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camper_id: camperId, event_id: eventId, church_id: churchId, role }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        already_registered?: boolean;
        registration?: EventRegistration;
        error?: string;
      };
      if (res.ok && data.success) {
        return {
          success: true,
          message: data.message,
          already_registered: data.already_registered,
          registration: data.registration,
        };
      }
      return { success: false, error: data.error || 'Failed to join event' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error joining event';
      return { success: false, error: msg };
    }
  }

  // 29. Upload Media (Images and Videos) to Cloudflare R2
  async uploadMedia(
    fileOrData: File | Blob | string,
    options: {
      folder?: string;
      eventId?: string;
      isPrimary?: boolean;
      title?: string;
      description?: string;
      fileName?: string;
    } = {}
  ): Promise<{ success: boolean; url?: string; r2_key?: string; media?: MediaItem; error?: string }> {
    try {
      let res: Response;

      if (typeof fileOrData === 'string') {
        res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_data: fileOrData,
            file_name: options.fileName,
            folder: options.folder || 'events',
            event_id: options.eventId || 'vlc-2027',
            title: options.title,
            description: options.description,
            is_primary: options.isPrimary,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append('file', fileOrData, options.fileName || (fileOrData instanceof File ? fileOrData.name : 'upload.bin'));
        if (options.folder) formData.append('folder', options.folder);
        if (options.eventId) formData.append('event_id', options.eventId);
        if (options.title) formData.append('title', options.title);
        if (options.description) formData.append('description', options.description);
        if (options.isPrimary) formData.append('is_primary', 'true');

        res = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });
      }

      const data = (await res.json()) as { success?: boolean; url?: string; r2_key?: string; media?: MediaItem; error?: string };
      if (res.ok && data.success) {
        return {
          success: true,
          url: data.url,
          r2_key: data.r2_key,
          media: data.media,
        };
      }
      return { success: false, error: data.error || 'Failed to upload media to Cloudflare R2' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error uploading to R2';
      return { success: false, error: msg };
    }
  }

  // 30. Get Media Items (Images & Videos)
  async getMedia(options: { type?: 'image' | 'video'; eventId?: string; limit?: number } = {}): Promise<{ success: boolean; items: MediaItem[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (options.type) params.set('type', options.type);
      if (options.eventId) params.set('event_id', options.eventId);
      if (options.limit) params.set('limit', String(options.limit));

      const res = await fetch(`/api/media?${params.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as { success?: boolean; items?: MediaItem[] };
        return { success: true, items: data.items || [] };
      }
      return { success: false, items: [], error: 'Failed to fetch media list' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error fetching media list';
      return { success: false, items: [], error: msg };
    }
  }

  // 31. Delete Media Item from Cloudflare R2
  async deleteMedia(idOrKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const isKey = idOrKey.includes('/') || idOrKey.includes('.');
      const param = isKey ? `key=${encodeURIComponent(idOrKey)}` : `id=${encodeURIComponent(idOrKey)}`;
      const res = await fetch(`/api/media?${param}`, {
        method: 'DELETE',
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete media' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error deleting media';
      return { success: false, error: msg };
    }
  }

  // 32. Set Event Primary Image
  async setEventPrimaryImage(eventId: string, imageUrl: string, mediaId?: string): Promise<{ success: boolean; primary_image_url?: string; error?: string }> {
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_primary', event_id: eventId, url: imageUrl, id: mediaId }),
      });
      const data = (await res.json()) as { success?: boolean; primary_image_url?: string; error?: string };
      if (res.ok && data.success) {
        return { success: true, primary_image_url: data.primary_image_url };
      }
      return { success: false, error: data.error || 'Failed to set event primary image' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error setting primary image';
      return { success: false, error: msg };
    }
  }

  // ==========================================
  // Community Feed & Camper Media Methods
  // ==========================================

  /**
   * Request pre-signed R2 upload URL for a post or story image
   */
  async presignMediaUpload(params: {
    camper_id: string;
    file_name?: string;
    file_type: string;
    file_size: number;
    type?: 'post' | 'story';
  }): Promise<PresignUploadResult> {
    try {
      const res = await fetch('/api/media/presign-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-camper-id': params.camper_id,
        },
        body: JSON.stringify(params),
      });
      const data = await res.json() as PresignUploadResult;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to request upload signature';
      return {
        success: false,
        upload_url: '',
        key: '',
        media_url: '',
        file_type: params.file_type,
        file_size: params.file_size,
        expires_in: 0,
        error: msg,
      };
    }
  }

  /**
   * Upload binary directly to Cloudflare R2 via pre-signed PUT URL
   */
  async uploadDirectToPresignedUrl(
    uploadUrl: string,
    file: File | Blob,
    mimeType: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType,
        },
        body: file,
      });
      if (!res.ok) {
        const text = await res.text();
        return { success: false, error: `Upload to storage failed (${res.status}): ${text}` };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to stream media to storage';
      return { success: false, error: msg };
    }
  }

  /**
   * Commit a newly uploaded post record
   */
  async createPost(params: {
    camper_id: string;
    media_url: string;
    caption?: string;
  }): Promise<{ success: boolean; post?: CommunityPost; error?: string }> {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-camper-id': params.camper_id,
        },
        body: JSON.stringify(params),
      });
      const data = await res.json() as { success: boolean; post?: CommunityPost; error?: string };
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create post';
      return { success: false, error: msg };
    }
  }

  /**
   * Get paginated posts for a specific camper
   */
  async getCampersPosts(
    camperId: string,
    page: number = 1,
    limit: number = 12,
    viewerId?: string
  ): Promise<{
    success: boolean;
    posts?: CommunityPost[];
    camper?: any;
    pagination?: { page: number; limit: number; total: number; total_pages: number };
    error?: string;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (viewerId) params.set('viewer_id', viewerId);

      const headers: Record<string, string> = {};
      if (viewerId) headers['x-camper-id'] = viewerId;

      const res = await fetch(`/api/campers/${camperId}/posts?${params.toString()}`, { headers });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch camper posts';
      return { success: false, posts: [], error: msg };
    }
  }

  /**
   * Commit a newly uploaded permanent vertical story record
   */
  async createStory(params: {
    camper_id: string;
    media_url: string;
    caption?: string;
  }): Promise<{ success: boolean; story?: CommunityStory; error?: string }> {
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-camper-id': params.camper_id,
        },
        body: JSON.stringify(params),
      });
      const data = await res.json() as { success: boolean; story?: CommunityStory; error?: string };
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post story';
      return { success: false, error: msg };
    }
  }

  /**
   * Get chronological permanent stories for a camper
   */
  async getCampersStories(
    camperId: string,
    viewerId?: string
  ): Promise<{
    success: boolean;
    stories?: CommunityStory[];
    camper?: any;
    count?: number;
    error?: string;
  }> {
    try {
      const headers: Record<string, string> = {};
      if (viewerId) headers['x-camper-id'] = viewerId;

      const res = await fetch(`/api/campers/${camperId}/stories`, { headers });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch stories';
      return { success: false, stories: [], error: msg };
    }
  }

  /**
   * Get comments for a post
   */
  async getPostComments(
    postId: string,
    viewerId?: string
  ): Promise<{ success: boolean; comments?: PostComment[]; count?: number; error?: string }> {
    try {
      const headers: Record<string, string> = {};
      if (viewerId) headers['x-camper-id'] = viewerId;

      const res = await fetch(`/api/posts/${postId}/comments`, { headers });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch post comments';
      return { success: false, comments: [], error: msg };
    }
  }

  /**
   * Add a comment to a post
   */
  async addPostComment(
    postId: string,
    camperId: string,
    body: string
  ): Promise<{ success: boolean; comment?: PostComment; error?: string }> {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-camper-id': camperId,
        },
        body: JSON.stringify({ camper_id: camperId, body }),
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add comment';
      return { success: false, error: msg };
    }
  }

  /**
   * Add or toggle allowed emoji reaction on post, story, or comment
   */
  async toggleReaction(
    reactableType: 'post' | 'story' | 'comment',
    id: string,
    reactionType: AllowedReactionEmoji,
    camperId: string
  ): Promise<{
    success: boolean;
    action?: 'added' | 'updated' | 'removed';
    user_reaction?: AllowedReactionEmoji | null;
    reaction_counts?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/${reactableType}/${id}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-camper-id': camperId,
        },
        body: JSON.stringify({ camper_id: camperId, reaction_type: reactionType }),
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update reaction';
      return { success: false, error: msg };
    }
  }

  /**
   * Remove reaction from an entity
   */
  async deleteReaction(
    reactableType: 'post' | 'story' | 'comment',
    id: string,
    camperId: string
  ): Promise<{
    success: boolean;
    action?: string;
    user_reaction?: null;
    reaction_counts?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/${reactableType}/${id}/reactions`, {
        method: 'DELETE',
        headers: {
          'x-camper-id': camperId,
        },
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove reaction';
      return { success: false, error: msg };
    }
  }

  /**
   * Fetch the Community Feed (posts + camper story highlights)
   */
  async getCommunityFeed(
    page: number = 1,
    limit: number = 20,
    viewerId?: string
  ): Promise<{
    success: boolean;
    posts?: CommunityPost[];
    camper_stories?: CamperStoryGroup[];
    pagination?: { page: number; limit: number; total: number; total_pages: number };
    error?: string;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (viewerId) params.set('viewer_id', viewerId);

      const headers: Record<string, string> = {};
      if (viewerId) headers['x-camper-id'] = viewerId;

      const res = await fetch(`/api/feed?${params.toString()}`, { headers });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch community feed';
      return { success: false, posts: [], camper_stories: [], error: msg };
    }
  }

  /**
   * Get all active camper stories
   */
  async getAllStories(viewerId?: string): Promise<{
    success: boolean;
    camper_stories?: CamperStoryGroup[];
    total_stories?: number;
    error?: string;
  }> {
    try {
      const headers: Record<string, string> = {};
      if (viewerId) headers['x-camper-id'] = viewerId;

      const res = await fetch('/api/stories', { headers });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch stories';
      return { success: false, camper_stories: [], error: msg };
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string, camperId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'x-camper-id': camperId,
        },
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete post';
      return { success: false, error: msg };
    }
  }

  /**
   * Delete a story
   */
  async deleteStory(storyId: string, camperId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          'x-camper-id': camperId,
        },
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete story';
      return { success: false, error: msg };
    }
  }

  /**
   * Get camp worship & praise tracks + curated playlists
   */
  async getMusicTracks(category?: string, search?: string): Promise<{
    success: boolean;
    tracks: MusicTrack[];
    playlists: MusicPlaylist[];
    error?: string;
  }> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      params.set('_t', String(Date.now()));

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/music${qs}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json() as { success: boolean; tracks: MusicTrack[]; playlists: MusicPlaylist[]; error?: string };
      return {
        success: data.success ?? true,
        tracks: data.tracks || [],
        playlists: data.playlists || [],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load camp music tracks';
      console.warn('[apiService.getMusicTracks] Fallback or error:', msg);
      return { success: false, tracks: [], playlists: [], error: msg };
    }
  }

  /**
   * Upload an MP3 song to Cloudflare R2 and publish to D1
   */
  async uploadMusicTrack(formData: FormData): Promise<{
    success: boolean;
    track?: MusicTrack;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json() as any;
      if (!res.ok) {
        return { success: false, error: data.error || `HTTP ${res.status}` };
      }
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload song';
      return { success: false, error: msg };
    }
  }

  /**
   * Record track play count and sync camper live listening status
   */
  async recordTrackPlay(
    trackId: string,
    camperId?: string,
    isPlaying: boolean = true
  ): Promise<{ success: boolean; play_count?: number; listening_status?: any; error?: string }> {
    try {
      const res = await fetch('/api/music/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track_id: trackId,
          camper_id: camperId || undefined,
          is_playing: isPlaying,
        }),
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record track play';
      return { success: false, error: msg };
    }
  }

  /**
   * Update active camper listening status (e.g. pause or stop)
   */
  async updateListeningStatus(
    camperId: string,
    isPlaying: boolean,
    trackId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/music/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camper_id: camperId,
          track_id: trackId,
          is_playing: isPlaying,
        }),
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update listening status';
      return { success: false, error: msg };
    }
  }

  /**
   * Update an existing track metadata
   */
  async updateMusicTrack(id: string, updates: Partial<MusicTrack> | FormData): Promise<{
    success: boolean;
    track?: MusicTrack;
    error?: string;
  }> {
    try {
      const isFormData = typeof FormData !== 'undefined' && updates instanceof FormData;
      const res = await fetch(`/api/music/${id}`, {
        method: 'PUT',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? updates : JSON.stringify(updates),
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update song';
      return { success: false, error: msg };
    }
  }

  /**
   * Delete a music track from D1 and R2
   */
  async deleteMusicTrack(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/music/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete song';
      return { success: false, error: msg };
    }
  }

  /**
   * Get Spotify & YouTube Music playlists
   */
  async getMusicPlaylists(): Promise<{ success: boolean; playlists: MusicPlaylist[]; error?: string }> {
    try {
      const res = await fetch('/api/music/playlists');
      const data = await res.json() as any;
      return { success: true, playlists: data.playlists || [] };
    } catch (err: unknown) {
      return { success: false, playlists: [], error: err instanceof Error ? err.message : 'Failed to fetch playlists' };
    }
  }

  /**
   * Save or update an external Spotify/YouTube playlist
   */
  async saveMusicPlaylist(playlist: Partial<MusicPlaylist>): Promise<{ success: boolean; playlist?: MusicPlaylist; error?: string }> {
    try {
      const res = await fetch('/api/music/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playlist),
      });
      const data = await res.json() as any;
      return data;
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to save playlist' };
    }
  }

  private getLocalAdminUsers(): AdminUser[] {
    const raw = localStorage.getItem('vlc2027_admin_users');
    if (!raw) {
      localStorage.setItem('vlc2027_admin_users', JSON.stringify(INITIAL_ADMIN_USERS));
      return [...INITIAL_ADMIN_USERS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_ADMIN_USERS];
    }
  }

  private saveLocalAdminUsers(users: AdminUser[]) {
    localStorage.setItem('vlc2027_admin_users', JSON.stringify(users));
  }
}


export const apiService = new CampApiService();
