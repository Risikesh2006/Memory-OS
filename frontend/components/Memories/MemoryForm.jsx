import React, { useState, useEffect } from 'react';
import { generateAISummary } from '../../utils/aiSummary';

export default function MemoryForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    mood: '',
    tags: '',
    type: 'note',
    imageUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(t => t)
      : [];
    
    const memory = {
      ...formData,
      tags: tagsArray,
      id: initialData?.id || Date.now().toString() + Math.random().toString(36).substring(7),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      favorite: initialData?.favorite || false,
      aiSummary: initialData?.aiSummary && formData.content === initialData.content 
                  ? initialData.aiSummary 
                  : generateAISummary(formData.content || formData.description)
    };
    
    onSubmit(memory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl bg-surface-container/90 rounded-3xl border border-white/10 shadow-2xl p-8 max-h-[90vh] overflow-y-auto neumorphic-lift">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">{initialData ? 'Edit Memory' : 'Preserve Memory'}</h2>
          <button onClick={onCancel} className="text-on-surface-variant hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Title</label>
            <input 
              required
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all neumorphic-inset"
              placeholder="Give this memory a name..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all neumorphic-inset"
              >
                <option value="note">Note</option>
                <option value="image">Image</option>
                <option value="event">Event</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Mood (Optional)</label>
              <input 
                type="text" 
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all neumorphic-inset"
                placeholder="e.g. Nostalgic, Happy"
              />
            </div>
          </div>

          {formData.type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Image URL</label>
              <input 
                type="text" 
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all neumorphic-inset"
                placeholder="https://..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Description / Short Note</label>
            <input 
              type="text" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all neumorphic-inset"
              placeholder="Brief context..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Full Content</label>
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all neumorphic-inset resize-none"
              placeholder="Pour your thoughts here. The AI will summarize it."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Tags</label>
            <input 
              type="text" 
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all neumorphic-inset"
              placeholder="Comma separated (e.g. solitude, nature)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              {initialData ? 'Save Changes' : 'Archive Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
