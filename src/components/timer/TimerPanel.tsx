// src/components/timer/TimerPanel.tsx
import { useState, useEffect } from "react";
import { useTimer } from "../../hooks/useTimer";
import TimeSelector from "./TimeSelector";
import TimerControls from "./TimerControls";
import StudySwitch from "./StudySwitch";
import MotivationalQuote from "./MotivationalQuote";
import MultipleSessionPanel from "./MutipleSessionPanel";
import { WorkModes } from "../types/sessions";
import { useStorage } from "../../helpers/useStorage";
import { DateParser } from "../../helpers/dateParser";
import { triggerSuccessPopUp } from "../ui/SuccessPopUp";
import { setSessionCount as persistSessionCount } from "../../helpers/setChoices"; // ← add

export default function TimerPanel() {
  const storage = useStorage();
  const { get, set, update, remove } = storage;

  /* ─── break / work status ─── */
  const [isBreak, setIsBreak] = useState(get("workStatus")?.isBreak ?? false);
  useEffect(() => {
    const id = setInterval(() => {
      setIsBreak(get("workStatus")?.isBreak ?? false);
    }, 500);
    return () => clearInterval(id);
  }, [get]);

  /* ─── study mode (Pomodoro etc.) ─── */
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

  /* ─── lifted sessionCount ─── */
  const [sessionCount, setSessionCount] = useState<number>(() => {
    const c = get("choices");
    return c?.sessionCount ?? 5;
  });

  const handleSessionCountChange = (cnt: number) => {
    setSessionCount(cnt);
    persistSessionCount(cnt); // persist to localStorage
  };

  /* ─── current index inside multi-session ─── */
  const [sessionIndex, setSessionIndex] = useState(
    get(`${DateParser()}-Multiple`)?.sessionCount ?? 0
  );

  /* reset index when user toggles single ↔ multi */
  useEffect(() => setSessionIndex(0), [session.multipleSession]);

  /* ─── minutes picker ─── */
  const [selectedMinutes, setSelectedMinutes] = useState(
    isBreak ? get("choices")?.breakTime ?? 10 : get("choices")?.workTime ?? 45
  );

  /* ─── timer hook ─── */
  const {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    setDuration,
    justFinished,
  } = useTimer(selectedMinutes * 60, {
    onFinish: (workedMinutes) => {
      const today = DateParser();

      if (workedMinutes) {
        update(DateParser(), { time: workedMinutes, session });
      } else {
        update(today, { time: selectedMinutes, session });

        if (session.multipleSession && !get("workStatus").isBreak) {
          update(`${today}-Multiple`, { time: selectedMinutes, session });

          const isFinalSession = sessionIndex + 1 >= sessionCount;

          if (isFinalSession) {
            remove(`${today}-Multiple`); // streak complete → reset
            setSessionIndex(0);
            triggerSuccessPopUp(true); // show streak complete popup
          } else {
            setSessionIndex(sessionIndex + 1); // continue streak
            triggerSuccessPopUp(); // normal session complete popup
          }
        } else {
          remove(`${today}-Multiple`); // not a streak, make sure it’s clean
          triggerSuccessPopUp(); // regular session popup
        }
      }
    },
  });

  /* keep raw seconds in sync while stopped */
  useEffect(() => {
    if (!isRunning) setDuration(selectedMinutes * 60);
  }, [selectedMinutes, isRunning, setDuration]);

  /* clamp minutes when mode changes */
  useEffect(() => {
    if (!isRunning) {
      const safe = Math.min(selectedMinutes, session.maxDuration);
      setSelectedMinutes(safe);
      setDuration(safe * 60);
    }
  }, [session, isRunning, setDuration, selectedMinutes]);

  return (
    <div id="time-panel" className="w-full mx-auto mt-10 px-4">
      <div className="flex flex-col items-center gap-6 rounded-xl p-3 shadow-xl dark:shadow-gray-700 min-h-[45svh]">
        <TimeSelector
          key={session.id}
          minutes={selectedMinutes}
          setMinutes={setSelectedMinutes}
          timeLeft={timeLeft}
          isRunning={isRunning}
          sessionMaxMinutes={session.maxDuration}
          sessionInterval={session.interval}
          multipleSession={session.multipleSession}
          isBreak={isBreak}
        />

        <TimerControls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
          isBreak={isBreak}
        />

        {session.multipleSession && (
          <MultipleSessionPanel
            currentIndex={sessionIndex}
            setCurrentIndex={setSessionIndex}
            sessionCount={sessionCount}
            setSessionCount={handleSessionCountChange}
          />
        )}

        {justFinished}
      </div>

      {!isRunning && <StudySwitch value={session} onChange={setSession} />}
      {isRunning && <MotivationalQuote />}
    </div>
  );
}
