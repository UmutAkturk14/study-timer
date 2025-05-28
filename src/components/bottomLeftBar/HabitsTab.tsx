import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  FC,
} from "react";
import HabitsModal from "./HabitsModal";

const STORAGE_KEY = "habitsData";

/* ---------- types ---------- */
interface Habit {
  id: number;
  name: string;
  history: Record<string, boolean>; // key = YYYY-MM-DD
}

/* ---------- util ---------- */
const formatDate = (date: Date = new Date()): string =>
  date.toISOString().slice(0, 10); // YYYY-MM-DD

/* ---------- component ---------- */
const HabitsTab: FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Habit[]) : [];
    } catch {
      return [];
    }
  });

  const [newHabitName, setNewHabitName] = useState("");
  const [showStats, setShowStats] = useState(false);

  const today = formatDate();

  /* persist to localStorage whenever habits change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  /* ---------- CRUD helpers ---------- */
  const toggleDoneToday = (id: number) =>
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, history: { ...h.history, [today]: !h.history[today] } }
          : h
      )
    );

  const addHabit = () => {
    const name = newHabitName.trim();
    if (!name) return;
    setHabits((prev) => [{ id: Date.now(), name, history: {} }, ...prev]);
    setNewHabitName("");
  };

  const deleteHabit = (id: number) =>
    setHabits((prev) => prev.filter((h) => h.id !== id));

  /* ---------- split lists ---------- */
  const undone = habits.filter((h) => !h.history[today]);
  const done = habits.filter((h) => h.history[today]);

  /* ---------- stats (if you use them somewhere) ---------- */
  const completionRate =
    habits.length === 0 ? 0 : Math.round((done.length / habits.length) * 100);

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col h-full px-2">
      {/* header */}
      <h3 className="m-2 text-lg font-semibold flex items-center justify-between">
        Habits
        <button
          onClick={() => setShowStats(true)}
          className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Stats
        </button>
      </h3>

      {/* add bar */}
      <div className="flex gap-2 mt-3 ml-2 mb-4">
        <input
          className="flex-grow p-1 rounded border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          placeholder="New habit"
          value={newHabitName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewHabitName(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && addHabit()
          }
        />
        <button
          onClick={addHabit}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* lists wrapper */}
      <div className="flex-grow flex flex-col overflow-auto ml-2">
        {/* undone list directly under add bar */}
        <ul className="space-y-1">
          {undone.length === 0 && habits.length === 0 && (
            <li className="italic text-gray-500 dark:text-gray-400">
              No habits yet. Add one above!
            </li>
          )}

          {undone.map(({ id, name }) => (
            <li
              key={id}
              className="flex items-center justify-between rounded p-1
                         bg-gray-100 dark:bg-gray-700"
            >
              <label className="flex items-center gap-2 flex-grow cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => toggleDoneToday(id)}
                  className="cursor-pointer"
                />
                <span>{name}</span>
              </label>
              <button
                onClick={() => deleteHabit(id)}
                className="ml-2 text-red-600 hover:text-red-800"
                title="Delete"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* spacer pushes the next list to bottom */}
        <div className="flex-grow mt-0.5" />

        {/* done-today list anchored at bottom */}
        {done.length > 0 && (
          <ul className="space-y-1">
            {done.map(({ id, name }) => (
              <li
                key={id}
                className="flex items-center justify-between rounded p-1
                           bg-green-200 dark:bg-green-700
                           text-green-900 dark:text-green-300"
              >
                <label className="flex items-center gap-2 flex-grow cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggleDoneToday(id)}
                    className="cursor-pointer"
                  />
                  <span>{name}</span>
                </label>
                <button
                  onClick={() => deleteHabit(id)}
                  className="ml-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showStats && (
        <HabitsModal habits={habits} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
};

export default HabitsTab;
