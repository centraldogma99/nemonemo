import React, { useEffect, useMemo } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { CellStatus } from "../types/CellStatus";
import parseAnswerIntoHints from "../utils/parseAnswerIntoHints";
import { gameboardState } from "../stores/gameboard";
import { Orientation } from "../types/Orientation";
import Cell from "./Cell";
import styled from "@emotion/styled";
import HintCell from "./HintCell";
import { range } from "lodash";
import {
  changeALineFrom2dArray,
  changeOneElementFrom2dArray,
} from "../utils/changeOneElementFrom2dArray";

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

export const dragLastChangeState = atom({
  key: "dragLastChangeState",
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
  const [dragLastChange, setDragLastChange] =
    useRecoilState(dragLastChangeState);
  const [dragDirection, setDragDirection] = useRecoilState<
    Direction | undefined
  >(dragDirectionState);

  const isDragging = useMemo(
    () => dragStart.row >= 0 && dragStart.col >= 0,
    [dragStart.col, dragStart.row]
  );

  const cellStatusSwapper = (before: CellStatus) => {
    if (before === CellStatus.X) return CellStatus.FILLED;
    else if (before === CellStatus.FILLED) return CellStatus.X;
    else return CellStatus.X;
  };

  const newCell = useMemo(() => {
    // 처음 움직이기 시작했을 때
    if (
      dragDirection === undefined &&
      (hover.col !== dragStart.col || hover.row !== dragStart.row)
    )
      return hover;
    else if (dragDirection === Direction.Left && hover.col < dragLastChange.col)
      return { row: dragLastChange.row, col: hover.col };
    else if (
      dragDirection === Direction.Right &&
      hover.col > dragLastChange.col
    )
      return { row: dragLastChange.row, col: hover.col };
    else if (dragDirection === Direction.Up && hover.row < dragLastChange.row)
      return { row: hover.row, col: dragLastChange.col };
    else if (dragDirection === Direction.Down && hover.col > dragLastChange.col)
      return { row: hover.row, col: dragLastChange.col };
    return undefined;
  }, [
    dragDirection,
    hover,
    dragStart.col,
    dragStart.row,
    dragLastChange.col,
    dragLastChange.row,
  ]);

  useEffect(() => {
    if (!isDragging) return;
    if (newCell) {
      console.log("newCell", newCell);
      if (dragDirection === undefined) {
        if (hover.row < dragStart.row) {
          setDragDirection(Direction.Left);
          setDragLastChange({ row: dragStart.row, col: dragStart.col - 1 });
        } else if (hover.row > dragStart.row) {
          setDragDirection(Direction.Right);
          setDragLastChange({ row: dragStart.row, col: dragStart.col + 1 });
        } else if (hover.col < dragStart.col) {
          setDragDirection(Direction.Up);
          setDragLastChange({ row: dragStart.row - 1, col: dragStart.col });
        } else if (hover.col > dragStart.col) {
          setDragDirection(Direction.Down);
          setDragLastChange({ row: dragStart.row + 1, col: dragStart.col });
        }
      }
      setBoard((prev) =>
        changeOneElementFrom2dArray(
          prev,
          newCell.row,
          newCell.col,
          cellStatusSwapper(prev[newCell.row][newCell.col])
        )
      );
      setDragLastChange(newCell);
    }
  }, [
    dragDirection,
    dragStart.col,
    dragStart.row,
    hover.col,
    hover.row,
    isDragging,
    newCell,
    setBoard,
    setDragDirection,
    setDragLastChange,
  ]);

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
    let max: number, min: number;
    let fixed: number;
    let orientation: Orientation;
    if (dragDirection === Direction.Left || dragDirection === Direction.Right) {
      orientation = Orientation.ROW;
      max = Math.max(
        draggedRange[0].col,
        draggedRange[draggedRange.length - 1].col
      );
      min = Math.min(
        draggedRange[0].col,
        draggedRange[draggedRange.length - 1].col
      );
      fixed = draggedRange[0].row;
    } else {
      orientation = Orientation.COLUMN;
      max = Math.max(
        draggedRange[0].row,
        draggedRange[draggedRange.length - 1].row
      );
      min = Math.min(
        draggedRange[0].row,
        draggedRange[draggedRange.length - 1].row
      );
      fixed = draggedRange[0].col;
    }
    setBoard((prev) => {
      return changeALineFrom2dArray(
        board,
        fixed,
        min,
        max,
        Array(max - min + 1).fill(CellStatus.FILLED),
        orientation
      );
    });
  }, [board, dragDirection, draggedRange, setBoard]);

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
