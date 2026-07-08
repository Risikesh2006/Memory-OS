'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2, Star, Calendar, Tag, Sparkles } from 'lucide-react';
import { useMemory } from '@/context/MemoryContext';

export default function MemoryModal({ memory, onClose, onEdit, onDelete }) {
  const { toggleFavorite } = useMemory();
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this memory?')) {
      onDelete(memory.id);
      onClose();
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(memory.id);
  };

  if (!memory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold">{memory.title}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  memory.favorite ? 'text-white' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Star size={20} className={memory.favorite ? 'fill-white' : ''} />
              </button>
              <button
                onClick={() => onEdit(memory)}
                className="p-2 rounded-full text-white/40 hover:text-white transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Image */}
            {memory.image && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="w-full h-auto grayscale"
                />
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(memory.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span className="capitalize">{memory.type}</span>
              </div>
              {memory.mood && (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span className="capitalize">{memory.mood}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {memory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {memory.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white/60 mb-2">Description</h3>
                <p className="text-white/80">{memory.description}</p>
              </div>
            )}

            {/* Content */}
            {memory.content && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white/60 mb-2">Content</h3>
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{memory.content}</p>
              </div>
            )}

            {/* AI Summary */}
            {memory.aiSummary && (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-2 flex items-center gap-2">
                  <Sparkles size={16} />
                  AI Summary
                </h3>
                <p className="text-white/80">{memory.aiSummary}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
