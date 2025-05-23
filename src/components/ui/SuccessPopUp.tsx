/* ────────────────────────────────────────────────────────────── *
 *  SessionFinishedModal.tsx                                      *
 *  A one-liner helper “triggerSuccessPopUp()” shows the modal.   *
 * ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

/* --------------------------------------------------------------
   Global trigger pointer – gets initialised when the component
   mounts.  If the helper is called before mount, nothing happens.
---------------------------------------------------------------- */
let _openModal: (() => void) | null = null;

/* --------------------------------------------------------------
   Call this anywhere in your app to open the “session finished”
   pop-up.  ▼
---------------------------------------------------------------- */
export const triggerSuccessPopUp = () => {
  if (_openModal) _openModal();
};

/* --------------------------------------------------------------
   Props allow you to hook “take break” and “next session”.
---------------------------------------------------------------- */
type Props = {
  onBreak?: () => void;
  onNext?: () => void;
};

const setBreak = () => {
  localStorage.setItem('breakStatus', JSON.stringify({isBreak: true}))
}


const SessionFinishedModal = ({ onBreak, onNext }: Props) => {
  const [open, setOpen] = useState(false);

  /* register the opener on mount, unregister on unmount */
  useEffect(() => {
    _openModal = () => setOpen(true);
    return () => {
      _openModal = null;
    };
  }, []);

  /* closed ⇒ render nothing */
  if (!open) return null;

  /* local close helper */
  const close = () => setOpen(false);

  /* modal ─ rendered through a portal so it sits at <body> level */
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-11/12 max-w-md rounded-lg bg-white dark:bg-gray-900 p-6 text-center shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-green-600">
          🎉 Great job!
        </h2>
        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          You’ve completed this study session.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            className="rounded-md bg-yellow-500 px-4 py-2 font-medium text-white transition hover:bg-yellow-600"
            onClick={() => {
              onBreak?.();
              close();
            }}
          >
            Take&nbsp;Break
          </button>

          <button
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            onClick={() => {
              // onNext?.();
              setBreak();
              close();
            }}
          >
            Next&nbsp;Session
          </button>

          <button
            className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SessionFinishedModal;
