import React from "react";
import Gameboard from "./components/Gameboard";
import { RecoilRoot } from "recoil";
import { CellStatus } from "./types/CellStatus";

const answer1: (CellStatus.BLANK | CellStatus.FILLED)[][] = [
  [
    CellStatus.BLANK,
    CellStatus.FILLED,
    CellStatus.FILLED,
    CellStatus.BLANK,
    CellStatus.FILLED,
  ],
  [
    CellStatus.BLANK,
    CellStatus.FILLED,
    CellStatus.BLANK,
    CellStatus.FILLED,
    CellStatus.BLANK,
  ],
  [
    CellStatus.FILLED,
    CellStatus.BLANK,
    CellStatus.BLANK,
    CellStatus.BLANK,
    CellStatus.FILLED,
  ],
  [
    CellStatus.BLANK,
    CellStatus.FILLED,
    CellStatus.BLANK,
    CellStatus.FILLED,
    CellStatus.BLANK,
  ],
  [
    CellStatus.BLANK,
    CellStatus.BLANK,
    CellStatus.FILLED,
    CellStatus.BLANK,
    CellStatus.BLANK,
  ],
];

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <Gameboard rowSize={5} colSize={5} answer={answer1} />
      </div>
    </RecoilRoot>
  );
}

export default App;
