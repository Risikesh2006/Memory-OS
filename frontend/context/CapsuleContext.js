'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CapsuleContext = createContext(null);

const SAMPLE_CAPSULES = [
  {
    id: 'c1',
    title: 'Monolith Series',
    description: 'A curation of singular moments that defined the silence of 2023.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtW1N3dUDzTxzwVPJPnNxKgooRcdgDhMqjImDBauwM00UrF1EV-gEAnsg74N0OysWvEu54eJhzoTfEA7V2VR9ZXEeluevuTTx6jCmB0PwXjJxGn0nZIYkXho7SWzlFnF1gwNFJOoEFIcFg7zhqI51zmd96cfcv1-bcm8bUjHqA2aeEQJ0aMiVQPHcsC4EjdDnQ6b9S7jc3iUmaSHdn7733Vr5EfIOwGSrARK6yDR-Fc0mH-_Rnw9c8AQ',
    createdAt: new Date('2021-01-01').toISOString(),
    unlockAt: null,
    status: 'unlocked',
    content: [
      { type: 'text', value: 'The monolith stood silent against the starless sky.' },
      { type: 'image', value: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80' },
    ],
    tags: ['Featured', 'Stream', '2021-2023'],
    itemCount: 1402,
  },
  {
    id: 'c2',
    title: 'Neural Streams',
    description: 'Direct neural interface logs and abstract visual thoughts.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVW5V5o-r7ptVEpzb1euUk8WTNaEaQdTD4j_sLj1eDlm6CQPRwFVsrWcP-vtAzzrgBxrcHENlkViNWju6CUlMwjdEXOrl7SoLZFSFM6lW1fyQsf-OvkCUPzImXbtBtRymR8wqn9bYnwxDihzYMFqDusU83AROYaEiZksRCK2OgYNEGyImMAHN8qsTPc0uuNutoLWA0JQ7_wTUQEXfBIwR0tnf8Uzcwh5i4jsf_oJquviObRe1ZwJccmA',
    createdAt: new Date('2024-01-15').toISOString(),
    unlockAt: null,
    status: 'unlocked',
    content: [
      { type: 'text', value: 'Neural patterns emerging from the interface.' },
    ],
    tags: ['Neural', 'Logs', 'Active'],
    itemCount: 84,
  },
  {
    id: 'c3',
    title: 'Urban Echoes',
    description: 'Fragmented memories from metropolitan environments.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkNSYUSDudrvVFyVtUWYSoq4_T_SlwFsMafy-rNyk_XN9ZmXoCaWHc7JVdoMVcTg_aLwAFfK8oA1jBNJcwU_Oi9_12HUzEy-NB93wGlCHrE8jtU_9n21WVmP7kjjhueCkuuTcFhOY9DbS8wZS4AeCV6TdGeiaM_ISqVowue6rNH8rdph0zgvUYLWe2juCevtuC6S28yM1DrEjZKLMgEuW0yc2FcDYt0ZYoOB_uMf7gyq-3f3JTojAXlw',
    createdAt: new Date('2018-06-01').toISOString(),
    unlockAt: null,
    status: 'unlocked',
    content: [
      { type: 'text', value: 'Rain-slicked streets at midnight.' },
    ],
    tags: ['Urban', 'Memories', '2018-Present'],
    itemCount: 312,
  },
  {
    id: 'c4',
    title: 'Oceanic Calm',
    description: 'The vast expanses where memory meets the horizon.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOE-gQITJnHmoGc8NrswhtJqecqKmJorWndlOXuDB8iEpgSjOBLScQQaAQzKubJRYAP8fwpn-fRrcZI8TUUuDtgFaBzDRHEkUDUdFRMq4YVYnUNvSe-c75FZiYAoaGVGwKFvNuTwaE3amQ6SvczbTCltV8ZHkrNMWWzFFL2O1tAf3GMCLZhD3XJnrmA61QH8f2F0bAKiZ1gyjEL_UY5YtJqOOwazox_OUOokmBik0g9HtQkcgKvwkz3g',
    createdAt: new Date('2023-03-20').toISOString(),
    unlockAt: null,
    status: 'unlocked',
    content: [
      { type: 'text', value: 'The ocean meets the horizon in infinite calm.' },
    ],
    tags: ['Atmosphere', 'Nature'],
    itemCount: 56,
  },
  {
    id: 'c5',
    title: 'Future Memories',
    description: 'A time capsule locked until 2027.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date().toISOString(),
    unlockAt: new Date('2027-01-01').toISOString(),
    status: 'locked',
    content: [
      { type: 'text', value: 'This content will be revealed in the future.' },
    ],
    tags: ['Future', 'Locked'],
    itemCount: 12,
  },
];

export const CapsuleProvider = ({ children }) => {
  const [capsules, setCapsules] = useState([]);
  const [currentCapsule, setCurrentCapsule] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // all, locked, unlocked
  });

  // Load capsules from localStorage on mount
  useEffect(() => {
    const storedCapsules = localStorage.getItem('legacyCapsules');
    if (storedCapsules) {
      setCapsules(JSON.parse(storedCapsules));
    } else {
      // Initialize with sample data
      setCapsules(SAMPLE_CAPSULES);
    }
  }, []);

  // Save capsules to localStorage whenever they change
  useEffect(() => {
    if (capsules.length > 0) {
      localStorage.setItem('legacyCapsules', JSON.stringify(capsules));
    }
  }, [capsules]);

  // Update capsule statuses based on time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCapsules(prev => prev.map(capsule => {
        if (capsule.unlockAt && new Date(capsule.unlockAt) <= now && capsule.status === 'locked') {
          return { ...capsule, status: 'unlocked' };
        }
        return capsule;
      }));
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const createCapsule = (capsuleData) => {
    const newCapsule = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...capsuleData,
      createdAt: new Date().toISOString(),
      status: capsuleData.unlockAt && new Date(capsuleData.unlockAt) > new Date() ? 'locked' : 'unlocked',
      content: capsuleData.content || [],
      tags: capsuleData.tags || [],
      itemCount: capsuleData.content?.length || 0,
    };

    setCapsules(prev => [newCapsule, ...prev]);
    return newCapsule;
  };

  const updateCapsule = (id, updates) => {
    setCapsules(prev => prev.map(capsule => 
      capsule.id === id 
        ? { ...capsule, ...updates }
        : capsule
    ));
  };

  const deleteCapsule = (id) => {
    setCapsules(prev => prev.filter(capsule => capsule.id !== id));
  };

  const getCapsuleStatus = (capsule) => {
    if (!capsule.unlockAt) return 'unlocked';
    const now = new Date();
    const unlockTime = new Date(capsule.unlockAt);
    return unlockTime <= now ? 'unlocked' : 'locked';
  };

  const getCountdown = (unlockAt) => {
    if (!unlockAt) return null;
    const now = new Date();
    const unlockTime = new Date(unlockAt);
    const diff = unlockTime - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const filterCapsules = () => {
    return capsules.filter(capsule => {
      // Search filter
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        const matchesSearch = 
          capsule.title.toLowerCase().includes(lowerQuery) ||
          capsule.description.toLowerCase().includes(lowerQuery) ||
          capsule.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status === 'locked' && capsule.status !== 'locked') return false;
      if (filters.status === 'unlocked' && capsule.status !== 'unlocked') return false;

      return true;
    });
  };

  const value = {
    capsules,
    currentCapsule,
    filters,
    createCapsule,
    updateCapsule,
    deleteCapsule,
    setCurrentCapsule,
    setFilters,
    getCapsuleStatus,
    getCountdown,
    filterCapsules,
  };

  return <CapsuleContext.Provider value={value}>{children}</CapsuleContext.Provider>;
};

export const useCapsule = () => {
  const context = useContext(CapsuleContext);
  if (!context) {
    throw new Error('useCapsule must be used within a CapsuleProvider');
  }
  return context;
};
