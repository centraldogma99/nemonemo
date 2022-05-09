import styled from "@emotion/styled";
import { palette } from "./palette";

const VerticalLine = styled.div`
  height: 0;
  width: 400px;
  border-top: 2px dotted ${palette.blue};
`;

export default VerticalLine;
