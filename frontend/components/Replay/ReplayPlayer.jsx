'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX, Maximize } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReplayPlayer({ memories, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  const SLIDE_DURATION = 5000; // 5 seconds per slide

  useEffect(() => {
    let timer;
    if (isPlaying) {
      // Progress bar animation
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / SLIDE_DURATION) * 100;
        
        if (newProgress >= 100) {
          handleNext();
        } else {
          setProgress(newProgress);
        }
      }, 16); // ~60fps
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex]);

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 2500);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
      setShowControls(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        toast.error('Fullscreen not supported');
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!memories || memories.length === 0) return null;

  const currentMemory = memories[currentIndex];
  const dateStr = new Date(currentMemory.date).toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  });

  return (
    <div className="fixed inset-0 z-[120] bg-black flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-full h-full max-w-[500px] md:max-w-none md:aspect-video md:h-auto bg-black flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onClick={() => {
          if (window.innerWidth < 768) {
            // On mobile, tap to play/pause
            setIsPlaying(!isPlaying);
            setShowControls(true);
          }
        }}
      >
        {/* Progress Bars (Story style) */}
        <div className="absolute top-0 inset-x-0 z-50 p-4 flex gap-1 bg-gradient-to-b from-black/80 to-transparent pt-safe">
          {memories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ 
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                }}
                transition={{ duration: 0 }}
              />
            </div>
          ))}
        </div>

        {/* Media Layer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* Blurred background for padding */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
              style={{ backgroundImage: `url(${currentMemory.url || currentMemory.thumbnailUrl})` }}
            />
            
            {currentMemory.url || currentMemory.thumbnailUrl ? (
              <img 
                src={currentMemory.url || currentMemory.thumbnailUrl} 
                alt={currentMemory.title}
                className="relative z-10 w-full h-full object-contain"
              />
            ) : (
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-los-bg to-los-bg-tertiary">
                <p className="text-2xl md:text-4xl font-serif italic text-white/90 max-w-2xl">
                  "{currentMemory.description || currentMemory.content}"
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 z-40 transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Top Actions */}
          <div className="absolute top-12 right-4 flex items-center gap-4 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-white/20 glass-blur transition-all"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-white/20 glass-blur transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Info Overlay (Bottom) */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-12 pb-safe pointer-events-auto">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 rounded border border-white/20 bg-white/10 glass-blur text-xs font-semibold text-white uppercase tracking-widest mb-3">
                {dateStr}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
                {currentMemory.title}
              </h2>
              {currentMemory.category && (
                <p className="text-white/70 text-sm md:text-base line-clamp-2 drop-shadow">
                  {currentMemory.category}
                </p>
              )}
            </div>

            {/* Playback Controls (Desktop) */}
            <div className="hidden md:flex items-center justify-center gap-6 mt-8">
              <button 
                onClick={handlePrev} disabled={currentIndex === 0}
                className="p-3 text-white hover:text-los-accent transition-colors disabled:opacity-30"
              >
                <SkipBack size={24} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={32} className="fill-black" /> : <Play size={32} className="fill-black ml-1" />}
              </button>
              <button 
                onClick={handleNext} disabled={currentIndex === memories.length - 1}
                className="p-3 text-white hover:text-los-accent transition-colors disabled:opacity-30"
              >
                <SkipForward size={24} />
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="absolute right-12 text-white/50 hover:text-white transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Tap zones for mobile navigation */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-30 md:hidden" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-30 md:hidden" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
      </div>
    </div>
  );
}
