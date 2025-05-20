import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Page from "./components/page/Page";

function App() {
  return (
    <div className="w-screen min-h-[100svh] bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Page />
    </div>
  );
}

export default App;
