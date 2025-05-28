// Page.tsx
import { useState } from "react";
import TimerPanel from "../timer/TimerPanel";
import TodoPanel from "../todo/TodoPanel";
import MusicBar from "../musicBar/MusicBar";
import BottomLeftTabs from "../bottomLeftBar/BottomLeftTabs";
import TaskPanel from "../todo/TaskProvider";

const Page = () => {
  const [sessionVersion, setSessionVersion] = useState(0);

  const onSessionChange = () => {
    setSessionVersion((prev) => prev + 1); // triggers re-render
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-[25%] flex flex-col h-screen">
        <div className="flex-shrink-0">
          <TimerPanel onSessionChange={onSessionChange} />
        </div>
        <div className="flex-grow">
          <BottomLeftTabs key={sessionVersion} />
        </div>
      </div>

      <div className="w-[75%] flex flex-col flex-grow mt-15">
        <TaskPanel />
        <MusicBar />
      </div>
    </div>
  );
};

export default Page;
