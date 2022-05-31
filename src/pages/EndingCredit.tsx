import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "../components/palette";
import Spacing from "../components/Spacing";
import { useEffect } from "react";
import { Button } from "../components/Button";
import { contentState } from "./IntroPage";
import { useSetRecoilState } from "recoil";

const Typo = styled.div<{ isActive?: boolean; color?: string }>`
  color: ${palette.blue};
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  font-size: 1.5rem;
  margin-top: 1rem;
  text-align: center;
  line-height: 150%;
  transition: opacity 1.5s;
  user-select: none;
  &:first-of-type {
    margin-top: 0;
  }
`;

const Title = styled(Typo)`
  font-size: 2.5rem;
  font-weight: bold;
`;

const Item = styled(Typo)`
  margin-top: 1rem;
`;

const LinkText = styled.span`
  font-weight: 600;
`;

const LoveText = styled(Typo)`
  margin-top: 48px;
  font-weight: bold;
  font-size: 1.75rem;
`;

const Description = styled(Typo)`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const Strong = styled.span`
  font-weight: bold;
  margin-right: 2rem;
`;

const AnimatedButton = styled(Button)<{ isActive?: boolean }>`
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transition: opacity 1s;
`;

const Container = styled.div`
  position: relative;
`;

const Screen = styled.div<{ isActive?: boolean }>`
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transition: opacity 1s;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FirstScreen = styled(Screen)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const EndingCredit = () => {
  const [isActiveIndex, setIsActiveIndex] = useState(-1);
  const setContent = useSetRecoilState(contentState);

  useEffect(() => {
    if (isActiveIndex >= 10) return;
    const timer = setInterval(() => {
      setIsActiveIndex((prev) => prev + 1);
    }, 2300);

    return () => clearInterval(timer);
  }, [isActiveIndex]);

  const handleBackClick = useCallback(() => {
    setContent(undefined);
  }, [setContent]);

  return (
    <Container>
      {isActiveIndex <= 7 && (
        <>
          <FirstScreen isActive={isActiveIndex >= 0 && isActiveIndex <= 2}>
            <Title isActive={isActiveIndex >= 0}>네모네모로직 for 해련</Title>
            <Description isActive={isActiveIndex >= 1}>
              생일 기념으로,
              <br />
              오로지 해련이만을 위해 만든 네모네모로직 이에요.
            </Description>
            <Spacing size={16} />
            <Description isActive={isActiveIndex >= 2}>
              즐겨 주셔서 고마워요!
            </Description>
          </FirstScreen>
          <FirstScreen isActive={isActiveIndex >= 3 && isActiveIndex <= 6}>
            <Item isActive={isActiveIndex >= 4}>
              <Strong>제작</Strong>준영
            </Item>
            <Item isActive={isActiveIndex >= 5}>
              <Strong>제작기간</Strong>2022.3.13 ~ 2022.5.31
            </Item>
            <Item isActive={isActiveIndex >= 6}>
              총 <strong>1,898줄</strong>의 코드로 만들어졌어요.
            </Item>
          </FirstScreen>
        </>
      )}
      <Screen isActive={isActiveIndex >= 7}>
        <LoveText isActive={isActiveIndex >= 8} color={palette.pink}>
          사랑해 해련아. 생일 축하해!👏👏
        </LoveText>
        <Spacing size={80} />
        <AnimatedButton
          isActive={isActiveIndex >= 9}
          width={120}
          onClick={handleBackClick}
          type={"secondary"}
        >
          돌아가기
        </AnimatedButton>
        <Spacing size={16} />
        <Description isActive={isActiveIndex >= 9}>
          이 페이지는 <LinkText>nemonemo.dogmadevs.com</LinkText> 링크로
          <br />
          언제든지 다시 접속할 수 있어요.
        </Description>
      </Screen>
    </Container>
  );
};

export default EndingCredit;
