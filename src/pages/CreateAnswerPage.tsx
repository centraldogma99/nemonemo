import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CellStatus } from "../types/CellStatus";
import Board from "../components/Board";
import { Orientation } from "../types/Orientation";

interface BoardSize {
  row: number;
  col: number;
}

const CreateAnswerPage = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>({
    row: 0,
    col: 0,
  });
  const [board, setBoard] = useState<CellStatus[][]>([]);

  const handleSizeChange = useCallback((orientation: Orientation) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const o = orientation === Orientation.ROW ? "row" : "col";
      const value = Number(e.target.value);
      const a = shouldBoardWiden({ ...boardSize, [o]: value });
      setBoardSize((prev) => {
        return { ...prev, [o]: Number(e.target.value) };
      });
    };
  }, []);

  const shouldBoardWiden = useCallback(({ row, col }: BoardSize) => {
    return { row: row > boardSize.row, col: col > boardSize.col };
  }, []);

  useEffect(() => {
    setBoard(
      Array(boardSize.row).fill(Array(boardSize.col).fill(CellStatus.BLANK))
    );
  }, [boardSize.col, boardSize.row]);

  return (
    <>
      <p>행</p>
      <input
        type="number"
        value={boardSize.row}
        onChange={handleSizeChange(Orientation.ROW)}
      />
      <p>열</p>
      <input
        type="number"
        value={boardSize.col}
        onChange={handleSizeChange(Orientation.COLUMN)}
      />
      <Board board={board} />
    </>
  );
};

export default CreateAnswerPage;
