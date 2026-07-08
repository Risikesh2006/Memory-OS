'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, ArrowRight, Eye, ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { useCapsule } from '@/context/CapsuleContext';

export default function CapsuleCard({ capsule, onClick, variant = 'default' }) {
  const { getCountdown } = useCapsule();
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (capsule.status === 'locked' && capsule.unlockAt) {
      const updateCountdown = () => {
        const cd = getCountdown(capsule.unlockAt);
        setCountdown(cd);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [capsule.status, capsule.unlockAt, getCountdown]);

  const formatCountdown = (cd) => {
    if (!cd) return '';
    if (cd.days > 0) return `${cd.days}d ${cd.hours}h`;
    if (cd.hours > 0) return `${cd.hours}h ${cd.minutes}m`;
    return `${cd.minutes}m ${cd.seconds}s`;
  };

  const getIcon = () => {
    if (variant === 'featured') return <Sparkles size={16} />;
    if (variant === 'neural') return <Eye size={16} />;
    if (variant === 'urban') return <ArrowUpRight size={16} />;
    if (variant === 'oceanic') return <Play size={32} />;
    return <ArrowRight size={16} />;
  };

  const getLabel = () => {
    if (variant === 'featured') return 'Featured Stream';
    if (variant === 'neural') return 'Neural Logs';
    if (variant === 'urban') return 'Urban Memories';
    if (variant === 'oceanic') return 'Atmosphere';
    return 'Collection';
  };

  if (variant === 'oceanic') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={onClick}
        className="group aetheric-capsule glass-panel rounded-lg overflow-hidden flex flex-col cursor-pointer relative min-h-[400px]"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <img
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-1000"
          src={capsule.image}
          alt={capsule.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between z-10">
          <div>
            <h3 className="text-5xl font-bold mb-2 tracking-tight">{capsule.title}</h3>
            <p className="text-base text-white/60 max-w-md">{capsule.description}</p>
            <div className="flex gap-4 mt-4">
              {capsule.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button className="bg-white text-black w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl">
            <Play size={32} />
          </button>
        </div>

        {capsule.status === 'locked' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <Lock size={48} className="text-white/60 mb-4" />
              <p className="text-white/80 mb-2">Locked until {new Date(capsule.unlockAt).toLocaleDateString()}</p>
              {countdown && (
                <p className="text-white/60 text-sm">{formatCountdown(countdown)}</p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group aetheric-capsule glass-panel rounded-lg overflow-hidden flex flex-col cursor-pointer h-full"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-1000"
          src={capsule.image}
          alt={capsule.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-2">
            {getIcon()}
            <span className="text-xs font-semibold uppercase tracking-widest">{getLabel()}</span>
          </div>
          <h3 className="text-xl font-bold mb-2">{capsule.title}</h3>
          <p className="text-sm text-white/60 mb-4">{capsule.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{capsule.itemCount} Items</p>
            <p className="text-xs text-white/60">
              {capsule.status === 'locked' && countdown ? `Locked - ${formatCountdown(countdown)}` : 'Unlocked'}
            </p>
          </div>
          <button className="neumorphic-button p-4 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '-2px -2px 5px rgba(255, 255, 255, 0.05), 2px 2px 5px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            {getIcon()}
          </button>
        </div>
      </div>

      {capsule.status === 'locked' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock size={32} className="text-white/60 mb-2" />
            <p className="text-white/80 text-sm">Locked</p>
            {countdown && (
              <p className="text-white/60 text-xs mt-1">{formatCountdown(countdown)}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
