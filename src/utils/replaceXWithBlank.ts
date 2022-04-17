import { CellStatus } from "../types/CellStatus";

export const replaceXWithBlank = (gameboard: CellStatus[][]) =>
  gameboard.map((row) =>
    row.map((v) => {
      if (v === CellStatus.X) return CellStatus.BLANK;
      else return v;
    })
  );
