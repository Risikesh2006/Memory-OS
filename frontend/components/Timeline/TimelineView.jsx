'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutList, LayoutGrid, CalendarDays, Filter as FilterIcon, Search } from 'lucide-react';
import VerticalTimeline from './VerticalTimeline';
import HorizontalTimeline from './HorizontalTimeline';
import TimelineFilters from './TimelineFilters';

export default function TimelineView({ timelineData, loading }) {
  const [viewMode, setViewMode] = useState('vertical'); // 'vertical' or 'horizontal'
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    types: ['photo', 'video', 'journal', 'milestone'],
    categories: [],
  });

  // Apply filters
  const filteredTimeline = (Array.isArray(timelineData) ? timelineData : []).filter((item) => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = item.title?.toLowerCase().includes(query);
      const matchesDesc = item.description?.toLowerCase().includes(query);
      const matchesContent = item.content?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesContent) return false;
    }

    // Type filter
    if (!filters.types.includes(item.type || item.memoryType)) return false;

    // Category filter for milestones
    if (filters.categories.length > 0 && (item.type === 'milestone' || item.memoryType === 'milestone')) {
      if (!filters.categories.includes(item.category)) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-los-accent border-t-transparent animate-spin"></div>
          <p className="text-los-text-muted animate-pulse">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Timeline Controls Header */}
      <div className="sticky top-20 z-30 mb-8 pt-4 pb-4 bg-los-bg/80 glass-blur-sm border-b border-los-border">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-los-card p-1 rounded-full border border-los-border">
            <button
              onClick={() => setViewMode('vertical')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'vertical' ? 'bg-los-accent text-white shadow-lg shadow-los-accent/20' : 'text-los-text-secondary hover:text-white'
              }`}
            >
              <LayoutList size={16} /> Vertical
            </button>
            <button
              onClick={() => setViewMode('horizontal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'horizontal' ? 'bg-los-accent text-white shadow-lg shadow-los-accent/20' : 'text-los-text-secondary hover:text-white'
              }`}
            >
              <LayoutGrid size={16} /> Horizontal
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-los-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search timeline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-los-card border border-los-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-los-accent/50 transition-colors"
              />
            </div>
            
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
                filterOpen || filters.types.length < 4 || filters.categories.length > 0
                  ? 'bg-los-accent/10 border-los-accent text-los-accent-light'
                  : 'bg-los-card border-los-border text-los-text-secondary hover:text-white'
              }`}
            >
              <FilterIcon size={18} />
              {(filters.types.length < 4 || filters.categories.length > 0) && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-los-rose rounded-full border-2 border-los-bg"></span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <TimelineFilters filters={filters} setFilters={setFilters} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Timeline View */}
      <div className="flex-1 w-full min-h-[500px]">
        {filteredTimeline.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center border border-los-border border-dashed rounded-2xl bg-los-card/30">
            <CalendarDays size={48} className="text-los-text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No memories found</h3>
            <p className="text-sm text-los-text-muted mt-1 text-center max-w-sm">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {viewMode === 'vertical' ? (
                <VerticalTimeline items={filteredTimeline} />
              ) : (
                <HorizontalTimeline items={filteredTimeline} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
