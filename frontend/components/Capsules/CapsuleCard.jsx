'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock, FileText, Image as ImageIcon, Video, Music, Calendar } from 'lucide-react';
import CapsuleViewer from './CapsuleViewer';

export default function CapsuleCard({ capsule, onUpdate }) {
  const [isViewing, setIsViewing] = useState(false);
  
  const isLocked = capsule.isLocked;
  const isUnlockable = !isLocked && capsule.daysRemaining <= 0;
  const isApproaching = isLocked && capsule.daysRemaining > 0 && capsule.daysRemaining <= 7;

  const dateObj = new Date(capsule.unlockDate);
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const getIcon = () => {
    switch(capsule.type) {
      case 'image': return <ImageIcon size={20} className={isLocked ? 'text-los-text-muted' : 'text-los-cyan'} />;
      case 'video': return <Video size={20} className={isLocked ? 'text-los-text-muted' : 'text-los-rose'} />;
      case 'audio': return <Music size={20} className={isLocked ? 'text-los-text-muted' : 'text-los-amber'} />;
      default: return <FileText size={20} className={isLocked ? 'text-los-text-muted' : 'text-los-accent'} />;
    }
  };

  const handleOpen = () => {
    if (!isLocked) {
      setIsViewing(true);
    }
  };

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleOpen}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          isLocked 
            ? 'bg-los-bg-secondary border-los-border cursor-default hover:border-los-border-hover' 
            : 'bg-los-card border-los-accent/30 cursor-pointer hover:border-los-accent hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]'
        } ${isApproaching ? 'animate-pulse-glow border-los-accent/50' : ''}`}
      >
        {/* Background Gradient for unlocked */}
        {!isLocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-los-accent/10 to-transparent opacity-50" />
        )}

        <div className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-xl ${isLocked ? 'bg-los-bg border border-los-border' : 'bg-los-accent/20 shadow-inner'}`}>
              {isLocked ? <Lock size={24} className="text-los-text-muted" /> : <Unlock size={24} className="text-los-accent-light" />}
            </div>
            <div className="px-3 py-1 rounded-full bg-los-bg text-xs font-semibold uppercase tracking-wider text-los-text-muted border border-los-border flex items-center gap-1.5">
              {getIcon()}
              <span>{capsule.type}</span>
            </div>
          </div>

          <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-los-text-secondary' : 'text-los-text'} line-clamp-1`}>
            {capsule.title}
          </h3>

          {isLocked ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-los-text-muted bg-los-bg/50 px-3 py-2 rounded-lg border border-los-border">
                <Calendar size={16} />
                <span>Unlocks on {dateFormatted}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 bg-los-bg rounded-xl border border-los-border/50">
                <span className="text-3xl font-black tabular-nums bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                  {capsule.daysRemaining}
                </span>
                <span className="text-xs text-los-text-muted uppercase tracking-wider mt-1">Days Remaining</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-los-text-secondary line-clamp-2">
                This capsule is now unlocked and ready to be viewed.
              </p>
              <button 
                className="w-full py-3 rounded-xl bg-los-accent text-white font-medium hover:bg-los-accent-light transition-colors shadow-lg shadow-los-accent/20"
              >
                Open Capsule
              </button>
            </div>
          )}
        </div>
        
        {/* Approaching Indicator */}
        {isApproaching && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
            <div className="absolute top-[-20px] right-[-20px] w-full h-full bg-los-accent rounded-full blur-[20px] opacity-30 animate-pulse" />
          </div>
        )}
      </motion.div>

      {/* Viewer Modal */}
      <AnimatePresence>
        {isViewing && (
          <CapsuleViewer 
            capsule={capsule} 
            onClose={() => setIsViewing(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
