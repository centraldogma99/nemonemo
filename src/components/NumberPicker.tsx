import React, { useCallback } from "react";
import styled from "@emotion/styled";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { palette } from "./palette";
import { css } from "@emotion/react";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  //border: 2px solid ${palette.blue};
  border: 2px dashed ${palette.blue};
  border-radius: 10px;
  padding: 6px;
  width: 140px;
  background-color: white;
`;

const iconStyle = css`
  border-radius: 50%;
  background-color: ${palette.blue};
  color: ${palette.pink};
  margin-left: 4px;
  cursor: pointer;
`;

const NumberContainer = styled.div`
  flex: 1;
  text-align: center;
  font-size: 20px;
`;

const StyledKeyboardArrowUpIcon = styled(KeyboardArrowUpIcon)`
  ${iconStyle}
`;

const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)`
  ${iconStyle}
`;

interface Props {
  value: number;
  setValue: (func: (prev: number) => number) => void;
  min?: number;
  max?: number;
}

const NumberPicker = ({ value, setValue, min, max }: Props) => {
  const handleUpClick = useCallback(() => {
    if (max !== undefined && value + 1 > max) return;
    setValue((prev) => prev + 1);
  }, [max, setValue, value]);

  const handleDownClick = useCallback(() => {
    if (min !== undefined && value - 1 < min) return;
    setValue((prev) => prev - 1);
  }, [min, setValue, value]);

  return (
    <Container>
      <NumberContainer>{value}</NumberContainer>

      <StyledKeyboardArrowUpIcon onClick={handleUpClick}>
        UP
      </StyledKeyboardArrowUpIcon>
      <StyledKeyboardArrowDownIcon onClick={handleDownClick}>
        DOWN
      </StyledKeyboardArrowDownIcon>
    </Container>
  );
};

export default NumberPicker;
