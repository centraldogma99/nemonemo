import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

interface Props {
  size: number;
  inline?: boolean;
}

const normalStyle = (size: number) => css`
  height: ${size}px;
`;

const inlineStyle = (size: number) => css`
  display: inline;
  width: ${size}px;
`;

const Spacing = styled.div<Props>`
  ${({ inline, size }) => (inline ? inlineStyle(size) : normalStyle(size))}
`;

export default Spacing;
