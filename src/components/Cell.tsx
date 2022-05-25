import React, { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CellStatus, cellStatusToString } from "../types/CellStatus";
import { gameboardCellState } from "../stores/gameboard";
import styled from "@emotion/styled";
import { dragMouseButtonState, dragStartState, hoverState } from "./Board";
import { palette } from "./palette";
import { isFinishedState } from "../pages/GameboardPage";
import { keyframes } from "@emotion/react";

const finishAnimation = (isFilled: boolean) => keyframes`
  from {
    background-color: ${isFilled ? palette.gray : palette.white};
    border-color: ${palette.realDeepGray}
  }
  to {
    background-color: ${isFilled ? palette.deepGray : palette.white};
    border-color: ${isFilled ? palette.deepGray : palette.gray};
  }
`;

const StyledTd = styled.td<{
  isHighlighted?: boolean;
  isFilled?: boolean;
  isFinished?: boolean;
}>`
  border: dotted 0.5px
    ${({ isFinished }) =>
      isFinished ? palette.deepGray : palette.realDeepGray};
  width: 30px;
  height: 30px;
  text-align: center;
  background-color: ${({ isHighlighted, isFilled, isFinished }) => {
    if (!isFilled) return isHighlighted ? palette.lightGray : palette.white;
    if (isFinished) return palette.deepGray;
    return palette.gray;
  }};

  animation-duration: 1000ms;
  animation-timing-function: ease-out;
  animation-name: ${({ isFilled, isFinished }) => {
    return isFinished ? finishAnimation(Boolean(isFilled)) : undefined;
  }};
`;

interface CellProps {
  row: number;
  col: number;
}

export const cellStatusSwapper = (before: CellStatus) => {
  if (before === CellStatus.X) return CellStatus.BLANK;
  else if (before === CellStatus.FILLED) return CellStatus.BLANK;
  else return CellStatus.FILLED;
};

export const cellStatusRightSwapper = (before: CellStatus) => {
  if (before === CellStatus.BLANK) return CellStatus.X;
  else if (before === CellStatus.FILLED) return CellStatus.X;
  else return CellStatus.BLANK;
};

const Cell = ({ row, col }: CellProps) => {
  const [value, setValue] = useRecoilState(gameboardCellState({ row, col }));
  const [hover, setHover] = useRecoilState(hoverState);
  const isFinished = useRecoilValue(isFinishedState);
  const setDragMouseButton = useSetRecoilState(dragMouseButtonState);
  const setDragStart = useSetRecoilState(dragStartState);

  const isHighlighted = useMemo(
    () => row === hover.row || col === hover.col,
    [col, hover.col, hover.row, row]
  );

  const handleHover = useCallback(
    (event) => {
      event.preventDefault();
      setHover({ row, col });
    },
    [col, row, setHover]
  );

  const handleDragStart = useCallback(
    (event) => {
      if (isFinished) return;
      event.preventDefault();
      setValue(event.button === 0 ? cellStatusSwapper : cellStatusRightSwapper);
      setDragMouseButton(event.button === 0 ? "left" : "right");
      setDragStart({ row, col });
    },
    [col, isFinished, row, setDragMouseButton, setDragStart, setValue]
  );

  const handleDragEnd = useCallback(
    (event) => {
      if (isFinished) return;
      event.preventDefault();
      setDragStart({ row: -1, col: -1 });
    },
    [isFinished, setDragStart]
  );

  return (
    <StyledTd
      onMouseOver={handleHover}
      isHighlighted={isHighlighted}
      isFilled={value === CellStatus.FILLED}
      isFinished={isFinished}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onDrag={(e) => e.preventDefault()}
    >
      {cellStatusToString(value)}
    </StyledTd>
  );
};

export default Cell;
