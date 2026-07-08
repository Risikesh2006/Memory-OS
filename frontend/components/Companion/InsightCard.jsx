'use client';

import { motion } from 'framer-motion';

export default function InsightCard({ insight }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-xl bg-los-bg border border-los-border hover:border-los-accent/50 transition-colors shadow-sm"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-los-bg-tertiary flex items-center justify-center text-xl flex-shrink-0">
          {insight.icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-0.5">{insight.title}</h4>
          <p className="text-xs text-los-text-secondary leading-relaxed">
            {insight.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
