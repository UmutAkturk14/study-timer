// src/components/timer/TimerControls.tsx

import React from "react";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="flex gap-3 justify-center">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
        >
          Start
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-4 py-2 bg-yellow-500 text-white rounded-xl"
        >
          Pause
        </button>
      )}
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-700 text-white rounded-xl"
      >
        Reset
      </button>
    </div>
  );
};

export default TimerControls;
