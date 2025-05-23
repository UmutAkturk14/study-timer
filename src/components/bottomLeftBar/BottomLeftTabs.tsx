import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, BarChart2, CheckSquare, Edit3 } from "lucide-react";
import AnalyticsTab from "./AnalyticsTab";
import HabitsTab from "./HabitsTab";
import NotesTab from "./NotesTab";
import RemindersTab from "./RemindersTab";

const tabs = [
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
  { id: "notes", label: "Notes", icon: <Edit3 size={18} /> },
  { id: "reminders", label: "Reminders", icon: <Calendar size={18} /> },
  { id: "habits", label: "Habits", icon: <CheckSquare size={18} /> },
];

export default function BottomLeftTabs() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="flex flex-col h-11/12 mt-4 ml-4 dark:shadow-gray-700 shadow-xl rounded-lg overflow-hidden">
      {/* Tab headers */}
      <nav className="flex border-b border-gray-300 dark:border-gray-700">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors
              ${
                activeTab === id
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            aria-selected={activeTab === id}
            role="tab"
            type="button"
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <section
        role="tabpanel"
        aria-labelledby={activeTab}
        className="flex-grow p-4 overflow-hidden relative text-gray-800 dark:text-gray-200"
        style={{ minHeight: 200 }} // adjust to fit tallest tab content
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            >
              <AnalyticsTab />
            </motion.div>
          )}

          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            >
              <NotesTab />
            </motion.div>
          )}

          {activeTab === "reminders" && (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            >
              <RemindersTab />
            </motion.div>
          )}

          {activeTab === "habits" && (
            <motion.div
              key="habits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            >
              <HabitsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
