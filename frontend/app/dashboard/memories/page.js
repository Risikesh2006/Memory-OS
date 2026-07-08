'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMemory } from '../../../context/MemoryContext';
import MemoryModal from '../../../components/Memories/MemoryModal';
import MemoryForm from '../../../components/Memories/MemoryForm';
import FloatingNav from '../../../components/Navigation/FloatingNav';

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000 * 2) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ── Memory Card ───────────────────────────────────────────────────────────────
function MemoryCard({ memory, onClick, onToggleFavorite }) {
  const isNote = memory.type === 'note';
  const isEvent = memory.type === 'event';
  const hasImage = memory.image || memory.imageUrl;

  return (
    <div
      onClick={() => onClick(memory)}
      className="masonry-item group cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -4px -4px 12px rgba(255,255,255,0.02)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        marginBottom: '24px',
        breakInside: 'avoid',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '20px 20px 40px rgba(0,0,0,0.6), -6px -6px 16px rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '12px 12px 24px rgba(0,0,0,0.4), -4px -4px 12px rgba(255,255,255,0.02)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
      }}
    >
      {/* Image */}
      {hasImage && (
        <div style={{ position: 'relative', overflow: 'hidden' }}
          className={memory.type === 'image' && memory.id === 'm1' ? 'aspect-[4/5]' :
                     memory.type === 'image' && memory.id === 'm5' ? 'aspect-[3/4]' : 'aspect-video'}>
          <img
            src={memory.image || memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
          />
          {memory.mood && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e2e2e2' }}>
                {memory.mood}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Event card — sparkles placeholder */}
      {isEvent && !hasImage && (
        <div className="aspect-video flex items-center justify-center"
          style={{ background: '#2a2a2a' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '60px', color: 'rgba(255,255,255,0.2)' }}>auto_awesome</span>
        </div>
      )}

      {/* Note card — quote block */}
      {isNote && (
        <div className="p-8"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="material-symbols-outlined block mb-4" style={{ color: '#e2e2e2', fontSize: '28px' }}>format_quote</span>
          <blockquote style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 300, color: '#e2e2e2', lineHeight: 1.6 }}>
            {memory.content?.slice(0, 120) || memory.description}
          </blockquote>
        </div>
      )}

      {/* Card body */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.01em', color: '#ffffff', lineHeight: 1.3 }}>
            {memory.title}
          </h3>
          <span style={{ fontSize: '12px', color: '#c4c7c8', flexShrink: 0, marginLeft: '8px', marginTop: '4px' }}>
            {formatDate(memory.createdAt)}
          </span>
        </div>

        {/* Milestone badge for events */}
        {isEvent && (
          <div className="inline-block mb-3 px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', fontWeight: 500 }}>
              Milestone
            </span>
          </div>
        )}

        <p style={{ fontSize: '14px', color: 'rgba(226,226,226,0.7)', lineHeight: 1.6, marginBottom: '16px' }}>
          {memory.aiSummary || memory.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {(memory.tags || []).map(tag => (
            <span key={tag}
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.10)', color: '#c4c7c8' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MemoriesPage() {
  const { filter, searchQuery, setFilter, setSearchQuery, addMemory, updateMemory, deleteMemory, toggleFavorite, getFilteredMemories } = useMemory();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const canvasRef = useRef(null);

  // Dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.sx = (Math.random() - 0.5) * 0.2;
        this.sy = (Math.random() - 0.5) * 0.2;
        this.op = Math.random() * 0.5;
      }
      update() {
        this.x += this.sx; this.y += this.sy;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.op})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    resize();
    for (let i = 0; i < 150; i++) particles.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const handleSave = (data) => {
    if (isEditing) { updateMemory(data); setIsEditing(null); }
    else { addMemory(data); setIsCreating(false); }
  };

  const filtered = getFilteredMemories();
  const FILTERS = ['all', 'images', 'notes', 'events', 'ai summaries'];

  return (
    <div style={{ backgroundColor: '#0e0e0e', color: '#e2e2e2', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'Geist, sans-serif', position: 'relative' }}>

      {/* Material Symbols */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Atmospheric BG */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'rgba(255,255,255,0.05)', filter: 'blur(120px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', opacity: 0.3 }} />
      </div>

      {/* Left Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 40,
        width: '80px', backgroundColor: '#0e0e0e',
        borderRight: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(40px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '24px', paddingBottom: '24px', gap: '32px'
      }}>
        {/* Logo mark */}
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#131313', fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
        </div>

        {/* Nav icons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
          {[
            { icon: 'home', active: false },
            { icon: 'inventory_2', active: true },
            { icon: 'auto_awesome_motion', active: false },
            { icon: 'analytics', active: false },
          ].map(({ icon, active }) => (
            <button key={icon} style={{
              width: '48px', height: '48px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
              borderRight: active ? '2px solid #ffffff' : '2px solid transparent',
              color: active ? '#ffffff' : '#c4c7c8',
              transition: 'all 0.2s',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{icon}</span>
            </button>
          ))}
        </div>

        {/* Bottom icons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {['help', 'policy'].map(icon => (
            <button key={icon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c4c7c8' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Shared Dashboard Navbar */}
      <FloatingNav />

      {/* Page content (offset for left sidebar) */}
      <div style={{ marginLeft: '80px', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <header style={{ paddingTop: '80px', paddingBottom: '48px', maxWidth: '1100px', margin: '0 auto', padding: '80px 40px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: '72px', fontWeight: 800, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
                Memory Archive
              </h1>
              <p style={{ fontSize: '18px', color: 'rgba(226,226,226,0.7)', marginTop: '12px', maxWidth: '480px', lineHeight: 1.6 }}>
                A curated stream of your digital existence. Preserved in aether, accessed in silence.
              </p>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingBottom: '8px' }}>
              {FILTERS.map(f => {
                const active = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '8px 24px', borderRadius: '9999px', cursor: 'pointer', border: '1px solid',
                    fontSize: '14px', fontWeight: 500, letterSpacing: '0.05em',
                    background: active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(40px)',
                    borderColor: active ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.10)',
                    color: active ? '#ffffff' : '#c4c7c8',
                    transition: 'all 0.2s',
                  }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Masonry Grid */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 128px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.10)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '60px', color: 'rgba(255,255,255,0.2)', display: 'block', marginBottom: '16px' }}>cloud_off</span>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>No memories found in the archive.</p>
            </div>
          ) : (
            <div style={{ columnCount: 4, columnGap: '24px' }}>
              {filtered.map(m => (
                <MemoryCard key={m.id} memory={m} onClick={setSelectedMemory} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.10)', padding: '24px 40px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(226,226,226,0.7)' }}>© 2024 Legacy OS. Preserve your digital permanence.</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Terms', 'Privacy', 'Ethics'].map(l => (
                <a key={l} href="#" style={{ fontSize: '12px', color: '#c4c7c8', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsCreating(true)}
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 50,
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(255,255,255,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          animation: 'breathe 4s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(255,255,255,0.1)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#ffffff' }}>add</span>
      </button>

      {/* Modals */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onEdit={m => { setSelectedMemory(null); setIsEditing(m); }}
          onDelete={id => { deleteMemory(id); setSelectedMemory(null); }}
        />
      )}
      {(isEditing || isCreating) && (
        <MemoryForm
          initialData={isEditing}
          onSubmit={handleSave}
          onCancel={() => { setIsEditing(null); setIsCreating(false); }}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;300;400;500;600;700;800;900&display=swap');
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); transform: scale(1); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.3); transform: scale(1.05); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @media (max-width: 1280px) { .masonry-col { column-count: 3 !important; } }
        @media (max-width: 1024px) { .masonry-col { column-count: 2 !important; } }
        @media (max-width: 768px) { .masonry-col { column-count: 1 !important; } }
      `}</style>
    </div>
  );
}
