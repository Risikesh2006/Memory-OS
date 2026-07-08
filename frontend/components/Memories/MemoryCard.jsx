import React from 'react';

export default function MemoryCard({ memory, onClick, onToggleFavorite }) {
  // Format date safely
  const dateObj = new Date(memory.createdAt);
  const dateString = isNaN(dateObj.getTime()) 
    ? "Unknown Date" 
    : dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div 
      className="masonry-item relative glass-panel neumorphic-lift rounded-2xl overflow-hidden group cursor-pointer mb-6 border border-white/5 bg-surface-container-high transition-all duration-300 hover:border-white/20"
      style={{
        boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.02)"
      }}
      onClick={() => onClick(memory)}
    >
      {/* Top action area for Favorite */}
      <button 
        className={`absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${memory.favorite ? 'bg-primary/20 border-primary text-primary' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(memory.id);
        }}
      >
        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: memory.favorite ? "'FILL' 1" : "'FILL' 0" }}>star</span>
      </button>

      {/* Image or Icon area depending on type */}
      {memory.type === 'image' || memory.imageUrl ? (
         <div className="aspect-[4/5] relative overflow-hidden bg-black/50">
           <img 
              src={memory.imageUrl || "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={memory.title}
              className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" 
           />
           {memory.mood && (
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-10">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-white">{memory.mood}</span>
              </div>
           )}
         </div>
      ) : memory.type === 'note' ? (
        <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border-b border-white/10">
          <span className="material-symbols-outlined text-primary mb-4 block">format_quote</span>
          <blockquote className="text-lg italic font-light text-on-surface line-clamp-3">"{memory.content}"</blockquote>
          {memory.mood && (
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white">{memory.mood}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video relative overflow-hidden bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-white/20 text-6xl">
            {memory.type === 'event' ? 'event' : 'auto_awesome'}
          </span>
          {memory.mood && (
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white">{memory.mood}</span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-semibold text-primary line-clamp-1">{memory.title}</h3>
          <span className="text-xs text-on-surface-variant whitespace-nowrap pt-1">{dateString}</span>
        </div>
        
        {memory.type === 'event' && (
          <div className="mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 inline-block">
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary">Milestone</span>
          </div>
        )}

        <p className="text-on-surface-muted text-sm mb-4 leading-relaxed line-clamp-3">
          {memory.aiSummary}
        </p>

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {memory.tags.map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded-md border border-white/10 text-on-surface-variant bg-white/5">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
