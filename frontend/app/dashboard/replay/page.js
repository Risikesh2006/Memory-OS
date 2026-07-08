'use client';

import { useState, useEffect } from 'react';
import { PlaySquare } from 'lucide-react';
import { aiAPI } from '@/lib/apiService';
import ReplaySelector from '@/components/Replay/ReplaySelector';
import ReplayPlayer from '@/components/Replay/ReplayPlayer';
import toast from 'react-hot-toast';

export default function ReplayPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReplay, setActiveReplay] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await aiAPI.getAllMemories();
        setMemories(response.data || []);
      } catch (error) {
        toast.error('Failed to load memories for replay');
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  const handleSelectReplay = (categoryId) => {
    let filtered = [];
    
    // Simulate AI curation based on category
    switch (categoryId) {
      case 'year':
        const currentYear = new Date().getFullYear();
        filtered = memories.filter(m => new Date(m.date).getFullYear() === currentYear);
        break;
      case 'milestones':
        filtered = memories.filter(m => m.memoryType === 'milestone');
        break;
      case 'travel':
      case 'people':
        // Just mock some filtering for the demo
        filtered = [...memories].sort(() => 0.5 - Math.random()).slice(0, 15);
        break;
      default:
        filtered = memories.slice(0, 20);
    }

    if (filtered.length === 0) {
      toast.error(`Not enough memories found for this category.`);
      return;
    }

    // Sort chronologically
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    setActiveReplay(filtered);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen">
      <div className="mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-los-amber/10 text-los-amber mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <PlaySquare size={28} />
        </div>
        <h1 className="los-heading-xl text-los-text mb-2">Life Replay</h1>
        <p className="los-body max-w-2xl">
          Sit back and watch your life unfold. Enjoy AI-curated, immersive "Story" style playback of your favorite memories.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-los-card los-skeleton" />
          ))}
        </div>
      ) : (
        <ReplaySelector onSelectReplay={handleSelectReplay} />
      )}

      {activeReplay && (
        <ReplayPlayer 
          memories={activeReplay} 
          onClose={() => setActiveReplay(null)} 
        />
      )}
    </div>
  );
}
