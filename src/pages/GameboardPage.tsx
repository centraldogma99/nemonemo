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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 200px;
`;

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 500px;
`;

const GameboardPage = () => {
  const [gameboard, setGameboard] =
    useRecoilState<CellStatus[][]>(gameboardState);
  const [jsonText, setJsonText] = useState<string>("");
  const [answer, setAnswer] = useState<
    (CellStatus.BLANK | CellStatus.FILLED)[][]
  >([]);
  const setContent = useSetRecoilState(contentState);

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
  }, [setContent]);

  const handleJsonButtonClick = useCallback(async () => {
    setAnswer(JSON.parse(jsonText));
  }, [jsonText]);

  useEffect(() => {
    if (isInitialized)
      setGameboard(
        Array(answer.length).fill(
          Array(answer[0].length).fill(CellStatus.BLANK)
        )
      );
  }, [answer, isInitialized, setGameboard]);

  useEffect(() => {
    if (isCompleted) alert("성공!");
  }, [isCompleted]);

  return (
    <>
      {isInitialized && <Board rowSize={answer.length} answer={answer} />}
      {!isInitialized && (
        <>
          <input
            type={"text"}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <ButtonContainer>
            <Button onClick={handleBackButtonClick} type={"secondary"}>
              뒤로
            </Button>
            <Button onClick={handleJsonButtonClick}>GO!</Button>
          </ButtonContainer>
        </>
      )}
    </>
  );
};

export default GameboardPage;
