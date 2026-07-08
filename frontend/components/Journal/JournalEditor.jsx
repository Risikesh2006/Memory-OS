'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Sparkles, Heart, Lock, Image, Video, Mic, Link, Bold, Italic, List, Quote } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';

export default function JournalEditor({ journalId = null }) {
  const router = useRouter();
  const { createJournal, updateJournal, MOODS, CATEGORIES } = useJournal();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('happy');
  const [category, setCategory] = useState('Personal');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);

  const handleSave = () => {
    const journalData = {
      title,
      content,
      mood,
      category,
      location,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      date: new Date().toISOString().split('T')[0],
    };

    if (journalId) {
      updateJournal(journalId, journalData);
    } else {
      createJournal(journalData);
    }

    router.push('/dashboard/journal');
  };

  const handleAIAction = (action) => {
    // Mock AI actions
    switch (action) {
      case 'improve':
        setContent(content + ' [AI improved this text]');
        break;
      case 'summarize':
        setContent(content + '\n\n[AI Summary: This entry captures meaningful thoughts and experiences.]');
        break;
      case 'expand':
        setContent(content + '\n\n[AI Expanded: Consider adding more details about how this made you feel and what you learned from it.]');
        break;
      case 'correct':
        setContent(content);
        break;
      case 'reflect':
        setContent(content + '\n\n[AI Reflection: This entry shows deep thoughtfulness and emotional awareness.]');
        break;
      case 'title':
        if (!title) {
          setTitle('A Moment of Reflection');
        }
        break;
    }
    setShowAIMenu(false);
  };

  const handleVaultSave = () => {
    // Save to vault logic
    setShowVaultModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Spatial Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/journal')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} className="text-white/60" />
          </button>
          <h1 className="text-xl font-semibold">
            {journalId ? 'Edit Journal' : 'New Journal'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIMenu(!showAIMenu)}
            className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Sparkles size={16} />
            AI Assistant
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full text-sm font-semibold bg-white text-black hover:scale-105 transition-transform"
          >
            Save
          </button>
        </div>
      </header>

      {/* AI Menu Dropdown */}
      <AnimatePresence>
        {showAIMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-8 z-50 glass-card p-4 rounded-xl min-w-[200px]"
            style={{
              backdropFilter: 'blur(40px)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="space-y-2">
              {[
                { action: 'improve', label: 'Improve Writing' },
                { action: 'summarize', label: 'Summarize' },
                { action: 'expand', label: 'Expand Thoughts' },
                { action: 'correct', label: 'Correct Grammar' },
                { action: 'reflect', label: 'Generate Reflection' },
                { action: 'title', label: 'Generate Title' },
              ].map((item) => (
                <button
                  key={item.action}
                  onClick={() => handleAIAction(item.action)}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-24 max-w-4xl mx-auto px-10">
        <div className="space-y-8">
          {/* Title Input */}
          <div>
            <input
              type="text"
              placeholder="Enter journal title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none text-white placeholder-white/30"
              style={{ letterSpacing: '-0.02em' }}
            />
          </div>

          {/* Metadata Section */}
          <div className="glass-card p-6 rounded-xl space-y-6"
            style={{
              backdropFilter: 'blur(40px)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Date */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
              />
            </div>

            {/* Mood Selector */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Mood</label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                      mood === m.id ? 'bg-white text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Location (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Chennai, Bangalore"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 placeholder-white/30"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="#internship, #college, #friends"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 placeholder-white/30"
              />
            </div>
          </div>

          {/* Rich Text Editor Toolbar */}
          <div className="glass-card p-3 rounded-xl flex items-center gap-2"
            style={{
              backdropFilter: 'blur(40px)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Bold size={18} className="text-white/60" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Italic size={18} className="text-white/60" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <List size={18} className="text-white/60" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Quote size={18} className="text-white/60" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Image size={18} className="text-white/60" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Video size={18} className="text-white/60" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Mic size={18} className="text-white/60" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Link size={18} className="text-white/60" />
            </button>
          </div>

          {/* Content Editor */}
          <div>
            <textarea
              placeholder="Start writing your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] p-6 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 placeholder-white/30 resize-none text-lg leading-relaxed"
              style={{
                backdropFilter: 'blur(40px)',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
              <Heart size={16} />
              Add to Favorites
            </button>
            <button
              onClick={() => setShowVaultModal(true)}
              className="px-6 py-3 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Lock size={16} />
              Store in Vault
            </button>
          </div>
        </div>
      </main>

      {/* Vault Modal */}
      <AnimatePresence>
        {showVaultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-3xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 rounded-2xl max-w-md w-full mx-4"
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="text-2xl font-semibold mb-4">Store in Legacy Vault</h3>
              <p className="text-white/60 mb-6">
                This journal seems important. Would you like to preserve it in your Legacy Vault forever?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowVaultModal(false)}
                  className="flex-1 px-6 py-3 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleVaultSave}
                  className="flex-1 px-6 py-3 rounded-full text-sm font-semibold bg-white text-black hover:scale-105 transition-transform"
                >
                  Store Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
