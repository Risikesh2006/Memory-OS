'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Type, Image as ImageIcon, Video, Music, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { capsuleAPI } from '@/lib/apiService';

export default function CreateCapsuleModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text',
    unlockDate: '',
    mediaUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.unlockDate) {
      toast.error('Title and Unlock Date are required');
      return;
    }

    const unlock = new Date(formData.unlockDate);
    if (unlock <= new Date()) {
      toast.error('Unlock date must be in the future');
      return;
    }

    setLoading(true);
    try {
      await capsuleAPI.create(formData);
      toast.success('Time capsule sealed successfully!');
      onSuccess();
      onClose();
      // Reset
      setFormData({ title: '', content: '', type: 'text', unlockDate: '', mediaUrl: '' });
    } catch (error) {
      toast.error('Failed to seal capsule');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const typeOptions = [
    { id: 'text', label: 'Message', icon: Type },
    { id: 'image', label: 'Photo', icon: ImageIcon },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'audio', label: 'Audio', icon: Music },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 glass-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-los-bg-secondary rounded-2xl shadow-2xl border border-los-border overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-los-accent via-los-cyan to-los-accent" />
        
        <div className="flex items-center justify-between p-6 border-b border-los-border">
          <div>
            <h2 className="text-2xl font-bold text-los-text">Seal a Time Capsule</h2>
            <p className="text-sm text-los-text-muted mt-1">Send a memory into the future.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-los-bg hover:bg-los-border transition-colors text-los-text-secondary hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-los-text-secondary mb-2">What are you sending?</label>
              <div className="grid grid-cols-4 gap-3">
                {typeOptions.map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: t.id})}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        formData.type === t.id 
                          ? 'bg-los-accent/20 border-los-accent text-white' 
                          : 'bg-los-bg border-los-border text-los-text-muted hover:border-los-text-secondary hover:text-los-text-secondary'
                      }`}
                    >
                      <Icon size={24} className="mb-2" />
                      <span className="text-xs font-semibold">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-los-text-secondary mb-2">Capsule Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., To my future self after graduation"
                className="w-full px-4 py-3 bg-los-bg border border-los-border rounded-xl text-white focus:outline-none focus:border-los-accent focus:ring-1 focus:ring-los-accent transition-all"
                required
              />
            </div>

            {formData.type === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-los-text-secondary mb-2">Message Content</label>
                <textarea 
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your message to the future..."
                  className="w-full px-4 py-3 bg-los-bg border border-los-border rounded-xl text-white focus:outline-none focus:border-los-accent focus:ring-1 focus:ring-los-accent transition-all h-32 resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-los-text-secondary mb-2">Media URL</label>
                <input 
                  type="url" 
                  value={formData.mediaUrl}
                  onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-los-bg border border-los-border rounded-xl text-white focus:outline-none focus:border-los-accent focus:ring-1 focus:ring-los-accent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-los-text-secondary mb-2">When should this unlock?</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-los-text-muted" size={18} />
                <input 
                  type="date" 
                  value={formData.unlockDate}
                  onChange={e => setFormData({...formData, unlockDate: e.target.value})}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min tomorrow
                  className="w-full pl-12 pr-4 py-3 bg-los-bg border border-los-border rounded-xl text-white focus:outline-none focus:border-los-accent focus:ring-1 focus:ring-los-accent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-los-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-los-text-muted">
              <Lock size={14} />
              <span>It will remain encrypted until the date</span>
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2.5 rounded-full font-medium bg-los-bg border border-los-border text-white hover:bg-los-bg-tertiary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-full font-medium bg-los-accent text-white hover:bg-los-accent-light transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                Seal Capsule
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
