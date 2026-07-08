'use client';

import { Check } from 'lucide-react';

export default function TimelineFilters({ filters, setFilters }) {
  const toggleType = (type) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };

  const typeOptions = [
    { id: 'photo', label: 'Photos', color: 'bg-los-cyan text-white' },
    { id: 'video', label: 'Videos', color: 'bg-los-rose text-white' },
    { id: 'journal', label: 'Journals', color: 'bg-los-accent text-white' },
    { id: 'milestone', label: 'Milestones', color: 'bg-los-amber text-black' },
  ];

  return (
    <div className="p-4 bg-los-card rounded-2xl border border-los-border shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Type Filter */}
        <div>
          <h4 className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-3">Memory Types</h4>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(option => {
              const isActive = filters.types.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleType(option.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? option.color 
                      : 'bg-los-bg border border-los-border text-los-text-secondary hover:text-white'
                  }`}
                >
                  {isActive && <Check size={14} />}
                  {option.label}
                </button>
              );
            })}
            
            <button
              onClick={() => setFilters(prev => ({ ...prev, types: ['photo', 'video', 'journal', 'milestone'] }))}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-los-text-muted hover:text-white transition-colors"
            >
              Select All
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
