// src/hooks/useWorkStatus.ts
import { useState, useEffect } from "react";

export const useWorkStatus = () => {
  const readStatus = () => {
    return JSON.parse(localStorage.getItem("workStatus") || "{}");
  };

  const [status, setStatus] = useState(readStatus());

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "workStatus") {
        setStatus(readStatus());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Allow local status update too (important if set in same tab)
  const setWorkStatus = (newStatus: { isBreak: boolean }) => {
    localStorage.setItem("workStatus", JSON.stringify(newStatus));
    setStatus(newStatus); // update state in current tab
  };

  return { status, setWorkStatus };
};
