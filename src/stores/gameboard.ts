import { CellStatus } from "../types/CellStatus";
import { atom, selectorFamily } from "recoil";
import { Orientation } from "../types/Orientation";

export const gameboardState = atom<CellStatus[][]>({
  key: "gameboardState",
  default: [],
});

export const gameboardLineState = selectorFamily<
  CellStatus[],
  { orientation: Orientation; index: number }
>({
  key: "gameboardLineState",
  get:
    ({ orientation, index }) =>
    ({ get }) => {
      const gameboard = get(gameboardState);
      if (orientation === Orientation.ROW) return gameboard[index];
      else return gameboard.map((v) => v[index]);
    },
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
