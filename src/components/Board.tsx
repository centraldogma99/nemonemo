import React, { useCallback, useEffect, useMemo } from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { CellStatus } from "../types/CellStatus";
import parseAnswerIntoHints from "../utils/parseAnswerIntoHints";
import { gameboardState } from "../stores/gameboard";
import { Orientation } from "../types/Orientation";
import Cell, { cellStatusRightSwapper, cellStatusSwapper } from "./Cell";
import styled from "@emotion/styled";
import HintCell from "./HintCell";
import { changeOneElementFrom2dArray } from "../utils/changeOneElementFrom2dArray";
import CellCoordinate from "../types/CellCoordinate";

export interface BoardProps {
  rowSize: number;
  answer: (CellStatus.FILLED | CellStatus.BLANK)[][];
}

const RowHintCell = styled(HintCell)`
  vertical-align: bottom;
  text-align: center;
`;

const ColHintCell = styled(HintCell)`
  text-align: right;
  align-items: end;
`;

const StyledTable = styled.table`
  border-spacing: 0;
`;

export const hoverState = atom<CellCoordinate>({
  key: "hoverState",
  default: { row: -1, col: -1 },
});

export const dragStartState = atom<CellCoordinate>({
  key: "dragStartState",
  default: { row: -1, col: -1 },
});

export const isDraggingState = selector({
  key: "isDraggingState",
  get: ({ get }) => {
    const dragStart = get(dragStartState);
    return dragStart.col >= 0 && dragStart.row >= 0;
  },
});

export const dragLastChangeState = atom<CellCoordinate | undefined>({
  key: "dragLastChangeState",
  default: undefined,
});

export const dragDirectionState = atom<Direction | undefined>({
  key: "dragDirectionState",
  default: undefined,
});

export const dragMouseButtonState = atom<"left" | "right" | undefined>({
  key: "dragMouseButtonState",
  default: undefined,
});

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

const Board = ({ rowSize, answer }: BoardProps) => {
  // 마우스가 올라가 있는 좌표
  const [hover, setHover] = useRecoilState(hoverState);
  // 보드 상태
  const [board, setBoard] = useRecoilState(gameboardState);
  // 드래그가 시작된 지점
  const dragStart = useRecoilValue(dragStartState);
  const [dragLastChange, setDragLastChange] =
    useRecoilState(dragLastChangeState);
  const [dragDirection, setDragDirection] = useRecoilState(dragDirectionState);
  const isDragging = useRecoilValue(isDraggingState);
  const dragMouseButton = useRecoilValue(dragMouseButtonState);

  const handleBoardLeave = useCallback(() => {
    setHover({ row: -1, col: -1 });
  }, [setHover]);

  useEffect(() => {
    // 드래그 중단되었을 때
    if (!isDragging) {
      setDragDirection(undefined);
      setDragLastChange(undefined);
      return;
    }
    // 처음 움직이기 시작했을 때, lastChange와 direction을 채우기
    if (dragDirection === undefined) {
      if (hover.col !== dragStart.col || hover.row !== dragStart.row) {
        if (hover.col < dragStart.col) {
          setDragDirection(Direction.Left);
          setDragLastChange({ row: dragStart.row, col: dragStart.col - 1 });
        } else if (hover.col > dragStart.col) {
          setDragDirection(Direction.Right);
          setDragLastChange({ row: dragStart.row, col: dragStart.col + 1 });
        } else if (hover.row < dragStart.row) {
          setDragDirection(Direction.Up);
          setDragLastChange({ row: dragStart.row - 1, col: dragStart.col });
        } else if (hover.row > dragStart.row) {
          setDragDirection(Direction.Down);
          setDragLastChange({ row: dragStart.row + 1, col: dragStart.col });
        }
      }
      return;
    }
    if (dragLastChange === undefined) return;

    if (dragDirection === Direction.Left && hover.col < dragLastChange.col)
      setDragLastChange({ row: dragLastChange.row, col: hover.col });
    else if (
      dragDirection === Direction.Right &&
      hover.col > dragLastChange.col
    )
      setDragLastChange({ row: dragLastChange.row, col: hover.col });
    else if (dragDirection === Direction.Up && hover.row < dragLastChange.row)
      setDragLastChange({ row: hover.row, col: dragLastChange.col });
    else if (dragDirection === Direction.Down && hover.row > dragLastChange.row)
      setDragLastChange({ row: hover.row, col: dragLastChange.col });
  }, [
    dragDirection,
    dragLastChange,
    dragStart.col,
    dragStart.row,
    hover,
    isDragging,
    setDragDirection,
    setDragLastChange,
  ]);

  // 한 칸씩 변경사항 반영
  useEffect(() => {
    if (!dragLastChange) return;
    const { row, col } = dragLastChange;
    setBoard((prev) =>
      changeOneElementFrom2dArray(
        prev,
        row,
        col,
        dragMouseButton === "left"
          ? cellStatusSwapper(prev[row][col])
          : cellStatusRightSwapper(prev[row][col])
      )
    );
  }, [dragLastChange, dragMouseButton, setBoard]);

  const rowHints = useMemo(
    () => parseAnswerIntoHints(answer, Orientation.ROW),
    [answer]
  );
  const colHints = useMemo(
    () => parseAnswerIntoHints(answer, Orientation.COLUMN),
    [answer]
  );

  const handleResetClick = useCallback(() => {
    setBoard((prev) => prev.map((row) => row.map((v) => CellStatus.BLANK)));
  }, []);

  return (
    <>
      <input type={"button"} value={"초기화하기"} onClick={handleResetClick} />
      <StyledTable onMouseLeave={handleBoardLeave}>
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
      </StyledTable>
    </>
  );
};

export default Board;
