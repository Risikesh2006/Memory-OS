'use client';

import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Infinity } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  body {
    background-color: #000000;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }
  .glass-panel {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.10);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .glass-panel:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.25);
  }
  .hero-gradient {
    background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,1) 80%);
  }
  ::selection { background: rgba(255,255,255,0.2); color: #fff; }
`;

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="bg-black text-white min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-3 fixed top-0 left-0 right-0 z-50 rounded-full mt-6 mx-auto w-[95%] max-w-7xl backdrop-blur-[40px] border border-white/10 bg-white/[0.03] shadow-2xl">
        <div className="flex items-center gap-2">
          <img
            src="/images/legacy-os-logo.png"
            alt="Legacy OS Logo"
            className="w-8 h-8 rounded-full object-cover hover:shadow-[0_0_14px_rgba(255,255,255,0.35)] transition-shadow"
          />
          <span className="text-xl font-bold tracking-tight text-white">Legacy OS</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-sm font-semibold text-white border-b border-white pb-0.5 transition-all cursor-pointer" onClick={() => router.push('/dashboard/timeline')}>Timeline</a>
          <a className="text-sm font-medium text-white/70 hover:text-white transition-all cursor-pointer" onClick={() => router.push('/dashboard/journal')}>Journal</a>
          <a className="text-sm font-medium text-white/70 hover:text-white transition-all cursor-pointer" onClick={() => router.push('/dashboard/vault')}>The Vault</a>
          <a className="text-sm font-medium text-white/70 hover:text-white transition-all cursor-pointer" onClick={() => router.push('/dashboard/capsules')}>Collection</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={15} />
            <input className="bg-white/10 border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-white/40 w-48 transition-all focus:w-64 text-white placeholder-white/40" placeholder="Search memories..." type="text"/>
          </div>
          <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-transform" onClick={() => router.push('/login')}>Get Access</button>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-center px-10 relative hero-gradient overflow-hidden">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-8">
              <span className="text-white text-xs">✦</span>
              <span className="text-xs font-medium uppercase tracking-widest text-white/70">Now with AI-powered memory search</span>
            </div>
            <h1 className="text-[72px] leading-[1.1] font-extrabold tracking-[-0.04em] text-white mb-6">
              Your Life, <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">Beautifully Remembered.</span>
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Legacy OS is your personal life operating system — a cinematic digital universe to preserve, explore, and relive every moment that matters.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-black px-10 py-4 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform group" onClick={() => router.push('/dashboard')}>
                Start for free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/[0.03] border border-white/10 text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-white/[0.06] transition-colors">
                Watch demo
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-20 w-full max-w-6xl mx-auto relative group">
            <div className="absolute -inset-20 bg-white/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-white/10 transition-all duration-1000"></div>
            <div className="glass-panel p-4 rounded-[40px] shadow-2xl relative overflow-hidden">
              <img
                alt="Legacy OS Dashboard"
                className="w-full h-auto rounded-[32px] transition-all duration-700 cursor-pointer object-cover aspect-video hover:scale-[1.02] active:scale-[0.98]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLyZuffuJ-5jvYBuWzkuhtDdvjjAJzyaCR0QQLzD4EtB75KsrsOFxXeLCv2-ekHHX05soXDYGtxG9Q6sOV9DaAddd8n-HBdvV0eiQOWCESpTVHTElE68vprcwt_sG_9qzNpC1ikiKqRlGW_HK0oj3JOQKKG1U0nY2hin1Zr1avyWqdcSHjGYMkhkGXDmbj8PNh1TzHXRdsxXxOW57jApQS_f_BPydjeCNsldrViAHTnPoVlJuFQaFnyv_47-R2e0qJjsBMuWlf_O4i"
                onClick={() => router.push('/dashboard')}
              />
            </div>
          </div>
        </section>

        {/* Spatial Architecture */}
        <section className="py-24 px-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[40px] font-bold tracking-tight text-white mb-4">Spatial Architecture</h2>
            <p className="text-base text-white/60">Designed for the depth of human emotion.</p>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {/* Memory Search - Large */}
            <div className="col-span-12 md:col-span-8 glass-panel p-10 rounded-[2rem] flex flex-col justify-between group h-[480px]">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Search className="text-white" size={24} />
                  </div>
                  <span className="text-white/20 text-5xl font-light">◎</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Memory Search</h3>
                <p className="text-base text-white/60 max-w-md mb-6">
                  Semantic AI that understands your life. Ask "When did I last feel truly inspired?" and watch your legacy weave together.
                </p>
                <a className="inline-flex items-center gap-2 text-white text-sm font-semibold hover:underline group cursor-pointer">
                  Explore Neural Search
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <div className="mt-8 h-40 overflow-hidden rounded-xl relative">
                <img className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASp-mXAeSLSPEom6QTEKGZ5H4u0njn44BFOh0hNOIBH0eUuBPlrOx-n1e6pX2f9zkMuwNXeFqJPqsqvonycqxT_b0h061LKZx2hRl6b-1nAtuAYah_sKV1q3RqgJ52HqiHLbX48oAnLy2AjybOickfnpAnSusKtuE07ZRJDqVex1pjTeO-BwTioGS2-1HHH_xQo1h3R81OOZD5UtlCnZ2hdVQxO3tO69fw-8cAgZngXJm5Z1FXfZYwdIdgDNa8OtOQ4iRGNto-ouiP" alt="Neural Search" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
            </div>
            {/* The Timeline */}
            <div className="col-span-12 md:col-span-4 glass-panel p-10 rounded-[2rem] flex flex-col h-[480px]">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
                <span className="text-white text-xl">⏱</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">The Timeline</h3>
              <p className="text-base text-white/60 mb-auto">
                A cinematic, scrollable river of time that grows as you do. Visualized in 3D space for effortless navigation.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-black bg-white/10 backdrop-blur-md"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-black bg-white/20 backdrop-blur-md"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center text-black font-bold text-xs">+12</div>
                  </div>
                  <span className="text-xs text-white/60 font-medium">Recently archived moments</span>
                </div>
              </div>
            </div>
            {/* The Vault */}
            <div className="col-span-12 md:col-span-4 glass-panel p-10 rounded-[2rem] h-[400px] flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">The Vault</h3>
              <p className="text-base text-white/60">
                Encryption that lives beyond you. Secure your digital legacy with post-quantum security protocols and multi-generational access keys.
              </p>
            </div>
            {/* Digital Synthesis */}
            <div className="col-span-12 md:col-span-8 glass-panel p-10 rounded-[2rem] h-[400px] flex flex-col md:flex-row gap-8 overflow-hidden">
              <div className="flex-1 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
                  <span className="text-white text-xl">✦</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Digital Synthesis</h3>
                <p className="text-base text-white/60">
                  Connect your wearables, photos, and calendar to create a living digital twin of your personal growth journey.
                </p>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                  <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center">
                    <span className="text-white/40 text-5xl">◎</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-white/10 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[['10K+','MEMORIES STORED'],['2K+','HAPPY USERS'],['98%','RETENTION RATE'],['∞','STORIES TOLD']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-[72px] font-extrabold tracking-tight text-white mb-2 leading-none">{num}</div>
                  <div className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-10 flex flex-col items-center justify-center text-center">
          <div className="glass-panel p-16 rounded-[3rem] max-w-5xl w-full relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-[72px] font-extrabold tracking-tight text-white mb-8 leading-tight">Begin Your Legacy</h2>
              <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                Your memories deserve a permanent home. Join thousands of users who are building their digital immortality today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-black px-12 py-5 rounded-full text-sm font-bold hover:scale-105 transition-transform" onClick={() => router.push('/dashboard')}>
                  Create Free Account
                </button>
                <button className="bg-white/[0.03] border border-white/10 text-white px-12 py-5 rounded-full text-sm font-bold hover:bg-white/[0.06] transition-colors">
                  Explore Pricing
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-10 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/legacy-os-logo.png"
                alt="Legacy OS Logo"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-base font-bold text-white">Legacy OS</span>
            </div>
            <p className="text-sm text-white/50 max-w-xs text-center md:text-left">
              © 2026 Legacy OS. All rights preserved in the aether. Your life, beautifully remembered.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Privacy','Terms','Manifesto','Support'].map(item => (
              <a key={item} className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">↗</span>
            </button>
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">🌐</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
