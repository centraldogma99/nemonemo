import { Orientation } from "../types/Orientation";

export const changeOneElementFrom2dArray = <T>(
  arr: T[][],
  row: number,
  col: number,
  value: T
) => {
  if (arr[row][col] === undefined)
    throw Error("wrong parameter, index not exist");
  return [
    ...arr.slice(0, row),
    [...arr[row].slice(0, col), value, ...arr[row].slice(col + 1)],
    ...arr.slice(row + 1),
  ];
};

export const changeALineFrom2dArray = <T>(
  arr: T[][],
  fixed: number,
  start: number,
  end: number,
  value: T[],
  orientation: Orientation
) => {
  if (start > end)
    throw Error("wrong parameter, colEnd should be greater than colStart");
  if (arr[fixed] === undefined || arr[fixed].length <= end)
    throw Error("wrong parameter, index not exist");
  if (value.length !== end - start + 1)
    throw Error("wrong parameter, value have more or less values");

  if (orientation === Orientation.ROW)
    return [
      ...arr.slice(0, fixed),
      [...arr[fixed].slice(0, start), ...value, ...arr[fixed].slice(end + 1)],
      ...arr.slice(fixed + 1),
    ];
  else {
    let a = [...arr];
    value.forEach((v, i) => {
      a[start + i][fixed] = v;
    });

    return a;
  }
};
