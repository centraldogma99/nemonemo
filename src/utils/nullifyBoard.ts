import { CellStatus } from "../types/CellStatus";

export const nullifyBoard = (board: CellStatus[][]) => {
  return board.map((row) => row.map((_) => CellStatus.BLANK));
};
