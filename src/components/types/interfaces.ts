// src/components/timer/types/interfaces.ts
export interface TimeSelectorProps {
  minutes: number;                     // user-chosen duration (minutes)
  setMinutes: (m: number) => void;     // callback to lift state
  timeLeft: number;                    // current seconds remaining
  isRunning: boolean;                  // whether timer is counting
  sessionMaxMinutes: number;
  sessionInterval: number;
  multipleSession: boolean;
}

export interface WorkMode {
  id: string;
  label: string;
  description: string;
  maxDuration: number;
  interval: number;
  multipleSession: boolean;
  break: boolean;
}
