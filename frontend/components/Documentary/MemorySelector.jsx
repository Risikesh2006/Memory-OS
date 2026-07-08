'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Image as ImageIcon, Video, Calendar } from 'lucide-react';

export default function MemorySelector({ memories, selectedIds, onSelectionChange }) {
  const [filter, setFilter] = useState('all'); // all, photos, videos

  const filteredMemories = memories.filter(m => {
    // Only show media for documentary
    if (m.memoryType !== 'photo' && m.memoryType !== 'video') return false;
    if (filter === 'photos' && m.memoryType !== 'photo') return false;
    if (filter === 'videos' && m.memoryType !== 'video') return false;
    return true;
  });

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      if (selectedIds.length >= 30) {
        // Simple limit for the browser-based documentary
        alert('Maximum 30 memories allowed per documentary');
        return;
      }
      onSelectionChange([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    const ids = filteredMemories.slice(0, 30).map(m => m.id);
    onSelectionChange(ids);
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  return (
    <div className="bg-los-bg-secondary rounded-2xl border border-los-border p-6 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Select Memories</h3>
          <p className="text-sm text-los-text-muted">Choose photos and videos to include ({selectedIds.length}/30 selected)</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-los-bg rounded-lg p-1 border border-los-border">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === 'all' ? 'bg-los-card text-white shadow' : 'text-los-text-muted hover:text-white'}`}
            >
              All Media
            </button>
            <button 
              onClick={() => setFilter('photos')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === 'photos' ? 'bg-los-card text-white shadow' : 'text-los-text-muted hover:text-white'}`}
            >
              Photos
            </button>
            <button 
              onClick={() => setFilter('videos')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === 'videos' ? 'bg-los-card text-white shadow' : 'text-los-text-muted hover:text-white'}`}
            >
              Videos
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs font-medium text-los-cyan hover:text-white transition-colors">
              Select Visible
            </button>
            <span className="text-los-border">|</span>
            <button onClick={clearSelection} className="text-xs font-medium text-los-text-muted hover:text-white transition-colors">
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredMemories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-los-text-muted border border-dashed border-los-border rounded-xl bg-los-bg/50">
            No media found matching criteria.
          </div>
        ) : (
          filteredMemories.map((memory) => {
            const isSelected = selectedIds.includes(memory.id);
            const dateStr = new Date(memory.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            
            return (
              <div 
                key={memory.id}
                onClick={() => toggleSelection(memory.id)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                  isSelected ? 'border-los-accent shadow-[0_0_15px_rgba(124,58,237,0.3)] scale-[0.98]' : 'border-transparent hover:border-los-border'
                }`}
              >
                <img 
                  src={memory.url || memory.thumbnailUrl} 
                  alt={memory.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isSelected ? 'opacity-80 scale-105' : 'opacity-100 group-hover:scale-110'
                  }`}
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
                
                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-los-accent flex items-center justify-center text-white shadow-lg">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
                
                {/* Media Type Icon */}
                {!isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 glass-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {memory.memoryType === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                  </div>
                )}
                
                {/* Info */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 transform transition-transform duration-300 ${
                  isSelected ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
                }`}>
                  <p className="text-white text-xs font-semibold truncate">{memory.title}</p>
                  <p className="text-white/70 text-[10px] flex items-center gap-1 mt-0.5">
                    <Calendar size={10} /> {dateStr}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
