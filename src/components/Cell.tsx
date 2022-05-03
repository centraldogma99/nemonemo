import React, { useCallback, useMemo } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CellStatus, cellStatusToString } from "../types/CellStatus";
import { gameboardCellState } from "../stores/gameboard";
import styled from "@emotion/styled";
import { dragMouseButtonState, dragStartState, hoverState } from "./Board";
import { palette } from "./palette";

const StyledTd = styled.td<{ isHighlighted?: boolean; isFilled?: boolean }>`
  border: dotted 0.5px gray;
  width: 30px;
  height: 30px;
  text-align: center;
  background-color: ${({ isHighlighted, isFilled }) =>
    isFilled
      ? palette.gray
      : isHighlighted
      ? palette.lightGray
      : palette.white};
`;

interface CellProps {
  row: number;
  col: number;
}

export const cellStatusSwapper = (before: CellStatus) => {
  if (before === CellStatus.X) return CellStatus.BLANK;
  else if (before === CellStatus.FILLED) return CellStatus.X;
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
      event.preventDefault();
      setValue(event.button === 0 ? cellStatusSwapper : cellStatusRightSwapper);
      setDragMouseButton(event.button === 0 ? "left" : "right");
      setDragStart({ row, col });
    },
    [col, row, setDragStart, setValue]
  );

  const handleDragEnd = useCallback(
    (event) => {
      event.preventDefault();
      setDragStart({ row: -1, col: -1 });
    },
    [setDragStart]
  );

  return (
    <StyledTd
      onMouseOver={handleHover}
      isHighlighted={isHighlighted}
      isFilled={value === CellStatus.FILLED}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onDrag={(e) => e.preventDefault()}
    >
      {cellStatusToString(value)}
    </StyledTd>
  );
};

export default Cell;
