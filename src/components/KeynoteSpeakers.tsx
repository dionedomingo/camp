import { useState, type FC } from 'react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  topic: string;
  category: 'Keynote' | 'Leadership' | 'Worship' | 'Missions' | 'Discipleship';
  photoUrl: string;
  bio: string;
  timeSlot: string;
}

const SPEAKERS_DATA: Speaker[] = [
  {
    id: 'speaker-1',
    name: 'Rev. David Santos',
    title: 'General Overseer & Presiding Minister',
    affiliation: 'Pentecostal Christian Church Inc.',
    topic: 'Arise & Shine: Apostolic Mandate for 2027',
    category: 'Keynote',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Pioneering church planter and spiritual father overseeing over 50 congregations across Northern Luzon and beyond.',
    timeSlot: 'Opening Night • July 15, 7:00 PM',
  },
  {
    id: 'speaker-2',
    name: 'Pastor Joshua Lee',
    title: 'National NextGen & Youth Director',
    affiliation: 'PCCI Youth Alliance',
    topic: 'Unshakable Faith in a Shifting Culture',
    category: 'Leadership',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Passionate communicator dedicated to equipping student leaders, campus ministers, and young visionaries.',
    timeSlot: 'Morning Plenary • July 16, 9:00 AM',
  },
  {
    id: 'speaker-3',
    name: 'Dr. Abigail Cruz',
    title: 'Director of Compassion & Medical Missions',
    affiliation: 'Global Harvest Missions',
    topic: 'Holistic Service: Faith in Action & Healing',
    category: 'Missions',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Physician and missionary leading medical caravans and community empowerment initiatives across the archipelago.',
    timeSlot: 'Afternoon Workshop • July 16, 2:30 PM',
  },
  {
    id: 'speaker-4',
    name: 'Pastor Caleb Ramos',
    title: 'Northern Luzon Regional Coordinator',
    affiliation: 'Jesus Is Alive Center - Bambang',
    topic: 'The Altar of Revival: Awakening a Generation',
    category: 'Keynote',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Local host and revivalist who has championed inter-church youth prayer gatherings and camp movements for over 15 years.',
    timeSlot: 'Evening Rally • July 17, 7:00 PM',
  },
  {
    id: 'speaker-5',
    name: 'Elijah Marcus Tan',
    title: 'Worship Pastor & Creative Director',
    affiliation: 'PCCI Sound & Worship Collective',
    topic: 'The Sound of Prophetic Praise & Holy Fire',
    category: 'Worship',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Songwriter and worship leader igniting youth culture through transformative, presence-centered worship encounters.',
    timeSlot: 'Worship Masterclass • July 17, 10:30 AM',
  },
  {
    id: 'speaker-6',
    name: 'Hannah Joy Mendoza',
    title: 'Marketplace Missionary & Campus Evangelist',
    affiliation: 'Campus Ignite Philippines',
    topic: 'Bold Witness: Carrying the Light into School & Career',
    category: 'Discipleship',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=600&q=80',
    bio: 'Tech entrepreneur and campus evangelist inspiring thousands of university students to stand firm in faith.',
    timeSlot: 'Commissioning Service • July 18, 9:00 AM',
  },
];

const CATEGORIES = ['All', 'Keynote', 'Leadership', 'Worship', 'Missions', 'Discipleship'] as const;

export const KeynoteSpeakers: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSpeakers = selectedCategory === 'All'
    ? SPEAKERS_DATA
    : SPEAKERS_DATA.filter((s) => s.category === selectedCategory);

  return (
    <section id="speakers" className="space-y-8 scroll-mt-24">
      {/* Section Header - Google I/O Minimalist Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e1e3e1] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#0b57d0]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b57d0]">
              Program &amp; Speakers
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#1f1f1f] tracking-tight">
            Keynote Speakers &amp; Leaders
          </h2>
          <p className="text-sm text-[#5e5e5e] max-w-xl mt-2 leading-relaxed">
            Gathering under the open sky to hear inspiring words of faith, leadership, and divine calling from servant leaders across Northern Luzon.
          </p>
        </div>

        {/* Minimalist Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`tap-pill px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1f1f1f] text-white shadow-xs'
                  : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#444746]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Google I/O-Inspired Speaker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpeakers.map((speaker) => (
          <div
            key={speaker.id}
            className="group bg-white rounded-3xl p-6 border border-[#e1e3e1] hover:border-[#0b57d0]/40 transition-all duration-300 shadow-[0_1px_3px_rgba(60,64,67,0.06)] hover:shadow-[0_8px_24px_rgba(60,64,67,0.12)] flex flex-col justify-between"
          >
            <div>
              {/* Speaker Header with Portrait & Category Chip */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="relative">
                  <img
                    src={speaker.photoUrl}
                    alt={speaker.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#e1e3e1] group-hover:ring-[#0b57d0] transition-all duration-300 shadow-xs"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-[#e8f0fe] text-[#0b57d0]">
                  {speaker.category}
                </span>
              </div>

              {/* Speaker Info */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1f1f1f] group-hover:text-[#0b57d0] transition-colors">
                  {speaker.name}
                </h3>
                <p className="text-xs font-medium text-[#444746] leading-snug">
                  {speaker.title}
                </p>
                <p className="text-[11px] text-[#747775]">
                  {speaker.affiliation}
                </p>
              </div>

              {/* Keynote Session Topic (Styled clean like Google I/O talk cards) */}
              <div className="mt-4 pt-4 border-t border-[#f1f3f4] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#747775] block">
                  Keynote Session
                </span>
                <p className="text-sm font-semibold text-[#1f1f1f] leading-snug">
                  &ldquo;{speaker.topic}&rdquo;
                </p>
                <p className="text-xs text-[#5e5e5e] line-clamp-2 leading-relaxed pt-1">
                  {speaker.bio}
                </p>
              </div>
            </div>

            {/* Time Slot / Venue Footer */}
            <div className="mt-5 pt-3 border-t border-[#f1f3f4] flex items-center justify-between text-[11px] text-[#747775]">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#0b57d0]" />
                {speaker.timeSlot}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#747775]" />
                Main Pavillion
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
