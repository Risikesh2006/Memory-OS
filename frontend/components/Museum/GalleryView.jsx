'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function GalleryView({ collections, onSelectCollection }) {
  
  if (!collections || collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-dashed border-los-border rounded-3xl bg-los-card/30">
        <Layers size={64} className="text-los-text-muted mb-6 opacity-30" />
        <h3 className="text-2xl font-bold text-los-text mb-2">No Exhibitions Found</h3>
        <p className="text-los-text-muted text-center max-w-md mb-8">
          You haven't curated any collections for your museum yet. Group your memories into thematic exhibitions.
        </p>
        <button className="los-btn-secondary">
          Create New Exhibition
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectCollection(collection)}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
        >
          {/* Base Frame Layer */}
          <div className="absolute inset-0 bg-los-bg border border-los-border rounded-2xl" />
          
          {/* Image */}
          <div className="absolute inset-[8px] rounded-xl overflow-hidden shadow-inner">
            {collection.coverImage ? (
              <img 
                src={collection.coverImage} 
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-los-bg-tertiary to-los-bg flex items-center justify-center">
                <Layers size={48} className="text-los-text-muted opacity-20" />
              </div>
            )}
            
            {/* Museum Lighting Effect */}
            <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[50%] bg-gradient-to-b from-white/10 to-transparent rotate-[-15deg] pointer-events-none mix-blend-overlay" />
          </div>

          {/* Vignette & Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none rounded-2xl" />
          
          {/* Plaque / Text Info */}
          <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col items-center text-center transform transition-transform duration-500 group-hover:-translate-y-2">
            <span className="text-[10px] font-bold text-los-accent uppercase tracking-[0.3em] mb-3 border-b border-los-accent/30 pb-1">
              Exhibition {index + 1}
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mb-2 leading-tight drop-shadow-md">
              {collection.name}
            </h3>
            <p className="text-sm text-white/60 line-clamp-2">
              {collection.description || 'A curated collection of memories.'}
            </p>
            
            {/* Enter Button */}
            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-xs font-semibold uppercase tracking-wider text-los-text hover:text-white px-6 py-2 rounded-full border border-los-border bg-los-bg/50 glass-blur">
                Enter Gallery
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
