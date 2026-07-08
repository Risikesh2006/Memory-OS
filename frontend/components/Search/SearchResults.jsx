'use client';

import { motion } from 'framer-motion';
import TimelineCard from '@/components/Timeline/TimelineCard';
import { Sparkles } from 'lucide-react';

export default function SearchResults({ results, suggestions, onSuggestionClick }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="w-full mt-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-medium text-white flex items-center gap-2">
          <Sparkles size={20} className="text-los-accent" />
          Found {results.length} memories
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Wrapper to add relevance indicator */}
            <div className="relative group h-full">
              {item.relevanceScore > 10 && (
                <div className="absolute -top-3 -right-3 z-10 bg-los-bg-tertiary border border-los-accent text-los-accent-light text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-lg">
                  Highly Relevant
                </div>
              )}
              <div className="h-full">
                <TimelineCard item={item} compact />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="mt-12 p-6 bg-los-card border border-los-border rounded-2xl text-center">
          <p className="text-sm text-los-text-muted mb-4">You might also want to search for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-4 py-2 rounded-full bg-los-bg-secondary border border-los-border text-sm text-los-text-secondary hover:text-white hover:border-los-accent/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
