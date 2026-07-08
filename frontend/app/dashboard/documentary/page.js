'use client';

import { useState, useEffect } from 'react';
import { aiAPI } from '@/lib/apiService';
import MemorySelector from '@/components/Documentary/MemorySelector';
import DocumentaryPreview from '@/components/Documentary/DocumentaryPreview';
import { Film, Clapperboard, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentaryPage() {
  const [memories, setMemories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [narrative, setNarrative] = useState(null);

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

  const handleGenerate = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one memory');
      return;
    }

    setGenerating(true);
    setNarrative(null); // Reset preview
    
    // Simulate generation time to feel "AI-like"
    const minimumWait = new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const responsePromise = aiAPI.generateNarrative({ 
        memoryIds: selectedIds,
        duration: '5min' 
      });
      
      const [response] = await Promise.all([responsePromise, minimumWait]);
      setNarrative(response.data);
      toast.success('Documentary generated successfully!');
      
      // Scroll to preview
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error('Failed to generate documentary');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-los-rose/10 text-los-rose mb-4 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <Clapperboard size={28} />
        </div>
        <h1 className="los-heading-xl text-los-text mb-2">AI Documentary Studio</h1>
        <p className="los-body max-w-2xl">
          Transform your scattered memories into a cinematic, narrated documentary. Select the moments, and let the AI script the story of your life.
        </p>
      </div>

      {/* Preview Section - Appears when narrative is generated */}
      {narrative && (
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Film className="text-los-accent" /> Your Premiere
          </h2>
          <DocumentaryPreview narrative={narrative} memories={memories} />
        </div>
      )}

      {/* Generation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="order-2 lg:order-1">
          {loading ? (
            <div className="h-[400px] rounded-2xl bg-los-card los-skeleton" />
          ) : (
            <MemorySelector 
              memories={memories} 
              selectedIds={selectedIds} 
              onSelectionChange={setSelectedIds} 
            />
          )}
        </div>

        <div className="order-1 lg:order-2 space-y-6">
          <div className="bg-los-card rounded-2xl border border-los-border p-6 shadow-lg sticky top-32">
            <h3 className="text-lg font-bold text-white mb-4">Production Settings</h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm font-medium text-los-text-muted mb-2 block">Selected Media</label>
                <div className="text-3xl font-black text-los-text tabular-nums tracking-tight">
                  {selectedIds.length} <span className="text-sm font-normal text-los-text-muted">/ 30 max</span>
                </div>
              </div>

              <div className="pt-4 border-t border-los-border/50">
                <label className="text-sm font-medium text-los-text-muted mb-2 block">Documentary Style</label>
                <select className="los-input bg-los-bg">
                  <option value="cinematic">Cinematic Journey</option>
                  <option value="nostalgic">Nostalgic Reflection</option>
                  <option value="upbeat">Upbeat & Energetic</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-los-text-muted mb-2 block">Background Score</label>
                <select className="los-input bg-los-bg">
                  <option value="ambient">Ambient Cinematic</option>
                  <option value="piano">Emotional Piano</option>
                  <option value="acoustic">Acoustic Indie</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={generating || selectedIds.length === 0}
              className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-white disabled:opacity-50 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-los-accent via-los-rose to-los-accent animate-gradient" />
              
              <span className="relative z-10 flex items-center gap-2">
                {generating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Producing Magic...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Documentary
                  </>
                )}
              </span>
            </button>
            
            {selectedIds.length === 0 && (
              <p className="text-xs text-los-rose mt-3 text-center">Select memories to begin</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
