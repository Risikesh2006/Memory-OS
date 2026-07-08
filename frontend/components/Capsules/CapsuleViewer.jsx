'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Unlock, Calendar, Clock, Share2 } from 'lucide-react';
import ReactConfetti from 'react-confetti';

export default function CapsuleViewer({ capsule, onClose }) {
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const createdDate = new Date(capsule.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  
  const unlockedDate = new Date(capsule.unlockDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} colors={['#7c3aed', '#06b6d4', '#f59e0b', '#f43f5e']} />}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 glass-blur-lg"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-los-bg rounded-3xl border border-los-accent/30 shadow-[0_0_100px_rgba(124,58,237,0.2)] no-scrollbar"
      >
        {/* Header Ribbon */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-los-bg/80 glass-blur border-b border-los-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-los-accent/20 text-los-accent-light">
              <Unlock size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-los-accent tracking-wider uppercase">Time Capsule Unlocked</span>
              <p className="text-sm text-los-text-muted">Sealed on {createdDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-los-bg-secondary text-los-text-secondary hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
            <button onClick={onClose} className="p-2 rounded-full bg-los-bg-secondary text-los-text-secondary hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{capsule.title}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-los-bg-secondary border border-los-border text-sm text-los-text-secondary">
              <Calendar size={16} /> Opened {unlockedDate}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {capsule.type === 'text' && (
              <div className="prose prose-invert prose-lg max-w-none font-serif text-los-text-secondary leading-relaxed p-8 rounded-2xl bg-los-bg-secondary border border-los-border relative">
                <div className="absolute top-0 left-8 w-12 h-1 bg-los-accent rounded-b-lg" />
                {capsule.content}
              </div>
            )}

            {capsule.type === 'image' && (
              <div className="space-y-8">
                <div className="rounded-2xl overflow-hidden border border-los-border shadow-2xl">
                  <img src={capsule.mediaUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200'} alt="Capsule Content" className="w-full h-auto object-cover" />
                </div>
                {capsule.content && (
                  <p className="text-lg text-los-text-secondary text-center italic">"{capsule.content}"</p>
                )}
              </div>
            )}
            
            {(capsule.type === 'video' || capsule.type === 'audio') && (
              <div className="p-8 rounded-2xl bg-los-bg-secondary border border-los-border text-center">
                <p className="text-los-text-muted mb-4">Media player would render here</p>
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center border border-los-border">
                  <span className="text-los-accent text-lg">Media Component Placeholder</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
