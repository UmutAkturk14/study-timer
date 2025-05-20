import { useEffect, useRef, useState } from "react";
import { useStorage } from "../../helpers/useStorage";
import { WorkModes } from "../types/sessions";
import type { WorkMode } from "../types/interfaces";

interface StudySwitchProps {
  value: WorkMode; // selected session mode
  onChange: (mode: WorkMode) => void; // called when user picks a new mode
}

const STORAGE_KEY = "sessionType";

const StudySwitch = ({ value, onChange }: StudySwitchProps) => {
  const { set } = useStorage();
  const { SimpleSession, BasicPomodoro, DeepFocus, Mindfulness } = WorkModes;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Persist to localStorage when value changes
  useEffect(() => {
    set(STORAGE_KEY, value);
  }, [value, set]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handle);
    return () => window.removeEventListener("mousedown", handle);
  }, [open]);

  const renderItem = (mode: WorkMode) => {
    const { label, description, id } = mode;
    const selected = value.id === mode.id;
    return (
      <li
        key={id}
        onClick={() => {
          onChange(mode); // ← notify parent
          setOpen(false);
        }}
        className={`select-none px-4 py-2 text-sm ${
          selected
            ? "bg-indigo-600 text-white"
            : "text-gray-800 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-gray-700"
        }`}
      >
        <p className="font-medium">{label}</p>
        <p className="text-xs opacity-70">{description}</p>
      </li>
    );
  };

  return (
    <div ref={dropdownRef} className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 shadow-sm flex flex-col text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
      >
        <p className="font-medium text-sm dark:text-white">{value.label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {value.description}
        </p>
      </button>

      {open && (
        <ul className="relative z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg h-auto overflow-auto">
          {renderItem(SimpleSession)}
          {renderItem(BasicPomodoro)}
          {renderItem(DeepFocus)}
          {renderItem(Mindfulness)}
        </ul>
      )}
    </div>
  );
};

export default StudySwitch;
