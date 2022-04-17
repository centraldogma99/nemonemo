import React, { useEffect, useMemo, useState } from "react";
import {
  useRecoilState,
  atom,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { CellStatus } from "../types/CellStatus";
import parseAnswerIntoHints from "../utils/parseAnswerIntoHints";
import { gameboardCellState, gameboardState } from "../stores/gameboard";
import { Orientation } from "../types/Orientation";
import Cell from "./Cell";
import styled from "@emotion/styled";
import HintCell from "./HintCell";
import { range } from "lodash";

export interface BoardProps {
  rowSize: number;
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

export const dragStartState = atom({
  key: "dragStartState",
  default: { row: -1, col: -1 },
});

export const dragDirectionState = atom<Direction | undefined>({
  key: "dragDirectionState",
  default: undefined,
});

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

const Board = ({ rowSize, answer }: BoardProps) => {
  const hover = useRecoilValue(hoverState);
  const board = useRecoilValue(gameboardState);
  const setBoard = useSetRecoilState(gameboardState);
  const dragStart = useRecoilValue(dragStartState);
  const [dragDirection, setDragDirection] = useRecoilState<
    Direction | undefined
  >(dragDirectionState);

  const isDragging = useMemo(
    () => dragStart.row >= 0 && dragStart.col >= 0,
    [dragStart.col, dragStart.row]
  );

  useEffect(() => {
    if (isDragging) {
      if (hover.row < dragStart.row) {
        setDragDirection(Direction.Left);
      } else if (hover.row > dragStart.row) {
        setDragDirection(Direction.Right);
      } else if (hover.col < dragStart.col) {
        setDragDirection(Direction.Up);
      } else if (hover.col > dragStart.col) {
        setDragDirection(Direction.Down);
      } else {
        setDragDirection(undefined);
      }
    } else {
      setDragDirection(undefined);
    }
  }, [dragStart.col, dragStart.row, hover.col, hover.row, isDragging]);

  const draggedRange = useMemo(() => {
    if (!isDragging) return [];
    if (dragDirection === Direction.Left || dragDirection === Direction.Right) {
      return range(
        hover.col,
        dragStart.col + 1,
        dragDirection === Direction.Left ? 1 : -1
      ).map((number) => {
        return { row: dragStart.row, col: number };
      });
    } else {
      return range(
        hover.row,
        dragStart.row + 1,
        dragDirection === Direction.Up ? 1 : -1
      ).map((number) => {
        return { col: dragStart.col, row: number };
      });
    }
  }, [
    dragDirection,
    dragStart.col,
    dragStart.row,
    hover.col,
    hover.row,
    isDragging,
  ]);

  useEffect(() => {
    if (draggedRange.length === 0) return;
  }, []);

  const rowHints = useMemo(
    () => parseAnswerIntoHints(answer, Orientation.ROW),
    [answer]
  );
  const colHints = useMemo(
    () => parseAnswerIntoHints(answer, Orientation.COLUMN),
    [answer]
  );

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td />
            {colHints?.map((d, i) => (
              <RowHintCell isHighlighted={i === hover.col}>
                {d && d.join("\n")}
              </RowHintCell>
            ))}
          </tr>
          {board.map((row, i) => (
            <tr key={i}>
              <ColHintCell isHighlighted={i === hover.row}>
                {rowHints[i] && rowHints[i].join(" ")}
              </ColHintCell>

              {row.map((_, j) => (
                <Cell row={i} col={j} key={i * rowSize + j} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Board;
