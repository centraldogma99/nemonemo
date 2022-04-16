import React, { useMemo } from "react";
import Cell from "./Cell";
import { CellStatus } from "../types/CellStatus";

interface Props {
  board: CellStatus[][];
}

const Board = ({ board }: Props) => {
  // const colSize = useMemo(() => {
  //   return board[0].length;
  // }, [board]);

  const rowSize = useMemo(() => {
    return board.length;
  }, [board.length]);

  return (
    <table>
      <tbody>
        {board.map((row, i) => (
          <tr key={i}>
            {row.map((_, j) => (
              <Cell row={i} col={j} key={i * rowSize + j} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
