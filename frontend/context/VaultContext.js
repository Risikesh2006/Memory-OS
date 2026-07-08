'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const VaultContext = createContext(null);

const DEFAULT_VAULT_YEAR = 2026;
const DEFAULT_STORAGE_PREFIX = 'vault_';
const DEFAULT_VAULT_PIN = '1234';
const UNLOCKED_YEAR_KEY = 'vault_unlocked_year';

export const vaultData = [
  {
    id: 'm1',
    type: 'image',
    title: 'MONOLITH_STRUCTURE',
    description: 'Central spire integration sequence archived after the first spatial alignment test.',
    mediaUrl: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80',
    date: '2026-07-05',
    tags: ['core', 'structure'],
    z: 10,
  },
  {
    id: 'm2',
    type: 'video',
    title: 'HALLWAY_RESONANCE',
    description: 'A muted corridor scan that captured the first pulse of the vault lighting system.',
    mediaUrl: '',
    date: '2026-07-06',
    tags: ['scan', 'motion'],
    z: 9,
  },
  {
    id: 'm3',
    type: 'text',
    title: 'ANOMALY_REPORT_014',
    description: 'The search layer now isolates memories by title, description, and tags without reflowing the world.',
    mediaUrl: '',
    date: '2026-07-07',
    tags: ['report', 'search'],
    z: 8,
  },
  {
    id: 'm4',
    type: 'audio',
    title: 'RELAY_SIGNAL_ALPHA',
    description: 'Low-frequency archival tone captured during the nightly synchronization window.',
    mediaUrl: '',
    date: '2026-07-08',
    tags: ['signal', 'relay'],
    z: 7,
  },
  {
    id: 'm5',
    type: 'image',
    title: 'WHITE_NOISE_GARDEN',
    description: 'The noise field around the gallery softened after the drag physics pass was enabled.',
    mediaUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    date: '2026-07-09',
    tags: ['gallery', 'field'],
    z: 6,
  },
  {
    id: 'm6',
    type: 'text',
    title: 'LAST_OPENED_TRACE',
    description: 'The last accessed memory remains visible across reloads through vault-level persistence.',
    mediaUrl: '',
    date: '2026-07-10',
    tags: ['persistence', 'trace'],
    z: 5,
  },
];

export const vaultState = {
  year: DEFAULT_VAULT_YEAR,
  memories: vaultData,
  positions: {},
  activeMemory: null,
  searchQuery: '',
};

const buildFallbackPosition = (index) => {
  const column = index % 3;
  const row = Math.floor(index / 3);

  return {
    x: 120 + column * 360 + (row % 2) * 42,
    y: 140 + row * 260 + column * 18,
  };
};

const normalizeMemory = (memory, index) => ({
  id: memory.id || `mem_${index}_${Date.now()}`,
  type: memory.type || 'text',
  title: memory.title || 'UNTITLED_MEMORY',
  description: memory.description || '',
  mediaUrl: memory.mediaUrl || '',
  date: memory.date || new Date().toISOString().slice(0, 10),
  tags: Array.isArray(memory.tags) ? memory.tags : [],
  z: memory.z ?? index + 1,
  createdAt: memory.createdAt || new Date().toISOString(),
});

const buildPositions = (memories, existingPositions = {}) => {
  const positions = {};

  memories.forEach((memory, index) => {
    positions[memory.id] = existingPositions[memory.id] || buildFallbackPosition(index);
  });

  return positions;
};

const createVaultState = (year, memories = vaultData, existingState = {}) => {
  const normalizedMemories = memories.map(normalizeMemory);

  return {
    year,
    pinHash: existingState.pinHash ?? null,
    memories: normalizedMemories,
    positions: buildPositions(normalizedMemories, existingState.positions || {}),
    activeMemory: existingState.activeMemory ?? null,
    searchQuery: existingState.searchQuery ?? '',
    lastOpenedMemoryId: existingState.lastOpenedMemoryId ?? null,
    pan: existingState.pan || { x: 0, y: 0 },
    yearlyReflection: existingState.yearlyReflection || null,
    createdAt: existingState.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const getStorageKey = (year) => `${DEFAULT_STORAGE_PREFIX}${year}`;

const readVaultStateFromStorage = (year) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(getStorageKey(year));

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const readUnlockedYear = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedYear = localStorage.getItem(UNLOCKED_YEAR_KEY);

  if (!storedYear) {
    return null;
  }

  const parsedYear = Number(storedYear);
  return Number.isFinite(parsedYear) ? parsedYear : null;
};

const writeUnlockedYear = (year) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(UNLOCKED_YEAR_KEY, String(year));
};

const clearUnlockedYear = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(UNLOCKED_YEAR_KEY);
};

const normalizeVault = (vault) => {
  if (!vault) {
    return null;
  }

  return createVaultState(vault.year, vault.memories || vaultData, vault);
};

const createSeedVault = () => ({
  year: DEFAULT_VAULT_YEAR,
  ...createVaultState(DEFAULT_VAULT_YEAR, vaultData),
  pinHash: simpleHash(DEFAULT_VAULT_PIN),
  activeMemory: null,
  searchQuery: '',
  lastOpenedMemoryId: null,
  pan: { x: 0, y: 0 },
  createdAt: new Date().toISOString(),
});

const upsertVaultState = (vaultList, nextVault) => {
  const normalizedVault = normalizeVault(nextVault);

  if (!normalizedVault) {
    return vaultList;
  }

  const hasVault = vaultList.some((vault) => vault.year === normalizedVault.year);

  if (!hasVault) {
    return [...vaultList, normalizedVault];
  }

  return vaultList.map((vault) => (vault.year === normalizedVault.year ? normalizedVault : vault));
};

// Simple hash function for PIN simulation
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const VaultProvider = ({ children }) => {
  const [vaults, setVaults] = useState([]);
  const [currentVault, setCurrentVault] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const currentStorageKey = useMemo(() => {
    if (!currentVault?.year) {
      return null;
    }

    return getStorageKey(currentVault.year);
  }, [currentVault?.year]);

  // Load vaults from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedVaults = localStorage.getItem('legacyVaults');
    const parsedVaults = storedVaults ? JSON.parse(storedVaults) : [];
    const normalizedVaults = Array.isArray(parsedVaults)
      ? parsedVaults.map(normalizeVault).filter(Boolean)
      : [];

    const seedVault = createSeedVault();
    const currentYearState = normalizeVault(readVaultStateFromStorage(DEFAULT_VAULT_YEAR));

    const existingDefaultVaultIndex = normalizedVaults.findIndex((vault) => vault.year === DEFAULT_VAULT_YEAR);

    if (existingDefaultVaultIndex >= 0) {
      if (!normalizedVaults[existingDefaultVaultIndex].pinHash) {
        normalizedVaults[existingDefaultVaultIndex] = seedVault;
      }
    } else if (currentYearState && currentYearState.pinHash) {
      normalizedVaults.push(currentYearState);
    } else {
      normalizedVaults.push(seedVault);
    }

    setVaults(normalizedVaults);

    const unlockedYear = readUnlockedYear();
    if (unlockedYear) {
      const unlockedVault = normalizedVaults.find((vault) => vault.year === unlockedYear);
      if (unlockedVault) {
        setCurrentVault(unlockedVault);
        setIsUnlocked(true);
      }
    }

    setHasHydrated(true);
  }, []);

  // Save vaults to localStorage whenever they change
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (vaults.length > 0) {
      localStorage.setItem('legacyVaults', JSON.stringify(vaults));
    }

    if (currentVault && currentStorageKey) {
      localStorage.setItem(currentStorageKey, JSON.stringify(currentVault));
    }
  }, [currentStorageKey, currentVault, hasHydrated, vaults]);

  const commitVault = (nextVault) => {
    const normalizedVault = normalizeVault(nextVault);

    if (!normalizedVault) {
      return null;
    }

    setCurrentVault(normalizedVault);
    setVaults((prev) => upsertVaultState(prev, normalizedVault));
    return normalizedVault;
  };

  const unlockVault = (year) => {
    writeUnlockedYear(year);
  };

  // Create or get vault for a year
  const getVault = (year) => {
    return vaults.find(v => v.year === year);
  };

  // Create a new vault with PIN
  const createVault = (year, pin) => {
    if (pin.length < 4) {
      throw new Error('PIN must be at least 4 digits');
    }

    const existingVault = getVault(year);
    if (existingVault) {
      throw new Error('Vault for this year already exists');
    }

    const newVault = {
      year,
      ...createVaultState(year, year === DEFAULT_VAULT_YEAR ? vaultData : []),
      pinHash: simpleHash(pin),
      yearlyReflection: null,
      createdAt: new Date().toISOString()
    };

    commitVault(newVault);
    unlockVault(year);
    setIsUnlocked(true);
    return newVault;
  };

  // Verify PIN for a vault
  const verifyPin = (year, pin) => {
    const vault = getVault(year);
    if (!vault) {
      return { success: false, error: 'Vault not found' };
    }

    const inputHash = simpleHash(pin);
    if (inputHash === vault.pinHash) {
      const storedState = normalizeVault(readVaultStateFromStorage(year));
      commitVault({
        ...vault,
        ...(storedState || {}),
        pinHash: vault.pinHash,
        year,
      });
      unlockVault(year);
      setIsUnlocked(true);
      return { success: true };
    }

    return { success: false, error: 'Invalid PIN' };
  };

  // Add memory to current vault
  const addMemory = (memory) => {
    if (!currentVault || !isUnlocked) {
      throw new Error('No vault unlocked');
    }

    const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newMemory = {
      id,
      createdAt: new Date().toISOString(),
      ...memory
    };

    const nextPosition = buildFallbackPosition(currentVault.memories.length);

    const updatedVault = {
      ...currentVault,
      memories: [...currentVault.memories, newMemory],
      positions: {
        ...currentVault.positions,
        [id]: nextPosition,
      },
      activeMemory: id,
      lastOpenedMemoryId: id,
    };

    commitVault(updatedVault);
    return newMemory;
  };

  // Update memory
  const updateMemory = (memoryId, updates) => {
    if (!currentVault || !isUnlocked) {
      throw new Error('No vault unlocked');
    }

    const updatedVault = {
      ...currentVault,
      memories: currentVault.memories.map(m => 
        m.id === memoryId ? { ...m, ...updates } : m
      ),
    };

    commitVault(updatedVault);
  };

  // Delete memory
  const deleteMemory = (memoryId) => {
    if (!currentVault || !isUnlocked) {
      throw new Error('No vault unlocked');
    }

    const updatedVault = {
      ...currentVault,
      memories: currentVault.memories.filter(m => m.id !== memoryId),
      positions: Object.fromEntries(
        Object.entries(currentVault.positions || {}).filter(([id]) => id !== memoryId)
      ),
      activeMemory: currentVault.activeMemory === memoryId ? null : currentVault.activeMemory,
      lastOpenedMemoryId: currentVault.lastOpenedMemoryId === memoryId ? null : currentVault.lastOpenedMemoryId,
    };

    commitVault(updatedVault);
  };

  const setSearchQuery = (query) => {
    if (!currentVault) {
      return;
    }

    commitVault({
      ...currentVault,
      searchQuery: query,
    });
  };

  const setActiveMemory = (memoryId) => {
    if (!currentVault) {
      return;
    }

    commitVault({
      ...currentVault,
      activeMemory: memoryId,
    });
  };

  const openMemory = (memory) => {
    if (!currentVault || !memory) {
      return;
    }

    commitVault({
      ...currentVault,
      activeMemory: memory.id,
      lastOpenedMemoryId: memory.id,
    });
  };

  const changeVaultPin = (currentPin, nextPin) => {
    if (!currentVault || !isUnlocked) {
      return { success: false, error: 'No vault unlocked' };
    }

    if (nextPin.length < 4) {
      return { success: false, error: 'PIN must be at least 4 digits' };
    }

    const currentHash = simpleHash(currentPin);
    if (currentHash !== currentVault.pinHash) {
      return { success: false, error: 'Current PIN is invalid' };
    }

    const updatedVault = {
      ...currentVault,
      pinHash: simpleHash(nextPin),
    };

    commitVault(updatedVault);
    unlockVault(updatedVault.year);
    return { success: true };
  };

  const closeMemory = () => {
    if (!currentVault) {
      return;
    }

    commitVault({
      ...currentVault,
      activeMemory: currentVault.activeMemory,
    });
  };

  const updateMemoryPosition = (memoryId, position) => {
    if (!currentVault) {
      return;
    }

    commitVault({
      ...currentVault,
      positions: {
        ...currentVault.positions,
        [memoryId]: position,
      },
    });
  };

  const updatePan = (pan) => {
    if (!currentVault) {
      return;
    }

    commitVault({
      ...currentVault,
      pan,
    });
  };

  // Generate AI yearly reflection (mock)
  const generateYearlyReflection = () => {
    if (!currentVault || !isUnlocked) {
      throw new Error('No vault unlocked');
    }

    const memoryCount = currentVault.memories.length;
    const types = currentVault.memories.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    }, {});

    const reflection = {
      generatedAt: new Date().toISOString(),
      keyEvents: [
        `Captured ${memoryCount} memories throughout the year`,
        `Most common type: ${Object.entries(types).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}`
      ],
      emotionalSummary: 'This year was marked by significant personal growth and memorable experiences. The memories captured reflect a journey of discovery and meaningful connections.',
      highlights: currentVault.memories.slice(0, 3).map(m => ({
        title: m.title,
        date: m.createdAt,
        type: m.type
      }))
    };

    const updatedVault = {
      ...currentVault,
      yearlyReflection: reflection
    };

    commitVault(updatedVault);
    return reflection;
  };

  // Export vault data (JSON)
  const exportVault = () => {
    if (!currentVault || !isUnlocked) {
      throw new Error('No vault unlocked');
    }

    const exportData = {
      vault: {
        year: currentVault.year,
        exportedAt: new Date().toISOString(),
        memoryCount: currentVault.memories.length,
        activeMemory: currentVault.activeMemory,
        lastOpenedMemoryId: currentVault.lastOpenedMemoryId,
      },
      memories: currentVault.memories,
      positions: currentVault.positions,
      searchQuery: currentVault.searchQuery,
      pan: currentVault.pan,
      yearlyReflection: currentVault.yearlyReflection
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legacy_vault_${currentVault.year}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Lock current vault
  const lockVault = () => {
    setCurrentVault(null);
    setIsUnlocked(false);
    clearUnlockedYear();
  };

  const value = {
    vaults,
    currentVault,
    isUnlocked,
    hasHydrated,
    getVault,
    createVault,
    verifyPin,
    addMemory,
    updateMemory,
    deleteMemory,
    setSearchQuery,
    setActiveMemory,
    openMemory,
    changeVaultPin,
    closeMemory,
    updateMemoryPosition,
    updatePan,
    generateYearlyReflection,
    exportVault,
    lockVault
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
