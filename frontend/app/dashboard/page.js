'use client';

import { useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, Video, FileText, Trophy, FolderArchive, 
  Flame, Search, Play, Activity, Plus, Bell
} from 'lucide-react';

const CSS = `
  body {
      background-color: #000000 !important;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
  }
  .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .glass-panel:hover {
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.06);
  }
  .heatmap-cell {
      aspect-ratio: 1;
      border-radius: 4px;
      transition: all 0.3s ease;
  }
  .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
  }
`;

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white relative font-sans selection:bg-white/20 selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Spatial Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
      </div>

      {/* Top Navbar — matches Timeline design */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3"
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
              { label: 'Home',         href: '/dashboard',          active: true },
              { label: 'Timeline',     href: '/dashboard/timeline'  },
              { label: 'Journal',      href: '/dashboard/journal'   },
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
      <main className="relative z-10 pt-20 pb-24 px-10 max-w-7xl mx-auto">
        {/* Hero Header */}
        <section className="mb-12">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-2">Good Evening, Risikesh!</h1>
          <p className="text-lg text-zinc-400">Your memories are safe and growing.</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-[2rem] text-center flex flex-col items-center justify-center space-y-2 hover:scale-[1.02] cursor-pointer">
            <ImageIcon className="text-zinc-400" size={24} />
            <h3 className="text-2xl font-bold">1,248</h3>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Photos</span>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] text-center flex flex-col items-center justify-center space-y-2 hover:scale-[1.02] cursor-pointer">
            <Video className="text-zinc-400" size={24} />
            <h3 className="text-2xl font-bold">53</h3>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Videos</span>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] text-center flex flex-col items-center justify-center space-y-2 hover:scale-[1.02] cursor-pointer">
            <FileText className="text-zinc-400" size={24} />
            <h3 className="text-2xl font-bold">102</h3>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Journals</span>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] text-center flex flex-col items-center justify-center space-y-2 hover:scale-[1.02] cursor-pointer">
            <Trophy className="text-zinc-400" size={24} />
            <h3 className="text-2xl font-bold">74</h3>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Milestones</span>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] text-center flex flex-col items-center justify-center space-y-2 hover:scale-[1.02] cursor-pointer">
            <FolderArchive className="text-zinc-400" size={24} />
            <h3 className="text-2xl font-bold">18</h3>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Collections</span>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] text-center flex flex-col items-center justify-center space-y-2 hover:scale-[1.02] border-white/20 cursor-pointer">
            <Flame className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" size={24} />
            <h3 className="text-2xl font-bold">12</h3>
            <span className="text-[10px] uppercase tracking-widest text-white font-bold">Day Streak</span>
          </div>
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Memory (Left Large) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="glass-panel rounded-[2rem] overflow-hidden group relative">
              <div className="relative h-[480px]">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmh86kodyZzPaZnA63uqZzxVHvC_OCR3Xe4zJCwW9GfP-RTf0Ah2F0tcEGODq-zek1W1_owAIMJTfqZe4BkTwo7K00pTDvcSjZMbFARGie1tiCSmTHq2eCudQB2__8Qs7tNcLC2Dr35UWEYo4rgFHmYLgzdQm_cxpBKtPHKRhbLGgYIRqUqu00T09vBLNIt4S73PxuDyyBdLobeNdmQ2NY62sXla3051pMh5zrtl5IXQKdbSaG2R8aahmxpQKwfL1qNMsie47b9jRr" alt="Summit of Solitude"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10 w-full flex justify-between items-end">
                  <div className="max-w-xl">
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white mb-4 inline-block border border-white/20">On This Day: 3 Years Ago</span>
                    <h2 className="text-4xl font-extrabold text-white mb-4">Summit of Solitude</h2>
                    <p className="text-base text-white/70 line-clamp-2">"The sunset view from the hilltop was absolutely breathtaking. One of the most peaceful moments I've experienced in a long time. The climb was hard, but the silence at the top was worth every step."</p>
                  </div>
                  <button className="bg-white text-black p-4 rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Memory Activity */}
              <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between h-[300px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Memory Activity</h3>
                    <p className="text-xs text-zinc-400 font-semibold">+10% increase vs last month</p>
                  </div>
                  <Activity className="text-white/40" size={24} />
                </div>
                {/* Grayscale Heatmap */}
                <div className="grid grid-cols-11 gap-2 mt-4">
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/20"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/40"></div>
                  <div className="heatmap-cell bg-white/60"></div>
                  <div className="heatmap-cell bg-white/10"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/20"></div>
                  <div className="heatmap-cell bg-white/80"></div>
                  <div className="heatmap-cell bg-white/10"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/20"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/10"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/20"></div>
                  <div className="heatmap-cell bg-white/40"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/10"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/20"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/40"></div>
                  <div className="heatmap-cell bg-white/60"></div>
                  <div className="heatmap-cell bg-white/10"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/20"></div>
                  <div className="heatmap-cell bg-white/80"></div>
                  <div className="heatmap-cell bg-white/10"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                  <div className="heatmap-cell bg-white/20"></div>
                  <div className="heatmap-cell bg-white/5"></div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-widest mt-4">
                  <span>Less</span>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-white/5 rounded-sm"></div>
                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                    <div className="w-3 h-3 bg-white/50 rounded-sm"></div>
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* The Vault */}
              <div className="glass-panel p-8 rounded-[2rem] h-[300px] flex flex-col items-center justify-center relative overflow-hidden text-center">
                <h3 className="text-2xl font-bold mb-2">The Vault</h3>
                <p className="text-sm text-zinc-400 mb-6">4 new sensory matches found in your Synthesis stream.</p>
                <button className="px-8 py-3 bg-white/5 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-sm font-semibold">Explore Now</button>
              </div>
            </div>
          </div>

          {/* Right Column (Recent Memories) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-8 rounded-[2rem] h-full min-h-[600px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">Recent Memories</h3>
                  <button className="text-sm text-white/60 hover:text-white transition-colors underline decoration-white/20 underline-offset-4 font-semibold">See all</button>
                </div>
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[460px]">
                  {/* Memory Item 1 */}
                  <div className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img className="w-full h-full object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0nhtV7eNyJn7ZYQ11g_SG2RzqWg3Et8k8Dy4YT5PEkwqwg0VXztAk_cnipOOsmF39tl_u3hMR-ALJgrlifq-FhJUTpruDRdx8dN7rtffxdrsVLYobwsQVBpUH7rbTrNHJ8tpJrh38KXnfFHAkJYI9Md7gha5cnQcqt08v-t9cAgJwjckdGwunEY_cgbn20n9dPYZS25W9toygf3JRrr4milmYkHaXo7mu5xBYXFr6Vn7wFXYxEgAxAnmPkCAm7nLljCyeIgA596_v" alt="Pondicherry"/>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] text-zinc-400 font-semibold mb-1">June 12, 2025</p>
                      <h4 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors">Peaceful Morning at Pondicherry</h4>
                      <p className="text-xs text-zinc-500 font-medium">Location: Pondicherry, India</p>
                    </div>
                  </div>
                  {/* Memory Item 2 */}
                  <div className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img className="w-full h-full object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC737FuzWwyW1Ba5d47TNsggZ22kSEGXrB0yOWz_IwHLFwcRI4xwckYABIDPgxdpG1LCX3gQdp8WdBz2rVrzvxKOnIRh1RCfPexzH8otv1LAW17fSK3hsCKdAndc8jV4YMs_BY9SKWDcFShk92DNMa9-79Lx8ldR1EiNLiJi1KISer07NStgwnihKOLg6OQJtD1-aQSrWA31_9KyUQXzzYeo_xRlKPEcr98uDbL6n750woS9pJdYLN7lW7qq4NPZO37JInQzanqU2Qm" alt="Campfire"/>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] text-zinc-400 font-semibold mb-1">April 25, 2025</p>
                      <h4 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors">Campfire Night Stories</h4>
                      <p className="text-xs text-zinc-500 font-medium">Location: Coorg, Karnataka</p>
                    </div>
                  </div>
                  {/* Memory Item 3 */}
                  <div className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img className="w-full h-full object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd1PFK_6IE_V9OSqAcuc8dUseiGymtYo8crFVMt-moSgV9AGdoQxxyYS_pp7ZqYD5Yl1D2TIfg-6wHnU7jnXQ1gZ0sov5imK7d7yUPNuAg1-Czb1YzAa5lNyIlek-FEFeYcUraHWhIMypI-46bu42ObDGQ_bxandfSDS3wYtTU9SJ_McO2rYMbfTtNifru_R2snAMGhmHDgOJDrl_pPPRAQ0kLAiujLr9oaa8Q2fVaX3Mhd7ljU5iVxHvroRUvaNPgUaSHQedDvY-u" alt="Bruno"/>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] text-zinc-400 font-semibold mb-1">Jan 18, 2025</p>
                      <h4 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors">My Puppy Bruno</h4>
                      <p className="text-xs text-zinc-500 font-medium">Category: Pets</p>
                    </div>
                  </div>
                  {/* Memory Item 4 */}
                  <div className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img className="w-full h-full object-cover filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwsnzR5DMiauFMY7f6taHgSi46LSt10g2rzkDT5DPpvoIT_jVx0OfulYxUwWsOGb1Zf4PpPENqp2crLxy7nTS4co3VCZ4BhkCZLgMMG4-UFtorNZ8jCjma4OA4FiOp_q8ImqaTlUyRz8oEteND_DXIuLqoU7rbKWYzbyrliSSK0g3xRXOLqKePF4Q7ob1WAnB90NlebzYJG86nqVWkxOodsay1WD5YSdwyUp_GrIABKyM-QrkW3jDls1oawT2iqkbLheAhlmp05Cui" alt="Road Trip"/>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] text-zinc-400 font-semibold mb-1">Feb 14, 2025</p>
                      <h4 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors">Coastal Road Trip</h4>
                      <p className="text-xs text-zinc-500 font-medium">Location: Wayanad, Kerala</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 shrink-0">
                <button className="w-full py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] active:scale-95 duration-150 text-sm">
                  <Plus size={16} /> Create New Memory
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/30 backdrop-blur-[40px] border-t border-white/10 relative z-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-2xl font-bold tracking-tight">Legacy OS</span>
          <p className="text-xs text-zinc-400">© 2026 Legacy OS. All rights reserved. Your life, beautifully remembered.</p>
        </div>
        <div className="flex gap-8 text-xs font-semibold text-zinc-400">
          <a className="hover:text-white transition-colors duration-300" href="#">Privacy Policy</a>
          <a className="hover:text-white transition-colors duration-300" href="#">Terms of Service</a>
          <a className="hover:text-white transition-colors duration-300" href="#">Digital Legacy Act</a>
          <a className="hover:text-white transition-colors duration-300" href="#">Help Center</a>
        </div>
      </footer>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-white text-black rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 active:scale-90 transition-all duration-300 shadow-white/10">
          <Plus size={24} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>
    </div>
  );
}
