'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronRight, ChevronLeft, Expand, Play } from 'lucide-react';
import { aiAPI } from '@/lib/apiService';
import OnThisDayModal from './OnThisDayModal';

export default function OnThisDayWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOnThisDay = async () => {
      try {
        const response = await aiAPI.onThisDay();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch On This Day memories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOnThisDay();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!data || !data.memories || data.memories.length <= 1 || isModalOpen) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.memories.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [data, isModalOpen]);

  if (loading) {
    return <div className="h-[300px] rounded-2xl bg-los-card los-skeleton" />;
  }

  // If no memories on this day
  if (!data || !data.memories || data.memories.length === 0) {
    return (
      <div className="h-[300px] rounded-2xl bg-los-card border border-los-border flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-los-bg-tertiary flex items-center justify-center mb-4">
          <CalendarDays size={24} className="text-los-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-los-text mb-1">On This Day</h3>
        <p className="text-sm text-los-text-muted">No memories found for today in past years.</p>
        <p className="text-xs text-los-accent mt-4">Create a memory today to see it here next year!</p>
      </div>
    );
  }

  const currentMemory = data.memories[currentIndex];
  const memoryYear = new Date(currentMemory.date).getFullYear();
  const yearsAgo = new Date().getFullYear() - memoryYear;

  const next = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % data.memories.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + data.memories.length) % data.memories.length);
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative h-[300px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
      >
        {/* Background Media */}
        <div className="absolute inset-0 bg-los-bg">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentMemory.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {currentMemory.url || currentMemory.thumbnailUrl ? (
                <img 
                  src={currentMemory.url || currentMemory.thumbnailUrl} 
                  alt="Memory" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-los-accent/40 to-los-bg flex items-center justify-center p-8">
                  <p className="text-xl text-center text-white/80 font-serif italic line-clamp-4">
                    "{currentMemory.description || currentMemory.content}"
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-los-bg-primary via-los-bg-primary/50 to-transparent opacity-90" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 glass-blur-sm text-xs font-semibold text-white border border-white/10 mb-2">
                <CalendarDays size={12} /> On This Day
              </span>
              <h3 className="text-3xl font-black text-white drop-shadow-md">
                {yearsAgo} Year{yearsAgo !== 1 ? 's' : ''} Ago
              </h3>
            </div>
            
            <button className="p-2 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40 glass-blur-sm transition-all opacity-0 group-hover:opacity-100">
              <Expand size={18} />
            </button>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMemory.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-los-accent-light text-sm font-bold mb-1">
                  {memoryYear}
                </div>
                <h4 className="text-lg font-semibold text-white line-clamp-1 mb-1">
                  {currentMemory.title}
                </h4>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls & Indicators */}
            {data.memories.length > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-1.5">
                  {data.memories.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-6 bg-los-accent' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={prev}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 glass-blur-sm text-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={next}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 glass-blur-sm text-white transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <OnThisDayModal 
            data={data} 
            initialIndex={currentIndex} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
