import { useState } from "react";

import "./App.css";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <div className="flex justify-center w-[100%] h-[100vh]">
      <div className="App">
        <h1 className="text-2xl font-bold mb-4">Matrix Game</h1>
        <GameBoard size={10} gifts={10} questions={5} />
      </div>
    </div>
  );
}

export default App;
