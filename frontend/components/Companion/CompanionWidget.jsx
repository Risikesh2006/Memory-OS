'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Activity, User, Settings, LogOut } from 'lucide-react';
import { useApp } from '@/components/Providers';
import { aiAPI } from '@/lib/apiService';
import InsightCard from './InsightCard';
import Link from 'next/link';

export default function CompanionWidget() {
  const { companionOpen, setCompanionOpen } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companionOpen && !data) {
      fetchInsights();
    }
  }, [companionOpen]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.insights();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load companion insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {companionOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCompanionOpen(false)}
            className="fixed inset-0 bg-black/60 glass-blur-sm z-50 md:hidden"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-[320px] max-w-[90vw] bg-los-card border-l border-los-border glass-blur z-[60] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Header / Profile Summary */}
            <div className="p-6 border-b border-los-border bg-gradient-to-b from-los-accent/10 to-transparent">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-los-accent to-los-cyan p-[2px]">
                    <div className="w-full h-full rounded-full bg-los-bg flex items-center justify-center overflow-hidden">
                      {/* Avatar Placeholder */}
                      <User size={32} className="text-los-text-muted" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-los-bg flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <button 
                  onClick={() => setCompanionOpen(false)}
                  className="p-2 rounded-full bg-los-bg/50 text-los-text-muted hover:text-white hover:bg-los-bg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">Legacy OS AI</h2>
              <p className="text-sm text-los-text-muted flex items-center gap-1.5">
                <Activity size={14} className="text-los-cyan" /> 
                System Active & Learning
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Daily Insights */}
              <div>
                <h3 className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-los-accent-light" />
                  Life Insights
                </h3>
                
                <div className="space-y-3">
                  {loading ? (
                    <>
                      <div className="h-20 rounded-xl bg-los-bg border border-los-border los-skeleton" />
                      <div className="h-20 rounded-xl bg-los-bg border border-los-border los-skeleton" />
                    </>
                  ) : data?.insights?.length > 0 ? (
                    data.insights.map((insight, idx) => (
                      <InsightCard key={idx} insight={insight} />
                    ))
                  ) : (
                    <p className="text-sm text-los-text-muted italic text-center py-4">
                      Create more memories to generate insights.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {!loading && data?.stats && (
                <div>
                  <h3 className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-4">
                    Your Universe
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-los-bg p-3 rounded-xl border border-los-border text-center">
                      <div className="text-2xl font-black text-white">{data.stats.total}</div>
                      <div className="text-[10px] text-los-text-muted uppercase tracking-wider">Total Memories</div>
                    </div>
                    <div className="bg-los-bg p-3 rounded-xl border border-los-border text-center">
                      <div className="text-2xl font-black text-white">{data.stats.streak}</div>
                      <div className="text-[10px] text-los-text-muted uppercase tracking-wider">Day Streak</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-4">
                  Account
                </h3>
                <div className="space-y-2">
                  <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-los-bg border border-los-border text-sm text-los-text-secondary hover:text-white transition-colors">
                    <Settings size={16} /> Preferences
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-los-bg border border-los-border text-sm text-los-rose hover:bg-los-rose/10 hover:border-los-rose/30 transition-colors">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
