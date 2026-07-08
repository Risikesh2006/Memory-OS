'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Clock, Archive, Map, Clock as Timeline } from 'lucide-react';
import { useCapsule } from '@/context/CapsuleContext';
import CapsuleCard from './CapsuleCard';

export default function CapsuleHome() {
  const router = useRouter();
  const { capsules, filters, setFilters, filterCapsules, createCapsule } = useCapsule();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unlockAt: '',
    tags: '',
  });

  const filteredCapsules = filterCapsules();

  const handleCardClick = (capsule) => {
    if (capsule.status === 'unlocked') {
      router.push(`/dashboard/capsules/${capsule.id}`);
    }
  };

  const handleCreateCapsule = () => {
    const newCapsule = {
      title: formData.title,
      description: formData.description,
      unlockAt: formData.unlockAt ? new Date(formData.unlockAt).toISOString() : null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      content: [{ type: 'text', value: formData.description }],
    };

    createCapsule(newCapsule);
    setShowCreateModal(false);
    setFormData({ title: '', description: '', unlockAt: '', tags: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Particle Background */}
      <div id="particle-container" className="fixed inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              position: 'fixed',
              background: 'white',
              borderRadius: '50%',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              opacity: 0.15,
              animation: `float ${Math.random() * 15 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-40 px-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-bold mb-2 tracking-tight"
          >
            Archive.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl"
          >
            The neural echo of your digital existence. Sorted by emotional frequency and chronological resonance.
          </motion.p>
        </header>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search archive..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-full text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-all"
              style={{ backdropFilter: 'blur(40px)' }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilters({ ...filters, status: 'all' })}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              filters.status === 'all' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilters({ ...filters, status: 'unlocked' })}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              filters.status === 'unlocked' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            Unlocked
          </button>
          <button
            onClick={() => setFilters({ ...filters, status: 'locked' })}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              filters.status === 'locked' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            Locked
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Featured Capsule - Large */}
          {filteredCapsules[0] && (
            <div className="md:col-span-8">
              <CapsuleCard
                capsule={filteredCapsules[0]}
                onClick={() => handleCardClick(filteredCapsules[0])}
                variant="featured"
              />
            </div>
          )}

          {/* Neural Streams */}
          {filteredCapsules[1] && (
            <div className="md:col-span-4">
              <CapsuleCard
                capsule={filteredCapsules[1]}
                onClick={() => handleCardClick(filteredCapsules[1])}
                variant="neural"
              />
            </div>
          )}

          {/* Urban Echoes */}
          {filteredCapsules[2] && (
            <div className="md:col-span-4">
              <CapsuleCard
                capsule={filteredCapsules[2]}
                onClick={() => handleCardClick(filteredCapsules[2])}
                variant="urban"
              />
            </div>
          )}

          {/* Oceanic Calm - Large Image */}
          {filteredCapsules[3] && (
            <div className="md:col-span-8">
              <CapsuleCard
                capsule={filteredCapsules[3]}
                onClick={() => handleCardClick(filteredCapsules[3])}
                variant="oceanic"
              />
            </div>
          )}

          {/* Additional Capsules */}
          {filteredCapsules.slice(4).map((capsule, index) => (
            <div key={capsule.id} className="md:col-span-4">
              <CapsuleCard
                capsule={capsule}
                onClick={() => handleCardClick(capsule)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCapsules.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No capsules found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
            >
              Create Your First Capsule
            </button>
          </div>
        )}
      </main>

      {/* Spatial Dock */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div
          className="glass-panel px-6 py-4 rounded-full flex items-center gap-8 shadow-2xl transition-all duration-500"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <button
            onClick={() => router.push('/dashboard/timeline')}
            className="flex items-center gap-3 text-white group"
          >
            <Timeline size={20} className="p-2 bg-white text-black rounded-full transition-all group-hover:rotate-12" />
            <span className="hidden md:block text-sm font-semibold">Timeline</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/vault')}
            className="flex items-center gap-3 text-white/60 hover:text-white transition-all group"
          >
            <Archive size={20} className="p-2 group-hover:bg-white/10 rounded-full" />
            <span className="hidden md:block text-sm font-semibold">Vault</span>
          </button>
          <button className="flex items-center gap-3 text-white/60 hover:text-white transition-all group">
            <Map size={20} className="p-2 group-hover:bg-white/10 rounded-full" />
            <span className="hidden md:block text-sm font-semibold">Map</span>
          </button>
          <div className="h-6 w-px bg-white/10"></div>
          <button className="flex items-center gap-3 text-white/60 hover:text-white transition-all group">
            <Clock size={20} className="p-2 group-hover:bg-white/10 rounded-full" />
            <span className="hidden md:block text-sm font-semibold">Sync</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
      >
        <Plus size={32} />
      </motion.button>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-3xl flex items-center justify-center"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 rounded-2xl max-w-2xl w-full mx-4"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 className="text-2xl font-bold mb-6">Create Time Capsule</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter capsule title..."
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your capsule..."
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Unlock Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.unlockAt}
                    onChange={(e) => setFormData({ ...formData, unlockAt: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="memories, future, special"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCreateCapsule}
                    className="flex-1 px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
                  >
                    Create Capsule
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 rounded-full bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-100vh) translateX(20vw); }
        }
      `}</style>
    </div>
  );
}
