import React, { useCallback, useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import { useRecoilState } from "recoil";
import { CellStatus } from "../types/CellStatus";
import { gameboardState } from "../stores/gameboard";
import isGameboardEqual from "../utils/isGameboardEqual";
import { replaceXWithBlank } from "../utils/replaceXWithBlank";
import { Button } from "../components/Button";
import styled from "@emotion/styled";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const GameboardPage = () => {
  const [gameboard, setGameboard] =
    useRecoilState<CellStatus[][]>(gameboardState);
  const [jsonText, setJsonText] = useState<string>("");
  const [answer, setAnswer] = useState<
    (CellStatus.BLANK | CellStatus.FILLED)[][]
  >([]);

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
            <Button type={"secondary"}>뒤로</Button>
            <Button onClick={handleJsonButtonClick} type={"primary"}>
              GO!
            </Button>
          </ButtonContainer>
        </>
      )}
    </>
  );
};

export default GameboardPage;
