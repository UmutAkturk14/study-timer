import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import type { TimeSelectorProps } from "../types/interfaces";
import { formatTime } from "../../utils/formatTime";

const TimeSelector: React.FC<TimeSelectorProps> = ({
  minutes,
  setMinutes,
  timeLeft,
  isRunning,
  sessionMaxMinutes,
  sessionInterval,
  multipleSession,
}) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const totalMinutes = sessionMaxMinutes;
  const interval = sessionInterval || 1; // fallback to 1 minute
  const totalSeconds = useMemo(() => minutes * 60, [minutes]);

  // Live update angle while running
  useEffect(() => {
    if (!isRunning) return;
    const progress = timeLeft / totalSeconds; // 1 → 0
    setAngle(progress * 360);
  }, [isRunning, timeLeft, totalSeconds]);

  // Reset knob position when timer is not running
  useEffect(() => {
    if (!isRunning) {
      const deg = (minutes / totalMinutes) * 360;
      setAngle(deg);
    }
  }, [isRunning, minutes, totalMinutes]);

  // Pointer logic (working drag!)
  const updateTimeFromPointer = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!circleRef.current || isRunning) return;

      /* centre & pointer position ----------------------------------- */
      const rect = circleRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      /* angle -------------------------------------------------------- */
      let deg = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
      deg = (deg + 90 + 360) % 360; // top = 0 deg

      /* minutes & snapping ------------------------------------------ */
      const rawMinutes = Math.round((deg / 360) * totalMinutes);
      const snapped = Math.max(
        interval,
        Math.round(rawMinutes / interval) * interval
      );

      /* align knob perfectly to the snapped value ------------------- */
      const snappedAngle = (snapped / totalMinutes) * 360;

      setAngle(snappedAngle);
      setMinutes(snapped);
    },
    [isRunning, setMinutes, totalMinutes, interval]
  );

  // Attach/remove drag listeners
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

  const display = isRunning
    ? formatTime(timeLeft)
    : `${String(minutes).padStart(2, "0")}:00`;

  const progressAngle = isRunning
    ? 360 - (timeLeft / totalSeconds) * 360
    : (minutes / totalMinutes) * 360;

  const conicStyle = {
    background: `conic-gradient(
      ${isRunning ? "#10b981" : "#0ea5e9"} ${progressAngle}deg,
      #e5e7eb ${progressAngle}deg
    )`,
  };

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
          {/* Center display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-700 dark:text-white">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isRunning ? "Time Left" : "Work Time"}
            </p>
            <p
              className={`text-4xl font-bold ${
                isRunning ? "animate-pulse" : ""
              }`}
            >
              {display}
            </p>
            <div
              className="absolute w-full h-full flex items-start justify-center"
              style={{ transform: `rotate(-${angle}deg)` }}
            >
              {isRunning && (
                <div className="w-3 h-3 bg-emerald-700 dark:bg-emerald-400 rounded-full mt-[-9px] transition-colors duration-300" />
              )}
            </div>{" "}
          </div>

          {/* Knob */}
          {!isRunning && (
            <div
              className="absolute w-full h-full flex items-start justify-center transition duration-300"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="w-5 h-5 bg-emerald-700 dark:bg-sky-400 rounded-full mt-[-12px] transition-colors duration-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
