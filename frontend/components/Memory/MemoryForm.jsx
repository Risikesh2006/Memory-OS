'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';
import { useMemory } from '@/context/MemoryContext';

export default function MemoryForm({ memory, onClose }) {
  const { addMemory, updateMemory } = useMemory();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    mood: 'nostalgic',
    tags: '',
    type: 'note',
    image: '',
  });

  useEffect(() => {
    if (memory) {
      setFormData({
        title: memory.title || '',
        description: memory.description || '',
        content: memory.content || '',
        mood: memory.mood || 'nostalgic',
        tags: memory.tags?.join(', ') || '',
        type: memory.type || 'note',
        image: memory.image || '',
      });
    }
  }, [memory]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const memoryData = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      mood: formData.mood,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      type: formData.type,
      image: formData.image,
    };

    if (memory) {
      updateMemory({ ...memory, ...memoryData });
    } else {
      addMemory(memoryData);
    }

    onClose();
  };

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
          className="glass-panel rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold">
              {memory ? 'Edit Memory' : 'Create New Memory'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Enter memory title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Brief description..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
                placeholder="Write your memory..."
              />
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Type</label>
              <div className="flex gap-3">
                {[
                  { value: 'note', icon: FileText, label: 'Note' },
                  { value: 'image', icon: ImageIcon, label: 'Image' },
                  { value: 'event', icon: Sparkles, label: 'Event' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`flex-1 p-4 rounded-lg border transition-all ${
                      formData.type === type.value
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <type.icon size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL (only for image type) */}
            {formData.type === 'image' && (
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Mood</label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors"
              >
                <option value="nostalgic">Nostalgic</option>
                <option value="accomplished">Accomplished</option>
                <option value="contemplative">Contemplative</option>
                <option value="philosophical">Philosophical</option>
                <option value="adventurous">Adventurous</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="calm">Calm</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="nature, travel, memory"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
              >
                {memory ? 'Update Memory' : 'Create Memory'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
