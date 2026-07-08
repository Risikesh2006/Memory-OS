'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize, ArrowLeft, ArrowRight, Info } from 'lucide-react';

export default function ExhibitionView({ collection, memories, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  // Filter memories to only those in the collection
  const collectionMemories = memories.filter(m => 
    collection.memoryIds && collection.memoryIds.includes(m.id)
  );

  if (!collection || collectionMemories.length === 0) {
    return (
      <div className="fixed inset-0 z-[120] bg-los-bg flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Empty Exhibition</h2>
        <p className="text-los-text-muted mb-8">This collection has no memories assigned to it.</p>
        <button onClick={onClose} className="los-btn-primary">Return to Gallery</button>
      </div>
    );
  }

  const currentMemory = collectionMemories[currentIndex];
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % collectionMemories.length);
    setShowInfo(false); // hide info when switching
  };
  
  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + collectionMemories.length) % collectionMemories.length);
    setShowInfo(false);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-zinc-950 flex flex-col">
      {/* Subtle Wall Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")' }} />

      {/* Top Bar */}
      <div className="relative z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Exit Exhibition
          </button>
          <div className="h-4 w-px bg-white/20" />
          <h1 className="text-white font-serif italic text-lg opacity-80">{collection.name}</h1>
        </div>
        <div className="text-white/50 text-xs tracking-widest font-mono">
          {(currentIndex + 1).toString().padStart(2, '0')} / {collectionMemories.length.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Main Exhibition Area */}
      <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
        
        {/* Spotlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[800px] bg-gradient-to-b from-white/10 to-transparent blur-[40px] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0, scale: 0.95, filter: 'brightness(0.5)' }}
            animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'brightness(0.5)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-5xl w-full max-h-full flex items-center justify-center group"
          >
            {/* The Artwork/Memory */}
            <div className="relative bg-zinc-900 border-[16px] border-zinc-900 rounded shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_10px_rgba(0,0,0,0.5)]">
              {currentMemory.url || currentMemory.thumbnailUrl ? (
                <img 
                  src={currentMemory.url || currentMemory.thumbnailUrl} 
                  alt={currentMemory.title}
                  className="max-h-[70vh] object-contain block"
                />
              ) : (
                <div className="w-[600px] h-[400px] max-w-full bg-zinc-800 flex items-center justify-center p-12 text-center">
                  <p className="text-2xl font-serif italic text-white/80">"{currentMemory.content}"</p>
                </div>
              )}

              {/* Plaque (Hidden until requested or hovered) */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -right-80 bottom-0 w-64 bg-zinc-100 p-6 shadow-2xl border-l-4 border-los-accent text-zinc-900 hidden lg:block"
                  >
                    <h3 className="font-serif font-bold text-xl mb-1">{currentMemory.title}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                      {new Date(currentMemory.date).getFullYear()}
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-700">
                      {currentMemory.description || currentMemory.content || 'Untitled piece from the collection.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 flex justify-between items-center p-8">
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`p-3 rounded-full transition-colors ${showInfo ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
        >
          <Info size={20} />
        </button>

        <div className="flex gap-4">
          <button 
            onClick={handlePrev}
            className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={handleNext}
            className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile Info Overlay (shows when info is active on small screens) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="lg:hidden absolute bottom-24 inset-x-4 bg-zinc-100 p-6 rounded-t-xl z-30"
          >
             <h3 className="font-serif font-bold text-xl mb-1 text-black">{currentMemory.title}</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                {new Date(currentMemory.date).getFullYear()}
              </p>
              <p className="text-sm leading-relaxed text-zinc-700">
                {currentMemory.description || currentMemory.content || 'Untitled piece from the collection.'}
              </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
