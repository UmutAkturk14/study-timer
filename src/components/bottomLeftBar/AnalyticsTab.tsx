import { DateParser } from "../../helpers/dateParser";
import { useStorage } from "../../helpers/useStorage";

export default function AnalyticsTab() {
  const storage = useStorage();
  const { get } = storage;
  const analytics = get(DateParser()) || {};

  const { sessionCount = 0, time = 0 } = analytics;

  // Convert minutes to hours and minutes
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  // Compliment based on worked time
  let compliment = "";
  if (time === 0) {
    compliment = "No work yet — get started!";
  } else if (time < 60) {
    compliment = "Good start! Keep going.";
  } else if (time < 180) {
    compliment = "Nice work! You're building momentum.";
  } else if (time < 360) {
    compliment = "Great job! You're making serious progress.";
  } else {
    compliment = "Amazing! You've worked hard today! 🎉";
  }

  // Knob parameters
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // We'll show percentage of max daily goal (e.g. 8 hours = 480 minutes)
  const maxMinutes = 480;
  const percent = Math.min(time / maxMinutes, 1);
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center p-2 rounded-lg shadow-lg max-w-sm mx-auto">
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Daily / Weekly Analytics
      </h3>

      <svg
        height={radius * 2}
        width={radius * 2}
        className="mb-4"
        role="img"
        aria-label={`Worked time progress: ${Math.round(percent * 100)}%`}
      >
        <circle
          stroke="#e5e7eb" // Tailwind gray-300
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#10b981" // Tailwind emerald-500
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="1.5rem"
          fill="#047857" // Tailwind emerald-700
          className="dark:fill-emerald-400 font-semibold"
        >
          {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
        </text>
      </svg>

      <div className="mb-4 text-center text-gray-700 dark:text-gray-300">
        <p className="text-lg font-medium">
          {time > 0
            ? `You've worked for ${
                hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""} and ` : ""
              }${minutes} minute${minutes !== 1 ? "s" : ""} today.`
            : "No work recorded today."}
        </p>
        <p className="mt-2 italic text-sm text-emerald-600 dark:text-emerald-400">
          {compliment}
        </p>
      </div>

      <div className="text-gray-600 dark:text-gray-400">
        <p>
          <strong>Total Sessions:</strong> {sessionCount}
        </p>
      </div>
    </div>
  );
}
