'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2, Calendar } from 'lucide-react';
import TimelineCard from '@/components/Timeline/TimelineCard';

export default function OnThisDayModal({ data, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  if (!data || !data.memories) return null;

  const currentMemory = data.memories[currentIndex];
  const memoryYear = new Date(currentMemory.date).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - memoryYear;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.memories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + data.memories.length) % data.memories.length);
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${monthNames[data.date.month - 1]} ${data.date.day}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 glass-blur-lg"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-[85vh] flex flex-col md:flex-row bg-los-bg-secondary rounded-2xl overflow-hidden border border-los-border shadow-2xl z-10">
        
        {/* Left Side: Visuals */}
        <div className="w-full md:w-2/3 h-1/2 md:h-full relative bg-los-bg border-r border-los-border group">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            {currentMemory.url ? (
              <img 
                src={currentMemory.url} 
                alt="Memory" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : currentMemory.thumbnailUrl ? (
              <img 
                src={currentMemory.thumbnailUrl} 
                alt="Video Memory" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full h-full max-w-lg bg-los-card border border-los-border rounded-2xl p-10 flex items-center justify-center text-center shadow-2xl">
                <p className="text-xl md:text-2xl font-serif italic text-white/90">
                  "{currentMemory.content || currentMemory.description}"
                </p>
              </div>
            )}
          </motion.div>

          {/* Navigation Controls */}
          {data.memories.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-los-accent glass-blur transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-los-accent glass-blur transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Date Badge */}
          <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/50 glass-blur border border-white/10 text-white flex items-center gap-2">
            <Calendar size={16} className="text-los-accent-light" />
            <span className="font-semibold">{dateStr}, {memoryYear}</span>
            <span className="text-white/50 text-xs ml-1">({yearsAgo} year{yearsAgo !== 1 ? 's' : ''} ago)</span>
          </div>
        </div>

        {/* Right Side: Info & Context */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col bg-los-bg-tertiary">
          <div className="flex justify-end p-4 border-b border-los-border">
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-los-bg hover:bg-los-border text-los-text-secondary hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentMemory.title}</h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded border border-los-border bg-los-bg text-[10px] uppercase tracking-wider font-semibold text-los-text-secondary">
                  {currentMemory.memoryType}
                </span>
                {currentMemory.category && (
                  <span className="px-2 py-1 rounded border border-los-border bg-los-bg text-[10px] uppercase tracking-wider font-semibold text-los-text-secondary">
                    {currentMemory.category}
                  </span>
                )}
              </div>
            </div>

            {(currentMemory.description || currentMemory.content) && (
              <div>
                <h4 className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-2">Memory Details</h4>
                <p className="text-los-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {currentMemory.description || currentMemory.content}
                </p>
              </div>
            )}

            {/* Other years context */}
            {data.totalYears > 1 && (
              <div>
                <h4 className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-4">Other Years on this Day</h4>
                <div className="space-y-3">
                  {Object.entries(data.byYear)
                    .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
                    .filter(([year]) => parseInt(year) !== memoryYear)
                    .map(([year, memories]) => (
                      <div key={year} className="flex gap-3">
                        <div className="w-12 text-right">
                          <span className="font-bold text-los-accent-light">{year}</span>
                        </div>
                        <div className="flex-1 pl-3 border-l-2 border-los-border space-y-2">
                          {memories.map(m => (
                            <button 
                              key={m.id}
                              onClick={() => {
                                const newIndex = data.memories.findIndex(mem => mem.id === m.id);
                                if (newIndex !== -1) setCurrentIndex(newIndex);
                              }}
                              className="text-left text-sm text-los-text hover:text-los-cyan transition-colors line-clamp-1 block w-full"
                            >
                              {m.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-los-border bg-los-bg/50">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-los-bg border border-los-border text-white hover:bg-los-border-hover transition-colors font-medium">
              <Share2 size={18} /> Share this memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
