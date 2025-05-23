import TimerPanel from "../timer/TimerPanel";
import TodoPanel from "../todo/TodoPanel";
import MusicBar from "../musicBar/MusicBar";
import BottomLeftTabs from "../bottomLeftBar/BottomLeftTabs";

const Page = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left side: vertical flex container */}
      <div className="w-[25%] flex flex-col h-screen">
        {/* TimerPanel gets fixed or intrinsic height */}
        <div className="flex-shrink-0">
          <TimerPanel />
        </div>

        {/* BottomLeftTabs fills remaining space and scrolls internally */}
        <div className="flex-grow overflow-hidden">
          <BottomLeftTabs />
        </div>
      </div>

      {/* Right side stays the same */}
      <div className="w-[75%] flex flex-col">
        <TodoPanel />
        <MusicBar />
      </div>
    </div>
  );
};

export default Page;
