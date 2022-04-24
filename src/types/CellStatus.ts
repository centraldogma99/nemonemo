export enum CellStatus {
  BLANK,
  X,
  FILLED,
}

export const cellStatusToString = (value: CellStatus): string => {
  if (value === CellStatus.BLANK) return "";
  else if (value === CellStatus.FILLED) return "O";
  else return "X";
};
