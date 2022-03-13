import { CellStatus } from "../types/CellStatus";

const parseAnswerIntoHints = (
  answer: (CellStatus.BLANK | CellStatus.FILLED)[][]
) => {
  let a = Array(answer.length).fill(0);
  let a_idx = 0;
  for (let i = 0; i < answer.length; i++) {
    for (let j = 0; j < answer[0].length; j++) {
      if (answer[i][j] === CellStatus.BLANK) {
        if (answer[i][j - 1] && answer[i][j - 1] === CellStatus.FILLED) a_idx++;
        continue;
      }
      a[a_idx]++;
    }
  }
  return a;
};

export default parseAnswerIntoHints;
