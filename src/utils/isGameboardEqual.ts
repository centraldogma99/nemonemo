import isArraysEqual from "./isArraysEqual";

const isGameboardEqual = <T>(a: T[][], b: T[][]) => {
  return a.map((row, i) => isArraysEqual(row, b[i])).reduce((f, s) => f && s);
};

export default isGameboardEqual;
