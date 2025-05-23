import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DateParser } from "../../helpers/dateParser";
import Celebrate from "./Celebrate";

let _openModal: ((streakDone?: boolean) => void) | null = null;

export const triggerSuccessPopUp = (streakDone: boolean = false) => {
  _openModal?.(streakDone);
};

type Props = {
  onBreak?: () => void;
  onNext?: () => void;
};

const SessionFinishedModal = ({ onBreak, onNext }: Props) => {
  const [open, setOpen] = useState(false);
  const [streakDone, setStreakDone] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);

  // We'll keep track of break status inside component state to avoid reading localStorage on every render
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    _openModal = (flag?: boolean) => {
      setStreakDone(!!flag);
      // Read the break status when modal opens
      const stored = localStorage.getItem("workStatus");
      const breakFlag = stored ? JSON.parse(stored).isBreak : false;
      setIsBreak(!!breakFlag);
      setOpen(true);
    };
    return () => {
      _openModal = null;
    };
  }, []);

  if (!open && !showCelebrate) return null;

  const close = () => setOpen(false);

  const setBreak = () =>
    localStorage.setItem("workStatus", JSON.stringify({ isBreak: true }));

  const clearTodayStreak = () =>
    localStorage.removeItem(`${DateParser()}-Multiple`);

  const handleCelebrate = () => {
    clearTodayStreak();
    setBreak();
    setOpen(false);
    setShowCelebrate(true);
    setTimeout(() => setShowCelebrate(false), 5000);
  };

  // Conditionally define title and message
  let title = "🎉 Great job!";
  let message = "You’ve completed this study session.";

  if (streakDone) {
    title = "🏁 Streak Complete!";
    message = "You finished every session you planned today. Amazing focus!";
  } else if (isBreak) {
    title = "⌛ Let's get back to work!";
    message = "Hope you had a refreshing break. Ready for the next session?";
  }

  return createPortal(
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-11/12 max-w-md rounded-lg bg-white dark:bg-gray-900 p-6 text-center shadow-lg">
            <h2 className="mb-2 text-2xl font-bold text-green-600">{title}</h2>
            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              {message}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {streakDone ? (
                <>
                  <button
                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                    onClick={handleCelebrate}
                  >
                    Celebrate&nbsp;🎉
                  </button>
                </>
              ) : (
                <>
                  {!isBreak && (
                    <button
                      className="rounded-md bg-yellow-500 px-4 py-2 font-medium text-white transition hover:bg-yellow-600"
                      onClick={() => {
                        onBreak?.();
                        setBreak();
                        close();
                      }}
                    >
                      Take&nbsp;Break
                    </button>
                  )}

                  <button
                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                    onClick={() => {
                      // Set workStatus to isBreak: false because user is moving from break to work session
                      localStorage.setItem(
                        "workStatus",
                        JSON.stringify({ isBreak: false })
                      );
                      setIsBreak(false); // update internal state accordingly

                      onNext?.();
                      close();
                    }}
                  >
                    Next&nbsp;Session
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showCelebrate && <Celebrate />}
    </>,
    document.body
  );
};

export default SessionFinishedModal;
