'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Archive, Clock } from 'lucide-react';
import PinModal from './PinModal';
import TiltedCard from './TiltedCard';

export default function VaultHome({ vaults, onSelectVault, onCreateVault }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState(false);
  const [pinError, setPinError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const handleVaultClick = (year) => {
    const vault = vaults.find(v => v.year === year);
    
    if (vault) {
      // Vault exists, show PIN modal
      setSelectedYear(year);
      setShowPinModal(true);
      setPinError('');
    } else {
      // Vault doesn't exist, show create PIN modal
      setSelectedYear(year);
      setShowCreatePinModal(true);
      setPinError('');
    }
  };

  const handlePinSubmit = (pin) => {
    const result = onSelectVault(selectedYear, pin);
    
    if (result.success) {
      setShowPinModal(false);
      setSelectedYear(null);
    } else {
      setPinError(result.error);
      // Shake animation could be added here
    }
  };

  const handleCreatePin = (pin) => {
    try {
      onCreateVault(selectedYear, pin);
      setShowCreatePinModal(false);
      setSelectedYear(null);
    } catch (error) {
      setPinError(error.message);
    }
  };

  const closePinModal = () => {
    setShowPinModal(false);
    setSelectedYear(null);
    setPinError('');
  };

  const closeCreatePinModal = () => {
    setShowCreatePinModal(false);
    setSelectedYear(null);
    setPinError('');
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Spatial Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'rotateX(60deg) translateY(-200px)',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32 px-16 min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 xl:gap-20 w-full max-w-7xl justify-items-center">
          {years.map((year, index) => {
            const vault = vaults.find(v => v.year === year);
            const isCurrentYear = year === currentYear;
            const isFutureYear = year > currentYear;
            const hasVault = !!vault;
            const cardHeight = isCurrentYear ? '320px' : '300px';
            const cardWidth = isCurrentYear ? '320px' : '300px';
            const iconSize = isCurrentYear ? 46 : 42;
            const statusLabel = hasVault
              ? 'ENCRYPTED ARCHIVES'
              : isFutureYear
                ? 'COMING SOON'
                : 'CREATE VAULT';

            return (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => handleVaultClick(year)}
              >
                <TiltedCard
                  containerHeight={cardHeight}
                  containerWidth={cardWidth}
                  imageHeight={cardHeight}
                  imageWidth={cardWidth}
                  rotateAmplitude={12}
                  scaleOnHover={1.04}
                  showMobileWarning={false}
                  showTooltip={false}
                  statusText={statusLabel}
                  active={isCurrentYear && hasVault}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleVaultClick(year);
                    }
                  }}
                  overlayContent={
                    <>
                      {isFutureYear ? (
                        <Clock size={iconSize} className="text-white/18 drop-shadow-[0_0_24px_rgba(255,255,255,0.08)]" strokeWidth={1.7} />
                      ) : hasVault ? (
                        <Archive size={iconSize} className="text-white/34 drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] group-hover:text-white/60 transition-colors" strokeWidth={1.7} />
                      ) : (
                        <Lock size={iconSize} className="text-white/34 drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] group-hover:text-white/60 transition-colors" strokeWidth={1.7} />
                      )}

                      <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-white/28">
                        {hasVault ? 'Encrypted Archives' : isFutureYear ? 'Coming Soon' : 'Create Vault'}
                      </span>
                    </>
                  }
                />

                <div className="mt-8 text-center">
                  <h2
                    className="text-5xl font-bold mb-2 tracking-tight"
                    style={{
                      letterSpacing: '-0.05em',
                      background: 'linear-gradient(180deg, #ffffff 0%, #a1a1a1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {year}
                  </h2>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                    {hasVault ? (
                      <span className="text-white/60">
                        {vault.memories.length} ASSETS
                      </span>
                    ) : isCurrentYear ? (
                      <span className="text-white tracking-widest">CURRENT • CREATE</span>
                    ) : (
                      <span className="text-white/40">
                        {isFutureYear ? `READY 01.01.${year}` : 'EMPTY'}
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PIN Modal for Existing Vault */}
      <PinModal
        isOpen={showPinModal}
        onClose={closePinModal}
        onPinSubmit={handlePinSubmit}
        error={pinError}
        isCreatingPin={false}
      />

      {/* PIN Modal for Creating New Vault */}
      <PinModal
        isOpen={showCreatePinModal}
        onClose={closeCreatePinModal}
        onPinSubmit={() => {}}
        onCreatePin={handleCreatePin}
        error={pinError}
        isCreatingPin={true}
      />

    </div>
  );
}
