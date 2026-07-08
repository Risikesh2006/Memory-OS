'use client';

import { useCapsule } from '@/context/CapsuleContext';
import CapsuleHome from '@/components/Capsule/CapsuleHome';
import FloatingNav from '@/components/Navigation/FloatingNav';

export default function CapsulePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingNav />
      <main className="relative pt-14">
        <CapsuleHome />
      </main>
    </div>
  );
}
