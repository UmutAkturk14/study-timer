import { useState, useEffect } from "react";
import { useTimer } from "../../hooks/useTimer";
import TimeSelector from "./TimeSelector";
import TimerControls from "./TimerControls";
import StudySwitch from "./StudySwitch";
import { WorkModes } from "../types/sessions";
import { useStorage } from "../../helpers/useStorage";
import MotivationalQuote from "./MotivationalQuote";
import MutipleSessionPanel from "./MutipleSessionPanel";
import { DateParser } from "../../helpers/dateParser";

export default function TimerPanel() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const storage = useStorage();
  const { get, set, update, remove } = storage;
  const { BasicPomodoro } = WorkModes;

  const [session, setSession] = useState(() => {
    return (
      get("sessionType") ??
      (() => {
        set("sessionType", BasicPomodoro);
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
      const multipleSession = session.multipleSession;

      update(DateParser(), { time: selectedMinutes, session });
      if (multipleSession) {
        update(`${DateParser()}-Multiple`, { time: selectedMinutes, session });
      } else {
        remove(`${DateParser()}-Multiple`);
      }

      // You can trigger animation, save to localStorage, etc.
    },
  });

  useEffect(() => {
    if (!isRunning) setDuration(selectedMinutes * 60);
  }, [selectedMinutes, isRunning, setDuration]);

  useEffect(() => {
    if (!isRunning) {
      const safeDefault = Math.min(selectedMinutes, session.maxDuration);
      setSelectedMinutes(safeDefault);
      setDuration(safeDefault * 60);
    }
  }, [session, isRunning, setDuration, selectedMinutes]);

  useEffect(() => {
    if (session.multipleSession) {
      console.log("multiple session");
    }
  }, [session]);

  return (
    <div id="time-panel" className="w-full mx-auto mt-10 px-4">
      <div className="flex flex-col items-center gap-6 bg-white dark:bg-gray-900  rounded-xl p-6 shadow-sm min-h-[45svh]">
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
        {session.multipleSession && (
          <MutipleSessionPanel currentIndex={0} totalSessions={5} />
        )}

        {/* Finished message / status */}
        {justFinished}
      </div>
      {!isRunning && <StudySwitch value={session} onChange={setSession} />}
      {isRunning && <MotivationalQuote />}
    </div>
  );
}
