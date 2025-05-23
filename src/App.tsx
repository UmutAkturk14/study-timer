import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Page from "./components/page/Page";
import SessionFinishedModal from "./components/ui/SuccessPopUp";

function App() {
  return (
    <div className="w-screen min-h-[100svh] bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-emerald-950 ">
      <Navbar />
      <Page />

      {/* Mount the modal once, pass optional handlers if needed */}
      <SessionFinishedModal
        onBreak={() => {
          console.log("Break button clicked");
          // You can add logic here, e.g., start a break timer
        }}
        onNext={() => {
          console.log("Next session clicked");
          // You can add logic here, e.g., start next session
        }}
      />
    </div>
  );
}

export default App;
