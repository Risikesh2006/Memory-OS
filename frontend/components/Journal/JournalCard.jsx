'use client';

import { motion } from 'framer-motion';
import { MoreHorizontal, Heart, Lock, Sparkles, Clock } from 'lucide-react';

export default function JournalCard({ journal, onClick, onDoubleClick, onToggleFavorite, onToggleVault }) {
  const moodEmoji = {
    happy: '😊',
    grateful: '❤️',
    motivated: '🔥',
    calm: '😌',
    reflective: '🌧',
    sad: '😔',
    excited: '🎉',
    tired: '😴',
    creative: '✨',
  };

  const categoryColors = {
    Personal: 'bg-blue-500/20 text-blue-300',
    College: 'bg-purple-500/20 text-purple-300',
    Travel: 'bg-green-500/20 text-green-300',
    Career: 'bg-orange-500/20 text-orange-300',
    Family: 'bg-pink-500/20 text-pink-300',
    Achievements: 'bg-yellow-500/20 text-yellow-300',
    Relationships: 'bg-red-500/20 text-red-300',
    Health: 'bg-teal-500/20 text-teal-300',
    Custom: 'bg-gray-500/20 text-gray-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className="glass-card p-4 rounded-lg liquid-shimmer cursor-pointer group"
      style={{
        backdropFilter: 'blur(40px)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      }}
    >
      {/* Image or Placeholder */}
      <div className="relative overflow-hidden rounded mb-4 aspect-[4/5]">
        <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
          <span className="text-6xl">{moodEmoji[journal.mood] || '📝'}</span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 glass-fill backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
          {journal.category}
        </div>

        {/* Favorite & Vault Indicators */}
        <div className="absolute top-4 right-4 flex gap-2">
          {journal.isFavorite && (
            <div className="w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center">
              <Heart size={14} className="text-red-400 fill-red-400" />
            </div>
          )}
          {journal.isInVault && (
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Lock size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* AI Reflection Badge */}
        {journal.aiReflection && (
          <div className="absolute bottom-4 right-4">
            <Sparkles size={16} className="text-yellow-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60">{journal.date}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Show more options
            }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-white leading-tight">
          {journal.title}
        </h3>

        <p className="text-sm text-white/60 line-clamp-2">
          {journal.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {journal.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-[10px] text-white/50"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <Clock size={10} />
          <span>{journal.readingTime} min read</span>
        </div>
      </div>
    </motion.div>
  );
}
