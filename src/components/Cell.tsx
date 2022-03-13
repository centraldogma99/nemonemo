import React, { useCallback } from "react";
import { useRecoilState } from "recoil";
import { CellStatus } from "../types/CellStatus";
import { gameboardCellState } from "./Gameboard";
import styled from "@emotion/styled";

const TdStyled = styled.td`
  border: solid 1px black;
  width: 30px;
  height: 30px;
  text-align: center;
`;

// hover 이벤트 정의

interface CellProps {
  row: number;
  col: number;
}

const Cell = ({ row, col }: CellProps) => {
  const [value, setValue] = useRecoilState(gameboardCellState({ row, col }));

  const getCellInner = useCallback((value: CellStatus) => {
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

  return (
    <TdStyled onClick={onClick} onContextMenu={onRightClick}>
      {getCellInner(value)}
    </TdStyled>
  );
};

export default Cell;
