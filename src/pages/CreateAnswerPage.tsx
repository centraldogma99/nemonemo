import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CellStatus } from "../types/CellStatus";
import Board from "../components/Board";
import { replaceXWithBlank } from "../utils/replaceXWithBlank";
import { useRecoilState } from "recoil";
import { gameboardState } from "../stores/gameboard";

interface BoardSize {
  row: number;
  col: number;
}

const CreateAnswerPage = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>({
    row: 0,
    col: 0,
  });
  const [board, setBoard] = useRecoilState(gameboardState);
  const [isSizeDetermined, setIsSizeDetermined] = useState<boolean>(false);

  const isSizeValid = useMemo(
    () => boardSize.row > 0 && boardSize.col > 0,
    [boardSize.col, boardSize.row]
  );

  const handleSizeSubmit = useCallback(() => {
    if (!isSizeValid) return;
    else setIsSizeDetermined(true);
  }, [isSizeValid]);

  const parsedBoard = useMemo(() => replaceXWithBlank(board), [board]);

  useEffect(() => {
    setBoard(
      Array(boardSize.row).fill(Array(boardSize.col).fill(CellStatus.BLANK))
    );
  }, [setBoard, boardSize.col, boardSize.row]);

  return (
    <>
      {!isSizeDetermined && (
        <div>
          <p>행</p>
          <input
            type="number"
            value={boardSize.row}
            onChange={(e) =>
              setBoardSize((prev) => {
                return { ...prev, row: Number(e.target.value) };
              })
            }
          />
          <p>열</p>
          <input
            type="number"
            value={boardSize.col}
            onChange={(e) =>
              setBoardSize((prev) => {
                return { ...prev, col: Number(e.target.value) };
              })
            }
          />
          <input type="button" value="시작" onClick={handleSizeSubmit} />
        </div>
      )}

      {isSizeDetermined && (
        <>
          <Board rowSize={boardSize.row} answer={parsedBoard} />
        </>
      )}
      {JSON.stringify(board)}
    </>
  );
};

export default CreateAnswerPage;
