import styled from "@emotion/styled";
import { palette } from "./palette";

export const Textarea = styled.textarea`
  resize: none;
  width: 260px;
  height: 90px;
  border: 2px dashed ${palette.blue};
`;
