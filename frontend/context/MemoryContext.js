'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const MemoryContext = createContext(null);

// AI Summary Mock Function
function generateAISummary(text) {
  if (!text || text.length === 0) return 'AI Summary: No content available.';
  const words = text.split(' ').slice(0, 15);
  return 'AI Summary: ' + words.join(' ') + '...';
}

// Sample Memories Data
const SAMPLE_MEMORIES = [
  {
    id: 'm1',
    title: 'The Whispering Woods',
    description: 'A quiet morning walk through the misty forest.',
    content: 'The morning mist hung low between the ancient pines as I walked the familiar path. Light rays pierced through the canopy, creating a cathedral-like atmosphere. It felt like walking between worlds.',
    createdAt: new Date('2023-11-15').toISOString(),
    mood: 'nostalgic',
    tags: ['solitude', 'nature'],
    type: 'image',
    aiSummary: 'AI Summary: A quiet morning walk that felt like a bridge between the past and the digital present.',
    favorite: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIWOWNNvz1zuX6-Fhr0UdY-CiRpmMqo4-dupDq_w7-K21hVgI_81KA1-vG8i3DFaqwRcRW4nAdU-8VKD4RobfDgakv3gI0qwglinfZwYy8hdiaGOLPHdyASOAk1zLAkmhThGI_Y95vU7ZMVYGKd842nEQjFBAjUkOj3kp1QtVd3jqvSNTxO2KeYYXpShvYYz0bN6WHccB46gxNqm1HfPE4tl6g0WVtnhj298jvH9b8EpQUI4gr3Q83ZA',
  },
  {
    id: 'm2',
    title: 'The Neural Linkage',
    description: 'Successfully archived first 1,000 data nodes.',
    content: 'Today marked a significant milestone in my journey with Legacy OS. I successfully archived my first 1,000 data nodes into the core system. This represents years of memories, thoughts, and digital artifacts now preserved forever.',
    createdAt: new Date('2023-10-20').toISOString(),
    mood: 'accomplished',
    tags: ['achievement', 'system'],
    type: 'event',
    aiSummary: 'AI Summary: You successfully archived your first 1,000 data nodes into the Legacy OS core system.',
    favorite: false,
  },
  {
    id: 'm3',
    title: 'Brutalist Echoes',
    description: 'Capturing the rigid beauty of Central Terminal.',
    content: 'The brutalist architecture of Central Terminal stood stark against the rainy afternoon sky. Sharp shadows and geometric lines created a visual rhythm that felt both oppressive and beautiful. I captured the moment in monochrome.',
    createdAt: new Date('2023-08-10').toISOString(),
    mood: 'contemplative',
    tags: ['architecture', 'urban'],
    type: 'image',
    aiSummary: 'AI Summary: Capturing the rigid beauty of the Central Terminal during a rainy afternoon layover.',
    favorite: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrpmgIlYg3JPGsqZTtmCBQFdYk4530pnYgRvc0ePbUpOINp_q1rDaF3SI22efEbHJixduwT1VlP-I7MTWSjPFFS4x2axb1yWmAsd09SZ1ozX1rQassFCNN4HC8BPbuMFK3BcsDmoNwjKJ-OKySt81GAJJn8a3WFxx0c6KnpqPqfxbgNN5pzir6gXPeQPh6pOYpuAiCdQco81zsJrMIuzc4gAIAJl8Z24GaciTdXDCQ36JDkM_oShyM7Q',
  },
  {
    id: 'm4',
    title: 'Reflective Thought',
    description: 'A realization about digital preservation.',
    content: '"Memory is the diary that we all carry about with us." This quote struck me deeply today while browsing the Vault. I suddenly realized the immense value of digital preservation in our age of fleeting digital experiences.',
    createdAt: new Date().toISOString(),
    mood: 'philosophical',
    tags: ['philosophy'],
    type: 'note',
    aiSummary: 'AI Summary: A sudden realization about the value of digital preservation while browsing the Vault.',
    favorite: false,
  },
  {
    id: 'm5',
    title: 'Analog Roots',
    description: 'Exploring physical origins of visual history.',
    content: 'I found my old film camera today. The weight of it in my hands, the mechanical shutter sound, the anticipation of waiting for film to develop - all these things remind me of where our visual history began before the transition to Legacy OS.',
    createdAt: new Date('2023-09-05').toISOString(),
    mood: 'nostalgic',
    tags: ['vintage', 'history'],
    type: 'image',
    aiSummary: 'AI Summary: Exploring the physical origins of our visual history before the transition to Legacy OS.',
    favorite: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiWkdKAGzxWreG6KVxhCCdDQYfxAV5eRKN5kPL9QfwXAGTxC1S2bvpdxJwlhexWUabfGZzb7YZoRp4YMoI4jqzorcaR6PGuR7vj9c0BAFFtuLFD1qN-gAEYteGrGz-VwtQm7IpeP3RaDY3QwbMeT6ZPJDBFWy4Cyeh9CdfVesXc7by7NTbfFVrExsJ-qR6In_aciANdGgHJ11YEFe032qUxGF-4gHeZ3nzwnsmU8JiKFU0yGx8E2oBVg',
  },
  {
    id: 'm6',
    title: 'The Long Road',
    description: 'A solo journey where the destination mattered less.',
    content: 'The desert road stretched endlessly toward the stormy horizon. Dramatic clouds filled the sky with silver linings. In that moment, I realized the journey itself was the destination - the digital trail I left behind mattered more than where I was going.',
    createdAt: new Date('2023-07-22').toISOString(),
    mood: 'adventurous',
    tags: ['travel'],
    type: 'image',
    aiSummary: 'AI Summary: A solo journey where the destination mattered less than the digital trail left behind.',
    favorite: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB41v8ChmFNh6_NQHE1P6CAqj0N77uVQW-ojrnwrEqEc4LwANpK9nXQ4hyH9ZXrd-IbxCELU4q35Ctyvtb9SBqGyMxhTa7DFWG-SSL9spFfAfbWKaU8bguMK2NQygp5_zVFuLbBkWkkGanBRWPTGBYgtoJutaP1nHjoNmwCdeBHmhIg8y51gUw22-mxAZfgfvxPFHARqCoWKyJ2aj18bpH_TWl7dVwYakrobvJsW74ac_P63LEAoFuaHg',
  },
];

// Reducer Actions
const ADD_MEMORY = 'ADD_MEMORY';
const DELETE_MEMORY = 'DELETE_MEMORY';
const UPDATE_MEMORY = 'UPDATE_MEMORY';
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
const SET_FILTER = 'SET_FILTER';
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const SET_MEMORIES = 'SET_MEMORIES';

// Initial State
const initialState = {
  memories: [],
  filter: 'all', // all, favorites, images, notes, events
  searchQuery: '',
};

// Reducer Function
function memoryReducer(state, action) {
  switch (action.type) {
    case SET_MEMORIES:
      return { ...state, memories: action.payload };

    case ADD_MEMORY:
      const newMemory = {
        ...action.payload,
        id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        aiSummary: generateAISummary(action.payload.content),
        favorite: false,
      };
      return {
        ...state,
        memories: [newMemory, ...state.memories],
      };

    case DELETE_MEMORY:
      return {
        ...state,
        memories: state.memories.filter(m => m.id !== action.payload),
      };

    case UPDATE_MEMORY:
      return {
        ...state,
        memories: state.memories.map(m =>
          m.id === action.payload.id
            ? { ...m, ...action.payload, aiSummary: generateAISummary(action.payload.content || m.content) }
            : m
        ),
      };

    case TOGGLE_FAVORITE:
      return {
        ...state,
        memories: state.memories.map(m =>
          m.id === action.payload ? { ...m, favorite: !m.favorite } : m
        ),
      };

    case SET_FILTER:
      return { ...state, filter: action.payload };

    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}

// Provider Component
export const MemoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(memoryReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const storedMemories = localStorage.getItem('legacyMemories');
    if (storedMemories) {
      dispatch({ type: SET_MEMORIES, payload: JSON.parse(storedMemories) });
    } else {
      // Initialize with sample data
      dispatch({ type: SET_MEMORIES, payload: SAMPLE_MEMORIES });
    }
  }, []);

  // Save to localStorage on every update
  useEffect(() => {
    if (state.memories.length > 0) {
      localStorage.setItem('legacyMemories', JSON.stringify(state.memories));
    }
  }, [state.memories]);

  // Filter and Search Logic
  const getFilteredMemories = () => {
    let filtered = [...state.memories];

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.title.toLowerCase().includes(query) ||
          m.content.toLowerCase().includes(query) ||
          m.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (state.filter === 'favorites') {
      filtered = filtered.filter(m => m.favorite);
    } else if (state.filter === 'images') {
      filtered = filtered.filter(m => m.type === 'image');
    } else if (state.filter === 'notes') {
      filtered = filtered.filter(m => m.type === 'note');
    } else if (state.filter === 'events') {
      filtered = filtered.filter(m => m.type === 'event');
    }

    // Sort: favorites first, then by date (newest first)
    filtered.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  };

  // Actions
  const addMemory = (memory) => {
    dispatch({ type: ADD_MEMORY, payload: memory });
  };

  const deleteMemory = (id) => {
    dispatch({ type: DELETE_MEMORY, payload: id });
  };

  const updateMemory = (memory) => {
    dispatch({ type: UPDATE_MEMORY, payload: memory });
  };

  const toggleFavorite = (id) => {
    dispatch({ type: TOGGLE_FAVORITE, payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: SET_FILTER, payload: filter });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: SET_SEARCH_QUERY, payload: query });
  };

  const value = {
    memories: state.memories,
    filter: state.filter,
    searchQuery: state.searchQuery,
    addMemory,
    deleteMemory,
    updateMemory,
    toggleFavorite,
    setFilter,
    setSearchQuery,
    getFilteredMemories,
  };

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>;
};

// Custom Hook
export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};
