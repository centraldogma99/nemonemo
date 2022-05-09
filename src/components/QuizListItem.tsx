import React from "react";
import { Button } from "./Button";
import styled from "@emotion/styled";

interface Props {
  name: string;
  colSize: number;
  rowSize: number;
}

const StyledButton = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const QuizListItem = ({
  name,
  colSize,
  rowSize,
  onClick,
}: Props & React.HTMLProps<HTMLDivElement>) => {
  return (
    <StyledButton onClick={onClick}>
      <ItemName>{name}</ItemName>
      <br />
      <div>
        {colSize}x{rowSize}
      </div>
    </StyledButton>
  );
};

export default QuizListItem;
