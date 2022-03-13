import React, { useCallback, useEffect, useState } from "react";
import {
  atom,
  selectorFamily,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import { CellStatus } from "../types/CellStatus";
import Cell from "./Cell";

interface GameboardProps {
  rowSize: number;
  colSize: number;
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

const Gameboard = ({ rowSize, colSize }: GameboardProps) => {
  const [gameboard, setGameboard] = useRecoilState(gameboardState);

  useEffect(() => {
    setGameboard(Array(rowSize).fill(Array(colSize).fill(CellStatus.BLANK)));
  }, [colSize, rowSize, setGameboard]);

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
