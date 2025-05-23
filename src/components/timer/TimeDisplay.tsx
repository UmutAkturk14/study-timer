interface Props {
  label: string;
  display: string;
  isRunning: boolean;
  angle: number;
  knobColour: string;
}

const TimeDisplay: React.FC<Props> = ({
  label,
  display,
  isRunning,
  angle,
  knobColour,
}) => (
  <>
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
          <div
            className={`w-3 h-3 ${knobColour} rounded-full mt-[-9px] transition-colors duration-300`}
          />
        </div>
      )}
    </div>
  </>
);

export default TimeDisplay;
