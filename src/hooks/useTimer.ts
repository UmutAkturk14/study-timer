import { useState, useEffect, useRef } from "react";

interface UseTimerOptions {
  /** Called once when the timer stops (natural finish or manual reset).
      Argument = minutes actually worked during this run.               */
  onFinish?: (workedMinutes: number) => void;
}

export const useTimer = (
  initialDuration: number,
  { onFinish }: UseTimerOptions = {}
) => {
  const [duration, setDuration] = useState(initialDuration);   // seconds
  const [timeLeft, setTimeLeft] = useState(initialDuration);   // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [justFinished, setJustFinished] = useState(false);

  /* --- keep latest onFinish in a ref to avoid stale closure --------- */
  const finishCb = useRef<typeof onFinish>();
  useEffect(() => {
    finishCb.current = onFinish;
  }, [onFinish]);

  /* --- flag so onFinish fires exactly once per run ------------------ */
  const hasFinished = useRef(false);

  /* --- countdown loop ---------------------------------------------- */
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
            const workedMinutes = Math.round(duration / 60);
            finishCb.current?.(workedMinutes);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 10);                                  // ← 1 s tick (was 10 ms)

    return () => clearInterval(id);
  }, [isRunning, duration]);

  /* --- reset finish flag whenever duration changes ----------------- */
  useEffect(() => {
    hasFinished.current = false;
    if (!isRunning) setTimeLeft(duration);
  }, [duration, isRunning]);

  /* --- public controls --------------------------------------------- */
  const start = () => {
    setJustFinished(false);
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  /** Reset timer.
   *  • If some time was worked already, add it to analytics via onFinish.
   *  • Then zero everything. */
  const reset = () => {
    // calculate worked seconds before clearing
    const workedSeconds = duration - timeLeft;

    if (workedSeconds > 0 && !hasFinished.current) {
      hasFinished.current = true;  // ensure only once
      const workedMinutes = Math.round(workedSeconds / 60);
      if (workedMinutes > 0) finishCb.current?.(workedMinutes);
    }

    setIsRunning(false);
    setJustFinished(false);
    setTimeLeft(duration);
    hasFinished.current = false;   // allow future runs to fire onFinish

    // ensure status returns to work mode
    localStorage.setItem("workStatus", JSON.stringify({ isBreak: false }));
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
