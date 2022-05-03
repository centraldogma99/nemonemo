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
import { palette } from "../components/palette";
import Spacing from "../components/Spacing";
import { nullifyBoard } from "../utils/nullifyBoard";
import useToast from "../components/Toast";

interface BoardSize {
  row: number;
  col: number;
}

const CounterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 250px;
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
  align-items: center;
  height: 200px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ButtonContainer2 = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledButton = styled(Button)`
  width: 120px;
`;

const BoardContainer = styled.div`
  border: 2.5px solid ${palette.blue};
  border-radius: 16px;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const CreateAnswerPage = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>({
    row: 0,
    col: 0,
  });
  const [board, setBoard] = useRecoilState(gameboardState);
  const [isSizeDetermined, setIsSizeDetermined] = useState<boolean>(false);
  const setContent = useSetRecoilState(contentState);
  const { toast, showToast } = useToast(
    "문제 코드가 복사 되었습니다!",
    2500,
    300
  );

  const handleBackButtonClick = useCallback(() => {
    setContent(undefined);
    setBoard((prev) => nullifyBoard(prev));
  }, [setBoard, setContent]);

  const isSizeValid = useMemo(
    () => boardSize.row > 0 && boardSize.col > 0,
    [boardSize.col, boardSize.row]
  );

  const handleSizeSubmit = useCallback(() => {
    if (!isSizeValid) return;
    else setIsSizeDetermined(true);
  }, [isSizeValid]);

  const parsedBoard = useMemo(() => replaceXWithBlank(board), [board]);

  const handleCompleteClick = useCallback(async () => {
    await window.navigator.clipboard.writeText(JSON.stringify(parsedBoard));
    showToast();
  }, [parsedBoard, showToast]);

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
              <CounterLabel>행 개수</CounterLabel>
              <NumberPicker
                value={boardSize.row}
                setValue={setEachBoardSize("row")}
                min={0}
              />
            </CounterContainer>
            <CounterContainer>
              <CounterLabel>열 개수</CounterLabel>
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
            <Spacing size={16} inline />
            <Button onClick={handleSizeSubmit} width={80}>
              시작!
            </Button>
          </ButtonContainer>
        </ContentsWrapper>
      )}

      {isSizeDetermined && (
        <>
          {toast}
          <BoardContainer>
            <Board rowSize={boardSize.row} answer={parsedBoard} />
          </BoardContainer>
          <Spacing size={32} />
          <ButtonContainer2>
            <Button onClick={handleBackButtonClick} type={"secondary"}>
              뒤로
            </Button>
            <Spacing size={16} inline />
            <StyledButton onClick={handleCompleteClick} type={"secondary"}>
              완료!
            </StyledButton>
          </ButtonContainer2>
        </>
      )}
    </>
  );
};

export default CreateAnswerPage;
