'use client';

import React, { useState, useEffect } from 'react';
import { useMemory } from '../../components/Providers'; // Wait, it's not exported from Providers
import { useMemory as useMemoryContext } from '../../context/MemoryContext';
import MemoryCard from '../../components/Memories/MemoryCard';
import MemoryModal from '../../components/Memories/MemoryModal';
import MemoryForm from '../../components/Memories/MemoryForm';

export default function ArchivePage() {
  const { 
    memories, filter, searchQuery, 
    setFilter, setSearchQuery, 
    addMemory, updateMemory, deleteMemory, toggleFavorite,
    getFilteredMemories 
  } = useMemoryContext();

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // To simulate the dust particles, we use a simple effect
  useEffect(() => {
    const canvas = document.getElementById('dustCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCardClick = (memory) => {
    setSelectedMemory(memory);
  };

  const handleEditClick = (memory) => {
    setSelectedMemory(null);
    setIsEditing(memory);
  };

  const handleDelete = (id) => {
    deleteMemory(id);
    setSelectedMemory(null);
  };

  const handleSaveForm = (memoryData) => {
    if (isEditing) {
      updateMemory(memoryData);
      setIsEditing(null);
    } else {
      addMemory(memoryData);
      setIsCreating(false);
    }
  };

  const filteredMemories = getFilteredMemories();

  return (
    <div className="bg-surface-container-lowest font-body-md text-on-surface selection:bg-primary selection:text-surface min-h-screen relative overflow-x-hidden">
      
      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full"></div>
        <canvas id="dustCanvas" className="w-full h-full opacity-30"></canvas>
      </div>

      {/* Navigation Shell */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-10 h-24 pointer-events-none">
        <div className="glass-panel rounded-full max-w-7xl mx-auto h-16 px-8 flex items-center justify-between shadow-2xl pointer-events-auto backdrop-blur-[40px] border border-white/10 w-full transition-all duration-300">
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold tracking-tighter text-primary">Legacy OS</div>
            <div className="hidden md:flex gap-4">
              <a className="text-sm text-primary border-b border-primary pb-1 font-semibold" href="#">Archive</a>
              <a className="text-sm text-white/50 hover:text-white transition-colors" href="#">Chronology</a>
              <a className="text-sm text-white/50 hover:text-white transition-colors" href="#">Museum</a>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="bg-white/5 w-full h-10 rounded-full flex items-center px-4 gap-3 border border-white/10 shadow-inner">
              <span className="material-symbols-outlined text-white/50 text-[20px]">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-full text-white placeholder-white/30" 
                placeholder="Search the void..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-white/50 hover:text-white transition-colors">notifications</button>
            <button className="material-symbols-outlined text-white/50 hover:text-white transition-colors">settings</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW6GQow6eJuAYl7f4ZcxK3KwbTUMkFedentPASZukdFlu4Uy2RQRREj9rQmrhLqtG5kegOHgBsH3zsuvFIT4A_DO6MKednBTeN1f9kwKgjSIpVsvMAhP4i5ql3sTC3Qn70STATQA8Jejam8OyA5oKMI-KDX3gzV4-UrQn0wo70iLFyAxQreGO1sYb1M-pKUEz3uPe9Wl4wealRwgPEMNJNN2bchBs_q27uZev4gnanG7h_-pybXRD-rQ" alt="User" className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        </div>
      </nav>

      {/* Side Nav (Hidden on Mobile) */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col w-20 bg-surface-container-lowest/90 border-r border-white/10 backdrop-blur-[40px] items-center py-12 gap-8">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-black text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
        </div>
        <div className="flex flex-col gap-6 flex-1 justify-center">
          <button className="w-12 h-12 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">home</span>
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-white border-r-2 border-primary">
            <span className="material-symbols-outlined">inventory_2</span>
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">auto_awesome_motion</span>
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">analytics</span>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <button className="material-symbols-outlined text-white/50 hover:text-white transition-colors">help</button>
          <button className="material-symbols-outlined text-white/50 hover:text-white transition-colors">policy</button>
        </div>
      </aside>

      {/* Header Section */}
      <header className="relative pt-36 pb-12 max-w-7xl mx-auto z-10 px-8 pl-8 md:pl-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 items-start md:items-center">
          <div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tighter">Memory Archive</h1>
            <p className="text-lg text-white/60 mt-4 max-w-xl">
              A curated stream of your digital existence. Preserved in aether, accessed in silence.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 pb-2">
            {['all', 'favorites', 'images', 'notes', 'events'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full glass-panel transition-all text-sm font-medium ${filter === f ? 'bg-white/10 text-white border-white/50' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content: Masonry Grid */}
      <main className="relative max-w-7xl mx-auto z-10 pb-32 px-8 pl-8 md:pl-28">
        {filteredMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-white/20 text-6xl mb-4">search_off</span>
            <h2 className="text-2xl font-bold text-white mb-2">No memories found</h2>
            <p className="text-white/50 max-w-md">Try adjusting your filters or search terms to uncover hidden fragments of your past.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredMemories.map(memory => (
              <div className="break-inside-avoid" key={memory.id}>
                <MemoryCard 
                  memory={memory} 
                  onClick={handleCardClick}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB: Floating Add Button */}
      <button 
        onClick={() => setIsCreating(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center border-2 border-white/20 hover:border-white/50 transition-all duration-500 shadow-2xl group active:scale-90 animate-[breathe_4s_ease-in-out_infinite]"
        style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
      >
        <span className="material-symbols-outlined text-white text-3xl group-hover:rotate-90 transition-transform duration-500">add</span>
      </button>

      {/* Modals */}
      {selectedMemory && (
        <MemoryModal 
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}

      {(isEditing || isCreating) && (
        <MemoryForm 
          initialData={isEditing}
          onSubmit={handleSaveForm}
          onCancel={() => { setIsEditing(null); setIsCreating(false); }}
        />
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); transform: scale(1); }
          50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.3); transform: scale(1.05); }
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
      `}} />
    </div>
  );
}
