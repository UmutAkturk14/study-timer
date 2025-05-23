type MultipleSessionPanelProps = {
  currentIndex: number;
  totalSessions: number;
  isBreak?: boolean;
  onSkip?: () => void;
  onReset?: () => void;
};

const MutipleSessionPanel = ({
  currentIndex,
  totalSessions,
  isBreak = false,
  onSkip,
  onReset,
}: MultipleSessionPanelProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Session status */}
      <p className="dark:text-white text-sm font-medium">
        {isBreak
          ? "Break time"
          : `Session ${currentIndex + 1} of ${totalSessions}`}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2">
        {Array.from({ length: totalSessions }, (_, idx) => (
          <div
            key={idx}
            className={`w-4 h-4 rounded-full transition-colors duration-300 ${
              idx < currentIndex
                ? "bg-green-500"
                : idx === currentIndex
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MutipleSessionPanel;
