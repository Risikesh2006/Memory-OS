'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Clock, Search, Archive, Map, Plus } from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Timeline', href: '/dashboard/timeline', icon: Clock },
  { name: 'Add', href: '#add', icon: Plus, isAction: true },
  { name: 'Capsules', href: '/dashboard/capsules', icon: Archive },
  { name: 'Museum', href: '/dashboard/museum', icon: Map },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden pb-safe">
      {/* Background Gradient fade for better readability */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-los-bg via-los-bg/80 to-transparent pointer-events-none" />
      
      <div className="relative mx-4 mb-4">
        <nav className="flex items-center justify-around bg-los-card border border-los-border rounded-2xl glass-blur px-2 py-2 shadow-lg">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  className="relative -top-5 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-los-accent to-los-cyan text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] border-4 border-los-bg transition-transform active:scale-95"
                >
                  <Icon size={24} />
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-14 h-12 gap-1 rounded-xl"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileNavActive"
                    className="absolute inset-0 bg-los-accent/15 rounded-xl border border-los-accent/20"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon 
                  size={20} 
                  className={`relative z-10 transition-colors ${
                    isActive ? 'text-los-accent-light' : 'text-los-text-muted'
                  }`} 
                />
                <span 
                  className={`relative z-10 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-los-text' : 'text-los-text-muted'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
