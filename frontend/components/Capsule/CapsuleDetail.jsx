'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock, Calendar, Tag, Clock, Edit, Trash2 } from 'lucide-react';
import { useCapsule } from '@/context/CapsuleContext';

export default function CapsuleDetail({ capsuleId }) {
  const router = useRouter();
  const { capsules, deleteCapsule, getCountdown } = useCapsule();
  
  const capsule = capsules.find(c => c.id === capsuleId);
  const [countdown, setCountdown] = useState(null);

  if (!capsule) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Capsule not found</p>
      </div>
    );
  }

  const formatCountdown = (cd) => {
    if (!cd) return '';
    if (cd.days > 0) return `${cd.days} days ${cd.hours} hours`;
    if (cd.hours > 0) return `${cd.hours} hours ${cd.minutes} minutes`;
    return `${cd.minutes} minutes ${cd.seconds} seconds`;
  };

  const handleDelete = () => {
    if (confirm('Delete this capsule?')) {
      deleteCapsule(capsule.id);
      router.push('/dashboard/capsules');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
            onClick={() => router.push('/dashboard/capsules')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} className="text-white/60" />
          </button>
          <h1 className="text-xl font-semibold">Capsule Detail</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={20} className="text-white/60" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-24 max-w-6xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Image & Content */}
          <div className="space-y-8">
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl aspect-video">
              <img
                src={capsule.image}
                alt={capsule.title}
                className="w-full h-full object-cover grayscale"
              />
              {capsule.status === 'locked' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Lock size={48} className="text-white/60 mb-4" />
                    <p className="text-white/80 mb-2">Locked until {new Date(capsule.unlockAt).toLocaleDateString()}</p>
                    {countdown && (
                      <p className="text-white/60">{formatCountdown(countdown)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            {capsule.status === 'unlocked' && (
              <div className="glass-panel p-8 rounded-2xl space-y-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h2 className="text-2xl font-bold mb-4">Capsule Contents</h2>
                {capsule.content && capsule.content.length > 0 ? (
                  capsule.content.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      {item.type === 'text' && (
                        <p className="text-white/80">{item.value}</p>
                      )}
                      {item.type === 'image' && (
                        <img src={item.value} alt="Content" className="w-full rounded-lg" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No content in this capsule</p>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Metadata */}
          <div className="space-y-6">
            {/* Title & Description */}
            <div className="glass-panel p-8 rounded-2xl space-y-6"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                {capsule.status === 'locked' ? (
                  <Lock size={24} className="text-white/60" />
                ) : (
                  <Unlock size={24} className="text-white/60" />
                )}
                <span className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  {capsule.status}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{capsule.title}</h1>
              <p className="text-lg text-white/70 leading-relaxed">{capsule.description}</p>
            </div>

            {/* Metadata Panel */}
            <div className="glass-panel p-6 rounded-2xl space-y-6 sticky top-24"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="font-semibold text-lg mb-4">Details</h3>

              {/* Created Date */}
              <div className="flex items-center gap-3 text-white/60">
                <Calendar size={16} />
                <div>
                  <p className="text-xs text-white/40">Created</p>
                  <p className="text-sm">{new Date(capsule.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Unlock Date */}
              {capsule.unlockAt && (
                <div className="flex items-center gap-3 text-white/60">
                  <Clock size={16} />
                  <div>
                    <p className="text-xs text-white/40">Unlock Date</p>
                    <p className="text-sm">{new Date(capsule.unlockAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {/* Item Count */}
              <div className="flex items-center gap-3 text-white/60">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm">📦</span>
                </div>
                <div>
                  <p className="text-xs text-white/40">Items</p>
                  <p className="text-sm">{capsule.itemCount}</p>
                </div>
              </div>

              {/* Tags */}
              {capsule.tags && capsule.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Tag size={16} />
                    <p className="text-xs text-white/40">Tags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {capsule.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-white/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
