// src/components/timer/TimeSelector.tsx
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import type { TimeSelectorProps } from "../types/interfaces";
import { formatTime } from "../../utils/formatTime";
import Dial from "./Dial";
import TimeDisplay from "./TimeDisplay";

import { setBreakTime, setWorkTime } from "../../helpers/setChoices";

interface Props extends TimeSelectorProps {
  isBreak?: boolean; // true → break selector
}

const TimeSelector: React.FC<Props> = ({
  minutes,
  setMinutes,
  timeLeft,
  isRunning,
  sessionMaxMinutes,
  sessionInterval,
  multipleSession,
  isBreak = false,
}) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  /* ───── logic constants ───── */
  const totalMinutes = isBreak ? 30 : sessionMaxMinutes ?? 25;
  const interval = sessionInterval || 1;
  const totalSeconds = useMemo(() => minutes * 60, [minutes]);

  /* ───── track previous mode to avoid mis-persisting on flip ───── */
  const prevModeRef = useRef<boolean>(isBreak);

  /* ───── persist helper ───── */
  const persistChoice = useCallback(
    (val: number) => {
      if (isBreak) {
        setBreakTime(val);
      } else {
        setWorkTime(val);
      }
    },
    [isBreak]
  );

  /* ───── live progress while running ───── */
  useEffect(() => {
    if (!isRunning) return;
    setAngle((timeLeft / totalSeconds) * 360);
  }, [isRunning, timeLeft, totalSeconds]);

  /* ───── reset knob when stopped ───── */
  useEffect(() => {
    if (!isRunning) {
      setAngle((minutes / totalMinutes) * 360);
    }
  }, [isRunning, minutes, totalMinutes]);

  /* ───── load stored choice when mode flips (timer stopped) ───── */
  useEffect(() => {
    if (isRunning) return; // don’t disturb active timer
    if (prevModeRef.current === isBreak) return; // mode didn’t change

    const stored = JSON.parse(localStorage.getItem("choices") || "{}");
    const remembered = isBreak ? stored.breakTime : stored.workTime;

    if (typeof remembered === "number" && remembered > 0) {
      setMinutes(remembered);
      setAngle((remembered / totalMinutes) * 360);
    }

    prevModeRef.current = isBreak; // update ref
  }, [isBreak, isRunning, setMinutes, totalMinutes]);

  /* ───── save externally-changed minutes (while stopped) ───── */
  useEffect(() => {
    if (!isRunning && prevModeRef.current === isBreak) {
      persistChoice(minutes);
    }
  }, [minutes, isRunning, persistChoice, isBreak]);

  /* ───── pointer-drag handler ───── */
  const updateTimeFromPointer = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!circleRef.current || isRunning) return;

      const rect = circleRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      let deg = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
      deg = (deg + 90 + 360) % 360;

      const raw = Math.round((deg / 360) * totalMinutes);
      const snapped = Math.max(interval, Math.round(raw / interval) * interval);

      setAngle((snapped / totalMinutes) * 360);
      setMinutes(snapped);
      persistChoice(snapped); // save instantly
    },
    [isRunning, setMinutes, totalMinutes, interval, persistChoice]
  );

  /* ───── listener helpers ───── */
  const stopTracking = () => {
    window.removeEventListener("mousemove", updateTimeFromPointer);
    window.removeEventListener("touchmove", updateTimeFromPointer);
    window.removeEventListener("mouseup", stopTracking);
    window.removeEventListener("touchend", stopTracking);
  };

  const startTracking = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRunning) return;
    e.preventDefault();
    updateTimeFromPointer(e.nativeEvent);
    window.addEventListener("mousemove", updateTimeFromPointer);
    window.addEventListener("touchmove", updateTimeFromPointer);
    window.addEventListener("mouseup", stopTracking);
    window.addEventListener("touchend", stopTracking);
  };

  useEffect(() => () => stopTracking(), []);

  /* ───── derived display info ───── */
  const label = isRunning
    ? isBreak
      ? "Break Left"
      : "Time Left"
    : isBreak
    ? "Break Time"
    : "Work Time";

  const display = isRunning
    ? formatTime(timeLeft)
    : `${String(minutes).padStart(2, "0")}:00`;

  const progressAngle = isRunning
    ? 360 - (timeLeft / totalSeconds) * 360
    : (minutes / totalMinutes) * 360;

  const colourWhenRunning = isBreak ? "#f59e0b" : "#10b981";
  const colourWhenStopped = isBreak ? "#fbbf24" : "#0ea5e9";
  const knobColour = isBreak
    ? "bg-amber-500 dark:bg-amber-400"
    : "bg-emerald-700 dark:bg-sky-400";

  const conicStyle = {
    background: `conic-gradient(
      ${isRunning ? colourWhenRunning : colourWhenStopped} ${progressAngle}deg,
      #e5e7eb ${progressAngle}deg
    )`,
  };

  /* ───── JSX ───── */
  return (
    <div className="flex flex-col items-center justify-center mt-5 select-none">
      <Dial
        circleRef={circleRef}
        conicStyle={conicStyle}
        isRunning={isRunning}
        angle={angle}
        knobColour={knobColour}
        startTracking={startTracking}
      >
        <TimeDisplay
          label={label}
          display={display}
          isRunning={isRunning}
          angle={angle}
          knobColour={knobColour}
        />
      </Dial>
    </div>
  );
};

export default TimeSelector;
