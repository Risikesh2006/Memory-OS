'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Settings, Bell } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'Collections', href: '/collections' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Journal', href: '/journal' },
];

export default function Navbar() {
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('dashboard-nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.width = '95%';
          nav.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        } else {
          nav.style.width = '90%';
          nav.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="dashboard-nav"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 rounded-full mt-6 mx-auto w-[90%] max-w-6xl bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-2xl transition-all duration-300"
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6a38d4] to-[#006875] flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>all_inclusive</span>
        </div>
        <span className="font-['Geist'] text-[20px] leading-[40px] font-bold tracking-tight text-[#191c1e]">Legacy OS</span>
      </Link>

      {/* Center Nav */}
      <nav className="hidden md:flex items-center gap-1 bg-black/5 rounded-full p-1.5">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white shadow-sm text-[#191c1e]'
                  : 'text-[#494454] hover:bg-white/40'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-[#494454]">
          <Settings size={18} />
        </Link>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-[#494454] relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#6a38d4] rounded-full border-2 border-white/50"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#6a38d4] flex items-center justify-center text-white text-[12px] font-['Geist'] font-medium tracking-wide shadow-lg cursor-pointer">
          RK
        </div>
      </div>
    </header>
  );
}
