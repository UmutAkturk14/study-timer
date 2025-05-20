import TimerPanel from "../timer/TimerPanel";
import TodoPanel from "../todo/TodoPanel";
import MusicBar from "../musicBar/MusicBar";

const Page = () => {
  return (
    <div className="flex h-screen w-screen">
      <div className="w-[25%]">
        <TimerPanel />
      </div>
      <div className="w-[75%] flex flex-col">
        <TodoPanel />
        <MusicBar />
      </div>
    </div>
  );
};

export default Page;
