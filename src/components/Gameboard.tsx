import React, { useEffect, useMemo } from "react";
import { useRecoilState, atom, useRecoilValue } from "recoil";
import { CellStatus } from "../types/CellStatus";
import isGameboardEqual from "../utils/isGameboardEqual";
import parseAnswerIntoHints from "../utils/parseAnswerIntoHints";
import { gameboardState } from "../stores/gameboard";
import { Orientation } from "../types/Orientation";
import Cell from "./Cell";
import styled from "@emotion/styled";
import HintCell from "./HintCell";

interface GameboardProps {
  rowSize: number;
  colSize: number;
  answer: (CellStatus.FILLED | CellStatus.BLANK)[][];
}

const RowHintCell = styled(HintCell)`
  white-space: pre;
  vertical-align: bottom;
  text-align: center;
`;

const ColHintCell = styled(HintCell)`
  white-space: pre;
  text-align: right;
  align-items: end;
`;

export const hoverState = atom({
  key: "hoverState",
  default: { row: -1, col: -1 },
});

const Gameboard = ({ rowSize, colSize, answer }: GameboardProps) => {
  const [gameboard, setGameboard] =
    useRecoilState<CellStatus[][]>(gameboardState);
  const hover = useRecoilValue(hoverState);

  const rowHints = useMemo(
    () => parseAnswerIntoHints(answer, Orientation.ROW),
    [answer]
  );
  const colHints = useMemo(
    () => parseAnswerIntoHints(answer, Orientation.COLUMN),
    [answer]
  );

  // X를 BLANK로 바꾼 버전
  const parsedGameboard = useMemo(() => {
    return gameboard.map((row) =>
      row.map((v) => {
        if (v === CellStatus.X) return CellStatus.BLANK;
        else return v;
      })
    );
  }, [gameboard]);

  const isCompleted = useMemo(() => {
    if (gameboard.length === 0) return false;
    return isGameboardEqual(parsedGameboard, answer);
  }, [answer, gameboard.length, parsedGameboard]);

  useEffect(() => {
    setGameboard(Array(rowSize).fill(Array(colSize).fill(CellStatus.BLANK)));
  }, [colSize, rowSize, setGameboard]);

  useEffect(() => {
    if (isCompleted) alert("성공!");
  }, [isCompleted]);

  return (
    <>
      {rowHints && colHints && (
        <table>
          <tbody>
            <tr>
              <td />
              {colHints?.map((d, i) => (
                <RowHintCell isHighlighted={i === hover.col}>
                  {d.join("\n")}
                </RowHintCell>
              ))}
            </tr>
            {gameboard.map((row, i) => (
              <tr key={i}>
                <ColHintCell isHighlighted={i === hover.row}>
                  {rowHints[i].join(" ")}
                </ColHintCell>
                {row.map((_, j) => (
                  <Cell row={i} col={j} key={i * rowSize + j} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Gameboard;
