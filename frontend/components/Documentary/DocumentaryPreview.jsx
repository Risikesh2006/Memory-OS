'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Maximize, Download, RefreshCw, Film } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentaryPreview({ narrative, memories }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [showUI, setShowUI] = useState(true);
  
  // Flatten memories per chapter to create a single timeline
  const timeline = [];
  narrative.chapters.forEach((chapter, cIndex) => {
    chapter.memories.forEach((memoryId, mIndex) => {
      const memory = memories.find(m => m.id === memoryId);
      if (memory) {
        timeline.push({
          chapterIndex: cIndex,
          chapterTitle: chapter.title,
          chapterNarrative: mIndex === 0 ? chapter.narrative : null, // Show narrative only on first memory of chapter
          memory,
        });
      }
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Auto-hide UI when playing
  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowUI(false), 3000);
    } else {
      setShowUI(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, currentIndex]);

  // Handle playing progression
  useEffect(() => {
    if (!isPlaying) return;
    
    // Each slide shows for 5 seconds
    const interval = setInterval(() => {
      if (currentIndex < timeline.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setShowUI(true);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, timeline.length]);

  if (!narrative || timeline.length === 0) return null;

  const currentSlide = timeline[currentIndex];
  const progress = ((currentIndex + 1) / timeline.length) * 100;

  const handleNext = () => {
    if (currentIndex < timeline.length - 1) setCurrentIndex(prev => prev + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };
  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        toast.error('Error attempting to enable fullscreen');
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleExport = () => {
    toast.success('Documentary generation started! This may take a few minutes.', {
      icon: '🎬'
    });
    // In a real implementation, this would trigger a backend rendering job (e.g., using FFmpeg)
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-black rounded-2xl overflow-hidden shadow-2xl group"
      onMouseMove={() => setShowUI(true)}
    >
      {/* Background/Slide Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Ken Burns Effect Image */}
          <motion.img 
            src={currentSlide.memory.url || currentSlide.memory.thumbnailUrl} 
            alt="Memory"
            className="w-full h-full object-cover opacity-60"
            animate={{ scale: [1, 1.1], x: [0, 10], y: [0, -10] }}
            transition={{ duration: 10, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Narrative Overlay */}
      <AnimatePresence>
        {currentSlide.chapterNarrative && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none"
          >
            <h2 className="text-2xl md:text-4xl font-serif italic text-white/90 drop-shadow-lg mb-6 max-w-4xl">
              "{currentSlide.chapterNarrative}"
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Info (Bottom Left) */}
      <div className={`absolute bottom-20 left-8 right-8 flex items-end justify-between transition-opacity duration-500 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
        <div>
          <span className="text-los-accent font-bold tracking-widest uppercase text-xs mb-2 block drop-shadow-md">
            {currentSlide.chapterTitle}
          </span>
          <h3 className="text-white text-2xl font-bold drop-shadow-lg line-clamp-1">
            {currentSlide.memory.title}
          </h3>
          <p className="text-white/70 text-sm drop-shadow-md mt-1">
            {new Date(currentSlide.memory.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* UI Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-500 ${showUI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/50 glass-blur flex items-center justify-center text-white">
              <Film size={20} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">{narrative.title}</h1>
              <p className="text-white/60 text-xs">{narrative.subtitle}</p>
            </div>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-los-accent text-white text-sm font-medium hover:bg-los-accent-light transition-colors shadow-lg"
          >
            <Download size={16} /> Export MP4
          </button>
        </div>

        {/* Playback Controls */}
        <div className="absolute bottom-0 inset-x-0 p-6">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/20 rounded-full mb-6 cursor-pointer overflow-hidden relative group">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-los-accent"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>

          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={handlePrev}
              className="text-white hover:text-los-accent transition-colors disabled:opacity-50"
              disabled={currentIndex === 0}
            >
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={28} className="fill-black" /> : <Play size={28} className="fill-black ml-1" />}
            </button>
            
            <button 
              onClick={handleNext}
              className="text-white hover:text-los-accent transition-colors disabled:opacity-50"
              disabled={currentIndex === timeline.length - 1}
            >
              <SkipForward size={24} />
            </button>

            <button 
              onClick={toggleFullscreen}
              className="absolute right-6 text-white/70 hover:text-white transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
