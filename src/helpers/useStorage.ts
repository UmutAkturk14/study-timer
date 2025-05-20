import { useCallback } from "react";

type StorageKey = string;

export const useStorage = () => {
  // Get item and parse JSON, return null if not found or parse error
  const get = useCallback((key: StorageKey) => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (err) {
      console.error(`Error parsing localStorage key "${key}":`, err);
      return null;
    }
  }, []);

  // Stringify and set
  const set = useCallback((key: StorageKey, value: unknown) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error setting localStorage key "${key}":`, err);
    }
  }, []);

  // Remove
  const remove = useCallback((key: StorageKey) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
    }
  }, []);

  return { get, set, remove };
};
