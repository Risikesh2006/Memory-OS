import React from 'react';

export default function MemoryModal({ memory, onClose, onEdit, onDelete }) {
  if (!memory) return null;

  const dateObj = new Date(memory.createdAt);
  const dateString = isNaN(dateObj.getTime()) 
    ? "Unknown Date" 
    : dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-500 animate-in fade-in zoom-in-95">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] bg-surface-container-lowest/90 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Media / Visual Side */}
        <div className="md:w-1/2 relative bg-surface-container-highest min-h-[300px] flex items-center justify-center">
          {memory.type === 'image' || memory.imageUrl ? (
            <img 
              src={memory.imageUrl || "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={memory.title}
              className="w-full h-full object-cover grayscale" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-transparent p-12">
              <span className="material-symbols-outlined text-white/10 text-8xl mb-6">
                {memory.type === 'note' ? 'sticky_note_2' : memory.type === 'event' ? 'event' : 'auto_awesome'}
              </span>
              <div className="text-white/20 text-xl font-light italic text-center px-8">
                {memory.type === 'note' && "A thought preserved in time."}
                {memory.type === 'event' && "A moment etched in history."}
                {memory.type === 'mixed' && "Fragments of memory."}
              </div>
            </div>
          )}
          
          {memory.mood && (
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-white">{memory.mood}</span>
            </div>
          )}
        </div>

        {/* Content Side */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col h-full max-h-full overflow-y-auto">
          <div className="mb-2">
             <span className="text-sm text-on-surface-variant/70">{dateString}</span>
          </div>
          
          <div className="flex items-start justify-between mb-6 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{memory.title}</h2>
            {memory.favorite && (
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            )}
          </div>

          <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="text-xs uppercase tracking-widest text-white/50 mb-2 font-semibold">AI Analysis</h4>
            <p className="text-sm text-white/80 leading-relaxed italic">
              {memory.aiSummary}
            </p>
          </div>

          <div className="flex-1 space-y-6">
            {memory.description && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/50 mb-2 font-semibold">Context</h4>
                <p className="text-white/90 leading-relaxed">{memory.description}</p>
              </div>
            )}
            
            {memory.content && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/50 mb-2 font-semibold">Content</h4>
                <div className="text-white/90 leading-relaxed whitespace-pre-wrap font-light text-lg">
                  {memory.content}
                </div>
              </div>
            )}

            {memory.tags && memory.tags.length > 0 && (
              <div className="pt-4 border-t border-white/10 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {memory.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 bg-white/5">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-12 pt-6 border-t border-white/10">
            <button 
              onClick={() => onEdit(memory)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to permanently erase this memory from the archive?")) {
                  onDelete(memory.id);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              Erase
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
