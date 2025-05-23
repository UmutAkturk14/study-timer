import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { TimeSelectorProps } from "../types/interfaces";
import { formatTime } from "../../utils/formatTime";

/* ────────────────────────────────────────────────────────────── *
 * Extend the existing props with an optional “isBreak” flag.
 * -------------------------------------------------------------  */
interface Props extends TimeSelectorProps {
  /** `true` → break selector, `false` (default) → work/study selector */
  isBreak?: boolean;
}

const TimeSelector: React.FC<Props> = ({
  minutes,
  setMinutes,
  timeLeft,
  isRunning,
  sessionMaxMinutes,
  sessionInterval,
  multipleSession,
  isBreak = false,                    /* ← NEW */
}) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  const totalMinutes = sessionMaxMinutes;
  const interval = sessionInterval || 1;
  const totalSeconds = useMemo(() => minutes * 60, [minutes]);

  /* ───────────────────────── live progress while running ─────── */
  useEffect(() => {
    if (!isRunning) return;
    const progress = timeLeft / totalSeconds; // 1 → 0
    setAngle(progress * 360);
  }, [isRunning, timeLeft, totalSeconds]);

  /* ───────────────────────── reset knob when stopped ─────────── */
  useEffect(() => {
    if (!isRunning) {
      const deg = (minutes / totalMinutes) * 360;
      setAngle(deg);
    }
  }, [isRunning, minutes, totalMinutes]);

  /* ───────────────────────── pointer-drag logic ──────────────── */
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
      deg = (deg + 90 + 360) % 360; // 0° at top

      const raw = Math.round((deg / 360) * totalMinutes);
      const snapped = Math.max(interval, Math.round(raw / interval) * interval);

      setAngle((snapped / totalMinutes) * 360);
      setMinutes(snapped);
    },
    [isRunning, setMinutes, totalMinutes, interval]
  );

  /* attach / detach drag listeners */
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

  useEffect(() => stopTracking, []);

  /* ───────────────────────── derived display info ─────────────── */
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

  /* colour theme: green/blue for work, amber/purple for break */
  const colourWhenRunning = isBreak ? "#f59e0b" /* amber */ : "#10b981"; /* green */
  const colourWhenStopped = isBreak ? "#fbbf24" /* lighter amber */ : "#0ea5e9"; /* blue */

  const conicStyle = {
    background: `conic-gradient(
      ${isRunning ? colourWhenRunning : colourWhenStopped} ${progressAngle}deg,
      #e5e7eb ${progressAngle}deg
    )`,
  };

  const knobColour = isBreak ? "bg-amber-500 dark:bg-amber-400" : "bg-emerald-700 dark:bg-sky-400";

  /* ───────────────────────── JSX ──────────────────────────────── */
  return (
    <div className="flex flex-col items-center justify-center mt-5 select-none">
      <div
        ref={circleRef}
        onMouseDown={startTracking}
        onTouchStart={startTracking}
        className="relative w-64 h-64 rounded-full p-[6px] transition-colors duration-300 shadow-md dark:shadow-lg"
        style={conicStyle}
      >
        <div className="bg-white dark:bg-gray-900 rounded-full w-full h-full flex items-center justify-center relative">
          {/* centre display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-700 dark:text-white">
            <p className="text-lg text-gray-600 dark:text-gray-400">{label}</p>
            <p className={`text-4xl font-bold ${isRunning ? "animate-pulse" : ""}`}>
              {display}
            </p>

            {/* running indicator dot */}
            {isRunning && (
              <div
                className="absolute w-full h-full flex items-start justify-center"
                style={{ transform: `rotate(-${angle}deg)` }}
              >
                <div className={`w-3 h-3 ${knobColour} rounded-full mt-[-9px] transition-colors duration-300`} />
              </div>
            )}
          </div>

          {/* draggable knob (only when stopped) */}
          {!isRunning && (
            <div
              className="absolute w-full h-full flex items-start justify-center transition duration-300"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className={`w-5 h-5 ${knobColour} rounded-full mt-[-12px] transition-colors duration-300`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
