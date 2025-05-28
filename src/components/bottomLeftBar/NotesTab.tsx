import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function NotesTab() {
  const [savedNote, setSavedNote] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quickNotes") || "";
    setSavedNote(stored);
    setDraftNote(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem("quickNotes", draftNote);
    setSavedNote(draftNote);
  };

  const handleCancel = () => {
    setDraftNote(savedNote);
  };

  const isModified = draftNote !== savedNote;
  const shouldShowButtons = isFocused || isModified;

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-lg font-semibold">Quick Notes / Journal</h3>

      <textarea
        className="p-2 rounded bg-gray-100 dark:bg-transparent focus:outline-none focus:ring-0 dark:text-gray-200 resize-none flex-grow"
        placeholder="Write your notes here..."
        value={draftNote}
        onChange={(e) => setDraftNote(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <AnimatePresence>
        {shouldShowButtons && (
          <motion.div
            key="note-buttons"
            className="flex justify-end gap-2 mt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleCancel}
              className="px-4 py-1 text-sm rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
