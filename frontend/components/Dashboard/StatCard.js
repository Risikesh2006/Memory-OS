'use client';

import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card p-6 rounded-2xl border-l-4 border-accent"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-accent text-opacity-80">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
