import styled from "@emotion/styled";
import { palette } from "./palette";
import { css } from "@emotion/react";

interface ButtonProps {
  type?: "primary" | "secondary";
}

const primaryStyle = css`
  background-color: ${palette.blue};
  color: ${palette.pink};
  border: none;
`;

const secondaryStyle = css`
  background-color: ${palette.pink};
  color: ${palette.blue};
  border: 1px dashed ${palette.blue};
`;

export const Button = styled.div<ButtonProps>`
  border-radius: 20px;
  padding: 12px 24px;
  text-align: center;
  ${({ type = "secondary" }) =>
    type === "primary" ? primaryStyle : secondaryStyle}
`;
