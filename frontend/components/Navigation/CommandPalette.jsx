'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Clock, Archive, Map, MessageSquare, Book, Home } from 'lucide-react';
import { useApp } from '@/components/Providers';

const actions = [
  { id: 'home', title: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'timeline', title: 'Interactive Timeline', icon: Clock, href: '/dashboard/timeline' },
  { id: 'capsules', title: 'Time Capsules', icon: Archive, href: '/dashboard/capsules' },
  { id: 'search', title: 'AI Memory Search', icon: Search, href: '/dashboard/search' },
  { id: 'museum', title: 'Digital Museum Mode', icon: Map, href: '/dashboard/museum' },
  { id: 'chat', title: 'AI Chat Assistant', icon: MessageSquare, href: '/dashboard/chat' },
  { id: 'book', title: 'Legacy Book Generator', icon: Book, href: '/dashboard/book' },
];

export default function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  const filteredActions = query === ''
    ? actions
    : actions.filter((action) =>
        action.title.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter' && filteredActions.length > 0) {
      e.preventDefault();
      handleSelect(filteredActions[selectedIndex]);
    }
  };

  const handleSelect = (action) => {
    setCommandPaletteOpen(false);
    router.push(action.href);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-los-bg/80 glass-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-los-bg-tertiary border border-los-border shadow-2xl shadow-los-accent/10"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-los-border">
              <Search size={20} className="text-los-text-muted mr-3" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-los-text text-lg placeholder:text-los-text-muted"
                placeholder="Search memories, features, or jump to..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-los-bg border border-los-border text-xs text-los-text-muted font-mono">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="px-4 py-8 text-center text-los-text-muted">
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-2">Try searching for memories in the <Link href="/dashboard/search" onClick={() => setCommandPaletteOpen(false)} className="text-los-accent-light hover:underline">AI Search</Link> tab.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-los-text-muted uppercase tracking-wider">
                    Features
                  </div>
                  {filteredActions.map((action, index) => {
                    const isSelected = index === selectedIndex;
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleSelect(action)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors ${
                          isSelected ? 'bg-los-accent/15 text-white' : 'text-los-text-secondary hover:bg-los-bg-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-los-accent/20 text-los-accent-light' : 'bg-los-bg border border-los-border'}`}>
                            <Icon size={16} />
                          </div>
                          <span className="font-medium">{action.title}</span>
                        </div>
                        {isSelected && (
                          <ArrowRight size={16} className="text-los-accent-light" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-los-border bg-los-bg/50 flex items-center justify-between text-xs text-los-text-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-los-bg border border-los-border font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-los-bg border border-los-border font-mono">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-los-bg border border-los-border font-mono">↵</kbd>
                  to select
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Command size={12} /> Legacy OS
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
