// src/components/MotivationalQuote.tsx
import { useMemo } from "react";
import { Quotes } from "../../data/quotes";

const dashRegex = / ?[-–] ?/; // matches “-” or “–” with optional spaces

const MotivationalQuote = () => {
  /* pick a quote once per mount */
  const [quoteText, author] = useMemo(() => {
    const raw = Quotes[Math.floor(Math.random() * Quotes.length)];
    const parts = raw.split(dashRegex);
    return [parts[0].trim(), parts[1]?.trim()];
  }, []);

  return (
    <div className="w-full mt-4 flex flex-col justify-center items-center mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-2">
      {/* quote line */}
      <p className="text-base font-semibold text-gray-800 dark:text-gray-50">
        {quoteText}
      </p>

      {/* author line (if present) */}
      {author && (
        <p className="mt-3 text-right italic text-gray-600 dark:text-gray-400">
          - {author}
        </p>
      )}
    </div>
  );
};

export default MotivationalQuote;
