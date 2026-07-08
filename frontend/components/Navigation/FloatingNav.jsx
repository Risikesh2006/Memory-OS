'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell } from 'lucide-react';

const navItems = [
  { name: 'Home',         href: '/dashboard' },
  { name: 'Timeline',     href: '/dashboard/timeline' },
  { name: 'Journal',      href: '/dashboard/journal' },
  { name: 'Collections',  href: '/dashboard/capsules' },
  { name: 'Memories',     href: '/dashboard/memories' },
  { name: 'AI Assistant', href: '/dashboard/chat' },
];

export default function FloatingNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navbar — full-width dark bar matching Timeline design */}
      <header
        className="fixed inset-x-0 top-0 z-40 hidden md:flex items-center justify-between px-8 py-3"
        style={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Left — Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
            <img
              src="/images/legacy-os-logo.png"
              alt="Legacy OS Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-bold text-base tracking-tight text-white uppercase">
              Legacy OS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors pb-0.5 ${
                    isActive
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right — Search + Bell + Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={15}
            />
            <input
              className="rounded-full pl-9 pr-4 py-2 text-[13px] text-white focus:outline-none focus:border-white/30 w-52 placeholder-white/35 transition-all"
              placeholder="Search by year or time..."
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            />
          </div>

          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <Bell size={16} />
          </button>

          <button
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/50 transition-all"
          >
            <img
              src="https://i.pravatar.cc/36?img=12"
              alt="User"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>
    </>
  );
}
