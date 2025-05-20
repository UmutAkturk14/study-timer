// src/components/timer/types/sessions.ts
import type { WorkMode } from "./interfaces";

/** 1. Simple, one-off session — good for quick tasks or light study */
export const SimpleSession: WorkMode = {
  id: "simple",
  label: "Simple Session",
  description:
    "Single, continuous session. Time-boxed up to 90–120 minutes. Ideal for quick tasks or casual study with no built-in breaks.",
  maxDuration: 120,   // minutes
  interval: 5,        // user can pick any minute
  multipleSession: false,
  break: false,
};

/** 2. Classic Pomodoro cycles (work + short breaks) */
export const BasicPomodoro: WorkMode = {
  id: "pomodoro",
  label: "Basic Pomodoro",
  description:
    "Focus / break cycles (e.g., 25 min focus + 5 min break). User chooses sessions (4–8) and durations. Encourages rhythm and regular rest; total run ≲ 60 minutes.",
  maxDuration: 60,    // total time picker cap per focus block
  interval: 1,
  multipleSession: true, // multiple cycles
  break: true,          // has break periods
};

/** 3. Deep-focus marathon with motivation nudges */
export const DeepFocus: WorkMode = {
  id: "deep",
  label: "Deep Focus",
  description:
    "Long, uninterrupted work blocks (2–6 hours). Shows motivational quotes and milestone progress. Optional ambient sounds to maintain flow.",
  maxDuration: 360,   // up to 6 hours
  interval: 5,        // picker moves in 5-minute steps
  multipleSession: false,
  break: false,       // no programmed breaks
};

/** 4. Mindfulness / quick reset */
export const Mindfulness: WorkMode = {
  id: "mindfulness",
  label: "Mindfulness Mode",
  description:
    "Short 10–15 minute sessions for meditation, stretching or breathing exercises. Perfect for quick mental resets.",
  maxDuration: 15,
  interval: 1,
  multipleSession: false,
  break: false,
};

/** Convenience export: all predefined modes */
export const WorkModes = {
  SimpleSession,
  BasicPomodoro,
  DeepFocus,
  Mindfulness,
};

export type WorkModeKeys = keyof typeof WorkModes;
