'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { aiAPI } from '@/lib/apiService';
import BookPreview from '@/components/Book/BookPreview';
import BookExport from '@/components/Book/BookExport';
import toast from 'react-hot-toast';

export default function BookPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState(null);
  
  // Settings
  const [theme, setTheme] = useState('classic');
  const [title, setTitle] = useState('My Legacy');
  const [subtitle, setSubtitle] = useState('A Journey in Memories');
  const [yearRange, setYearRange] = useState('all');

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await aiAPI.getAllMemories();
        setMemories(response.data || []);
      } catch (error) {
        toast.error('Failed to load memories');
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  const handleGenerateBook = () => {
    if (memories.length === 0) {
      toast.error('No memories available to create a book');
      return;
    }

    setLoading(true);
    
    // Simulate AI curating the book content and generating layout
    setTimeout(() => {
      let filtered = [...memories];
      if (yearRange !== 'all') {
        const year = parseInt(yearRange);
        filtered = filtered.filter(m => new Date(m.date).getFullYear() === year);
      }
      
      // Sort chronologically
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Select top ~20 items for the book preview
      const curated = filtered.slice(0, 20);
      
      if (curated.length === 0) {
        toast.error('No memories found for selected filters');
        setLoading(false);
        return;
      }

      setBookData(curated);
      setLoading(false);
      toast.success('Book preview generated!');
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen">
      <div className="mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 text-white mb-4 border border-white/20 shadow-lg">
          <BookOpen size={28} />
        </div>
        <h1 className="los-heading-xl text-los-text mb-2 font-serif">Legacy Book Generator</h1>
        <p className="los-body max-w-2xl">
          Turn your digital memories into a beautiful, print-ready physical book. The AI curates your best photos and journals, automatically handling layout and typography.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 xl:gap-12">
        
        {/* Left Column: Preview or Setup */}
        <div className="order-2 lg:order-1">
          {bookData ? (
            <div className="bg-los-bg-secondary rounded-3xl p-6 md:p-12 border border-los-border shadow-2xl relative overflow-hidden">
              {/* Decor */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-los-accent to-transparent opacity-50" />
              
              <BookPreview 
                data={bookData} 
                coverTitle={title} 
                coverSubtitle={subtitle} 
                theme={theme} 
              />
            </div>
          ) : (
            <div className="h-[500px] rounded-3xl border border-dashed border-los-border bg-los-card/30 flex flex-col items-center justify-center text-center p-8">
              <BookOpen size={48} className="text-los-text-muted opacity-30 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Book is Empty</h2>
              <p className="text-los-text-muted max-w-md mb-8">
                Configure your book settings on the right and click generate to let the AI design your pages.
              </p>
              <button onClick={handleGenerateBook} className="los-btn-primary">
                <Sparkles size={18} /> Generate Preview
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Settings & Export */}
        <div className="order-1 lg:order-2 space-y-8">
          
          <div className="bg-los-card border border-los-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6">Book Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-2 block">Book Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-los-bg border border-los-border rounded-xl px-4 py-2.5 text-white focus:border-los-accent outline-none font-serif"
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-2 block">Subtitle</label>
                <input 
                  type="text" 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-los-bg border border-los-border rounded-xl px-4 py-2.5 text-white focus:border-los-accent outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-2 block">Design Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'classic', name: 'Classic' },
                    { id: 'minimal', name: 'Minimal' },
                    { id: 'modern', name: 'Modern' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                        theme === t.id ? 'bg-los-accent text-white border-los-accent' : 'bg-los-bg text-los-text-muted border-los-border hover:border-white/20'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-los-text-muted uppercase tracking-wider mb-2 block">Content Filter</label>
                <select 
                  value={yearRange}
                  onChange={(e) => setYearRange(e.target.value)}
                  className="w-full bg-los-bg border border-los-border rounded-xl px-4 py-2.5 text-white focus:border-los-accent outline-none"
                >
                  <option value="all">Entire Lifetime</option>
                  <option value="2024">2024 Year in Review</option>
                  <option value="2023">2023 Year in Review</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerateBook}
              className="w-full mt-6 py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
            >
              <Sparkles size={16} /> Re-generate Layout
            </button>
          </div>

          {bookData && <BookExport />}
          
        </div>
      </div>
    </div>
  );
}
