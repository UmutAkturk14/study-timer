import React, { useState, useEffect } from "react";
import HabitsModal from "./HabitsModal"

const STORAGE_KEY = "habitsData";

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export default function HabitsTab() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newHabitName, setNewHabitName] = useState("");
  const [showStats, setShowStats] = useState(false);

  const today = formatDate();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const toggleDoneToday = (id) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const newHistory = { ...habit.history };
          newHistory[today] = !newHistory[today];
          return { ...habit, history: newHistory };
        }
        return habit;
      })
    );
  };

  const addHabit = () => {
    const trimmed = newHabitName.trim();
    if (!trimmed) return;

    const newHabit = {
      id: Date.now(),
      name: trimmed,
      history: {},
    };
    setHabits((prev) => [newHabit, ...prev]);
    setNewHabitName("");
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Stats
  const totalHabits = habits.length;
  const doneTodayCount = habits.filter((h) => h.history[today]).length;
  const completionRate = totalHabits
    ? Math.round((doneTodayCount / totalHabits) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full px-2">
      <h3 className="mb-2 text-lg font-semibold flex items-center justify-between">
        Habits
        <button
          onClick={() => setShowStats(true)}
          className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          aria-label="View habits statistics"
        >
          Stats
        </button>
      </h3>

      <ul className="flex-grow overflow-auto space-y-1">
        {habits.length === 0 && (
          <li className="italic text-gray-500 dark:text-gray-400">
            No habits yet. Add one below!
          </li>
        )}

        {habits.map(({ id, name, history }) => {
          const doneToday = history[today] || false;
          return (
            <li
              key={id}
              className={`flex items-center justify-between rounded p-1 ${
                doneToday
                  ? "bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <label className="flex items-center gap-2 flex-grow cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={doneToday}
                  onChange={() => toggleDoneToday(id)}
                  className="cursor-pointer"
                />
                <span>{name}</span>
              </label>

              <button
                onClick={() => deleteHabit(id)}
                className="ml-2 text-red-600 hover:text-red-800"
                aria-label={`Delete habit ${name}`}
                title="Delete"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="New habit"
          className="flex-grow p-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
        />
        <button
          onClick={addHabit}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {showStats && (
        <HabitsModal habits={habits} onClose={() => setShowStats(false)} />
)}
    </div>
  );
}
