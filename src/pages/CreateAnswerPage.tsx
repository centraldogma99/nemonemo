import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CellStatus } from "../types/CellStatus";
import Board from "../components/Board";
import { replaceXWithBlank } from "../utils/replaceXWithBlank";
import { useRecoilState, useSetRecoilState } from "recoil";
import { gameboardState } from "../stores/gameboard";
import NumberPicker from "../components/NumberPicker";
import { Button } from "../components/Button";
import styled from "@emotion/styled";
import { contentState } from "./IntroPage";

interface BoardSize {
  row: number;
  col: number;
}

const CounterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  margin-bottom: 16px;
`;

const CounterLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CreateAnswerPage = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>({
    row: 0,
    col: 0,
  });
  const [board, setBoard] = useRecoilState(gameboardState);
  const [isSizeDetermined, setIsSizeDetermined] = useState<boolean>(false);
  const setContent = useSetRecoilState(contentState);

  const handleBackButtonClick = useCallback(() => {
    setContent(undefined);
  }, [setContent]);

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

  const setEachBoardSize = useCallback(
    (orientation: "col" | "row") => (setter: (prev: number) => number) => {
      setBoardSize((prev) => {
        return { ...prev, [orientation]: setter(prev[orientation]) };
      });
    },
    []
  );

  return (
    <>
      {!isSizeDetermined && (
        <ContentsWrapper>
          <div>
            <CounterContainer>
              <CounterLabel>행</CounterLabel>
              <NumberPicker
                value={boardSize.row}
                setValue={setEachBoardSize("row")}
                min={0}
              />
            </CounterContainer>
            <CounterContainer>
              <CounterLabel>열</CounterLabel>
              <NumberPicker
                value={boardSize.col}
                setValue={setEachBoardSize("col")}
                min={0}
              />
            </CounterContainer>
          </div>
          <ButtonContainer>
            <Button onClick={handleBackButtonClick} type={"secondary"}>
              뒤로
            </Button>
            <Button onClick={handleSizeSubmit}>시작!</Button>
          </ButtonContainer>
        </ContentsWrapper>
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
