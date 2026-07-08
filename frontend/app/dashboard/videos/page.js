'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { videoAPI } from '@/lib/apiService';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await videoAPI.getAll();
      setVideos(response.data || []);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await videoAPI.search(query);
        setVideos(response.data || []);
      } catch (error) {
        toast.error('Search failed');
      }
    } else {
      fetchVideos();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;

    try {
      await videoAPI.delete(id);
      setVideos(videos.filter(v => v.id !== id));
      toast.success('Video deleted');
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resource_type', 'video');
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      const videoRes = await videoAPI.create({
        url: data.secure_url,
        thumbnailUrl: data.secure_url.replace('/upload/', '/upload/q_auto,w_300/') + '.jpg',
        title: file.name,
        description: '',
      });

      setVideos([videoRes.data, ...videos]);
      setUploadOpen(false);
      toast.success('Video uploaded successfully');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton rounded-xl aspect-video"></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredVideos = videos.filter(v =>
    v.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Videos</h1>
          <button
            onClick={() => setUploadOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} /> Upload Video
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-text-muted" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search videos..."
            className="input-field pl-12"
          />
        </div>
      </motion.div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-secondary"
            >
              <img
                src={video.thumbnailUrl || 'https://via.placeholder.com/400x300?text=Video'}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Play Button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/40 transition-colors">
                  <Play className="fill-white text-white" size={24} />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-semibold truncate">{video.title}</p>
                <p className="text-sm text-white/70">{new Date(video.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(video.id);
                }}
                className="absolute top-3 right-3 p-2 rounded-lg bg-danger/20 hover:bg-danger/40 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-card p-16 rounded-2xl text-center">
          <p className="text-text-muted text-lg">No videos yet. Upload your first video!</p>
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setUploadOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 rounded-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
            <label className="block border-2 border-dashed border-accent/30 rounded-xl p-8 text-center cursor-pointer hover:border-accent transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="text-4xl mb-3">🎬</div>
              <p className="font-semibold mb-1">Drop your video here</p>
              <p className="text-text-muted text-sm">or click to browse</p>
              {uploading && <p className="text-accent mt-3">Uploading...</p>}
            </label>
            <button
              onClick={() => setUploadOpen(false)}
              className="w-full btn-secondary mt-6"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
