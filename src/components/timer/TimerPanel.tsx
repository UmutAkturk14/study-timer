// src/components/timer/TimerPanel.tsx
import { useState, useEffect } from "react";
import { useTimer } from "../../hooks/useTimer";
import TimeSelector from "./TimeSelector";
import TimerControls from "./TimerControls";
import StudySwitch from "./StudySwitch";
import MotivationalQuote from "./MotivationalQuote";
import MutipleSessionPanel from "./MutipleSessionPanel";   // ← keep the file-name you already have
import { WorkModes } from "../types/sessions";
import { useStorage } from "../../helpers/useStorage";
import { DateParser } from "../../helpers/dateParser";
import { triggerSuccessPopUp } from "../ui/SuccessPopUp";

export default function TimerPanel() {
  /* ───────────────────────────────────────── storage helpers ─────────── */
  const storage = useStorage();
  const { get, set, update, remove } = storage;

  /* ───────────────────────────────────────── initial study mode ───────── */
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

  /* ───────────────────────────────────────── multi-session progress ───── */
  const [sessionIndex, setSessionIndex] = useState(
    get(`${DateParser()}-Multiple`)?.sessionCount ?? 0
  );

  /*  Reset progress whenever the user flips between
      single-session and multi-session modes.                            */
  useEffect(() => {
    setSessionIndex(0);
  }, [session.multipleSession]);

  /* ───────────────────────────────────────── timer duration & running ─── */
  const [selectedMinutes, setSelectedMinutes] = useState(25);

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
      /* write today’s study stats */
      update(DateParser(), { time: selectedMinutes, session });

      if (session.multipleSession) {
        update(`${DateParser()}-Multiple`, { time: selectedMinutes, session });

        /* advance the progress bar */
        setSessionIndex((prev: number) => prev + 1);
      } else {
        remove(`${DateParser()}-Multiple`);
      }

      triggerSuccessPopUp();
    },
  });

  /* keep raw seconds in sync with the picker while the timer is stopped */
  useEffect(() => {
    if (!isRunning) setDuration(selectedMinutes * 60);
  }, [selectedMinutes, isRunning, setDuration]);

  /* clamp minutes if the user switches to a mode with a lower max */
  useEffect(() => {
    if (!isRunning) {
      const safe = Math.min(selectedMinutes, session.maxDuration);
      setSelectedMinutes(safe);
      setDuration(safe * 60);
    }
  }, [session, isRunning, setDuration, selectedMinutes]);

  /* ───────────────────────────────────────── render ───────────────────── */
  return (
    <div id="time-panel" className="w-full mx-auto mt-10 px-4">
      <div className="flex flex-col items-center gap-6 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm min-h-[45svh]">
        {/* time selector */}
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

        {/* controls */}
        <TimerControls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        {/* multi-session progress indicator */}
        {session.multipleSession && (
          <MutipleSessionPanel
            currentIndex={sessionIndex}
            setCurrentIndex={setSessionIndex}
          />
        )}

        {/* “finished” flash message, if any */}
        {justFinished}
      </div>

      {/* mode switch / quote */}
      {!isRunning && <StudySwitch value={session} onChange={setSession} />}
      {isRunning && <MotivationalQuote />}
    </div>
  );
}
