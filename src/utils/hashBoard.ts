import { CellStatus } from "../types/CellStatus";

export const hash = (board: (CellStatus.BLANK | CellStatus.FILLED)[][]) => {
  const res: number[] = [];
  board.forEach((row) => {
    let r = 0;
    row.forEach(
      (v, i) =>
        (r += v === CellStatus.FILLED ? Math.pow(2, row.length - i - 1) : 0)
    );
    res.push(r);
  });
  res.push(board[0].length);

  return res.join(" ");
};

function dec2bin(dec: number) {
  return (dec >>> 0).toString(2);
}

export const unhash = (
  hash: number[]
): (CellStatus.BLANK | CellStatus.FILLED)[][] => {
  return hash.slice(0, hash.length - 1).map((v) => {
    const res = dec2bin(v)
      .split("")
      .map((w) => (w === "1" ? CellStatus.FILLED : CellStatus.BLANK));
    const lengthDiff = hash[hash.length - 1] - res.length;
    // if (lengthDiff < 0) throw Error("잘못된 코드입니다!");

    return [
      ...(lengthDiff > 0 ? Array(lengthDiff).fill(CellStatus.BLANK) : []),
      ...res,
    ];
  });
};
