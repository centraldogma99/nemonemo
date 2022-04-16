import React from "react";
import styled from "@emotion/styled";

interface Props {
  isHighlighted?: boolean;
  className?: string;
}

const StyledTd = styled.td<{ isHighlighted: boolean }>`
  background-color: ${({ isHighlighted }) => (isHighlighted ? "#ddd" : "#fff")};
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
