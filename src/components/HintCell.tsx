import React from "react";
import styled from "@emotion/styled";
import { palette } from "./palette";

interface Props {
  isHighlighted?: boolean;
  className?: string;
}

const StyledTd = styled.td<{ isHighlighted: boolean }>`
  white-space: pre;
  background-color: ${({ isHighlighted }) =>
    isHighlighted ? "#ddd" : palette.pink};
`;

const HintCell = ({
  isHighlighted = false,
  className,
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <StyledTd isHighlighted={isHighlighted} className={className}>
      {children}
    </StyledTd>
  );
};

export default HintCell;
