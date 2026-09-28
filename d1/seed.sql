-- VLC 2027 Initial Seed Data
-- Pentecostal Christian Church Incorporated (PCCI)
-- 21 Affiliated "Jesus Is Alive Worship Center" Churches across Luzon + Independent Delegate Option

-- Initial Camp Event
INSERT OR IGNORE INTO events (id, slug, name, theme, tagline, description, start_date, end_date, venue_name, venue_address, city, province, country, target_capacity, status) VALUES 
('vlc-2027', 'vlc-2027', 'Vision & Leadership Camp 2027', 'Arise & Shine (Isaiah 60:1)', 'National Youth & Workers Leadership Gathering', 'Annual national gathering of youth delegates across PCCI for spiritual renewal.', '2027-07-21', '2027-07-24', 'PCCI National Headquarters (Buag Campus)', 'National Highway, Barangay Buag', 'Bambang', 'Nueva Vizcaya', 'Philippines', 600, 'active');

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
),
(
  'cmp_pcci_105', 'ch_jia_buag', 'counselor', 'David Paul Villanueva', 'Dave', 'male', 23, '2003-05-18',
  'david.villanueva@email.com', '+639174445566', 'Nueva Vizcaya', 'Bambang', 'L', 'None',
  'Cynthia Villanueva', '+639178881122', 'Mother',
  '["Youth Leadership", "Prayer & Intercession"]',
  '1 Timothy 4:12',
  'Don’t let anyone look down on you because you are young, but set an example for the believers.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_106', 'ch_jia_buguey', 'first_timer', 'Sarah Joy Balisi', 'Sarah', 'female', 19, '2007-11-04',
  'sarah.balisi@email.com', '+639185556677', 'Cagayan', 'Buguey', 'M', 'None',
  'Antonio Balisi', '+639187779900', 'Father',
  '["Children Ministry", "Media & Tech"]',
  'Proverbs 3:5-6',
  'Trust in the Lord with all your heart and lean not on your own understanding.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_107', 'ch_cog_almaguer', 'worship', 'Grace Nicole Aquino', 'Grace', 'female', 22, '2004-08-25',
  'grace.aquino@email.com', '+639201112244', 'Nueva Vizcaya', 'Bambang', 'S', 'None',
  'Elena Aquino', '+639203334411', 'Mother',
  '["Praise & Worship", "Acoustic Guitar"]',
  'Psalm 46:1',
  'God is our refuge and strength, an ever-present help in trouble.',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_108', 'ch_jia_amunitan', 'worship', 'Nathaniel Joseph Perez', 'Nathan', 'male', 21, '2005-06-14',
  'nathan.perez@email.com', '+639173332211', 'Cagayan', 'Gonzaga', 'L', 'None',
  'Marites Perez', '+639178883344', 'Mother',
  '["Praise & Worship", "Bass Guitar"]',
  'Psalm 150:6',
  'Let everything that has breath praise the Lord!',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_109', 'ch_jia_ipil', 'first_timer', 'Faith Angela Cruz', 'Faith', 'female', 18, '2008-02-19',
  'faith.cruz@email.com', '+639194445566', 'Cagayan', 'Gonzaga', 'M', 'None',
  'Eduardo Cruz', '+639192223311', 'Father',
  '["Creative Dance", "Children Ministry"]',
  'Hebrews 11:1',
  'Now faith is confidence in what we hope for and assurance about what we do not see.',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_110', 'ch_jia_tucalan', 'counselor', 'Mark Anthony Lopez', 'Mark', 'male', 24, '2002-10-08',
  'mark.lopez@email.com', '+639186667788', 'Cagayan', 'Lasam', 'XL', 'None',
  'Luzviminda Lopez', '+639184441122', 'Mother',
  '["Youth Discipleship", "Camp Counseling"]',
  'Philippians 4:13',
  'I can do all things through Christ who gives me strength.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_111', 'ch_jia_nabannagan', 'camper', 'Caleb Joshua Dizon', 'Caleb', 'male', 20, '2006-07-22',
  'caleb.dizon@email.com', '+639225556677', 'Cagayan', 'Lasam', 'M', 'None',
  'Jonathan Dizon', '+639227778899', 'Father',
  '["Media & Tech", "Logistics"]',
  'Joshua 24:15',
  'As for me and my household, we will serve the Lord.',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_112', 'ch_jia_new_orlins', 'camper', 'Kyla Mae Pascual', 'Kyla', 'female', 19, '2007-04-16',
  'kyla.pascual@email.com', '+639178889900', 'Cagayan', 'Lasam', 'S', 'None',
  'Virginia Pascual', '+639172221100', 'Mother',
  '["Creative Arts", "Ushering"]',
  'Psalm 23:1',
  'The Lord is my shepherd, I lack nothing.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_113', 'ch_jia_callao', 'worship', 'James Matthew Tan', 'James', 'male', 22, '2004-12-03',
  'james.tan@email.com', '+639193337788', 'Cagayan', 'Lasam', 'L', 'None',
  'Rebecca Tan', '+639194448899', 'Mother',
  '["Praise & Worship", "Drums"]',
  'Colossians 3:16',
  'Sing psalms, hymns, and spiritual songs with gratitude in your hearts to God.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_114', 'ch_jia_minanga', 'first_timer', 'Joy Abigail Perez', 'Joy', 'female', 18, '2008-08-30',
  'joy.perez@email.com', '+639206665544', 'Cagayan', 'Lasam', 'M', 'None',
  'Marlon Perez', '+639207771122', 'Father',
  '["Youth Fellowship", "Hospitality"]',
  'Nehemiah 8:10',
  'The joy of the Lord is your strength!',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_115', 'ch_jia_ibj', 'staff', 'Gabriel Sean Ramos', 'Gabe', 'male', 25, '2001-09-12',
  'gabe.ramos@email.com', '+639189991122', 'Cagayan', 'Lasam', 'L', 'None',
  'Patricia Ramos', '+639185552233', 'Mother',
  '["Camp Administration", "Safety & Security"]',
  'Galatians 6:9',
  'Let us not become weary in doing good, for at the proper time we will reap a harvest.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_116', 'ch_jia_allannay', 'camper', 'Bea Louise Torres', 'Bea', 'female', 20, '2006-05-14',
  'bea.torres@email.com', '+639234445566', 'Cagayan', 'Lasam', 'S', 'None',
  'Danilo Torres', '+639238889900', 'Father',
  '["Visual Arts", "Decoration"]',
  'Psalm 139:14',
  'I praise you because I am fearfully and wonderfully made.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_117', 'ch_jia_sta_teresita', 'counselor', 'Timothy John Reyes', 'Timmy', 'male', 23, '2003-03-29',
  'timmy.reyes@email.com', '+639177773322', 'Cagayan', 'Sta. Teresita', 'M', 'None',
  'Corazon Reyes', '+639176664411', 'Mother',
  '["Cabin Mentoring", "Youth Outreach"]',
  '2 Timothy 1:7',
  'For God has not given us a spirit of fear, but of power, love, and self-discipline.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_118', 'ch_jia_upacan', 'worship', 'Leah Marie Fernandez', 'Leah', 'female', 21, '2005-11-18',
  'leah.fernandez@email.com', '+639198884433', 'Nueva Vizcaya', 'Bambang', 'S', 'None',
  'Bernardo Fernandez', '+639191118877', 'Father',
  '["Praise & Worship", "Violin / Strings"]',
  'Psalm 91:1-2',
  'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_119', 'ch_jia_santo_domingo', 'camper', 'Lucas Aaron Diaz', 'Luke', 'male', 20, '2006-08-05',
  'luke.diaz@email.com', '+639205559988', 'Nueva Vizcaya', 'Bambang', 'L', 'None',
  'Teresa Diaz', '+639203332211', 'Mother',
  '["Sports Ministry", "Media"]',
  '1 Corinthians 9:24',
  'Run in such a way as to get the prize.',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_120', 'ch_jia_gifta', 'first_timer', 'Rachel Ann Castro', 'Rachel', 'female', 18, '2008-01-12',
  'rachel.castro@email.com', '+639171119933', 'Nueva Vizcaya', 'Bambang', 'M', 'None',
  'Emilio Castro', '+639174447788', 'Father',
  '["Creative Arts", "Children Ministry"]',
  'Romans 8:28',
  'In all things God works for the good of those who love him.',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_121', 'ch_jia_mauan', 'camper', 'Philip Andrew Gomez', 'Philip', 'male', 22, '2004-09-24',
  'philip.gomez@email.com', '+639182226677', 'Nueva Vizcaya', 'Bambang', 'XL', 'None',
  'Clarissa Gomez', '+639189993344', 'Mother',
  '["Evangelism", "Ushering"]',
  'Romans 1:16',
  'For I am not ashamed of the gospel, because it is the power of God that brings salvation.',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_122', 'ch_jia_san_antonio', 'worship', 'Abigail Faye Morales', 'Abby', 'female', 20, '2006-02-14',
  'abby.morales@email.com', '+639197771122', 'Nueva Vizcaya', 'Bambang', 'S', 'None',
  'Vicente Morales', '+639198886655', 'Father',
  '["Praise & Worship", "Keyboard"]',
  'Psalm 63:1',
  'You, God, are my God, earnestly I seek you; my whole being longs for you.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
),
(
  'cmp_pcci_123', 'ch_jia_mangayang', 'staff', 'Daniel Keith Bautista', 'Dan', 'male', 26, '2000-12-07',
  'dan.bautista@email.com', '+639208883344', 'Nueva Vizcaya', 'Dupax Del Norte', 'L', 'None',
  'Lorena Bautista', '+639204447788', 'Mother',
  '["Camp Coordination", "Youth Pastorate"]',
  'Micah 6:8',
  'To act justly and to love mercy and to walk humbly with your God.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
);
