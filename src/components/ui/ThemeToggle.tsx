import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      title="Toggle light/dark theme"
      className="relative flex items-center justify-center w-10 h-10 rounded-full
                 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-colors duration-500 shadow-md focus:outline-none"
    >
      <Sun
        size={24}
        className={`absolute transition-opacity duration-500 ${
          isDark ? "opacity-100" : "opacity-0"
        } text-yellow-500`}
      />
      <Moon
        size={24}
        className={`absolute transition-opacity duration-500 ${
          isDark ? "opacity-0" : "opacity-100"
        } text-indigo-400`}
      />
    </button>
  );
};

export default ThemeToggle;
