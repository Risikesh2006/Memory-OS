/**
 * Frontend - Quick Start Guide
 * 
 * This file documents the frontend structure and how to use components
 */

// ============================================
// PAGES (Located in app/)
// ============================================

/*
Landing Page:           app/page.js
Login:                  app/auth/login/page.js
Register:               app/auth/register/page.js
Dashboard:              app/dashboard/page.js
Photos:                 app/dashboard/photos/page.js
Videos:                 app/dashboard/videos/page.js
Journal:                app/dashboard/journal/page.js
Milestones:             app/dashboard/milestones/page.js
Timeline:               app/dashboard/timeline/page.js
Settings:               app/dashboard/settings/page.js
*/

// ============================================
// AUTHENTICATION
// ============================================

// Use AuthContext in any component:
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, token, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <p>Welcome, {user.fullName}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}

// ============================================
// API CALLS
// ============================================

// Import services:
import {
  authAPI,
  photoAPI,
  videoAPI,
  journalAPI,
  milestoneAPI,
  timelineAPI,
  userAPI,
} from '@/lib/apiService';

// Examples:
async function fetchPhotos() {
  try {
    const response = await photoAPI.getAll();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch photos', error);
  }
}

async function createPhoto(data) {
  try {
    const response = await photoAPI.create(data);
    return response.data;
  } catch (error) {
    console.error('Failed to create photo', error);
  }
}

// ============================================
// STYLING
// ============================================

// Tailwind Classes:
// .glass-card          - Glassmorphism card
// .btn-primary         - Primary button
// .btn-secondary       - Secondary button
// .input-field         - Input styling
// .skeleton            - Loading skeleton
// .text-gradient       - Gradient text
// .glass-button        - Glass effect button

// Example:
function MyButton() {
  return (
    <button className="btn-primary inline-flex items-center gap-2">
      Click me
    </button>
  );
}

// ============================================
// NOTIFICATIONS
// ============================================

import toast from 'react-hot-toast';

// Success notification:
toast.success('Item created successfully');

// Error notification:
toast.error('Something went wrong');

// Loading notification:
const id = toast.loading('Processing...');

// Update notification:
toast.success('Done!', { id });

// ============================================
// ANIMATIONS
// ============================================

import { motion } from 'framer-motion';

// Example animated component:
function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ y: -5 }}
      className="glass-card p-4"
    >
      Content
    </motion.div>
  );
}

// ============================================
// ICONS
// ============================================

import { Plus, Trash2, Edit, Search } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      <Plus size={24} />
      <Trash2 size={24} />
      <Edit size={24} />
      <Search size={24} />
    </div>
  );
}

// ============================================
// FORMS
// ============================================

import { useState } from 'react';

function MyForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter title"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Submit
      </button>
    </form>
  );
}

// ============================================
// RESPONSIVE DESIGN
// ============================================

// Tailwind breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

// Example:
function ResponsiveComponent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Content */}
    </div>
  );
}

// ============================================
// DASHBOARD COMPONENTS
// ============================================

// Import dashboard components:
import Sidebar from '@/components/Dashboard/Sidebar';
import TopNav from '@/components/Dashboard/TopNav';
import StatCard from '@/components/Dashboard/StatCard';
import RecentActivityFeed from '@/components/Dashboard/RecentActivityFeed';

// ============================================
// ENVIRONMENT VARIABLES
// ============================================

// Access in components:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Note: Only NEXT_PUBLIC_* variables are accessible in browser

// ============================================
// ROUTING
// ============================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';

function MyComponent() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/dashboard/photos');
  };

  return (
    <>
      <Link href="/dashboard">Dashboard</Link>
      <button onClick={handleNavigation}>
        Go to Photos
      </button>
    </>
  );
}

// ============================================
// DEPLOYMENT
// ============================================

// Build for production:
// npm run build

// Preview production build:
// npm start

// Deploy to Vercel:
// vercel
