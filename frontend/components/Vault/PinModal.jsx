'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Fingerprint } from 'lucide-react';

export default function PinModal({
  isOpen,
  onClose,
  onPinSubmit,
  error,
  isCreatingPin,
  onCreatePin,
  mode,
  onChangePin,
}) {
  const resolvedMode = mode || (isCreatingPin ? 'create' : 'verify');
  const isChangeMode = resolvedMode === 'change';

  const [pin, setPin] = useState('');
  const [changeStep, setChangeStep] = useState('current');
  const [currentPin, setCurrentPin] = useState('');
  const [nextPin, setNextPin] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setChangeStep('current');
      setCurrentPin('');
      setNextPin('');
    }
  }, [isOpen, resolvedMode]);

  const activePin = useMemo(() => {
    if (!isChangeMode) {
      return pin;
    }

    if (changeStep === 'current') {
      return pin;
    }

    if (changeStep === 'new') {
      return pin;
    }

    return pin;
  }, [changeStep, isChangeMode, pin]);

  const getTitle = () => {
    if (isChangeMode) {
      if (changeStep === 'current') return 'Change PIN';
      if (changeStep === 'new') return 'Create New PIN';
      return 'Confirm New PIN';
    }

    return isCreatingPin ? 'Create PIN' : 'Identity Verification';
  };

  const getSubtitle = () => {
    if (isChangeMode) {
      if (changeStep === 'current') return 'Enter your current PIN';
      if (changeStep === 'new') return 'Set a new 4 digit PIN';
      return 'Re-enter the new PIN to confirm';
    }

    return isCreatingPin ? 'Set a 4 digit PIN for this vault' : 'Enter your PIN to unlock';
  };

  const submitPin = (value) => {
    if (isChangeMode) {
      if (changeStep === 'current') {
        setCurrentPin(value);
        setChangeStep('new');
        setPin('');
        return;
      }

      if (changeStep === 'new') {
        setNextPin(value);
        setChangeStep('confirm');
        setPin('');
        return;
      }

      if (changeStep === 'confirm') {
        if (value !== nextPin) {
          setPin('');
          setChangeStep('new');
          return;
        }

        const result = onChangePin?.(currentPin, value);
        if (result?.success) {
          handleClose();
        }
      }

      return;
    }

    if (isCreatingPin) {
      onCreatePin?.(value);
    } else {
      onPinSubmit?.(value);
    }
  };

  const handlePinInput = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length >= 4) {
        setTimeout(() => {
          submitPin(newPin);
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClose = () => {
    setPin('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-3xl flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="glass-container liquid-glass-border p-12 rounded-[48px] w-[420px] flex flex-col items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '0.5px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.02)'
              }}
            >
              <Lock className="w-10 h-10 mb-6 text-white/60" />
              <h3 className="text-xl font-semibold mb-2 tracking-tight text-white">
                {getTitle()}
              </h3>
              <p className="text-sm text-white/50 mb-10">
                {getSubtitle()}
              </p>

              {/* PIN Display */}
              <div className="flex gap-5 mb-14">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-14 h-16 border-b flex items-center justify-center text-4xl font-semibold transition-all ${
                      i < activePin.length
                        ? 'border-white text-white'
                        : 'border-white/20 text-white/20'
                    }`}
                    style={{
                      transform: i < activePin.length ? 'translateY(-4px)' : 'translateY(0)'
                    }}
                  >
                    {i < activePin.length ? '•' : '•'}
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Numeric Pad */}
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinInput(num)}
                    className="w-16 h-16 rounded-full border border-white/5 bg-white/5 hover:bg-white hover:text-black transition-all font-semibold text-2xl flex items-center justify-center active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button className="w-16 h-16 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors">
                  <Fingerprint size={24} />
                </button>
                <button
                  onClick={() => handlePinInput(0)}
                  className="w-16 h-16 rounded-full border border-white/5 bg-white/5 hover:bg-white hover:text-black transition-all font-semibold text-2xl flex items-center justify-center active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={handleClose}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
