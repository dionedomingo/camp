-- VLC 2027 Initial Seed Data
-- Pentecostal Christian Church Incorporated (PCCI)
-- 21 Affiliated "Jesus Is Alive Worship Center" Churches across Luzon + Independent Delegate Option

-- Special Open / Independent Delegate entry for campers not belonging to a specific church
INSERT OR REPLACE INTO churches (id, slug, name, province, city, pastor_name, contact_email, target_quota) VALUES
('ch_open_delegate', 'independent', 'Independent Delegate / Other Fellowship', 'Open / Various', 'Various Cities', 'Camp Coordination Team', 'info@pcci.org.ph', 100);

-- PCCI Affiliated Churches (Cagayan, Nueva Vizcaya, etc.)
INSERT OR REPLACE INTO churches (id, slug, name, province, city, pastor_name, contact_email, target_quota) VALUES
-- Cagayan Churches
('ch_jia_buguey', 'jia-san-lorenzo-buguey', 'Jesus Is Alive Worship Center - San Lorenzo', 'Cagayan', 'Buguey', 'Pastor in Charge', 'buguey@pcci.org.ph', 40),
('ch_jia_amunitan', 'jia-amunitan-gonzaga', 'Jesus Is Alive Worship Center - Amunitan', 'Cagayan', 'Gonzaga', 'Pastor in Charge', 'amunitan@pcci.org.ph', 35),
('ch_jia_ipil', 'jia-ipil-gonzaga', 'Jesus Is Alive Worship Center - Purok 1 Ipil', 'Cagayan', 'Gonzaga', 'Pastor in Charge', 'ipil@pcci.org.ph', 35),
('ch_jia_tucalan', 'jia-tucalan-lasam', 'Jesus Is Alive Worship Center - Tucalan Passing', 'Cagayan', 'Lasam', 'Pastor in Charge', 'tucalan@pcci.org.ph', 30),
('ch_jia_nabannagan', 'jia-nabannagan-lasam', 'Jesus Is Alive - Nabannagan West', 'Cagayan', 'Lasam', 'Pastor in Charge', 'nabannagan@pcci.org.ph', 30),
('ch_jia_new_orlins', 'jia-new-orlins-lasam', 'Jesus Is Alive Worship Center - New Orlins', 'Cagayan', 'Lasam', 'Pastor in Charge', 'neworlins@pcci.org.ph', 30),
('ch_jia_callao', 'jia-callao-sur-lasam', 'Jesus Is Alive Worship Center - Callao Sur', 'Cagayan', 'Lasam', 'Pastor in Charge', 'callao@pcci.org.ph', 30),
('ch_jia_minanga', 'jia-minanga-sur-lasam', 'Jesus Is Alive Worship Center - Minanga Sur', 'Cagayan', 'Lasam', 'Pastor in Charge', 'minanga@pcci.org.ph', 30),
('ch_jia_ibj', 'jia-ibj-lasam', 'Jesus Is Alive Worship Center - IBJ', 'Cagayan', 'Lasam', 'Pastor in Charge', 'ibj@pcci.org.ph', 30),
('ch_jia_allannay', 'jia-allannay-lasam', 'Jesus Is Alive Worship Center - Allannay', 'Cagayan', 'Lasam', 'Pastor in Charge', 'allannay@pcci.org.ph', 30),
('ch_jia_centro1', 'jia-centro1-lasam', 'Jesus Is Alive Worship Center - Centro 1', 'Cagayan', 'Lasam', 'Pastor in Charge', 'centro1@pcci.org.ph', 35),
('ch_jia_sanchez_mira', 'jia-sanchez-mira', 'Jesus Is Alive Worship Center - Sanchez Mira', 'Cagayan', 'Sanchez Mira', 'Pastor in Charge', 'sanchezmira@pcci.org.ph', 40),
('ch_jia_sta_teresita', 'jia-alucao-sta-teresita', 'Jesus Is Alive Worship Center - Alucao & Bungkag', 'Cagayan', 'Sta. Teresita', 'Pastor in Charge', 'stateresita@pcci.org.ph', 35),

-- Nueva Vizcaya Churches (PCCI Headquarters region)
('ch_jia_buag', 'jia-buag-bambang', 'Jesus Is Alive Worship Center - Buag', 'Nueva Vizcaya', 'Bambang', 'Rev. Pastor (National HQ)', 'bambang@pcci.org.ph', 80),
('ch_jia_upacan', 'jia-upacan-bambang', 'Jesus Is Alive - Upacan', 'Nueva Vizcaya', 'Bambang', 'Pastor in Charge', 'upacan@pcci.org.ph', 35),
('ch_jia_santo_domingo', 'jia-santo-domingo-bambang', 'Jesus Is Alive - Santo Domingo', 'Nueva Vizcaya', 'Bambang', 'Pastor in Charge', 'santodomingo@pcci.org.ph', 35),
('ch_jia_gifta', 'jia-gifta-almaguer-bambang', 'Jesus Is Alive - Gifta, Almaguer North', 'Nueva Vizcaya', 'Bambang', 'Pastor in Charge', 'gifta@pcci.org.ph', 30),
('ch_cog_almaguer', 'cog-cf-jia-almaguer', 'Church of God Christian Fellowship (JIA Almaguer)', 'Nueva Vizcaya', 'Bambang', 'Pastor in Charge', 'almaguer@pcci.org.ph', 35),
('ch_jia_mauan', 'jia-mauan-bambang', 'Jesus Is Alive - Mauan', 'Nueva Vizcaya', 'Bambang', 'Pastor in Charge', 'mauan@pcci.org.ph', 30),
('ch_jia_san_antonio', 'jia-san-antonio-bambang', 'Jesus Is Alive - San Antonio North', 'Nueva Vizcaya', 'Bambang', 'Pastor in Charge', 'sanantonio@pcci.org.ph', 35),
('ch_jia_mangayang', 'jia-mangayang-dupax', 'Jesus Is Alive - Mangayang', 'Nueva Vizcaya', 'Dupax Del Norte', 'Pastor in Charge', 'mangayang@pcci.org.ph', 35);

-- Initial sample registrations across PCCI delegations
INSERT OR IGNORE INTO campers (id, church_id, role, full_name, nickname, gender, age, birthdate, email, phone, province, city, t_shirt_size, dietary_needs, emergency_name, emergency_phone, emergency_relation, ministry_interests, favorite_verse, verse_reflection, selfie_url) VALUES
(
  'cmp_pcci_101', 'ch_jia_buag', 'counselor', 'Joshua Miguel Valdez', 'Josh', 'male', 24, '2002-04-12',
  'joshua.valdez@email.com', '+639171112233', 'Nueva Vizcaya', 'Bambang', 'L', 'None',
  'Maria Valdez', '+639170001122', 'Mother',
  '["Praise & Worship", "Youth Discipleship"]',
  'Joshua 1:9',
  'Be strong and courageous! God has prepared this season for you to lead fearlessly.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_102', 'ch_jia_sanchez_mira', 'first_timer', 'Hannah Joy Mendoza', 'Hannah', 'female', 18, '2008-09-15',
  'hannah.mendoza@email.com', '+639182223344', 'Cagayan', 'Sanchez Mira', 'M', 'No shellfish',
  'Roberto Mendoza', '+639189998877', 'Father',
  '["Media & Tech", "Visual Arts"]',
  'Jeremiah 29:11',
  'For I know the plans I have for you—plans to give you hope and a bright future!',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_103', 'ch_open_delegate', 'camper', 'Elijah Marcus Ramos', 'Eli', 'male', 21, '2005-01-20',
  'eli.ramos@email.com', '+639193334455', 'Metro Manila', 'Quezon City', 'XL', 'None',
  'Grace Ramos', '+639198887766', 'Mother',
  '["Praise & Worship", "Creative Arts"]',
  'Psalm 100:1-2',
  'Make a joyful noise to the Lord! Worship is your weapon and your joy.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_104', 'ch_jia_centro1', 'worship', 'Chloe Danielle Santos', 'Chloe', 'female', 20, '2006-03-30',
  'chloe.santos@email.com', '+639237778899', 'Cagayan', 'Lasam', 'S', 'None',
  'Lorna Santos', '+639234443322', 'Mother',
  '["Praise & Worship", "Vocalist"]',
  'Isaiah 60:1',
  'Arise, shine, for your light has come, and the glory of the Lord rises upon you!',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
);
