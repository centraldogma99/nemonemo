import React, { useCallback, useEffect, useState } from "react";
import { atom, selectorFamily, useRecoilState } from "recoil";
import { CellStatus } from "../types/CellStatus";
import Cell from "./Cell";
import isGameboardEqual from "../utils/isGameboardEqual";
import parseAnswerIntoHints from "../utils/parseAnswerIntoHints";

interface GameboardProps {
  rowSize: number;
  colSize: number;
  answer: (CellStatus.FILLED | CellStatus.BLANK)[][];
}

const gameboardState = atom<CellStatus[][]>({
  key: "gameboardState",
  default: [],
});

export const gameboardCellState = selectorFamily<
  CellStatus,
  { row: number; col: number }
>({
  key: "gameboardCellState",
  get:
    ({ row, col }) =>
    ({ get }) => {
      const gameboard = get(gameboardState);
      return gameboard[row][col];
    },
  set:
    ({ row, col }) =>
    ({ get, set }, newValue) => {
      const gameboard = get(gameboardState);
      set(gameboardState, [
        ...gameboard.slice(0, row),
        [
          ...gameboard[row].slice(0, col),
          newValue as CellStatus,
          ...gameboard[row].slice(col + 1),
        ],
        ...gameboard.slice(row + 1),
      ]);
    },
});

const Gameboard = ({ rowSize, colSize, answer }: GameboardProps) => {
  const [gameboard, setGameboard] =
    useRecoilState<CellStatus[][]>(gameboardState);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    console.log(parseAnswerIntoHints(answer));
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
