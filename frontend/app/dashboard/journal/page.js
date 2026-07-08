'use client';

import { useJournal } from '@/context/JournalContext';
import JournalHome from '@/components/Journal/JournalHome';
import FloatingNav from '@/components/Navigation/FloatingNav';

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingNav />
      <main className="relative pt-14">
        <JournalHome />
      </main>
    </div>
  );
}
