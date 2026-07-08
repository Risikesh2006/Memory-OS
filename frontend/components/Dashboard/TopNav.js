'use client';

import { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function TopNav({ onMenuClick }) {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-secondary/50 backdrop-blur-xl">
      <div className="flex justify-between items-center p-4 md:p-6">
        {/* Left */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-muted hover:text-text transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Center - Title (hidden on mobile) */}
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold">Memory Vault</h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {/* Notifications */}
          <button className="relative text-text-muted hover:text-text transition-colors">
            <Bell size={24} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-accent rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden sm:inline text-sm font-medium">{user?.fullName || 'User'}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm font-semibold">{user?.fullName}</p>
                  <p className="text-xs text-text-muted">{user?.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-sm">
                  Profile Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
