import React, { useCallback, useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CellStatus } from "../types/CellStatus";
import { gameboardCellState } from "../stores/gameboard";
import styled from "@emotion/styled";
import { dragDirectionState, dragStartState, hoverState } from "./Board";
import { Direction } from "./Board";

const StyledTd = styled.td<{ isHighlighted?: boolean; isFilled?: boolean }>`
  border: solid 1px black;
  width: 30px;
  height: 30px;
  text-align: center;
  background-color: ${({ isHighlighted, isFilled }) =>
    isFilled ? "#999" : isHighlighted ? "#ddd" : "#fff"};
`;

interface CellProps {
  row: number;
  col: number;
}

const Cell = ({ row, col }: CellProps) => {
  const [value, setValue] = useRecoilState(gameboardCellState({ row, col }));
  const [hover, setHover] = useRecoilState(hoverState);
  const [dragStart, setDragStart] = useRecoilState(dragStartState);
  const dragDirection = useRecoilValue(dragDirectionState);

  useEffect(() => {
    if (!dragDirection) return;
  }, []);

  const isHighlighted = useMemo(
    () => row === hover.row || col === hover.col,
    [col, hover.col, hover.row, row]
  );

  const getCellInnerAsString = useCallback((value: CellStatus): string => {
    if (value === CellStatus.BLANK) return "";
    else if (value === CellStatus.FILLED) return "O";
    else return "X";
  }, []);

  const onClick = useCallback(
    () =>
      setValue((prev) => {
        if (prev === CellStatus.BLANK) return CellStatus.FILLED;
        else if (prev === CellStatus.FILLED) return CellStatus.X;
        else return CellStatus.BLANK;
      }),
    [setValue]
  );

  const onRightClick = useCallback(
    (event) => {
      event.preventDefault();
      setValue((prev) => {
        if (prev === CellStatus.BLANK) return CellStatus.X;
        else if (prev === CellStatus.FILLED) return CellStatus.BLANK;
        else return prev;
      });
    },
    [setValue]
  );

  const handleHover = useCallback(() => {
    setHover({ row, col });
  }, [col, row, setHover]);

  const handleHoverEnd = useCallback(() => {
    setHover({ row: -1, col: -1 });
  }, [setHover]);

  const handleDragStart = useCallback(() => {
    setDragStart({ row, col });
  }, [col, row, setDragStart]);

  const handleDragEnd = useCallback(() => {
    setDragStart({ row: -1, col: -1 });
  }, [setDragStart]);

  return (
    <StyledTd
      onClick={onClick}
      onContextMenu={onRightClick}
      onMouseOver={handleHover}
      onMouseOut={handleHoverEnd}
      isHighlighted={isHighlighted}
      isFilled={value === CellStatus.FILLED}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
    >
      {getCellInnerAsString(value)}
    </StyledTd>
  );
};

export default Cell;
