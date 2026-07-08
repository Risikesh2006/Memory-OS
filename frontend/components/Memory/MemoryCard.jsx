'use client';

import { motion } from 'framer-motion';
import { Star, Image as ImageIcon, FileText, Calendar, Sparkles } from 'lucide-react';
import { useMemory } from '@/context/MemoryContext';

export default function MemoryCard({ memory, onClick }) {
  const { toggleFavorite } = useMemory();

  const getAspectRatio = () => {
    if (memory.type === 'image') return 'aspect-[4/5]';
    if (memory.type === 'event') return 'aspect-video';
    if (memory.type === 'note') return 'aspect-square';
    return 'aspect-[3/4]';
  };

  const getMoodColor = () => {
    const moodColors = {
      nostalgic: 'bg-white/40',
      accomplished: 'bg-white/30',
      contemplative: 'bg-white/35',
      philosophical: 'bg-white/25',
      adventurous: 'bg-white/45',
    };
    return moodColors[memory.mood] || 'bg-white/30';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="masonry-item glass-panel neumorphic-lift rounded-lg overflow-hidden group cursor-pointer"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'rgba(0, 0, 0, 0.4) 12px 12px 24px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      {/* Image or Icon */}
      <div className={`${getAspectRatio()} relative overflow-hidden`}>
        {memory.image ? (
          <img
            className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
            src={memory.image}
            alt={memory.title}
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            {memory.type === 'note' && <FileText size={48} className="text-white/20" />}
            {memory.type === 'event' && <Sparkles size={48} className="text-white/20" />}
            {memory.type === 'image' && <ImageIcon size={48} className="text-white/20" />}
          </div>
        )}
        
        {/* Mood Badge */}
        {memory.mood && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getMoodColor()} animate-pulse`}></span>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {memory.mood}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{memory.title}</h3>
          <span className="text-xs text-white/60">{formatDate(memory.createdAt)}</span>
        </div>

        {/* Milestone Badge */}
        {memory.type === 'event' && (
          <div className="mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 inline-block">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white">Milestone</span>
          </div>
        )}

        {/* AI Summary */}
        <p className="text-white/60 text-sm mb-4 leading-relaxed line-clamp-2">
          {memory.aiSummary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {memory.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-[10px] px-2 py-1 rounded border border-white/10 text-white/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(memory.id);
          }}
          className={`p-2 rounded-full transition-colors ${
            memory.favorite ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Star size={18} className={memory.favorite ? 'fill-white' : ''} />
        </button>
      </div>
    </motion.div>
  );
}
