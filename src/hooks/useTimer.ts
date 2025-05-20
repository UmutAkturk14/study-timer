// src/hooks/useTimer.ts
import { useState, useEffect, useRef } from "react";

interface UseTimerOptions {
  /** called once automatically when the countdown reaches zero */
  onFinish?: () => void;
}

export const useTimer = (
  initialDuration: number,
  { onFinish }: UseTimerOptions = {}
) => {
  const [duration, setDuration] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [justFinished, setJustFinished] = useState(false);

  // Safely hold latest onFinish function to avoid stale closure
  const finishCb = useRef<(() => void) | undefined>(undefined);
  useEffect(() => {
    finishCb.current = onFinish;
  }, [onFinish]);

  // 🔐 New: Prevent onFinish() from firing multiple times
  const hasFinished = useRef(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          setJustFinished(true);

          if (!hasFinished.current) {
            hasFinished.current = true;
            finishCb.current?.(); // ✅ will only run once
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  // 🔄 Reset finish flag on reset or new duration
  useEffect(() => {
    hasFinished.current = false;
    if (!isRunning) setTimeLeft(duration);
  }, [duration, isRunning]);

  const start = () => {
    setJustFinished(false);
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setJustFinished(false);
    setTimeLeft(duration);
    hasFinished.current = false; // ✅ ensure safe restart
  };

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    setDuration,
    justFinished,
    acknowledgeFinish: () => setJustFinished(false),
  };
};
