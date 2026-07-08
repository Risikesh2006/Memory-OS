'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Lock, Sparkles, Clock, MapPin, Edit, Trash2, Download, Share2 } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';

export default function JournalDetail({ journalId }) {
  const router = useRouter();
  const { journals, toggleFavorite, toggleVault, generateAIReflection, exportJournal } = useJournal();
  
  const journal = journals.find(j => j.id === journalId);
  const [showAIModal, setShowAIModal] = useState(false);

  if (!journal) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Journal not found</p>
      </div>
    );
  }

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

  const handleGenerateReflection = () => {
    generateAIReflection(journal.id);
    setShowAIModal(false);
  };

  const handleExport = (format) => {
    exportJournal(journal.id, format);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Spatial Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/journal')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} className="text-white/60" />
          </button>
          <h1 className="text-xl font-semibold">Journal Entry</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/journal/${journal.id}/edit`)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Edit"
          >
            <Edit size={20} className="text-white/60" />
          </button>
          <button
            onClick={() => toggleFavorite(journal.id)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Favorite"
          >
            <Heart 
              size={20} 
              className={journal.isFavorite ? 'text-red-400 fill-red-400' : 'text-white/60'} 
            />
          </button>
          <button
            onClick={() => toggleVault(journal.id)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Vault"
          >
            <Lock 
              size={20} 
              className={journal.isInVault ? 'text-white' : 'text-white/60'} 
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-24 max-w-6xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mood & Category Header */}
            <div className="flex items-center gap-4">
              <span className="text-6xl">{moodEmoji[journal.mood] || '📝'}</span>
              <div>
                <h1 className="text-4xl font-bold mb-2">{journal.title}</h1>
                <div className="flex items-center gap-3 text-white/60">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase">
                    {journal.category}
                  </span>
                  <span>{journal.date}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-white/90 whitespace-pre-line">
                {journal.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {journal.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* AI Reflection */}
            {journal.aiReflection && (
              <div className="glass-card p-6 rounded-xl border-l-4 border-l-yellow-400"
                style={{
                  backdropFilter: 'blur(40px)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={20} className="text-yellow-400" />
                  <h3 className="font-semibold">AI Reflection</h3>
                </div>
                <p className="text-white/80 italic">{journal.aiReflection}</p>
              </div>
            )}
          </div>

          {/* Right Side - Metadata */}
          <div className="space-y-6">
            {/* Metadata Panel */}
            <div className="glass-card p-6 rounded-xl space-y-6 sticky top-24"
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="font-semibold text-lg mb-4">Details</h3>

              {/* Date */}
              <div className="flex items-center gap-3 text-white/60">
                <Clock size={16} />
                <div>
                  <p className="text-xs text-white/40">Date</p>
                  <p className="text-sm">{journal.date}</p>
                </div>
              </div>

              {/* Mood */}
              <div className="flex items-center gap-3 text-white/60">
                <span className="text-2xl">{moodEmoji[journal.mood]}</span>
                <div>
                  <p className="text-xs text-white/40">Mood</p>
                  <p className="text-sm capitalize">{journal.mood}</p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3 text-white/60">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm">📁</span>
                </div>
                <div>
                  <p className="text-xs text-white/40">Category</p>
                  <p className="text-sm">{journal.category}</p>
                </div>
              </div>

              {/* Location */}
              {journal.location && (
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin size={16} />
                  <div>
                    <p className="text-xs text-white/40">Location</p>
                    <p className="text-sm">{journal.location}</p>
                  </div>
                </div>
              )}

              {/* Reading Time */}
              <div className="flex items-center gap-3 text-white/60">
                <Clock size={16} />
                <div>
                  <p className="text-xs text-white/40">Reading Time</p>
                  <p className="text-sm">{journal.readingTime} min</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3">
                <button
                  onClick={() => setShowAIModal(true)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Sparkles size={16} />
                  Generate AI Reflection
                </button>

                <button
                  onClick={() => handleExport('md')}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Download size={16} />
                  Export as Markdown
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Download size={16} />
                  Export as PDF
                </button>

                <button
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Reflection Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-3xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 rounded-2xl max-w-md w-full mx-4"
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="text-2xl font-semibold mb-4">Generate AI Reflection</h3>
              <p className="text-white/60 mb-6">
                AI will analyze this journal entry and generate a thoughtful reflection based on your emotions and experiences.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="flex-1 px-6 py-3 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReflection}
                  className="flex-1 px-6 py-3 rounded-full text-sm font-semibold bg-white text-black hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Generate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
