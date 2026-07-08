'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, BookOpen, Trophy, MoreHorizontal, Calendar, Play } from 'lucide-react';

export default function TimelineCard({ item, align = 'left', compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const type = item.type || item.memoryType;
  
  const dateObj = new Date(item.date || item.createdAt);
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getIcon = () => {
    switch(type) {
      case 'photo': return <ImageIcon size={compact ? 16 : 20} className="text-los-cyan" />;
      case 'video': return <Video size={compact ? 16 : 20} className="text-los-rose" />;
      case 'journal': return <BookOpen size={compact ? 16 : 20} className="text-los-accent-light" />;
      case 'milestone': return <Trophy size={compact ? 16 : 20} className="text-los-amber" />;
      default: return <Calendar size={compact ? 16 : 20} className="text-los-text-muted" />;
    }
  };

  const getBadgeColor = () => {
    switch(type) {
      case 'photo': return 'bg-los-cyan/10 text-los-cyan border-los-cyan/20';
      case 'video': return 'bg-los-rose/10 text-los-rose border-los-rose/20';
      case 'journal': return 'bg-los-accent/10 text-los-accent-light border-los-accent/20';
      case 'milestone': return 'bg-los-amber/10 text-los-amber border-los-amber/20';
      default: return 'bg-los-bg-tertiary text-los-text-muted border-los-border';
    }
  };

  // Strip HTML tags from journal content for preview
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const previewText = item.description || stripHtml(item.content) || '';
  const hasMoreText = previewText.length > 100;

  return (
    <motion.div 
      layout
      onClick={() => setExpanded(!expanded)}
      className={`los-card p-0 overflow-hidden cursor-pointer group ${compact ? 'text-sm' : ''}`}
    >
      {/* Header */}
      <div className={`p-4 border-b border-los-border/50 bg-los-bg-tertiary/50 flex items-center justify-between ${
        align === 'right' && !compact ? 'flex-row-reverse' : ''
      }`}>
        <div className={`flex items-center gap-3 ${align === 'right' && !compact ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 rounded-lg bg-los-bg shadow-sm">
            {getIcon()}
          </div>
          <div className={`flex flex-col ${align === 'right' && !compact ? 'items-end' : ''}`}>
            <h3 className="font-semibold text-los-text line-clamp-1">{item.title}</h3>
            <span className="text-xs text-los-text-muted flex items-center gap-1">
              <Calendar size={12} /> {dateFormatted}
            </span>
          </div>
        </div>
        
        <button className="text-los-text-muted hover:text-los-text p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Media Preview (Photos/Videos) */}
      {(item.url || item.thumbnailUrl) && (
        <div className={`relative w-full ${compact ? 'h-32' : 'h-48'} bg-los-bg overflow-hidden`}>
          {item.url && type === 'photo' ? (
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
              {item.thumbnailUrl && (
                <img src={item.thumbnailUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
              )}
              <div className="w-12 h-12 rounded-full bg-white/20 glass-blur flex items-center justify-center z-10 text-white group-hover:scale-110 transition-transform">
                <Play size={20} className="ml-1" fill="currentColor" />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Content Preview */}
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getBadgeColor()}`}>
            {type}
          </span>
          {item.category && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-los-border bg-los-bg text-los-text-secondary">
              {item.category}
            </span>
          )}
        </div>
        
        {previewText && (
          <motion.div layout>
            <p className={`text-los-text-secondary ${compact ? 'text-xs' : 'text-sm'} ${!expanded ? 'line-clamp-3' : ''}`}>
              {previewText}
            </p>
            {!expanded && hasMoreText && (
              <span className="text-los-accent text-xs font-medium mt-1 block">Read more</span>
            )}
          </motion.div>
        )}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 border-t border-los-border/50 bg-los-bg/30 pt-3"
          >
            <div className="flex items-center gap-3 justify-end">
              <button className="los-btn-ghost text-xs py-1 px-3 h-auto">Edit</button>
              <button className="los-btn-secondary text-xs py-1 px-3 h-auto">View Full</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
