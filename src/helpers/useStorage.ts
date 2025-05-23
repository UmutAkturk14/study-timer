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

  // Update: merge existing object with new value
  const update = useCallback(
    (key: StorageKey, value: Record<string, unknown> & { time?: number }) => {
      if (typeof window === "undefined") return;

      try {
        const existingRaw = get(key);

        // ─────────────────────────────────────────
        // 1️⃣  Extract the current sessions array
        // ─────────────────────────────────────────
        let sessions: Record<string, unknown>[] = [];

        if (
          existingRaw &&
          typeof existingRaw === "object" &&
          "sessions" in existingRaw &&
          Array.isArray((existingRaw).sessions)
        ) {
          // Current shape is the wrapper object
          sessions = [...(existingRaw).sessions];
        } else if (Array.isArray(existingRaw)) {
          // Legacy: plain array stored
          sessions = [...existingRaw];
        } else if (existingRaw) {
          // Legacy: single object stored
          sessions = [existingRaw];
        }

        // ─────────────────────────────────────────
        // 2️⃣  Append new entry (duplicates allowed)
        // ─────────────────────────────────────────
        sessions.push(value);

        // ─────────────────────────────────────────
        // 3️⃣  Re-calculate aggregates
        // ─────────────────────────────────────────
        const totalTime = sessions.reduce(
          (acc, s) => acc + (typeof s.time === "number" ? s.time : 0),
          0
        );

        const updatedWrapper = {
          sessions,
          time: totalTime,
          sessionCount: sessions.length,
        };

        localStorage.setItem(key, JSON.stringify(updatedWrapper));
      } catch (err) {
        console.error(`Error updating localStorage key "${key}":`, err);
      }
    },
    [get]
  );

  return { get, set, remove, update };
};
