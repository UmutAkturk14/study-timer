type Phase = "work" | "shortBreak" | "longBreak";

type SessionCycle = {
  label: string;
  sequence: { phase: Phase; minutes: number }[];
};

const pomodoroCycle: SessionCycle = {
  label: "Pomodoro",
  sequence: [
    { phase: "work", minutes: 25 },
    { phase: "shortBreak", minutes: 5 },
    { phase: "work", minutes: 25 },
    { phase: "shortBreak", minutes: 5 },
    { phase: "work", minutes: 25 },
    { phase: "longBreak", minutes: 15 },
  ],
};

export default function SessionCycleManager({
  session = pomodoroCycle,
  onFinish,
}) {
  const [index, setIndex] = useState(0);
  const current = session.sequence[index];

  const handlePhaseComplete = () => {
    onFinish?.(current); // You can log here
    setIndex((i) => (i + 1) % session.sequence.length);
  };

  return {
    currentPhase: current,
    nextPhase: session.sequence[(index + 1) % session.sequence.length],
    onPhaseComplete: handlePhaseComplete,
  };
}
