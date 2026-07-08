'use client';

import { Search } from 'lucide-react';
import { useMemory } from '@/context/MemoryContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useMemory();

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search the void..."
        className="w-full pl-12 pr-4 py-3 rounded-full text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-all"
        style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      />
    </div>
  );
}
