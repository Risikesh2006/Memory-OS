'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { photoAPI } from '@/lib/apiService';
import Image from 'next/image';

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await photoAPI.getAll();
      setPhotos(response.data || []);
    } catch (error) {
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await photoAPI.search(query);
        setPhotos(response.data || []);
      } catch (error) {
        toast.error('Search failed');
      }
    } else {
      fetchPhotos();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await photoAPI.delete(id);
      setPhotos(photos.filter(p => p.id !== id));
      toast.success('Photo deleted');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      const photoRes = await photoAPI.create({
        url: data.secure_url,
        title: file.name,
        description: '',
      });

      setPhotos([photoRes.data, ...photos]);
      setUploadOpen(false);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton rounded-xl aspect-square"></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredPhotos = photos.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Photo Gallery</h1>
          <button
            onClick={() => setUploadOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} /> Upload Photo
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-text-muted" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search photos..."
            className="input-field pl-12"
          />
        </div>
      </motion.div>

      {/* Gallery Grid */}
      {filteredPhotos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                <div className="text-white flex-1 min-w-0">
                  <p className="font-semibold truncate">{photo.title}</p>
                  <p className="text-sm text-white/70">{new Date(photo.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-2 rounded-lg bg-danger/20 hover:bg-danger/40 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-card p-16 rounded-2xl text-center">
          <p className="text-text-muted text-lg">No photos yet. Upload your first memory!</p>
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
            <h2 className="text-2xl font-bold mb-6">Upload Photo</h2>
            <label className="block border-2 border-dashed border-accent/30 rounded-xl p-8 text-center cursor-pointer hover:border-accent transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="text-4xl mb-3">📸</div>
              <p className="font-semibold mb-1">Drop your photo here</p>
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
