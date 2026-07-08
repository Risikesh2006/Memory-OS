'use client';

import { useState, useEffect } from 'react';
import { Landmark, Plus } from 'lucide-react';
import { collectionAPI, aiAPI } from '@/lib/apiService';
import GalleryView from '@/components/Museum/GalleryView';
import ExhibitionView from '@/components/Museum/ExhibitionView';
import toast from 'react-hot-toast';

export default function MuseumPage() {
  const [collections, setCollections] = useState([]);
  const [allMemories, setAllMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeExhibition, setActiveExhibition] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch collections and memories in parallel
        const [colRes, memRes] = await Promise.all([
          collectionAPI.getAll(),
          aiAPI.getAllMemories()
        ]);
        setCollections(colRes.data || []);
        setAllMemories(memRes.data || []);
      } catch (error) {
        toast.error('Failed to load museum data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen relative">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-los-text/10 text-los-text mb-4 border border-los-border">
            <Landmark size={28} />
          </div>
          <h1 className="los-heading-xl text-los-text mb-2 font-serif italic">Digital Museum</h1>
          <p className="los-body max-w-2xl">
            Step into curated exhibitions of your life. Group memories into thematic collections and view them in an immersive, distraction-free gallery space.
          </p>
        </div>

        <button className="los-btn-primary whitespace-nowrap bg-los-bg border border-los-border text-white hover:bg-white hover:text-black shadow-none">
          <Plus size={18} /> New Exhibition
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-los-card los-skeleton" />
          ))}
        </div>
      ) : (
        <GalleryView 
          collections={collections} 
          onSelectCollection={setActiveExhibition} 
        />
      )}

      {/* Fullscreen Exhibition Viewer */}
      {activeExhibition && (
        <ExhibitionView 
          collection={activeExhibition}
          memories={allMemories}
          onClose={() => setActiveExhibition(null)}
        />
      )}
    </div>
  );
}
