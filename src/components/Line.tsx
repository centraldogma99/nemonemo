import React, { useState } from "react";
import { CellStatus } from "../types/CellStatus";
import Cell from "./Cell";

// hover 이벤트 정의

export enum LineOrientation {
  ROW,
  COLUMN,
}

interface LineProps {
  orientation: LineOrientation;
}

// 기본적으로 가로선
const Line = () => {
  const [hintNumbers, setHintNumbers] = useState<number[]>([]);
  const [cellValues, setCellValues] = useState<CellStatus[]>([]);

  return (
    <tr>
      {cellValues.map((cellValue) => {
        return <td></td>;
      })}
    </tr>
  );
};

export default Line;
