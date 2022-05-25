import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled from "@emotion/styled";
import { palette } from "./palette";

interface NumberInputProps {}

const NumberInput = React.forwardRef<
  HTMLInputElement,
  NumberInputProps & React.HTMLProps<HTMLInputElement>
>(({ ...rest }, ref) => (
  <input
    type={"numeric"}
    inputMode={"decimal"}
    maxLength={1}
    placeholder={"_"}
    ref={ref}
    {...rest}
  />
));

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
  color: ${palette.blue};
  font-weight: 550;

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

interface Props {
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  length: number;
  isPasswordCorrect: boolean;
  onSuccessCallback: () => void;
  onFailCallback: () => void;
}

const PasswordInput = ({
  values,
  setValues,
  length,
  isPasswordCorrect,
  onSuccessCallback,
  onFailCallback,
}: Props) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setValue = useCallback(
    (index: number, value: string) => {
      setValues((prev) => [
        ...prev.slice(0, index),
        value,
        ...prev.slice(index + 1),
      ]);
    },
    [setValues]
  );

  const handleChange = useCallback(
    (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!value || isNaN(parseInt(value))) return;
      setValue(i, value);

      if (i === length - 1) return;
      inputRefs.current[i + 1]?.focus();
    },
    [length, setValue]
  );

  const isInputFull = useMemo(() => {
    return values.length === length && values.every((v) => v !== "");
  }, [length, values]);

  const handleKeyDown = useCallback(
    (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code !== "Backspace") return;
      setValue(i, "");
      if (i === 0 || inputRefs.current[i - 1] === null) return;
      inputRefs.current[i - 1]?.focus();
      setValue(i, "");
    },
    [setValue]
  );

  useEffect(() => {
    if (!isInputFull) return;
    if (!isPasswordCorrect) {
      inputRefs.current[0]?.focus();
      onFailCallback();
      return setValues(Array(length).fill(""));
    }

    onSuccessCallback();
  }, [
    isInputFull,
    isPasswordCorrect,
    length,
    onFailCallback,
    onSuccessCallback,
    setValues,
  ]);

  return (
    <InputsContainer>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <Input
            key={i}
            value={values[i]}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            ref={(e) => (inputRefs.current[i] = e)}
          />
        ))}
    </InputsContainer>
  );
};

export default PasswordInput;
