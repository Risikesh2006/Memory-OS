'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    privateProfile: false,
  });

  const handleSettingChange = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Setting updated');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'security', label: 'Security', icon: <Lock size={20} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Settings className="text-accent" size={32} />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account Settings */}
      {activeTab === 'account' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Account Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="glass-card p-4 rounded-lg">
                  <p className="text-lg">{user?.fullName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="glass-card p-4 rounded-lg">
                  <p className="text-lg">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Member Since</label>
                <div className="glass-card p-4 rounded-lg">
                  <p className="text-lg">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <button className="btn-secondary w-full">
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-accent/30 transition-colors">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-text-muted">Receive updates via email</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-checked:bg-accent rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-accent/30 transition-colors">
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-sm text-text-muted">Browser notifications</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleSettingChange('pushNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-checked:bg-accent rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Security</h2>

            <div className="space-y-4">
              <button className="w-full btn-secondary text-left px-6 py-3 flex justify-between items-center">
                <span>Change Password</span>
                <span className="text-accent">→</span>
              </button>

              <button className="w-full btn-secondary text-left px-6 py-3 flex justify-between items-center">
                <span>Two-Factor Authentication</span>
                <span className="text-text-muted text-sm">Disabled</span>
              </button>

              <button className="w-full btn-secondary text-left px-6 py-3 flex justify-between items-center">
                <span>Active Sessions</span>
                <span className="text-accent">→</span>
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl border-2 border-danger/30">
            <h3 className="text-xl font-semibold mb-4 text-danger">Danger Zone</h3>
            
            <p className="text-text-muted mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>

            <button className="w-full px-6 py-3 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg font-semibold transition-colors">
              Delete Account
            </button>
          </div>
        </motion.div>
      )}

      {/* Logout */}
      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="btn-secondary flex-1"
        >
          Logout
        </button>
        <button className="btn-primary flex-1">
          Save Changes
        </button>
      </div>
    </div>
  );
}
