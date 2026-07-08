'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2, ArrowRight } from 'lucide-react';

const suggestions = [
  "Show my internship memories",
  "Find all Goa trip memories",
  "Show memories from summer 2024",
  "Memories with my college friends",
  "My biggest achievements"
];

export default function AISearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const inputRef = useRef(null);

  // Cycle through suggestions for the placeholder
  useEffect(() => {
    if (isFocused) return;
    
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isFocused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative z-20">
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center p-2 rounded-2xl bg-los-card border transition-all duration-300 ${
          isFocused ? 'border-los-accent shadow-[0_0_30px_rgba(124,58,237,0.2)]' : 'border-los-border shadow-lg'
        }`}
      >
        <div className="pl-4 pr-2 text-los-accent-light">
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={`Ask AI: "${suggestions[suggestionIndex]}"`}
          className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-los-text-muted/70 py-3"
        />
        
        <button 
          type="submit"
          disabled={!query.trim() || loading}
          className="ml-2 px-6 py-3 rounded-xl bg-gradient-to-r from-los-accent to-los-cyan text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          Search <ArrowRight size={18} />
        </button>
      </form>

      {/* Expanded Suggestions Panel */}
      {isFocused && !query && (
        <div className="absolute top-full mt-2 w-full bg-los-card border border-los-border rounded-2xl p-4 shadow-xl glass-blur z-30 animate-fade-in-up">
          <p className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-3 px-2">
            Try asking about
          </p>
          <div className="space-y-1">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-los-bg-secondary text-los-text-secondary hover:text-white transition-colors flex items-center gap-3"
              >
                <Search size={16} className="text-los-text-muted" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
