import React, { useCallback, useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CellStatus } from "../types/CellStatus";
import { gameboardState } from "../stores/gameboard";
import isGameboardEqual from "../utils/isGameboardEqual";
import { replaceXWithBlank } from "../utils/replaceXWithBlank";
import { Button } from "../components/Button";
import styled from "@emotion/styled";
import { contentState } from "./IntroPage";
import Spacing from "../components/Spacing";
import { palette } from "../components/palette";
import { nullifyBoard } from "../utils/nullifyBoard";
import useToast from "../components/Toast";
import { Textarea } from "../components/Textarea";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2.5px solid ${palette.blue};
  border-radius: 16px;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 1.35rem;
  font-weight: bold;
  color: ${palette.blue};
`;

const ErrorMessage = styled.div`
  color: red;
`;

const GameboardPage = () => {
  const [gameboard, setGameboard] =
    useRecoilState<CellStatus[][]>(gameboardState);
  const [jsonText, setJsonText] = useState<string>("");
  const [answer, setAnswer] = useState<
    (CellStatus.BLANK | CellStatus.FILLED)[][]
  >([]);
  const setContent = useSetRecoilState(contentState);
  const [isError, setIsError] = useState<boolean>(false);
  const { toast, showToast } = useToast("성공!", 5000);

  const isInitialized = useMemo(
    () => answer.length > 0 && answer[0].length > 0,
    [answer]
  );

  // X를 BLANK로 바꾼 버전
  const parsedGameboard = useMemo(() => {
    return replaceXWithBlank(gameboard);
  }, [gameboard]);

  const isCompleted = useMemo(() => {
    if (gameboard.length === 0) return false;
    return isGameboardEqual(parsedGameboard, answer);
  }, [answer, gameboard.length, parsedGameboard]);

  const handleBackButtonClick = useCallback(() => {
    setContent(undefined);
    setGameboard((prev) => nullifyBoard(prev));
  }, [setContent, setGameboard]);

  const handleJsonButtonClick = useCallback(async () => {
    try {
      const res = JSON.parse(jsonText);
      if (res.length === 0 || res[0].length === 0) {
        return setIsError(true);
      }
      setAnswer(JSON.parse(jsonText));
    } catch (e) {
      setIsError(true);
    }
  }, [jsonText]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setIsError(false);
      setJsonText(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (isInitialized)
      setGameboard(
        Array(answer.length).fill(
          Array(answer[0].length).fill(CellStatus.BLANK)
        )
      );
  }, [answer, isInitialized, setGameboard]);

  useEffect(() => {
    if (isCompleted) showToast();
  }, [isCompleted, showToast]);

  return (
    <>
      {isInitialized && (
        <>
          {toast}
          <BoardContainer>
            <Board rowSize={answer.length} answer={answer} />
          </BoardContainer>
          <Spacing size={32} />
          <Button onClick={handleBackButtonClick} type={"secondary"}>
            뒤로
          </Button>
        </>
      )}
      {!isInitialized && (
        <>
          <Title>문제 코드를 입력해 주세요!</Title>
          <Spacing size={24} />
          <Textarea value={jsonText} onChange={handleTextareaChange} />
          {isError && (
            <>
              <Spacing size={16} />
              <ErrorMessage>문제 코드가 잘못된 것 같아요!</ErrorMessage>
            </>
          )}
          <Spacing size={32} />
          <ButtonContainer>
            <Button onClick={handleBackButtonClick} type={"secondary"}>
              뒤로
            </Button>
            <Spacing size={16} inline />
            <Button onClick={handleJsonButtonClick} width={80}>
              GO!
            </Button>
          </ButtonContainer>
        </>
      )}
    </>
  );
};

export default GameboardPage;
