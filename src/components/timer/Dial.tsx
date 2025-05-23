import React, { RefObject } from "react";

interface Props {
  circleRef: RefObject<HTMLDivElement>;
  conicStyle: React.CSSProperties;
  isRunning: boolean;
  angle: number;
  knobColour: string;
  startTracking: (e: React.MouseEvent | React.TouchEvent) => void;
  children: React.ReactNode; // The TimeDisplay goes here
}

const Dial: React.FC<Props> = ({
  circleRef,
  conicStyle,
  isRunning,
  angle,
  knobColour,
  startTracking,
  children,
}) => (
  <div
    ref={circleRef}
    onMouseDown={startTracking}
    onTouchStart={startTracking}
    className="relative w-64 h-64 rounded-full p-[6px] transition-colors duration-300 shadow-md dark:shadow-lg"
    style={conicStyle}
  >
    <div className="bg-white dark:bg-gray-900 rounded-full w-full h-full flex items-center justify-center relative">
      {children}

      {/* draggable knob (only when stopped) */}
      {!isRunning && (
        <div
          className="absolute w-full h-full flex items-start justify-center transition duration-300"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div
            className={`w-5 h-5 ${knobColour} rounded-full mt-[-12px] transition-colors duration-300`}
          />
        </div>
      )}
    </div>
  </div>
);

export default Dial;
