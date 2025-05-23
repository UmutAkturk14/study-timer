// src/helpers/choices.ts

/** Merge `patch` into the existing { choices } object */
const updateChoices = (patch: Record<string, unknown>) => {
  const stored = localStorage.getItem("choices");
  const current = stored ? JSON.parse(stored) : {};
  const updated = { ...current, ...patch };
  localStorage.setItem("choices", JSON.stringify(updated));
};

/* ------------------------------- public API ------------------------------ */

export const setBreakTime = (time: number) => {
  updateChoices({ breakTime: time });
};

export const setWorkTime = (time: number) => {
  updateChoices({ workTime: time });
};

export const setSessionCount = (count: number) => {
  updateChoices({ sessionCount: count });
};

export const setTheme = (theme: "light" | "dark") => {
  updateChoices({ theme });
};
