import { createContext, useContext, useState, type ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'tl' | 'ilo';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'tl', label: 'Tagalog', flag: '🇵🇭', nativeName: 'Tagalog' },
  { code: 'ilo', label: 'Ilocano', flag: '🌾', nativeName: 'Ilokano' },
];

export const translations = {
  en: {
    // Header Navigation
    'nav.home': 'Home',
    'nav.schedule': 'Schedule',
    'nav.overview': 'Camp Overview',
    'nav.delegations': 'Church Delegations',
    'nav.feed': 'Community Feed',
    'nav.music': 'Music',
    'nav.fastCheckIn': 'Arrived? Check In',
    'nav.signIn': 'Sign In',
    'nav.adminPortal': 'Admin Portal',
    'nav.camperPortal': 'Camper Portal',

    // Top Ticker Marquee
    'ticker.title': 'VICTORY LEADERSHIP CAMP 2027',
    'ticker.registrationOpen': 'EARLY BIRD REGISTRATION NOW OPEN',
    'ticker.joinDelegation': 'JOIN YOUR CHURCH DELEGATION TODAY',
    'ticker.capacityBanner': 'OVER 600 YOUTH & LEADERS UNITED UNDER ONE ROOF',

    // Hero Section
    'hero.badge': 'July 21 – 24, 2027 • Buag Campgrounds, Nueva Vizcaya',
    'hero.titleLine1': 'Victory Leadership',
    'hero.titleLine2': 'Camp 2027',
    'hero.tagline': 'Awakening a generation of bold spiritual leaders, worshipers, and world-changers across Northern Luzon. 4 unforgettable days of apostolic fire, intimate worship, and deep fellowship.',
    'hero.registerBtn': 'Register Your Delegate Pass',
    'hero.itineraryBtn': 'Schedule',
    'hero.countdownTitle': 'Countdown to Camp Opening',
    'hero.days': 'Days',
    'hero.hours': 'Hours',
    'hero.minutes': 'Mins',
    'hero.seconds': 'Secs',
    'hero.campersRegistered': 'campers registered of',
    'hero.capacity': 'capacity across',
    'hero.churches': 'churches',
    'hero.atmosphereBadge': 'Campground Experience',
    'hero.atmosphereQuote': '"For where two or three are gathered in my name, there am I with them." Experience unforgettable worship and prayer under the mountain skies of Bambang.',
    'hero.scrollHint': 'Scroll to discover speakers & zones',

    // Keynote Speakers Marquee
    'speakers.overline': 'Apostolic & NextGen Ministers',
    'speakers.title': 'Keynote Speakers',
    'speakers.subtitle': 'Anointed leaders and ministers imparting visionary leadership, spiritual fire, and practical ministry tools into every camper.',
    'speakers.sessionTopic': 'Session Topic',
    'speakers.close': 'Close',

    // Experience Zones
    'zones.overline': 'Four Dynamic Atmospheres',
    'zones.title': 'Camp Experience Zones',
    'zones.subtitle': 'From high-voltage evening rallies to strategic leadership workshops and campfire worship under open skies, every moment is crafted to empower your walk with God.',
    'zones.rally.title': 'Evening Revival Rallies',
    'zones.rally.desc': 'Electrifying praise, apostolic ministry, life-altering altar encounters, and the fresh baptism of the Holy Spirit. Hundreds of youth crying out in unison for a national spiritual awakening.',
    'zones.rally.time': 'Every Night • 7:00 PM',
    'zones.rally.loc': 'Main Tabernacle',
    'zones.labs.title': 'NextGen Leadership Labs',
    'zones.labs.desc': 'Intensive masterclasses for student leaders, campus evangelists, media creatives, and worship teams. Learn actionable frameworks to impact your local church and school campuses.',
    'zones.labs.time': 'Day 2 & 3 • 2:00 PM',
    'zones.labs.loc': 'Training Pavilions',
    'zones.sports.title': 'Tribal Wars & Sports Olympics',
    'zones.sports.desc': 'High-energy team obstacle challenges, relay courses, volleyball tournaments, and tribal cheers. Forge unbreakable bonds across delegations and celebrate healthy teamwork.',
    'zones.sports.time': 'Day 3 • 3:30 PM',
    'zones.sports.loc': 'Camp Athletic Field',
    'zones.campfire.title': 'Campfire & Acoustic Worship',
    'zones.campfire.desc': 'Gather around the crackling campfire beneath the mountain night stars for heartfelt testimonies, acoustic worship melodies, s\'mores, and personal covenant prayers.',
    'zones.campfire.time': 'Closing Night • 9:30 PM',
    'zones.campfire.loc': 'Pine Grove Hillside',

    // Practical Guide (Infos Pratiques)
    'guide.overline': 'Prepare For Your Visit',
    'guide.title': 'Practical Camp Guide',
    'guide.subtitle': 'Everything you need to know to ensure a smooth, comfortable, and life-changing camp experience.',
    'guide.packing.title': 'What to Pack (Camp Essentials Checklist)',
    'guide.packing.desc': 'Bring your Bible, notebook and pens, modest comfortable clothing suitable for active games and evening rallies, warm jacket or hoodie (mountain evenings get cold), personal toiletries, towel, bedding or sleeping bag, personal water bottle, and any prescription medications.',
    'guide.arrival.title': 'Location, Arrival & Shuttle Information',
    'guide.arrival.desc': 'Victory Leadership Camp 2027 is hosted at Buag Campgrounds in Bambang, Nueva Vizcaya. Coordinated church delegation vans and chartered buses will arrive on Wednesday morning between 8:00 AM and 1:00 PM. Designated camp staff and ushers will guide arrivals to the check-in desk.',
    'guide.qr.title': 'Fast On-Arrival Check-In with Scannable QR',
    'guide.qr.desc': 'Upon completing your online registration, your unique Camper ID and activation QR code will be generated. Simply show your badge QR to the check-in desk on arrival to claim your camp kit and bunk assignment instantly!',
    'guide.meals.title': 'Meals, Accommodations & Medical Support',
    'guide.meals.desc': 'All registered delegates receive full dormitory accommodation and full meal catering (Breakfast, Lunch, Dinner, and Evening Snacks). Our certified volunteer medical team and nurses are on-site 24/7 at the First Aid Pavilion.',

    // Jumbo Footer CTA
    'footer.badge': 'Registration Closing Soon',
    'footer.titleLine1': 'Claim Your Spot at',
    'footer.titleLine2': 'VLC 2027 Today',
    'footer.desc': 'Join hundreds of delegates from over 20 regional churches for this divine appointment. Coordinate with your church delegation or register as an open delegate.',
    'footer.registerBtn': 'Register Now',
    'footer.delegationsBtn': 'Browse Church Delegations',
    'footer.copyright': '© 2027 Pentecostal Christian Church Inc. • Victory Leadership Camp',
    'footer.checkIn': 'On-Arrival Fast Check-In',
    'footer.schedule': 'Schedule',
    'footer.churches': 'Church Directory',

    // User Profile Right Drawer
    'drawer.accountTitle': 'Delegate Account',
    'drawer.myProfile': 'My Profile',
    'drawer.myProfileDesc': 'View public profile, badge & community posts',
    'drawer.account': 'Account & Details',
    'drawer.accountDesc': 'Personal info, church delegation & settings',
    'drawer.digitalPass': 'Digital Pass',
    'drawer.digitalPassDesc': 'On-arrival scannable QR badge & bunk info',
    'drawer.adminPortal': 'Admin Management Portal',
    'drawer.adminPortalDesc': 'Access registrations, arrivals & print queue',
    'drawer.logout': 'Sign Out',
    'drawer.close': 'Close',
    'drawer.statusVerified': 'Registered Delegate',
  },

  tl: {
    // Header Navigation
    'nav.home': 'Tahanan',
    'nav.schedule': 'Iskedyul',
    'nav.overview': 'Pangkalahatang Tanaw',
    'nav.delegations': 'Mga Delegasyon ng Simbahan',
    'nav.feed': 'Feed ng Komunidad',
    'nav.music': 'Musika',
    'nav.fastCheckIn': 'Nakarating Na? Mag-Check In',
    'nav.signIn': 'Mag-Sign In',
    'nav.adminPortal': 'Admin Portal',
    'nav.camperPortal': 'Camper Portal',

    // Top Ticker Marquee
    'ticker.title': 'VICTORY LEADERSHIP CAMP 2027',
    'ticker.registrationOpen': 'BUKAS NA ANG EARLY BIRD REGISTRATION',
    'ticker.joinDelegation': 'SUMALI SA DELEGASYON NG IYONG SIMBAHAN NGAYON',
    'ticker.capacityBanner': 'MAHIGIT 600 NA KABATAAN AT PINUNO NAGKAKAISA SA ISANG TAHANAN',

    // Hero Section
    'hero.badge': 'Hulyo 21 – 24, 2027 • Buag Campgrounds, Nueva Vizcaya',
    'hero.titleLine1': 'Victory Leadership',
    'hero.titleLine2': 'Camp 2027',
    'hero.tagline': 'Paggising sa henerasyon ng matatapang na espirituwal na pinuno, mananamba, at tagapagbago ng lipunan sa Northern Luzon. 4 na araw ng apoy ng Espiritu Santo, taos-pusong pagsamba, at malalim na samahan.',
    'hero.registerBtn': 'Kumuha ng Delegate Pass',
    'hero.itineraryBtn': 'Iskedyul',
    'hero.countdownTitle': 'Pagbibilang Bago ang Pagbubukas ng Kampo',
    'hero.days': 'Araw',
    'hero.hours': 'Oras',
    'hero.minutes': 'Min',
    'hero.seconds': 'Seg',
    'hero.campersRegistered': 'mga camper na rehistrado sa',
    'hero.capacity': 'kabuuang puwang mula sa',
    'hero.churches': 'mga simbahan',
    'hero.atmosphereBadge': 'Karanasan sa Kampo',
    'hero.atmosphereQuote': '"Sapagkat saanman may dalawa o tatlong nagkakatipon sa aking pangalan, naroroon ako sa gitna nila." Damhin ang pagsamba at pananalangin sa ilalim ng kalangitan ng Bambang.',
    'hero.scrollHint': 'Mag-scroll para sa mga tagapagsalita at aktibidad',

    // Keynote Speakers Marquee
    'speakers.overline': 'Mga Apostoliko at Kabataang Ministro',
    'speakers.title': 'Mga Pangunahing Tagapagsalita',
    'speakers.subtitle': 'Mga pinahirang lingkod ng Diyos na magbabahagi ng espirituwal na apoy, makalangit na karunungan, at praktikal na pamumuno sa bawat camper.',
    'speakers.sessionTopic': 'Paksa ng Sesyon',
    'speakers.close': 'Isara',

    // Experience Zones
    'zones.overline': 'Apat na Masiglang Karanasan',
    'zones.title': 'Mga Sona ng Karanasan sa Kampo',
    'zones.subtitle': 'Mula sa maapoy na panggabing pagtitipon hanggang sa mga pagsasanay sa pamumuno at campfire sa ilalim ng bituin, bawat saglit ay inihanda para palakasin ang iyong pananampalataya.',
    'zones.rally.title': 'Panggabing Pagpupulong ng Revival',
    'zones.rally.desc': 'Makapangyarihang pagsamba, apostolikong ministeryo, pagbabago sa altar, at sariwang bautismo ng Espiritu Santo. Daan-daang kabataan na sabay-sabay sumisigaw para sa espirituwal na paggising ng bansa.',
    'zones.rally.time': 'Gabi-gabi • 7:00 PM',
    'zones.rally.loc': 'Pangunahing Tabernakulo',
    'zones.labs.title': 'NextGen Leadership Labs',
    'zones.labs.desc': 'Masinsinang mga pagsasanay para sa mga lider ng paaralan, ebanghelista sa campus, media creatives, at pangkat ng pagsamba. Alamin ang mga paraan upang magbunga sa inyong lokal na simbahan at paaralan.',
    'zones.labs.time': 'Araw 2 at 3 • 2:00 PM',
    'zones.labs.loc': 'Pavilion ng Pagsasanay',
    'zones.sports.title': 'Labanan ng Tribo at Palakasan',
    'zones.sports.desc': 'Puno ng enerhiyang obstacle challenges, relay courses, volleyball tournament, at sigaw ng tribo. Magtayo ng matibay na pagkakaibigan at pagkakaisa sa pagitan ng mga simbahan.',
    'zones.sports.time': 'Araw 3 • 3:30 PM',
    'zones.sports.loc': 'Palaruan ng Kampo',
    'zones.campfire.title': 'Campfire at Acoustic na Pagsamba',
    'zones.campfire.desc': 'Magtipon sa paligid ng nagniningas na apoy sa ilalim ng mga bituin para sa mga patotoo, acoustic na pagsamba, meryenda, at panalanging pangkasunduan sa Panginoon.',
    'zones.campfire.time': 'Huling Gabi • 9:30 PM',
    'zones.campfire.loc': 'Pine Grove Hillside',

    // Practical Guide (Infos Pratiques)
    'guide.overline': 'Paghahanda Para sa Iyong Pagbisita',
    'guide.title': 'Praktikal na Gabay sa Kampo',
    'guide.subtitle': 'Lahat ng dapat mong malaman para sa isang maayos, ligtas, at makabuluhang karanasan sa kampo.',
    'guide.packing.title': 'Mga Dapat Dalhin (Checklist ng Pangangailangan)',
    'guide.packing.desc': 'Dalhin ang iyong Bibliya, kwaderno at bolpen, disenteng damit para sa palaro at panggabing pagsamba, makapal na jacket o hoodie (malamig ang gabi sa kabundukan), personal na gamit sa banyo, tuwalya, banig o sleeping bag, lalagyan ng tubig, at sariling gamot kung mayroon.',
    'guide.arrival.title': 'Lokasyon, Pagdating at Impormasyon sa Sasakyan',
    'guide.arrival.desc': 'Ang Victory Leadership Camp 2027 ay gaganapin sa Buag Campgrounds sa Bambang, Nueva Vizcaya. Ang mga koordinadong van at bus ng simbahan ay darating ng Miyerkules ng umaga sa pagitan ng 8:00 AM at 1:00 PM. Gagabayan kayo ng ating mga ushers patungo sa registration desk.',
    'guide.qr.title': 'Mabilisang Check-In Gamit ang QR Code',
    'guide.qr.desc': 'Pagkatapos magparehistro online, matatanggap mo ang iyong Camper ID at activation QR code. Ipakita lamang ang QR code sa arrival desk upang makuha agad ang iyong camp kit at higaan!',
    'guide.meals.title': 'Pagkain, Tuluyan at Serbisyong Medikal',
    'guide.meals.desc': 'Lahat ng rehistradong delegado ay may dormitoryong tuluyan at kumpletong pagkain (Almusal, Tanghalian, Hapunan, at Meryenda). Mayroong volunteer medical team at nars sa First Aid Pavilion 24/7.',

    // Jumbo Footer CTA
    'footer.badge': 'Malapit Nang Magsara ang Pagpaparehistro',
    'footer.titleLine1': 'Ireserba ang Iyong Puwang sa',
    'footer.titleLine2': 'VLC 2027 Ngayon',
    'footer.desc': 'Samahan ang daan-daang delegado mula sa mahigit 20 simbahan para sa banal na tagpong ito. Makipag-ugnayan sa iyong pastor o magparehistro bilang bukas na delegado.',
    'footer.registerBtn': 'Magparehistro Ngayon',
    'footer.delegationsBtn': 'Tingnan ang Delegasyon ng mga Simbahan',
    'footer.copyright': '© 2027 Pentecostal Christian Church Inc. • Victory Leadership Camp',
    'footer.checkIn': 'Mabilisang Check-In sa Pagdating',
    'footer.schedule': 'Iskedyul',
    'footer.churches': 'Listahan ng Simbahan',

    // User Profile Right Drawer
    'drawer.accountTitle': 'Account ng Delegado',
    'drawer.myProfile': 'Aking Profile',
    'drawer.myProfileDesc': 'Tingnan ang pampublikong profile, badge at mga post',
    'drawer.account': 'Account at Detalye',
    'drawer.accountDesc': 'Personal na impormasyon, delegasyon at setting',
    'drawer.digitalPass': 'Digital Pass',
    'drawer.digitalPassDesc': 'Mabilisang scannable QR badge sa pagdating',
    'drawer.adminPortal': 'Admin Management Portal',
    'drawer.adminPortalDesc': 'Pangasiwaan ang rehistrasyon, pagdating at ID prints',
    'drawer.logout': 'Mag-Sign Out',
    'drawer.close': 'Isara',
    'drawer.statusVerified': 'Rehistradong Delegado',
  },

  ilo: {
    // Header Navigation
    'nav.home': 'Balay',
    'nav.schedule': 'Iskedyul',
    'nav.overview': 'Pakabuklan ti Kampo',
    'nav.delegations': 'Delegasion ti Simbaan',
    'nav.feed': 'Paset ti Komunidad',
    'nav.music': 'Musika',
    'nav.fastCheckIn': 'Nakadanonkan? Ag-Check In',
    'nav.signIn': 'Ag-Sign In',
    'nav.adminPortal': 'Portal ti Admin',
    'nav.camperPortal': 'Portal ti Kampero',

    // Top Ticker Marquee
    'ticker.title': 'VICTORY LEADERSHIP CAMP 2027',
    'ticker.registrationOpen': 'NUKATANEN TI EARLY BIRD NGA REHISTRASION',
    'ticker.joinDelegation': 'KUMUYOG ITI DELEGASION TI SIMBAANMO ITA',
    'ticker.capacityBanner': 'NASUROK NGA 600 NGA AGTUTUBO KEN MANGIDADAULO AGTUTUNOS ITI MAYMAYSA A TAHANAN',

    // Hero Section
    'hero.badge': 'Hulio 21 – 24, 2027 • Buag Campgrounds, Nueva Vizcaya',
    'hero.titleLine1': 'Victory Leadership',
    'hero.titleLine2': 'Camp 2027',
    'hero.tagline': 'Panangriing iti henerasion dagiti maingel nga espiritual a mangidadaulo, agdaydayaw, ken mangbalbaliw iti kagimongan iti Northern Luzon. 4 nga aldaw ti apoy ti Espiritu Santo, napudno a panagdayaw, ken nasged a panagkakadua.',
    'hero.registerBtn': 'Alaem ti Delegate Pass Mo',
    'hero.itineraryBtn': 'Iskedyul',
    'hero.countdownTitle': 'Panagbilang agingga Lukat ti Kampo',
    'hero.days': 'Aldaw',
    'hero.hours': 'Oras',
    'hero.minutes': 'Min',
    'hero.seconds': 'Seg',
    'hero.campersRegistered': 'dagiti kampero a nakarehistro iti',
    'hero.capacity': 'a kabuklan a kapasidad manipud iti',
    'hero.churches': 'a simbaan',
    'hero.atmosphereBadge': 'Padas iti Kampo',
    'hero.atmosphereQuote': '"Ta no sadino ti pakatitiponan ti dua wenno tallo iti naganko, addaak sadiay iti tengngada." Ramanam ti nasged a panagdayaw ken kararag iti sirok ti tangatang ti Bambang.',
    'hero.scrollHint': 'I-scroll tapno makita dagiti agsasao ken aktibidad',

    // Keynote Speakers Marquee
    'speakers.overline': 'Apostoliko ken Agtutubo a Ministro',
    'speakers.title': 'Kangrunaan nga Agsasao',
    'speakers.subtitle': 'Dagiti napulotan nga adipen ti Dios a mangibukbok ti naespirituan nga apoy, nadiosan a sirib, ken praktikal a panangidaulo iti tunggal kampero.',
    'speakers.sessionTopic': 'Tema ti Sesyon',
    'speakers.close': 'Irikep',

    // Experience Zones
    'zones.overline': 'Uppat a Masiglat a Padas',
    'zones.title': 'Luglugar ti Padas ti Kampo',
    'zones.subtitle': 'Manipud kadagiti napasnek a gimong ti rabii agingga kadagiti panagsanay ti panangidaulo ken campfire iti sirok dagiti bituen, naisagana amin a mangpabileg iti pammatim.',
    'zones.rally.title': 'Rabii a Rallies ti Panagungar',
    'zones.rally.desc': 'Nabileg a panagdayaw, apostoliko a ministerio, panagbalbaliw iti altar, ken baro a bautismo ti Espiritu Santo. Gasut nga agtutubo a sangsangkamaysa nga agpukkaw para iti nailian a panagriing.',
    'zones.rally.time': 'Tunggal Rabii • 7:00 PM',
    'zones.rally.loc': 'Kangrunaan a Tabernakulo',
    'zones.labs.title': 'NextGen Leadership Labs',
    'zones.labs.desc': 'Nauneg a panagsanay para kadagiti mangidadaulo iti eskuela, ebanghelista iti campus, media creatives, ken worship teams. Adalen dagiti addang tapno agbunga iti simbaan ken komunidad.',
    'zones.labs.time': 'Aldaw 2 ken 3 • 2:00 PM',
    'zones.labs.loc': 'Pavilion ti Panagsanay',
    'zones.sports.title': 'Gubat dagiti Tribu ken Ay-ayam',
    'zones.sports.desc': 'Napnuan pigsa nga obstacle challenges, relay courses, volleyball tournament, ken pukkaw ti tribu. Mangbangon iti natibker a panaggayyem ken panagkaykaysa ti tunggal simbaan.',
    'zones.sports.time': 'Aldaw 3 • 3:30 PM',
    'zones.sports.loc': 'Palaruan ti Kampo',
    'zones.campfire.title': 'Campfire ken Acoustic a Panagdayaw',
    'zones.campfire.desc': 'Aguummong iti agburburek a gil-ayab ti apuy iti sirok dagiti bituen para kadagiti pammaneknek, acoustic a kankanta, meryenda, ken panagkararag iti Apo.',
    'zones.campfire.time': 'Maudi a Rabii • 9:30 PM',
    'zones.campfire.loc': 'Pine Grove Hillside',

    // Practical Guide (Infos Pratiques)
    'guide.overline': 'Panagsagana Para iti Idadanon Mo',
    'guide.title': 'Praktikal a Giya ti Kampo',
    'guide.subtitle': 'Amin a nasken a maammuam tapno natalged, naannayas, ken adda pakaibatayan ti panagkampom.',
    'guide.packing.title': 'Dagiti Masapul nga Ipan (Listaan ti Kasapulan)',
    'guide.packing.desc': 'Ipan ti Biblia, kuaderno ken bolpen, naurnos a bado para iti ay-ayam ken gimong ti rabii, napuskol a jacket (nalam-ek ti rabii iti bantay), sabon ken sepilyo, tualia, ules wenno sleeping bag, pagkargaan ti danum, ken agas no adda personal a kasapulan.',
    'guide.arrival.title': 'Lugar, Idadanon ken Lugan',
    'guide.arrival.desc': 'Maangay ti Victory Leadership Camp 2027 idiay Buag Campgrounds, Bambang, Nueva Vizcaya. Dumteng dagiti van ken bus ti simbaan iti Mierkoles ti agsapa baetan ti 8:00 AM ken 1:00 PM. Adda dagiti ushers a mangigiya kadakayo.',
    'guide.qr.title': 'Napartak a Check-In babaen ti QR Code',
    'guide.qr.desc': 'Kalpasan ti online a panagrehistro, maawatmo ti Camper ID ken activation QR code. Ipakitanto laeng ti QR code iti arrival desk tapno maala a dagus ti camp kit ken pagiddaanmo!',
    'guide.meals.title': 'Makan, Pagdagusan ken Medikal a Tulong',
    'guide.meals.desc': 'Amin a kampero ket addaan dormitorio ken kompleto a taraon (Pamigat, Pangaldaw, Pangrabii, ken Meryenda). Adda nakasagana a volunteer medical team ken nars iti First Aid Pavilion 24/7.',

    // Jumbo Footer CTA
    'footer.badge': 'Asidegen nga Agserra ti Rehistrasion',
    'footer.titleLine1': 'Alaem ti Lugaryo iti',
    'footer.titleLine2': 'VLC 2027 Ita',
    'footer.desc': 'Kumuyog kadagiti ginasut a kampero manipud iti nasurok a 20 a simbaan para iti daytoy a nadiosan a panagsabat. Makisarita iti pastormo wenno agparehistro a kas maysa a delegado.',
    'footer.registerBtn': 'Agparehistro Ita',
    'footer.delegationsBtn': 'Kitaen dagiti Delegasion ti Simbaan',
    'footer.copyright': '© 2027 Pentecostal Christian Church Inc. • Victory Leadership Camp',
    'footer.checkIn': 'Napartak a Check-In iti Idadanon',
    'footer.schedule': 'Iskedyul',
    'footer.churches': 'Listaan ti Simbaan',

    // User Profile Right Drawer
    'drawer.accountTitle': 'Account ti Delegado',
    'drawer.myProfile': 'Ti Profile-ko',
    'drawer.myProfileDesc': 'Kitaen ti publiko a profile, badge ken posts',
    'drawer.account': 'Account ken Detalye',
    'drawer.accountDesc': 'Personal nga impormasion, delegasion ken urnos',
    'drawer.digitalPass': 'Digital a Pass',
    'drawer.digitalPassDesc': 'QR badge para iti napartak a panag-check in',
    'drawer.adminPortal': 'Portal ti Panangidaulo (Admin)',
    'drawer.adminPortalDesc': 'Urnosen dagiti rehistrasyon, idadanon ken ID prints',
    'drawer.logout': 'Ag-Sign Out',
    'drawer.close': 'Irikep',
    'drawer.statusVerified': 'Rehistrado a Delegado',
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vlc_lang') as SupportedLanguage;
      if (saved && (saved === 'en' || saved === 'tl' || saved === 'ilo')) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vlc_lang', lang);
    }
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = translations[language] || translations.en;
    if (key in langDict) {
      return (langDict as Record<string, string>)[key];
    }
    const defaultDict = translations.en;
    if (key in defaultDict) {
      return (defaultDict as Record<string, string>)[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
