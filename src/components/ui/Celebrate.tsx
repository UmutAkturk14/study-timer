import React, { useEffect, useState } from "react";

const EMOJIS = [
  "🎉",
  "🎊",
  "🥳",
  "✨",
  "🎈",
  "🍾",
  "🥂",
  "💥",
  "🌟",
  "🎵",
  "🎇",
  "🎆",
];

const EMOJI_COUNT = 240;

type EmojiProps = {
  emoji: string;
  style: React.CSSProperties;
  animationDuration: number;
};

const FallingEmoji = ({ emoji, style, animationDuration }: EmojiProps) => {
  return (
    <span
      style={{
        position: "fixed",
        top: "-2rem",
        fontSize: "2rem",
        pointerEvents: "none",
        userSelect: "none",
        animationName: "fall",
        animationTimingFunction: "linear",
        animationIterationCount: 1,
        animationFillMode: "forwards",
        animationDuration: `${animationDuration}s`,
        ...style,
      }}
    >
      {emoji}
    </span>
  );
};

const Celebrate = () => {
  const [emojis, setEmojis] = useState<
    { emoji: string; left: number; animationDuration: number; delay: number }[]
  >([]);

  useEffect(() => {
    // Generate emoji data for animation
    const generatedEmojis = Array.from({ length: EMOJI_COUNT }).map(() => ({
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100, // vw position
      animationDuration: 3 + Math.random() * 2, // between 3 and 5 seconds
      delay: Math.random() * 2, // delay start up to 2 seconds for spread
    }));
    setEmojis(generatedEmojis);

    // Clean up after 5 seconds (animation duration)
    const timeout = setTimeout(() => setEmojis([]), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (emojis.length === 0) return null;

  return (
    <>
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>

      {emojis.map(({ emoji, left, animationDuration, delay }, i) => (
        <FallingEmoji
          key={i}
          emoji={emoji}
          animationDuration={animationDuration}
          style={{ left: `${left}vw`, animationDelay: `${delay}s` }}
        />
      ))}
    </>
  );
};

export default Celebrate;
