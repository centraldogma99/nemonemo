import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { palette } from "./palette";
import { css } from "@emotion/react";

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const disappear = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

interface Props {
  visible: boolean;
  animateDuration: number;
}

const Container = styled.div<Props>`
  position: fixed;
  top: 150px;
  background-color: ${palette.blue};
  padding: 0.75rem;
  color: ${palette.pink};
  font-weight: bold;
  width: 300px;
  font-size: 1.25rem;
  text-align: center;

  animation-duration: ${({ animateDuration }) => animateDuration}ms;
  animation-timing-function: ease-out;
  animation-name: ${({ visible }) => (visible ? appear : disappear)};
  ${({ visible }) =>
    !visible &&
    css`
      opacity: 0;
    `}
`;

const useToast = (
  text: string,
  messageDuration: number = 2000,
  animateDuration: number = 500
) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const messageTimer = useRef<NodeJS.Timeout>();
  const animationTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isVisible) {
      messageTimer.current = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(true);
        animationTimer.current = setTimeout(() => {
          setIsAnimating(false);
        }, animateDuration);
      }, messageDuration);
    }
    return () => {
      messageTimer.current && clearTimeout(messageTimer.current);
      animationTimer.current && clearTimeout(animationTimer.current);
    };
  }, [animateDuration, isVisible, messageDuration]);

  const showToast = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleToastClick = useCallback(() => {
    setIsVisible(false);
    setIsAnimating(false);
  }, []);

  const toast = useMemo(
    () =>
      isVisible || isAnimating ? (
        <Container
          visible={isVisible}
          animateDuration={animateDuration}
          onClick={handleToastClick}
        >
          {text}
        </Container>
      ) : (
        <></>
      ),
    [animateDuration, handleToastClick, isAnimating, isVisible, text]
  );

  return { toast, showToast };
};

export default useToast;
