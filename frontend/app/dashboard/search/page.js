'use client';

import { useState } from 'react';
import { aiAPI } from '@/lib/apiService';
import AISearchBar from '@/components/Search/AISearchBar';
import SearchResults from '@/components/Search/SearchResults';
import { Search as SearchIcon, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AISearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await aiAPI.search(query);
      setResults(response.data.results || []);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      toast.error('Search failed to process');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col min-h-[80vh]">
      
      {/* Dynamic Header spacing based on search state */}
      <div className={`transition-all duration-500 ease-in-out flex flex-col items-center justify-center text-center ${
        hasSearched ? 'mt-4 mb-8' : 'mt-32 mb-12'
      }`}>
        <div className={`inline-flex items-center justify-center p-3 rounded-2xl bg-los-cyan/10 text-los-cyan mb-6 transition-all ${
          hasSearched ? 'scale-75 mb-2' : 'scale-100'
        }`}>
          <Cpu size={32} />
        </div>
        
        <h1 className={`font-bold text-white transition-all ${
          hasSearched ? 'text-3xl mb-2' : 'text-5xl mb-4'
        }`}>
          AI Memory Search
        </h1>
        
        {!hasSearched && (
          <p className="los-body max-w-2xl text-lg">
            Describe what you're looking for using natural language. The AI understands context, locations, people, and themes across all your photos, videos, and journals.
          </p>
        )}
      </div>

      <AISearchBar onSearch={handleSearch} loading={loading} />

      {!loading && hasSearched && results?.length === 0 && (
        <div className="mt-20 flex flex-col items-center text-center animate-fade-in">
          <SearchIcon size={48} className="text-los-text-muted opacity-30 mb-4" />
          <h3 className="text-xl font-medium text-los-text mb-2">No memories found</h3>
          <p className="text-los-text-muted max-w-md">
            The AI couldn't find any memories matching your description. Try using different keywords or broader concepts.
          </p>
        </div>
      )}

      <SearchResults 
        results={results} 
        suggestions={suggestions} 
        onSuggestionClick={handleSearch} 
      />
    </div>
  );
}
