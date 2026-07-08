export const STORAGE_KEY = "legacy_os_memories";

export function loadMemories() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load memories from localStorage", error);
    return [];
  }
}

export function saveMemories(memories) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch (error) {
    console.error("Failed to save memories to localStorage", error);
  }
}
