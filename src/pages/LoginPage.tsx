import React, { useCallback, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "../components/palette";
import Spacing from "../components/Spacing";
import PasswordInput from "../components/PasswordInput";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: ${palette.pink};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterContainer = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.div`
  color: ${palette.blue};
  font-size: 1.75rem;
  font-weight: bold;
`;

const MessageContainer = styled.div<{ isError?: boolean }>`
  margin-top: 32px;
  color: ${({ isError }) => (isError ? "red" : palette.blue)};
  font-weight: 600;
`;

interface Props {
  onSuccessCallback: () => void;
}

const LoginPage = ({ onSuccessCallback }: Props) => {
  const [values, setValues] = useState<string[]>(["", "", "", ""]);
  const [isError, setIsError] = useState<boolean>(false);

  const isPasswordCorrect = useMemo(() => {
    return ["0", "5", "3", "1"].every((v, i) => v === values[i]);
  }, [values]);

  const onFailCallback = useCallback(() => {
    setIsError(true);
  }, []);

  const onSuccess = useCallback(() => {
    setTimeout(onSuccessCallback, 1300);
  }, [onSuccessCallback]);

  return (
    <Container>
      <CenterContainer>
        <Text>비밀번호를 입력하세요!</Text>
        <Spacing size={48} />
        <PasswordInput
          values={values}
          setValues={setValues}
          length={4}
          isPasswordCorrect={isPasswordCorrect}
          onSuccessCallback={onSuccess}
          onFailCallback={onFailCallback}
        />
        <MessageContainer isError={isError}>
          {isError && "틀렸습니다!"}
          {isPasswordCorrect && "정답입니다! 잠시 후에 이동합니다..."}
        </MessageContainer>
      </CenterContainer>
    </Container>
  );
};

export default LoginPage;
