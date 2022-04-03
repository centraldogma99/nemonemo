import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { CellStatus } from "../types/CellStatus";
import Cell from "./Cell";
import isGameboardEqual from "../utils/isGameboardEqual";
import parseAnswerIntoHints from "../utils/parseAnswerIntoHints";
import {
  gameboardState,
  gameboardLineState,
  gameboardCellState,
} from "../stores/gameboard";
import { Orientation } from "../types/Orientation";

interface GameboardProps {
  rowSize: number;
  colSize: number;
  answer: (CellStatus.FILLED | CellStatus.BLANK)[][];
}

const Gameboard = ({ rowSize, colSize, answer }: GameboardProps) => {
  const [gameboard, setGameboard] =
    useRecoilState<CellStatus[][]>(gameboardState);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const convertHintIntoStr = (hints: number[], orientation: Orientation) => {
    if (orientation === Orientation.COLUMN) {
      return hints.map((hint) => (
        <>
          {hint}
          <br />
        </>
      ));
    }
  };

  useEffect(() => {
    console.log(parseAnswerIntoHints(answer, Orientation.COLUMN));
    console.log(parseAnswerIntoHints(answer, Orientation.ROW));
  }, []);

  useEffect(() => {
    setGameboard(Array(rowSize).fill(Array(colSize).fill(CellStatus.BLANK)));
  }, [colSize, rowSize, setGameboard]);

  useEffect(() => {
    if (gameboard.length === 0) return;
    const parsedGameboard = gameboard.map((row) =>
      row.map((v) => {
        if (v === CellStatus.X) return CellStatus.BLANK;
        else return v;
      })
    );
    if (isGameboardEqual(parsedGameboard, answer)) setIsCompleted(true);
    else setIsCompleted(false);
  }, [answer, gameboard]);

  useEffect(() => {
    if (isCompleted) alert("성공!");
  }, [isCompleted]);

  return (
    <div>
      <table>
        <tbody>
          {gameboard.map((row, i) => (
            <tr key={i}>
              {row.map((_, j) => (
                <Cell row={i} col={j} key={i * rowSize + j} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Gameboard;
