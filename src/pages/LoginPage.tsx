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
import { Button } from "../components/Button";
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
  font-size: 1.5rem;
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
  margin-left: 0.25rem;
  &:first-of-type {
    margin-left: 0;
  }
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

interface Props {
  onSuccessCallback: () => void;
}

const LoginPage = ({ onSuccessCallback }: Props) => {
  const [values, setValues] = useState<string[]>([]);
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
    [setValue]
  );

  const passwordComparison = useMemo(() => {
    return ["0", "5", "1", "3"].every((v, i) => v === values[i]);
  }, [values]);

  useEffect(() => {
    if (passwordComparison) onSuccessCallback();
  }, [passwordComparison, onSuccessCallback]);

  return (
    <Container>
      <CenterContainer>
        <Text>비밀번호를 입력하세요!</Text>
        <Spacing size={32} />
        <InputsContainer>
          <Input value={values[0]} onChange={handleChange(0)} />
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
      </CenterContainer>
    </Container>
  );
};

export default LoginPage;
