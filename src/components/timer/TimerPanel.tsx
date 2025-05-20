import { useState, useEffect } from "react";
import { useTimer } from "../../hooks/useTimer";
import TimeSelector from "./TimeSelector";
import TimerControls from "./TimerControls";
import StudySwitch from "./StudySwitch";
import { WorkModes } from "../types/sessions";
import { useStorage } from "../../helpers/useStorage";
import MotivationalQuote from "./MotivationalQuote";

export default function TimerPanel() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const storage = useStorage();
  const { BasicPomodoro } = WorkModes;

  const [session, setSession] = useState(() => {
    return (
      storage.get("sessionType") ??
      (() => {
        storage.set("sessionType", BasicPomodoro);
        return BasicPomodoro;
      })()
    );
  });

  const {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    setDuration,
    justFinished,
  } = useTimer(selectedMinutes * 60, {
    onFinish: () => {
      console.log("Studied minutes: ", selectedMinutes);
      console.log("⏰ Timer finished!");
      // You can trigger animation, save to localStorage, etc.
    },
  });

  useEffect(() => {
    if (!isRunning) setDuration(selectedMinutes * 60);
  }, [selectedMinutes, isRunning, setDuration]);

  useEffect(() => {
    console.log("Session changed");
    if (!isRunning) {
      const safeDefault = Math.min(selectedMinutes, session.maxDuration);
      setSelectedMinutes(safeDefault);
      setDuration(safeDefault * 60);
    }
  }, [session, isRunning, setDuration, selectedMinutes]);

  return (
    <div className="w-full mx-auto mt-10 px-4">
      <div className="flex flex-col items-center gap-6 bg-white dark:bg-gray-900  rounded-xl p-6 shadow-sm">
        {/* Mode selector */}

        {/* Time selector */}
        <TimeSelector
          key={session.id}
          minutes={selectedMinutes}
          setMinutes={setSelectedMinutes}
          timeLeft={timeLeft}
          isRunning={isRunning}
          sessionMaxMinutes={session.maxDuration}
          sessionInterval={session.interval}
          multipleSession={session.multipleSession}
        />

        {/* Timer controls */}
        <TimerControls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        {/* Finished message / status */}
        {justFinished}
      </div>
      {!isRunning && <StudySwitch value={session} onChange={setSession} />}
      {isRunning && <MotivationalQuote />}
    </div>
  );
}
