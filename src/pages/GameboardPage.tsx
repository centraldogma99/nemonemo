import React, { useCallback, useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
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
import { unhash } from "../utils/hashBoard";
import QuizListItem from "../components/QuizListItem";
import VerticalLine from "../components/VerticalLine";
import quizs from "../quizs";

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
  font-size: 1.5rem;
  font-weight: bold;
  color: ${palette.blue};
`;

const ErrorMessage = styled.div`
  color: red;
`;

const QuizListItemContainer = styled.div`
  display: grid;
  row-gap: 0.75rem;
  width: 200px;
`;

export const isFinishedState = atom<boolean>({
  key: "isFinishedState",
  default: false,
});

const GameboardPage = () => {
  const [gameboard, setGameboard] =
    useRecoilState<CellStatus[][]>(gameboardState);
  const [jsonText, setJsonText] = useState<string>("");
  const [answer, setAnswer] = useState<
    (CellStatus.BLANK | CellStatus.FILLED)[][]
  >([]);
  const setContent = useSetRecoilState(contentState);
  const [isFinished, setIsFinished] = useRecoilState(isFinishedState);
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

  useEffect(() => {
    if (gameboard.length === 0) return;
    if (isGameboardEqual(parsedGameboard, answer)) setIsFinished(true);
  }, [answer, gameboard.length, parsedGameboard, setIsFinished]);

  const handleBackButtonClick = useCallback(() => {
    setContent(undefined);
    setGameboard((prev) => nullifyBoard(prev));
    setIsFinished(false);
  }, [setContent, setGameboard, setIsFinished]);

  const handleJsonButtonClick = useCallback(async () => {
    try {
      const parsedText = `[${jsonText.trim().split(" ").join(", ")}]`;
      const res = unhash(JSON.parse(parsedText));
      if (res.length === 0 || res[0].length === 0) {
        return setIsError(true);
      }

      setAnswer(res);
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

  const handleQuizButtonClick = useCallback((hash: string) => {
    const parsedText = `[${hash.trim().split(" ").join(", ")}]`;
    const res = unhash(JSON.parse(parsedText));
    setAnswer(res);
  }, []);

  useEffect(() => {
    if (isInitialized)
      setGameboard(
        Array(answer.length).fill(
          Array(answer[0].length).fill(CellStatus.BLANK)
        )
      );
  }, [answer, isInitialized, setGameboard]);

  useEffect(() => {
    if (isFinished) showToast();
  }, [isFinished, showToast]);

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
          <Title>문제를 선택해 주세요!</Title>
          <Spacing size={24} />
          <QuizListItemContainer>
            {quizs.map((quiz, i) => (
              <QuizListItem
                name={quiz.name}
                colSize={quiz.colSize}
                rowSize={quiz.rowSize}
                onClick={() => handleQuizButtonClick(quiz.code)}
                key={i}
              />
            ))}
          </QuizListItemContainer>
          <Spacing size={36} />
          <VerticalLine />
          <Spacing size={36} />
          또는,
          <Spacing size={4} />
          <Title>문제 코드를 넣어 주세요</Title>
          <Spacing size={24} />
          <Textarea
            value={jsonText}
            onChange={handleTextareaChange}
            placeholder={
              "'만들래요!' 에서 문제를 만들고 '완료' 버튼을 누르면 문제 코드를 얻을 수 있습니다!"
            }
          />
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
          <Spacing size={48} />
        </>
      )}
    </>
  );
};

export default GameboardPage;
