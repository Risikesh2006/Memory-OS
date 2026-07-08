'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { milestoneAPI } from '@/lib/apiService';

const categories = ['Education', 'Career', 'Personal', 'Travel', 'Achievement'];
const categoryColors = {
  Education: 'from-blue-500 to-blue-600',
  Career: 'from-purple-500 to-purple-600',
  Personal: 'from-pink-500 to-pink-600',
  Travel: 'from-green-500 to-green-600',
  Achievement: 'from-yellow-500 to-yellow-600',
};

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Achievement',
  });

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const response = await milestoneAPI.getAll();
      setMilestones((response.data || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.date) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const response = await milestoneAPI.update(editingId, formData);
        setMilestones(milestones.map(m => m.id === editingId ? response.data : m).sort((a, b) => new Date(b.date) - new Date(a.date)));
        toast.success('Milestone updated');
      } else {
        const response = await milestoneAPI.create(formData);
        setMilestones([response.data, ...milestones].sort((a, b) => new Date(b.date) - new Date(a.date)));
        toast.success('Milestone created');
      }
      setCreateOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save milestone');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this milestone?')) return;

    try {
      await milestoneAPI.delete(id);
      setMilestones(milestones.filter(m => m.id !== id));
      toast.success('Milestone deleted');
    } catch (error) {
      toast.error('Failed to delete milestone');
    }
  };

  const handleEdit = (milestone) => {
    setFormData({
      title: milestone.title,
      description: milestone.description,
      date: milestone.date.split('T')[0],
      category: milestone.category,
    });
    setEditingId(milestone.id);
    setCreateOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Achievement',
    });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton rounded-xl h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Milestones</h1>
          <button
            onClick={() => {
              resetForm();
              setCreateOpen(true);
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} /> Add Milestone
          </button>
        </div>
      </motion.div>

      {/* Milestones Timeline */}
      {milestones.length > 0 ? (
        <div className="space-y-0">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {/* Timeline Line */}
              {index < milestones.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-accent/20" />
              )}

              <div className="glass-card p-6 rounded-xl hover:border-accent/50 transition-all group">
                <div className="flex gap-4">
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-4 h-4 rounded-full bg-accent border-4 border-primary group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${categoryColors[milestone.category] || categoryColors['Achievement']} text-white`}>
                            {milestone.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold">{milestone.title}</h3>
                        <p className="text-text-muted text-sm mt-1">
                          {new Date(milestone.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-text-muted mt-2">{milestone.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(milestone)}
                          className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(milestone.id)}
                          className="p-2 rounded-lg bg-danger/10 hover:bg-danger/20 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 rounded-2xl text-center">
          <Target size={48} className="mx-auto text-accent/50 mb-4" />
          <p className="text-text-muted text-lg">No milestones yet. Create your first achievement!</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {createOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setCreateOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 rounded-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Milestone' : 'New Milestone'}</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Got my first job"
                  className="input-field"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-secondary">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell the story..."
                  rows="4"
                  className="input-field resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setCreateOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
