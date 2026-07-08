'use client';
import Navbar from '@/components/dashboard/Navbar';

export default function CollectionsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main className="pt-28 pb-12 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-6xl mb-6">📦</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">My Collections</h1>
          <p className="text-slate-500 text-lg max-w-md">
            Organise your memories into beautiful, themed collections. Coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
