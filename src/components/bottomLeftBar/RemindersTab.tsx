import React, { useState, useEffect } from "react";

const STORAGE_KEY = "remindersData";

export default function RemindersTab() {
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              text: "Take a 5-min break",
              dueMinutes: 5,
              createdAt: Date.now(),
              done: false,
              notified: false,
            },
            {
              id: 2,
              text: "Meeting at 2 PM",
              done: false,
              notified: false,
            },
          ];
    } catch {
      return [];
    }
  });

  const [newText, setNewText] = useState("");
  const [newDue, setNewDue] = useState("");

  // Persist reminders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Check for due reminders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReminders((prev) =>
        prev.map((reminder) => {
          if (
            reminder.dueMinutes !== undefined &&
            !reminder.notified &&
            !reminder.done &&
            reminder.createdAt + reminder.dueMinutes * 60000 <= now
          ) {
            alert(`⏰ Reminder due: ${reminder.text}`);
            return { ...reminder, notified: true };
          }
          return reminder;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addReminder = () => {
    if (!newText.trim()) return;
    const newReminder = {
      id: Date.now(),
      text: newText.trim(),
      dueMinutes: newDue ? Number(newDue) : undefined,
      createdAt: Date.now(),
      done: false,
      notified: false,
    };
    setReminders((prev) => [newReminder, ...prev]);
    setNewText("");
    setNewDue("");
  };

  const toggleDone = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto p-4 bg-transparent rounded-lg shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Reminders / Upcoming Events
      </h3>

      {/* Add new reminder */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="New reminder"
          className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addReminder()}
          aria-label="New reminder text"
          spellCheck={false}
        />
        <input
          type="number"
          min="0"
          placeholder="Due (min)"
          className="w-24 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newDue}
          onChange={(e) => setNewDue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addReminder()}
          aria-label="Due time in minutes"
          spellCheck={false}
        />
        <button
          onClick={addReminder}
          className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Add reminder"
        >
          Add
        </button>
      </div>

      {/* Reminders list */}
      <ul className="flex-grow overflow-auto space-y-3 max-h-[50vh]">
        {reminders.length === 0 && (
          <li className="text-center text-gray-500 dark:text-gray-400 italic select-none">
            No reminders yet
          </li>
        )}

        {reminders.map(({ id, text, dueMinutes, done, notified }) => (
          <li
            key={id}
            className={`flex items-center justify-between rounded-lg p-3 border border-gray-200 dark:border-gray-700 transition
              ${
                done
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 line-through"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `}
          >
            <label className="flex items-center gap-3 cursor-pointer select-none flex-grow">
              <input
                type="checkbox"
                checked={done}
                onChange={() => toggleDone(id)}
                className="w-5 h-5 cursor-pointer text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="flex flex-col">
                <span className="text-base font-medium leading-tight">
                  {text}
                </span>
                {dueMinutes !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Due in {dueMinutes} minute{dueMinutes !== 1 ? "s" : ""}
                  </span>
                )}
                {notified && !done && (
                  <span className="mt-0.5 text-xs font-semibold text-yellow-500 select-none">
                    ⏰ Due!
                  </span>
                )}
              </div>
            </label>

            <button
              onClick={() => deleteReminder(id)}
              className="ml-4 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition"
              aria-label={`Delete reminder: ${text}`}
              title="Delete reminder"
            >
              &#10005;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
