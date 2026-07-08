'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, X, ZoomIn, ZoomOut, Calendar,
  Image as ImageIcon, Video, Plus, MousePointer2,
  Move, SlidersHorizontal, Maximize2, LayoutList,
  Clock, MoreHorizontal, Map, Check, Bell
} from 'lucide-react';

// Cards are positioned around a 2000,2000 centre point on the 4000×4000 canvas.
// The canvas initial offset is set so that point lands in the middle of the visible
// viewport (viewport centre ≈ 200px sidebar + half of remaining width, ~700px from left).
const MOCK_MEMORIES = [
  { id: 1, type: 'video',  title: 'Mountain Trip',    year: 2025, date: 'May 10, 2025',    time: '10:30 AM', location: 'Manali, Himachal Pradesh',  tag: 'Travel',  duration: '00:45', mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',  x: 1780, y: 1680, rotation: -3 },
  { id: 2, type: 'image',  title: 'Live Concert',     year: 2025, date: 'March 15, 2025',  time: '8:00 PM',  location: 'Bangalore, Karnataka',         tag: 'Music',   duration: '01:12', mediaUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop',  x: 2100, y: 1660, rotation:  5 },
  { id: 3, type: 'image',  title: 'Sunset View',      year: 2025, date: 'July 05, 2025',   time: '7:10 PM',  location: 'Kodaikanal, Tamil Nadu',        tag: 'Nature',                     mediaUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600&auto=format&fit=crop',  x: 1940, y: 1920, rotation:  0 },
  { id: 4, type: 'image',  title: 'Peaceful Morning', year: 2025, date: 'June 02, 2025',   time: '6:30 AM',  location: 'Pondicherry, Tamil Nadu',       tag: 'Relax',                      mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',  x: 1760, y: 2100, rotation: -2 },
  { id: 5, type: 'video',  title: 'My Puppy Bruno',   year: 2025, date: 'July 18, 2025',   time: '4:00 PM',  location: 'Home',                         tag: 'Pets',    duration: '01:05', mediaUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',  x: 2200, y: 2060, rotation:  4 },
  { id: 6, type: 'video',  title: 'Road Trip',        year: 2025, date: 'Feb 14, 2025',    time: '11:00 AM', location: 'Wayanad, Kerala',               tag: 'Travel',  duration: '01:05', mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop',  x: 2380, y: 1860, rotation: -4 },
];

function MemoryCard({ item, onDoubleClick }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onPointerDown={(e) => e.stopPropagation()}
      whileDrag={{ scale: 1.05, zIndex: 200, boxShadow: '0 30px 60px rgba(0,0,0,0.7)' }}
      whileHover={{ scale: 1.02 }}
      onDoubleClick={() => onDoubleClick(item)}
      className="absolute rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        left: item.x,
        top: item.y,
        rotate: item.rotation,
        width: 260,
        background: 'rgba(14,14,14,0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
      }}
    >
      {/* Media */}
      <div className="relative w-full" style={{ height: 200 }}>
        <img
          src={item.mediaUrl}
          alt={item.title}
          draggable={false}
          className="w-full h-full object-cover"
          style={{ opacity: 0.9 }}
        />
        {/* Duration badge */}
        {item.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-0.5 text-white text-[11px] font-bold">
            {item.duration}
          </div>
        )}
        {/* Type icon */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md rounded-lg p-1.5">
          {item.type === 'video'
            ? <Video size={13} className="text-white" />
            : <ImageIcon size={13} className="text-white" />}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4 text-white">
        <h3 className="font-bold text-[15px] leading-tight mb-1 tracking-tight">{item.title}</h3>
        <p className="text-[11px] text-white/50 mb-1">{item.date} • {item.time}</p>
        <p className="text-[11px] text-white/55 flex items-center gap-1 mb-3">
          <MapPin size={11} className="text-white/35" />{item.location}
        </p>
        <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-white/10 rounded-full border border-white/10">
          {item.tag}
        </span>
      </div>
    </motion.div>
  );
}

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
const BOTTOM_YEARS = [2022, 2023, 2024, 2025, 2026, 2027, 2028];

export default function TimelineOpenWorld() {
  const router = useRouter();
  const [scale, setScale] = useState(1);
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeYear, setActiveYear] = useState(2025);
  const [activeBottomYear, setActiveBottomYear] = useState(2025);
  const [activeTool, setActiveTool] = useState('select');

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      setScale(s => Math.min(Math.max(s - e.deltaY * 0.001, 0.25), 3));
    };
    const el = document.getElementById('ow-canvas');
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, []);

  const tools = [
    { id: 'select', icon: MousePointer2 },
    { id: 'move', icon: Move },
    { id: 'zoom', icon: ZoomIn },
    { id: 'map', icon: Map },
    { id: 'expand', icon: Maximize2 },
  ];

  const sidebarFeatures = [
    'Drag cards anywhere',
    'Move freely in 2D space',
    'Smooth physics & collisions',
    'Zoom in / out',
    'Search by year or time',
    'Double click to enlarge',
    'Glassmorphism cards',
    'Organize into collections',
  ];

  const howItWorks = [
    'Memories appear as floating glass cards',
    'Drag cards anywhere you like',
    'Cards have soft collisions',
    'Zoom and move around freely',
    'Search any year or time to focus',
    'Double click a card to see full details',
    'Create collections and group memories',
  ];

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative select-none">

      {/* ── DOT GRID BACKGROUND ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.5,
        }}
      />

      {/* ── INFINITE CANVAS ── */}
      {/* initial offset: cards are at ~x:1900-2400, y:1660-2100 on a 4000px canvas.
           We shift the canvas by (-1900 + centreX, -1660 + centreY).
           centreX ≈ sidebar(240) + half remaining ≈ 240 + 560 = 800px from left edge.
           centreY ≈ navbar(48) + half remaining ≈ 48 + 420 = 468px from top.
           offset X = 800 - 1900 = -1100  |  offset Y = 468 - 1660 = -1192  */}
      <div id="ow-canvas" className="absolute inset-0">
        <motion.div
          drag
          dragConstraints={{ left: -3500, right: 500, top: -3500, bottom: 500 }}
          dragElastic={0.08}
          style={{ scale }}
          className="w-[4000px] h-[4000px] absolute origin-top-left cursor-grab active:cursor-grabbing"
          initial={{ x: -1100, y: -1192 }}
        >
          {MOCK_MEMORIES.map(item => (
            <MemoryCard key={item.id} item={item} onDoubleClick={setExpandedCard} />
          ))}
        </motion.div>
      </div>

      {/* ── TOP NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 pointer-events-auto"
        style={{
          background: 'rgba(10,10,10,0.80)',
          backdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 group"
          >
            <img src="/images/legacy-os-logo.png" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-bold text-base tracking-tight text-white">LEGACY OS</span>
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'Home', href: '/dashboard' },
              { label: 'Timeline', href: '/dashboard/timeline', active: true },
              { label: 'Journal', href: '/dashboard/journal' },
              { label: 'Collections', href: '/dashboard/capsules' },
              { label: 'Memories', href: '/dashboard/memories' },
              { label: 'AI Assistant', href: '/dashboard/chat' },
              { label: 'The Vault', href: '/dashboard/vault' },
            ].map(n => (
              <button
                key={n.label}
                onClick={() => router.push(n.href)}
                className={`text-sm font-medium transition-colors ${n.active
                  ? 'text-white border-b-2 border-white pb-0.5'
                  : 'text-white/55 hover:text-white'
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
              className="bg-white/8 border border-white/10 rounded-full pl-9 pr-4 py-2 text-[13px] text-white focus:outline-none focus:border-white/30 w-52 placeholder-white/35 transition-all"
              placeholder="Search by year or time..."
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <Bell size={16} />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20">
            <img src="https://i.pravatar.cc/36?img=12" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* ── YEAR FILTER PILLS (below navbar, centred) ── */}
      <div className="fixed top-14 left-0 right-0 z-40 flex items-center justify-center gap-2 px-8 py-3 pointer-events-auto">
        {YEARS.map(y => (
          <button
            key={y}
            onClick={() => setActiveYear(y)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeYear === y
                ? 'bg-white text-black shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
            style={activeYear !== y ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' } : {}}
          >
            {y}
          </button>
        ))}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white ml-1 transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <Calendar size={15} />
        </button>
      </div>

      {/* ── LEFT SIDEBAR ── */}
      <aside
        className="fixed left-0 top-16 bottom-20 w-60 z-40 overflow-y-auto pointer-events-auto"
        style={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(32px)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="p-5">
          <h2 className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-white mb-2">
            Timeline – Open World Concept
          </h2>
          <p className="text-[11px] text-white/50 leading-relaxed mb-6">
            An infinite open world timeline where your memories float freely in space.
          </p>

          <ul className="space-y-2.5 mb-8">
            {sidebarFeatures.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-[11px] text-white/75">
                <Check size={12} className="text-white/60 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <h3 className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-white mb-3">
            How It Works
          </h3>
          <ol className="list-decimal list-outside pl-4 space-y-2 mb-8">
            {howItWorks.map((s, i) => (
              <li key={i} className="text-[11px] text-white/50 leading-relaxed pl-1">{s}</li>
            ))}
          </ol>

          <h3 className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-white mb-3">
            Card Information
          </h3>
          {['Thumbnail (image / video)', 'Title', 'Date & Time', 'Location', 'Short Note / Description', 'Collection Tag'].map(i => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-white/50 mb-1.5">
              <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
              {i}
            </div>
          ))}

          <h3 className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-white mt-6 mb-3">
            Interactions
          </h3>
          {[
            ['Drag', 'Move card'],
            ['Click', 'Select card'],
            ['Double Click', 'Enlarge card'],
            ['Scroll', 'Zoom in/out'],
            ['Right Click', 'Context menu'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2 text-[11px] mb-1.5">
              <span className="font-bold text-white/75">{k}</span>
              <span className="text-white/40">— {v}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── LEFT TOOL STRIP ── */}
      <div
        className="fixed left-60 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 py-3 px-2 pointer-events-auto"
        style={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
        }}
      >
        {tools.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTool(id)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              activeTool === id
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                : 'text-white/40 hover:text-white hover:bg-white/8'
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* ── BOTTOM YEAR SLIDER ── */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-5 py-2.5 pointer-events-auto"
        style={{
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 999,
          minWidth: 540,
        }}
      >
        {BOTTOM_YEARS.map(y => (
          <button
            key={y}
            onClick={() => setActiveBottomYear(y)}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
              activeBottomYear === y
                ? 'bg-white text-black shadow'
                : 'text-white/45 hover:text-white'
            }`}
          >
            {y}
          </button>
        ))}

        <div className="w-px h-5 bg-white/15 mx-2" />

        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/55 hover:text-white transition-colors flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <SlidersHorizontal size={16} />
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/55 hover:text-white transition-colors flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <LayoutList size={16} />
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-black bg-white hover:scale-105 transition-transform flex-shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* ── EXPANDED CARD MODAL ── */}
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
            style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)' }}
            onClick={() => setExpandedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-[88vw] max-w-[1100px] h-[82vh] rounded-3xl overflow-hidden flex flex-col md:flex-row pointer-events-auto"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 0 120px rgba(0,0,0,0.9)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Media */}
              <div className="w-full md:w-[62%] h-[45vh] md:h-full relative bg-black shrink-0">
                <img
                  src={expandedCard.mediaUrl}
                  alt={expandedCard.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-5 left-5 w-11 h-11 flex items-center justify-center rounded-full text-white transition-all"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Details */}
              <div
                className="w-full md:w-[38%] p-8 flex flex-col overflow-y-auto"
                style={{ background: 'rgba(14,14,14,0.95)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">{expandedCard.title}</h2>
                  <button
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white transition-colors shrink-0 ml-3"
                    style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    Edit Memory
                  </button>
                </div>

                <div
                  className="space-y-3 text-sm text-white/65 mb-6 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-3"><Calendar size={15} className="text-white/40" />{expandedCard.date}</div>
                  <div className="flex items-center gap-3"><Clock size={15} className="text-white/40" />{expandedCard.time}</div>
                  <div className="flex items-center gap-3"><MapPin size={15} className="text-white/40" />{expandedCard.location}</div>
                  <div className="flex items-center gap-3">
                    {expandedCard.type === 'video' ? <Video size={15} className="text-white/40" /> : <ImageIcon size={15} className="text-white/40" />}
                    {expandedCard.tag} Memory
                  </div>
                </div>

                <p className="text-xs font-bold text-white/35 uppercase tracking-widest mb-2">Memory Details</p>
                <p
                  className="text-sm text-white/70 leading-relaxed mb-6 p-4 rounded-2xl"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {expandedCard.description || "The view from this moment was absolutely breathtaking. We spent hours just taking it all in — definitely one of the most peaceful moments on this journey, surrounded by good company and beautiful scenery."}
                </p>

                <p className="text-xs font-bold text-white/35 uppercase tracking-widest mb-3">Tags</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}>{expandedCard.tag}</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white/65" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>Peaceful</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white/65" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>Trip</span>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}><Plus size={13} /></button>
                </div>

                <div className="mt-auto pt-6 border-t border-white/8">
                  <p className="text-xs font-bold text-white/35 uppercase tracking-widest mb-3">Collection</p>
                  <div
                    className="flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all hover:bg-white/8"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden">
                        <img src={expandedCard.mediaUrl} alt="" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Travel Diaries</p>
                        <p className="text-[10px] text-white/45">24 Memories</p>
                      </div>
                    </div>
                    <MoreHorizontal size={17} className="text-white/40" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
