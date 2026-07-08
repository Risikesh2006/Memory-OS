'use client';

import { useRouter } from 'next/navigation';
import { Search, Bell } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';
import JournalDetail from '@/components/Journal/JournalDetail';

function JournalDetailPageContent({ params }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3"
        style={{
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 shrink-0">
            <img src="/images/legacy-os-logo.png" alt="Legacy OS Logo" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-bold text-base tracking-tight text-white uppercase">Legacy OS</span>
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'Home',         href: '/dashboard',          active: false },
              { label: 'Timeline',     href: '/dashboard/timeline'  },
              { label: 'Journal',      href: '/dashboard/journal',   active: true },
              { label: 'Collections',  href: '/dashboard/capsules'  },
              { label: 'Memories',     href: '/dashboard/memories'    },
              { label: 'AI Assistant', href: '/dashboard/chat'      },
              { label: 'The Vault',    href: '/dashboard/vault'     },
            ].map(n => (
              <button
                key={n.label}
                onClick={() => router.push(n.href)}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  n.active ? 'text-white border-b-2 border-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              className="rounded-full pl-9 pr-4 py-2 text-[13px] text-white focus:outline-none w-52 placeholder-white/35 transition-all"
              placeholder="Search by year or time..."
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            />
          </div>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <Bell size={16} />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20">
            <img src="https://i.pravatar.cc/36?img=12" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <JournalDetail journalId={params.id} />
      </main>
    </div>
  );
}

export default function JournalDetailPage({ params }) {
  return <JournalDetailPageContent params={params} />;
}
