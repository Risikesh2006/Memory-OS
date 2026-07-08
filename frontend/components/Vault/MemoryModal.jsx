'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Download, File, FileText, Image, Music, Tag, Video, X } from 'lucide-react';

export default function MemoryModal({ isOpen, onClose, memory, sourceRect = null }) {
  const getIcon = () => {
    switch (memory?.type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'text': return FileText;
      case 'audio': return Music;
      default: return File;
    }
  };

  const Icon = getIcon();

  const getInitialMotion = () => {
    if (!sourceRect || typeof window === 'undefined') {
      return { opacity: 0, scale: 0.94, y: 24 };
    }

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    return {
      opacity: 0,
      x: sourceRect.left + sourceRect.width / 2 - viewportCenterX,
      y: sourceRect.top + sourceRect.height / 2 - viewportCenterY,
      scale: Math.max(0.24, Math.min(0.92, sourceRect.width / 900)),
    };
  };

  const renderMedia = () => {
    if (!memory) {
      return null;
    }

    if (memory.type === 'image' && memory.mediaUrl) {
      return <img alt={memory.title} className="h-full w-full object-cover" src={memory.mediaUrl} />;
    }

    if (memory.type === 'video' && memory.mediaUrl) {
      return (
        <video className="h-full w-full object-cover" controls src={memory.mediaUrl} />
      );
    }

    if (memory.type === 'audio' && memory.mediaUrl) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-white/[0.03] p-8">
          <div className="rounded-full border border-white/10 bg-white/5 p-6 text-white/50">
            <Music size={52} />
          </div>
          <audio controls className="w-full" src={memory.mediaUrl} />
        </div>
      );
    }

    if (memory.type === 'text') {
      return (
        <div className="flex h-full w-full flex-col justify-between gap-6 bg-white/[0.03] p-8">
          <div className="flex items-center gap-3 text-white/55">
            <FileText size={18} />
            <span className="text-[10px] uppercase tracking-[0.3em]">Text Memory</span>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/78">
            {memory.description || 'No text content available.'}
          </p>
          <div className="flex items-center gap-2 text-white/35">
            <File size={14} />
            <span className="text-[10px] uppercase tracking-[0.24em]">Archive Note</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
        <div className="flex flex-col items-center gap-4 text-white/35">
          <Icon className="h-24 w-24 text-white/20" />
          <span className="text-[10px] uppercase tracking-[0.32em]">No preview available</span>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && memory && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-3xl"
          />

          {/* Modal */}
          <motion.div
            initial={getInitialMotion()}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={getInitialMotion()}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-8 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-5xl max-h-[90vh] overflow-hidden">
              <div
                className="glass-container liquid-glass-border rounded-[48px] border-l border-white/10 p-10 flex flex-col md:flex-row gap-8 shadow-[-40px_0_100px_rgba(0,0,0,0.8)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '0.5px solid rgba(255, 255, 255, 0.08)',
                  maxHeight: '90vh'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
                >
                  <X size={28} />
                </button>

                {/* Media Section */}
                <div className="flex-1 flex-shrink-0">
                  <div className="rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                    <div className="aspect-square max-h-[60vh] overflow-hidden">
                      {renderMedia()}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-8">
                    {/* Title & Tags */}
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        {memory.title}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {memory.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-semibold text-white/60 uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5">
                      <div>
                        <p className="text-[10px] font-semibold text-white/30 mb-2 uppercase tracking-wider">Date</p>
                        <div className="flex items-center gap-2 text-white">
                          <Calendar size={14} />
                          <p className="text-sm font-mono">
                            {new Date(memory.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-white/30 mb-2 uppercase tracking-wider">Type</p>
                        <div className="flex items-center gap-2 text-white">
                          <Icon size={14} />
                          <p className="text-sm font-mono uppercase">{memory.type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-[10px] font-semibold text-white/30 mb-3 uppercase tracking-wider">Description</p>
                      <p className="text-white/80 leading-relaxed">
                        {memory.description || 'No description provided'}
                      </p>
                    </div>

                    {/* AI Summary */}
                    {memory.aiSummary && (
                      <div>
                        <p className="text-[10px] font-semibold text-white/30 mb-3 uppercase tracking-wider">AI Synopsis</p>
                        <p className="text-white/70 leading-relaxed italic border-l-2 border-white/20 pl-6 py-2">
                          {memory.aiSummary}
                        </p>
                      </div>
                    )}

                    {memory.type === 'text' && (
                      <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5">
                        <p className="text-[10px] font-semibold text-white/30 mb-3 uppercase tracking-wider">Primary Content</p>
                        <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                          {memory.content || memory.description || 'No content available.'}
                        </p>
                      </div>
                    )}

                    {/* Download Button */}
                    <div className="pt-6">
                      <button className="w-full bg-white text-black py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.15)]">
                        <Download size={20} />
                        Download Memory
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
