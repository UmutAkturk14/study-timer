import React from "react";

export default function NotesTab() {
  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-lg font-semibold">Quick Notes / Journal</h3>
      <textarea
        className="p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-200 resize-none min-h-[6rem] flex-grow"
        placeholder="Write your notes here..."
        onChange={(e) => {
          localStorage.setItem("quickNotes", e.target.value);
        }}
        defaultValue={localStorage.getItem("quickNotes") || ""}
      />
    </div>
  );
}
