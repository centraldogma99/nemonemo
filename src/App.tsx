import React from "react";
import Gameboard from "./components/Gameboard";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <Gameboard rowSize={5} colSize={5} />
      </div>
    </RecoilRoot>
  );
}

export default App;
