'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const JournalContext = createContext(null);

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
  { id: 'grateful', emoji: '❤️', label: 'Grateful', color: 'bg-red-400' },
  { id: 'motivated', emoji: '🔥', label: 'Motivated', color: 'bg-orange-400' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-400' },
  { id: 'reflective', emoji: '🌧', label: 'Reflective', color: 'bg-purple-400' },
  { id: 'sad', emoji: '😔', label: 'Sad', color: 'bg-gray-400' },
  { id: 'excited', emoji: '🎉', label: 'Excited', color: 'bg-pink-400' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-indigo-400' },
];

const CATEGORIES = [
  'Personal',
  'College',
  'Travel',
  'Career',
  'Family',
  'Achievements',
  'Relationships',
  'Health',
  'Custom',
];

const SAMPLE_JOURNALS = [
  {
    id: 'j1',
    title: 'Solitude at High Altitudes',
    content: 'Today I reached the summit of Kodaikanal. The silence up here is deafening, yet comforting. Standing at the edge, looking out at the vast expanse of clouds and mountains, I realized how small our daily worries truly are. The journey was challenging, but every step was worth it for this moment of clarity.',
    mood: 'reflective',
    category: 'Travel',
    location: 'Kodaikanal, Tamil Nadu',
    tags: ['travel', 'nature', 'reflection'],
    isFavorite: true,
    isInVault: false,
    aiReflection: 'This entry reflects a period of deep contemplation and appreciation for nature. You appeared to be seeking perspective and finding peace in solitude.',
    date: '2025-07-05',
    readingTime: 2,
    attachments: [],
    createdAt: new Date('2025-07-05').toISOString(),
    updatedAt: new Date('2025-07-05').toISOString(),
  },
  {
    id: 'j2',
    title: 'The Flow of Ideas',
    content: 'Some thoughts on why creativity feels like a physical tide in the morning hours. There\'s something magical about those early morning moments when the mind is fresh and ideas seem to flow effortlessly. I\'ve been trying to capture this state more consistently.',
    mood: 'creative',
    category: 'Personal',
    location: 'Home',
    tags: ['creativity', 'ideas', 'morning'],
    isFavorite: false,
    isInVault: false,
    aiReflection: null,
    date: '2025-06-28',
    readingTime: 1,
    attachments: [],
    createdAt: new Date('2025-06-28').toISOString(),
    updatedAt: new Date('2025-06-28').toISOString(),
  },
  {
    id: 'j3',
    title: 'Architecture of Memory',
    content: 'Visited the new archival museum today. It made me realize how much of our digital lives are built on fragile, invisible scaffolding. I want to build something that lasts centuries, not just server cycles. The way light hit the concrete walls was enough to change my perspective on longevity and permanence.',
    mood: 'reflective',
    category: 'Career',
    location: 'Museum District',
    tags: ['legacy', 'tech', 'architecture'],
    isFavorite: true,
    isInVault: true,
    aiReflection: 'This entry shows strong forward-thinking and a desire to create lasting impact. You were contemplating the intersection of technology and permanence.',
    date: '2025-08-12',
    readingTime: 3,
    attachments: [],
    createdAt: new Date('2025-08-12').toISOString(),
    updatedAt: new Date('2025-08-12').toISOString(),
  },
  {
    id: 'j4',
    title: 'Analog Heartbeat',
    content: 'Found my old typewriter today. The mechanical sound of keys striking paper brings back memories of simpler times. There\'s something satisfying about the physical act of writing that digital keyboards can never quite replicate.',
    mood: 'reflective',
    category: 'Personal',
    location: 'Home',
    tags: ['nostalgia', 'writing', 'analog'],
    isFavorite: false,
    isInVault: false,
    aiReflection: null,
    date: '2025-05-19',
    readingTime: 1,
    attachments: [],
    createdAt: new Date('2025-05-19').toISOString(),
    updatedAt: new Date('2025-05-19').toISOString(),
  },
];

export const JournalProvider = ({ children }) => {
  const [journals, setJournals] = useState([]);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    mood: null,
    category: null,
    isFavorite: false,
    isInVault: false,
  });

  // Load journals from localStorage on mount
  useEffect(() => {
    const storedJournals = localStorage.getItem('legacyJournals');
    if (storedJournals) {
      setJournals(JSON.parse(storedJournals));
    } else {
      // Initialize with sample data
      setJournals(SAMPLE_JOURNALS);
    }
  }, []);

  // Save journals to localStorage whenever they change
  useEffect(() => {
    if (journals.length > 0) {
      localStorage.setItem('legacyJournals', JSON.stringify(journals));
    }
  }, [journals]);

  const createJournal = (journalData) => {
    const newJournal = {
      id: `j_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...journalData,
      isFavorite: false,
      isInVault: false,
      aiReflection: null,
      readingTime: Math.ceil(journalData.content.split(' ').length / 200),
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setJournals(prev => [newJournal, ...prev]);
    return newJournal;
  };

  const updateJournal = (id, updates) => {
    setJournals(prev => prev.map(journal => 
      journal.id === id 
        ? { ...journal, ...updates, updatedAt: new Date().toISOString() }
        : journal
    ));
  };

  const deleteJournal = (id) => {
    setJournals(prev => prev.filter(journal => journal.id !== id));
  };

  const toggleFavorite = (id) => {
    setJournals(prev => prev.map(journal =>
      journal.id === id
        ? { ...journal, isFavorite: !journal.isFavorite }
        : journal
    ));
  };

  const toggleVault = (id) => {
    setJournals(prev => prev.map(journal =>
      journal.id === id
        ? { ...journal, isInVault: !journal.isInVault }
        : journal
    ));
  };

  const generateAIReflection = (id) => {
    const journal = journals.find(j => j.id === id);
    if (!journal) return null;

    const reflections = [
      'This entry reflects a period of growth and motivation. You appeared focused on building your future.',
      'Your writing shows deep emotional awareness and a desire for meaningful connections.',
      'This moment captured seems significant - a turning point in your personal journey.',
      'The thoughts expressed here demonstrate resilience and a positive outlook.',
      'This entry reveals contemplative thinking and attention to life\'s details.',
    ];

    const reflection = reflections[Math.floor(Math.random() * reflections.length)];

    updateJournal(id, { aiReflection: reflection });
    return reflection;
  };

  const searchJournals = (query) => {
    const lowerQuery = query.toLowerCase();
    return journals.filter(journal =>
      journal.title.toLowerCase().includes(lowerQuery) ||
      journal.content.toLowerCase().includes(lowerQuery) ||
      journal.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const filterJournals = () => {
    return journals.filter(journal => {
      // Search filter
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        const matchesSearch = 
          journal.title.toLowerCase().includes(lowerQuery) ||
          journal.content.toLowerCase().includes(lowerQuery) ||
          journal.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        if (!matchesSearch) return false;
      }

      // Mood filter
      if (filters.mood && journal.mood !== filters.mood) return false;

      // Category filter
      if (filters.category && journal.category !== filters.category) return false;

      // Favorite filter
      if (filters.isFavorite && !journal.isFavorite) return false;

      // Vault filter
      if (filters.isInVault && !journal.isInVault) return false;

      return true;
    });
  };

  const exportJournal = (id, format = 'json') => {
    const journal = journals.find(j => j.id === id);
    if (!journal) return null;

    let content, filename, mimeType;

    if (format === 'json') {
      content = JSON.stringify(journal, null, 2);
      filename = `journal_${journal.id}.json`;
      mimeType = 'application/json';
    } else if (format === 'txt') {
      content = `${journal.title}\n\nDate: ${journal.date}\nMood: ${journal.mood}\n\n${journal.content}`;
      filename = `journal_${journal.id}.txt`;
      mimeType = 'text/plain';
    } else if (format === 'md') {
      content = `# ${journal.title}\n\n**Date:** ${journal.date}\n**Mood:** ${journal.mood}\n\n${journal.content}`;
      filename = `journal_${journal.id}.md`;
      mimeType = 'text/markdown';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const value = {
    journals,
    currentJournal,
    isEditing,
    filters,
    MOODS,
    CATEGORIES,
    createJournal,
    updateJournal,
    deleteJournal,
    setCurrentJournal,
    setIsEditing,
    setFilters,
    toggleFavorite,
    toggleVault,
    generateAIReflection,
    searchJournals,
    filterJournals,
    exportJournal,
  };

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
