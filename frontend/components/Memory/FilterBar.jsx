'use client';

import { useMemory } from '@/context/MemoryContext';

export default function FilterBar() {
  const { filter, setFilter } = useMemory();

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'images', label: 'Images' },
    { value: 'notes', label: 'Notes' },
    { value: 'events', label: 'Events' },
    { value: 'favorites', label: 'Favorites' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`px-6 py-2 rounded-full glass-panel font-semibold transition-all ${
            filter === f.value
              ? 'bg-white/10 border-white/30 text-white'
              : 'hover:bg-white/5 text-white/60'
          }`}
          style={{
            background: filter === f.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
