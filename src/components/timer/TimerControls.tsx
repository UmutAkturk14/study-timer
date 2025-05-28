  // src/components/timer/TimerControls.tsx
  import React from "react";

  type Props = {
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    /** `true` → we’re on a break; `false` → we’re working */
    isBreak: boolean; // not optional, must be passed explicitly
  };

  const TimerControls: React.FC<Props> = ({
    isRunning,
    onStart,
    onPause,
    onReset,
    isBreak,
  }) => {
    const mainColour = isBreak
      ? "bg-amber-500 hover:bg-amber-600"
      : "bg-emerald-600 hover:bg-emerald-700";

    return (
      <div className="flex items-center gap-4">
        {isRunning ? (
          <button
            onClick={onPause}
            className={`px-5 py-2 text-white ${mainColour} rounded-md`}
            aria-label="Pause timer"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={onStart}
            className={`px-5 py-2 text-white ${mainColour} rounded-md`}
            aria-label={isBreak ? "Start break timer" : "Start work timer"}
          >
            {isBreak ? "Start Break" : "Start Work"}
          </button>
        )}

        <button
          onClick={onReset}
          className="px-5 py-2 text-gray-900 bg-gray-300 hover:bg-gray-400 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
    );
  };

  export default TimerControls;
