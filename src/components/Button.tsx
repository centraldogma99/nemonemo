import styled from "@emotion/styled";
import { palette } from "./palette";
import { css } from "@emotion/react";

interface ButtonProps {
  type?: "primary" | "secondary";
}

const primaryStyle = css`
  background-color: ${palette.blue};
  color: ${palette.pink};
  border: 2px solid ${palette.blue};
`;

const secondaryStyle = css`
  background-color: ${palette.pink};
  color: ${palette.blue};
  border: 2px dashed ${palette.blue};
`;

export const Button = styled.div<ButtonProps>`
  user-drag: none;
  user-select: none;
  border-radius: 20px;
  padding: 12px 24px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  ${({ type = "secondary" }) =>
    type === "primary" ? primaryStyle : secondaryStyle}
  &:hover {
    ${({ type }) => (type === "primary" ? secondaryStyle : primaryStyle)}
  }
`;
