import React from "react";

function calculateStreaks(history, today) {
  // Calculate current and longest streaks (you can improve this)
  const dates = Object.keys(history).sort(); // ascending dates
  let longest = 0,
    current = 0;
  let prevDate = null;
  for (let date of dates) {
    if (history[date]) {
      if (!prevDate) {
        current = 1;
      } else {
        const diff =
          (new Date(date) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          current += 1;
        } else {
          current = 1;
        }
      }
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
    prevDate = date;
  }
  return { currentStreak: current, longestStreak: longest };
}

export default function HabitsModal({ habits, onClose }) {
  const today = new Date().toISOString().slice(0, 10);

  const totalHabits = habits.length;
  const doneTodayCount = habits.filter((h) => h.history[today]).length;
  const completionRate = totalHabits
    ? Math.round((doneTodayCount / totalHabits) * 100)
    : 0;

  const totalDoneEver = habits.reduce(
    (acc, h) => acc + Object.values(h.history).filter(Boolean).length,
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Habit Statistics
        </h2>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p>
            Total habits: <strong>{totalHabits}</strong>
          </p>
          <p>
            Done today: <strong>{doneTodayCount}</strong>
          </p>
          <p>
            Completion rate today: <strong>{completionRate}%</strong>
          </p>
          <p>
            Total completions (all time): <strong>{totalDoneEver}</strong>
          </p>
        </section>

        <section className="mb-6 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-2">Per Habit Stats</h3>
          <ul>
            {habits.map(({ id, name, history }) => {
              const daysTracked = Object.keys(history).length;
              const daysDone = Object.values(history).filter(Boolean).length;
              const habitCompletion = daysTracked
                ? Math.round((daysDone / daysTracked) * 100)
                : 0;
              const { currentStreak, longestStreak } = calculateStreaks(
                history,
                today
              );

              return (
                <li
                  key={id}
                  className="border border-gray-300 dark:border-gray-700 rounded p-2 mb-2"
                >
                  <h4 className="font-semibold">{name}</h4>
                  <p>Days tracked: {daysTracked}</p>
                  <p>Days completed: {daysDone}</p>
                  <p>Completion: {habitCompletion}%</p>
                  <p>Current streak: {currentStreak} day(s)</p>
                  <p>Longest streak: {longestStreak} day(s)</p>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
