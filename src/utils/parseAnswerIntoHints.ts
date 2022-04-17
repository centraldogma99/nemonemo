import { CellStatus } from "../types/CellStatus";
import { Orientation } from "../types/Orientation";

const convertAnswerIntoColumns = (
  answer: (CellStatus.BLANK | CellStatus.FILLED)[][]
) => {
  return answer[0].map((_, colIndex) => answer.map((row) => row[colIndex]));
};

const hintizer = (line: (CellStatus.BLANK | CellStatus.FILLED)[]) => {
  let res: number[] = [];
  line.forEach((v, i) => {
    if (i > 0) {
      if (v === CellStatus.FILLED) {
        if (line[i - 1] !== CellStatus.FILLED) res = [...res, 1];
        else res[res.length - 1]++;
      } else if (v === CellStatus.BLANK) {
        return;
      }
    } else {
      if (v === CellStatus.BLANK) {
        return;
      } else if (v === CellStatus.FILLED) {
        res[0] = 1;
      }
    }
  });

  return res;
};

const parseAnswerIntoHints = (
  answer: (CellStatus.BLANK | CellStatus.FILLED)[][],
  orientation: Orientation
) => {
  if (orientation === Orientation.ROW) return answer.map(hintizer);
  else return convertAnswerIntoColumns(answer).map(hintizer);
};

export default parseAnswerIntoHints;
