'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Image,
  Video,
  BookOpen,
  Target,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Calendar size={20} />, label: 'Timeline', href: '/dashboard/timeline' },
    { icon: <Image size={20} />, label: 'Photos', href: '/dashboard/photos' },
    { icon: <Video size={20} />, label: 'Videos', href: '/dashboard/videos' },
    { icon: <BookOpen size={20} />, label: 'Journal', href: '/dashboard/journal' },
    { icon: <Target size={20} />, label: 'Milestones', href: '/dashboard/milestones' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: open ? 0 : -100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-64 bg-secondary border-r border-white/10 z-50 lg:z-40 lg:static lg:translate-x-0 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">Legacy OS</h1>
          <button onClick={onClose} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 text-text-muted hover:text-text transition-all duration-300 group"
            >
              <span className="text-accent group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 text-text-muted hover:text-text transition-all duration-300"
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-danger/10 text-danger hover:text-danger transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
