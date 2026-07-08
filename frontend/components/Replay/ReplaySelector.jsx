'use client';

import { Play, CalendarDays, MapPin, Users, Heart } from 'lucide-react';
import Image from 'next/image';

const REPLAY_CATEGORIES = [
  {
    id: 'year',
    title: 'Your Year in Review',
    description: 'A highlight reel of your best moments from the past 12 months.',
    icon: CalendarDays,
    color: 'from-los-accent to-los-accent-dark',
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d14c4c15?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'travel',
    title: 'Adventures & Travel',
    description: 'Relive your trips, vacations, and explorations across the globe.',
    icon: MapPin,
    color: 'from-los-cyan to-blue-600',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'people',
    title: 'Friends & Family',
    description: 'Cherished moments with the people who matter most.',
    icon: Users,
    color: 'from-los-rose to-red-600',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'milestones',
    title: 'Big Achievements',
    description: 'Your career, education, and personal victories.',
    icon: Heart,
    color: 'from-los-amber to-orange-600',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'
  }
];

export default function ReplaySelector({ onSelectReplay }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Curated Replays</h2>
        <p className="text-los-text-muted text-sm">AI-generated highlight reels based on themes in your life.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPLAY_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <div 
              key={category.id}
              onClick={() => onSelectReplay(category.id)}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-60`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/20 glass-blur text-white">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                    Featured
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-los-accent-light transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-white/70 line-clamp-2 mb-4">
                  {category.description}
                </p>

                {/* Play Button (Appears on hover) */}
                <div className="flex items-center gap-2 text-white text-sm font-semibold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <Play size={14} className="fill-black ml-0.5" />
                  </div>
                  Watch Replay
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
