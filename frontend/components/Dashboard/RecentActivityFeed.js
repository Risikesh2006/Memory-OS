'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function RecentActivityFeed({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-8 rounded-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-accent" size={24} />
        <h2 className="text-2xl font-semibold">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-b-0"
            >
              <div className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-sm text-text-muted">
                  {new Date(item.date || item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-text-muted text-center py-8">No recent activity yet. Start creating memories!</p>
        )}
      </div>
    </motion.div>
  );
}
