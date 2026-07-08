'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Lock, Plus, Search, Sparkles, Wand2, X, Bell } from 'lucide-react';
import { useVault } from '@/context/VaultContext';
import MemoryCard from './MemoryCard';
import MemoryModal from './MemoryModal';
import PinModal from './PinModal';

export default function VaultViewer({ vault, onLock, onAddMemory, onGenerateReflection, onExport }) {
  const [filterType, setFilterType] = useState('all');
  const [showReflection, setShowReflection] = useState(false);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [changePinError, setChangePinError] = useState('');
  const [openedMemory, setOpenedMemory] = useState(null);
  const [modalSourceRect, setModalSourceRect] = useState(null);
  const { setSearchQuery, setActiveMemory, openMemory, closeMemory, updateMemoryPosition, updatePan, changeVaultPin } = useVault();
  const searchQuery = vault?.searchQuery || '';
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const cardRefs = useRef(new Map());
  const panGestureRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    nextX: 0,
    nextY: 0,
    frameId: 0,
  });
  const repelFrameRef = useRef(0);
  const repelStateRef = useRef({ draggedId: null, draggedPosition: null });

  const memories = vault?.memories || [];
  const positions = vault?.positions || {};
  const pan = vault?.pan || { x: 0, y: 0 };

  const matchesSearch = (memory) => {
    if (!searchQuery.trim()) {
      return true;
    }

    const query = searchQuery.trim().toLowerCase();
    const haystack = [
      memory.title,
      memory.description,
      ...(memory.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  };

  const filteredCount = memories.filter((memory) => matchesSearch(memory) && (filterType === 'all' || memory.type === filterType)).length;

  const syncWorldTransform = (x, y) => {
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  const registerCardRef = (memoryId, element) => {
    if (element) {
      cardRefs.current.set(memoryId, element);
      return;
    }

    cardRefs.current.delete(memoryId);
  };

  const resetNeighborTransforms = () => {
    memories.forEach((memory) => {
      const element = cardRefs.current.get(memory.id);

      if (!element) {
        return;
      }

      const position = positions[memory.id] || { x: 0, y: 0 };
      element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) scale(1)`;
    });
  };

  const applyRepel = (draggedId, draggedPosition) => {
    repelStateRef.current = { draggedId, draggedPosition };

    if (repelFrameRef.current) {
      return;
    }

    repelFrameRef.current = requestAnimationFrame(() => {
      repelFrameRef.current = 0;

      memories.forEach((memory) => {
        if (memory.id === draggedId) {
          return;
        }

        const element = cardRefs.current.get(memory.id);

        if (!element) {
          return;
        }

        const basePosition = positions[memory.id] || { x: 0, y: 0 };
        const deltaX = basePosition.x - draggedPosition.x;
        const deltaY = basePosition.y - draggedPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
        const influence = Math.max(0, 1 - Math.min(distance, 320) / 320);
        const offsetX = (deltaX / distance) * influence * 18;
        const offsetY = (deltaY / distance) * influence * 18;

        element.style.transform = `translate3d(${basePosition.x + offsetX}px, ${basePosition.y + offsetY}px, 0) scale(${1 - influence * 0.04})`;
      });
    });
  };

  const clearRepel = () => {
    if (repelFrameRef.current) {
      cancelAnimationFrame(repelFrameRef.current);
      repelFrameRef.current = 0;
    }

    repelStateRef.current = { draggedId: null, draggedPosition: null };
    resetNeighborTransforms();
  };

  useEffect(() => {
    syncWorldTransform(pan.x || 0, pan.y || 0);
  }, [pan.x, pan.y]);

  useEffect(() => {
    if (!vault?.memories?.length) {
      return;
    }

    resetNeighborTransforms();
  }, [vault?.memories, positions]);

  const handleAddMemory = () => {
    // Mock adding a memory - in real app, this would open a file picker or form
    const mockMemory = {
      type: ['image', 'video', 'text', 'audio'][Math.floor(Math.random() * 4)],
      title: `New Memory ${vault.memories.length + 1}`,
      description: 'A beautiful moment captured in time',
      mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      tags: ['personal', 'moment'],
      aiSummary: 'This memory captures a significant moment of personal growth and reflection.'
    };

    onAddMemory(mockMemory);
    setIsAddingMemory(false);
  };

  const handleOpenMemory = (memory, rect = null) => {
    setModalSourceRect(rect);
    setOpenedMemory(memory);
    openMemory(memory);
  };

  const handleSelectMemory = (memory) => {
    setActiveMemory(memory.id);
  };

  const handleDragCommit = (memoryId, nextPosition) => {
    clearRepel();
    updateMemoryPosition(memoryId, nextPosition);
  };

  const handleDragMove = (memoryId, nextPosition) => {
    applyRepel(memoryId, nextPosition);
  };

  const handleWorldPointerDown = (event) => {
    if (event.target.closest('[data-memory-card="true"]')) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    const gesture = panGestureRef.current;
    gesture.active = true;
    gesture.pointerId = event.pointerId;
    gesture.startX = event.clientX;
    gesture.startY = event.clientY;
    gesture.originX = pan.x || 0;
    gesture.originY = pan.y || 0;
    gesture.nextX = pan.x || 0;
    gesture.nextY = pan.y || 0;

    if (containerRef.current?.setPointerCapture) {
      containerRef.current.setPointerCapture(event.pointerId);
    }
  };

  const handleWorldPointerMove = (event) => {
    const gesture = panGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    gesture.nextX = gesture.originX + deltaX;
    gesture.nextY = gesture.originY + deltaY;

    if (!gesture.frameId) {
      gesture.frameId = requestAnimationFrame(() => {
        gesture.frameId = 0;
        syncWorldTransform(gesture.nextX, gesture.nextY);
      });
    }
  };

  const handleWorldPointerUp = (event) => {
    const gesture = panGestureRef.current;

    if (!gesture.active || gesture.pointerId !== event.pointerId) {
      return;
    }

    gesture.active = false;

    if (gesture.frameId) {
      cancelAnimationFrame(gesture.frameId);
      gesture.frameId = 0;
    }

    updatePan({ x: gesture.nextX, y: gesture.nextY });

    if (containerRef.current?.releasePointerCapture) {
      try {
        containerRef.current.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may have already been released.
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Top Navbar — matches Dashboard design */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3"
        style={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-8">
          <button onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-2 shrink-0">
            <img src="/images/legacy-os-logo.png" alt="Legacy OS Logo" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-bold text-base tracking-tight text-white uppercase">Legacy OS</span>
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'Home',         href: '/dashboard',          active: false },
              { label: 'Timeline',     href: '/dashboard/timeline'  },
              { label: 'Journal',      href: '/dashboard/journal'   },
              { label: 'Collections',  href: '/dashboard/capsules'  },
              { label: 'Memories',     href: '/dashboard/search'    },
              { label: 'AI Assistant', href: '/dashboard/chat'      },
              { label: 'The Vault',    href: '/dashboard/vault',     active: true },
            ].map(n => (
              <button
                key={n.label}
                onClick={() => window.location.href = n.href}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  n.active ? 'text-white border-b-2 border-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              className="rounded-full pl-9 pr-4 py-2 text-[13px] text-white focus:outline-none w-52 placeholder-white/35 transition-all"
              placeholder="Search by year or time..."
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            />
          </div>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <Bell size={16} />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20">
            <img src="https://i.pravatar.cc/36?img=12" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Vault-specific toolbar below navbar */}
      <div className="fixed top-16 left-0 right-0 z-40 flex items-center justify-between px-8 py-3"
        style={{
          background: 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            {vault.year} Vault
          </h1>
          <span className="text-white/40 text-sm">
            {vault.memories.length} memories
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full pl-9 pr-4 py-2 text-[13px] text-white focus:outline-none w-48 placeholder-white/35 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-full text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
          </select>

          {/* Actions */}
          <button
            onClick={() => setShowReflection(!showReflection)}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="AI Reflection"
          >
            <Sparkles size={18} className="text-white/70" />
          </button>

          <button
            onClick={onExport}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Export Vault"
          >
            <Download size={18} className="text-white/70" />
          </button>

          <button
            onClick={() => setShowChangePinModal(true)}
            className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Change Vault PIN"
          >
            Change PIN
          </button>

          <button
            onClick={onLock}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Lock Vault"
          >
            <Lock size={18} className="text-white/70" />
          </button>
        </div>
      </div>

      {/* AI Reflection Panel */}
      <AnimatePresence>
        {showReflection && vault.yearlyReflection && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-8 right-8 z-40"
          >
            <div
              className="glass-container liquid-glass-border p-6 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '0.5px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="text-white/60" size={20} />
                  <h3 className="text-lg font-semibold text-white">AI Yearly Reflection</h3>
                </div>
                <button
                  onClick={() => setShowReflection(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold text-white/30 mb-2 uppercase tracking-wider">Key Events</p>
                  <ul className="space-y-1">
                    {vault.yearlyReflection.keyEvents.map((event, i) => (
                      <li key={i} className="text-sm text-white/70">• {event}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-white/30 mb-2 uppercase tracking-wider">Emotional Summary</p>
                  <p className="text-sm text-white/70 italic">{vault.yearlyReflection.emotionalSummary}</p>
                </div>

                {vault.yearlyReflection.highlights.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-white/30 mb-2 uppercase tracking-wider">Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {vault.yearlyReflection.highlights.map((highlight, i) => (
                        <span
                          key={i}
                          className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-white/60"
                        >
                          {highlight.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!vault.yearlyReflection && (
                <button
                  onClick={onGenerateReflection}
                  className="mt-4 w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
                >
                  <Wand2 size={18} />
                  Generate AI Reflection
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Cards Container */}
      <div 
        ref={containerRef}
        className="relative min-h-screen pt-36 px-8 overflow-hidden"
        style={{ minHeight: 'calc(100vh - 120px)' }}
        onPointerDown={handleWorldPointerDown}
        onPointerMove={handleWorldPointerMove}
        onPointerUp={handleWorldPointerUp}
        onPointerCancel={handleWorldPointerUp}
      >
        <div ref={worldRef} className="absolute inset-0 transition-transform duration-75 ease-out">
          {/* Background Atmosphere */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_25%,rgba(0,0,0,0.85))]" />
            <div className="absolute inset-0 opacity-[0.12] mix-blend-screen" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '88px 88px' }} />
          </div>

          <div className="pointer-events-none absolute right-8 top-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/45">
            {filteredCount} matching memories
          </div>

        {/* Empty State */}
        {memories.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Plus size={40} className="text-white/30" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Memories Yet</h3>
              <p className="text-white/50 mb-6">Start adding memories to your vault</p>
              <button
                onClick={() => setIsAddingMemory(true)}
                className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Add First Memory
              </button>
            </div>
          </div>
        )}

        {/* Memory Cards */}
        <div className="relative min-h-[calc(100vh-120px)]">
          <AnimatePresence>
            {memories.map((memory, index) => {
              const matchesType = filterType === 'all' || memory.type === filterType;
              const matchesQuery = matchesSearch(memory);
              const position = positions[memory.id] || { x: 120 + index * 36, y: 160 + index * 28 };

              return (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  position={position}
                  isFiltered={!(matchesQuery && matchesType)}
                  isActive={vault.activeMemory === memory.id}
                  onSelect={handleSelectMemory}
                  onOpen={handleOpenMemory}
                  onCommitPosition={handleDragCommit}
                  onDragMove={handleDragMove}
                  registerCardRef={registerCardRef}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add Memory Button (Floating) */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsAddingMemory(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-30"
        >
          <Plus size={24} />
        </motion.button>
        </div>
      </div>

      {/* Memory Modal */}
      <MemoryModal
        isOpen={!!openedMemory}
        onClose={() => {
          setOpenedMemory(null);
          setModalSourceRect(null);
          closeMemory();
        }}
        memory={openedMemory}
        sourceRect={modalSourceRect}
      />

      <PinModal
        isOpen={showChangePinModal}
        onClose={() => {
          setShowChangePinModal(false);
          setChangePinError('');
        }}
        mode="change"
        error={changePinError}
        onChangePin={(currentPin, nextPin) => {
          const result = changeVaultPin(currentPin, nextPin);

          if (result.success) {
            setShowChangePinModal(false);
            setChangePinError('');
            return result;
          }

          setChangePinError(result.error);
          return result;
        }}
      />

      {/* Add Memory Modal (Mock) */}
      <AnimatePresence>
        {isAddingMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-3xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-container liquid-glass-border p-8 rounded-[32px] w-[500px]"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '0.5px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Add Memory</h3>
              <p className="text-white/60 mb-8">
                This is a mock implementation. In production, this would open a file picker or memory creation form.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleAddMemory}
                  className="flex-1 bg-white text-black py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  Add Mock Memory
                </button>
                <button
                  onClick={() => setIsAddingMemory(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
