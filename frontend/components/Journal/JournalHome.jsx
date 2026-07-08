'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Heart, Lock, Filter } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';
import JournalCard from './JournalCard';

export default function JournalHome() {
  const router = useRouter();
  const { journals, filters, setFilters, filterJournals, toggleFavorite, toggleVault } = useJournal();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filteredJournals = filterJournals();

  const handleCardClick = (journal) => {
    router.push(`/dashboard/journal/${journal.id}`);
  };

  const handleNewJournal = () => {
    router.push('/dashboard/journal/new');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Spatial Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-10">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">My Digital Journal</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Capturing the ephemera of daily life in a timeless archive.
          </p>
        </section>

        {/* View Controls & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* View Switcher */}
          <div className="glass-fill backdrop-blur-[40px] border border-white/10 p-1 rounded-full flex gap-1">
            <button className="px-6 py-2 rounded-full text-sm font-semibold bg-white text-black transition-all">
              Cards View
            </button>
            <button className="px-6 py-2 rounded-full text-sm font-semibold text-white/60 hover:bg-white/10 transition-all">
              Timeline View
            </button>
            <button className="px-6 py-2 rounded-full text-sm font-semibold text-white/60 hover:bg-white/10 transition-all">
              Book View
            </button>
            <button className="px-6 py-2 rounded-full text-sm font-semibold text-white/60 hover:bg-white/10 transition-all">
              Mood View
            </button>
          </div>

          {/* Mood Filters */}
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setFilters({ ...filters, mood: filters.mood === 'happy' ? null : 'happy' })}
              className={`glass-card px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                filters.mood === 'happy' ? 'border-yellow-400' : 'border-white/10'
              }`}
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Happy
            </button>
            <button
              onClick={() => setFilters({ ...filters, mood: filters.mood === 'reflective' ? null : 'reflective' })}
              className={`glass-card px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                filters.mood === 'reflective' ? 'border-purple-400' : 'border-white/10'
              }`}
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Reflective
            </button>
            <button
              onClick={() => setFilters({ ...filters, mood: filters.mood === 'motivated' ? null : 'motivated' })}
              className={`glass-card px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                filters.mood === 'motivated' ? 'border-orange-400' : 'border-white/10'
              }`}
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-orange-400"></span> Motivated
            </button>
            <button
              onClick={() => setFilters({ ...filters, mood: filters.mood === 'calm' ? null : 'calm' })}
              className={`glass-card px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                filters.mood === 'calm' ? 'border-blue-400' : 'border-white/10'
              }`}
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Peaceful
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search entries..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-full text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-all"
              style={{ backdropFilter: 'blur(40px)' }}
            />
          </div>
        </div>

        {/* Journal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {filteredJournals.map((journal, index) => {
            // Determine grid span based on index for masonry-like layout
            let colSpan = 'md:col-span-3';
            let rowSpan = '';
            let marginTop = '';

            if (index === 0) {
              colSpan = 'md:col-span-4';
            } else if (index === 1) {
              colSpan = 'md:col-span-3';
              marginTop = 'mt-12 md:mt-0';
            } else if (index === 2) {
              colSpan = 'md:col-span-5';
              rowSpan = 'md:row-span-2';
            } else if (index === 3) {
              colSpan = 'md:col-span-3';
            } else if (index === 4) {
              colSpan = 'md:col-span-4';
              rowSpan = 'h-full';
            }

            return (
              <div key={journal.id} className={`${colSpan} ${rowSpan} ${marginTop} group`}>
                <JournalCard
                  journal={journal}
                  onClick={() => handleCardClick(journal)}
                  onDoubleClick={() => handleCardClick(journal)}
                />
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredJournals.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No journals found</p>
            <button
              onClick={handleNewJournal}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
            >
              Create Your First Journal
            </button>
          </div>
        )}

        {/* Empty Spacer for FAB */}
        <div className="h-24"></div>
      </main>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={handleNewJournal}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 z-50 group"
      >
        <Plus size={32} className="font-bold group-hover:rotate-90 transition-transform duration-500" />
        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-20 pointer-events-none"></div>
      </motion.button>
    </div>
  );
}
