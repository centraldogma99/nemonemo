import React, {
  ChangeEvent,
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import styled from "@emotion/styled";
import { palette } from "../components/palette";
import Spacing from "../components/Spacing";

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

interface NumberInputProps {
  innerRef?: React.RefObject<HTMLInputElement>;
}

const NumberInput = ({
  innerRef,
  ...rest
}: NumberInputProps & React.HTMLProps<HTMLInputElement>) => (
  <input
    type={"numeric"}
    inputMode={"decimal"}
    maxLength={1}
    placeholder={"-"}
    ref={innerRef}
    {...rest}
  />
);

const Input = styled(NumberInput)`
  border: 2px dashed ${palette.blue};
  font-size: 1.25rem;
  padding: 4px;
  text-align: center;
  width: 1.75rem;
  height: 2rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  caret-color: transparent;

  &:first-of-type {
    margin-left: 0;
  }
  &:focus {
    outline: none;
    border: ${palette.blue} solid 2.5px;
  }
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: row;
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
  const input1 = useRef<HTMLInputElement>(null);
  const input2 = useRef<HTMLInputElement>(null);
  const input3 = useRef<HTMLInputElement>(null);
  const input4 = useRef<HTMLInputElement>(null);

  const setValue = useCallback((index: number, value: string) => {
    setValues((prev) => [
      ...prev.slice(0, index),
      value,
      ...prev.slice(index + 1),
    ]);
  }, []);

  const handleChange = useCallback(
    (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") return setValue(i, "");
      if (!value || isNaN(parseInt(value))) return;
      setValue(i, value);
      if (isError) setIsError(false);
      switch (i) {
        case 0:
          input2.current?.focus();
          break;
        case 1:
          input3.current?.focus();
          break;
        case 2:
          input4.current?.focus();
          break;
      }
    },
    [isError, setValue]
  );

  const isPasswordCorrect = useMemo(() => {
    return ["0", "5", "3", "1"].every((v, i) => v === values[i]);
  }, [values]);

  const isInputFull = useMemo(() => {
    return values.length === 4 && values.every((v) => v !== "");
  }, [values]);

  useEffect(() => {
    if (isPasswordCorrect) {
      setTimeout(onSuccessCallback, 1300);
      return;
    } else if (isInputFull) {
      setValues(["", "", "", ""]);
      setIsError(true);
      input1.current?.focus();
    }
  }, [onSuccessCallback, values.length, isInputFull, isPasswordCorrect]);

  return (
    <Container>
      <CenterContainer>
        <Text>비밀번호를 입력하세요!</Text>
        <Spacing size={48} />
        <InputsContainer>
          <Input
            value={values[0]}
            onChange={handleChange(0)}
            innerRef={input1}
          />
          <Input
            value={values[1]}
            onChange={handleChange(1)}
            innerRef={input2}
          />
          <Input
            value={values[2]}
            onChange={handleChange(2)}
            innerRef={input3}
          />
          <Input
            value={values[3]}
            onChange={handleChange(3)}
            innerRef={input4}
          />
        </InputsContainer>
        <MessageContainer isError={isError}>
          {isError && "틀렸습니다!"}
          {isPasswordCorrect && "정답입니다! 잠시 후에 이동합니다..."}
        </MessageContainer>
      </CenterContainer>
    </Container>
  );
};

export default LoginPage;
