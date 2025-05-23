import { useState, useRef, useEffect } from "react";

const DEFAULT_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

type Props = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

const MultipleSessionPanel = ({ currentIndex, setCurrentIndex }: Props) => {
  const [totalSessions, setTotalSessions] = useState(4);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [currentIndex]);

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Session Status */}
      <p className="text-sm font-medium dark:text-white">
        Session {currentIndex + 1} of {totalSessions}
      </p>

      {/* Progress Dots */}
      <div className="flex gap-2">
        {Array.from({ length: totalSessions }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-4 w-4 rounded-full transition-colors duration-300 focus:outline-none ${
              idx < currentIndex
                ? "bg-green-500"
                : idx === currentIndex
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
            title={`Go to session ${idx + 1}`}
          />
        ))}
      </div>

      {/* Session Count Selector */}
      <div className="relative mt-1" ref={dropdownRef}>
        <button
          onClick={() => setSelectorOpen((o) => !o)}
          className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-800 dark:text-white"
        >
          Sessions: {totalSessions} ▾
        </button>

        <div
          className={`absolute left-0 z-10 mt-1 w-full overflow-hidden rounded-md bg-white shadow-md transition-all duration-300 dark:bg-gray-800 ${
            selectorOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          {DEFAULT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setTotalSessions(option);
                setCurrentIndex(0); // Reset to first session
                setSelectorOpen(false);
              }}
              className={`block w-full px-3 py-1 text-left text-sm transition-colors hover:bg-blue-700 text-white ${
                option === totalSessions ? "font-semibold" : ""
              }`}
            >
              {option} {option === 1 ? "session" : "sessions"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleSessionPanel;
