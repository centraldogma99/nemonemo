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
            <Title isActive={isActiveIndex >= 0}>?????????????????? for ??????</Title>
            <Description isActive={isActiveIndex >= 1}>
              ?????? ????????????,
              <br />
              ????????? ??????????????? ?????? ?????? ?????????????????? ?????????.
            </Description>
            <Spacing size={16} />
            <Description isActive={isActiveIndex >= 2}>
              ?????? ????????? ????????????!
            </Description>
          </FirstScreen>
          <FirstScreen isActive={isActiveIndex >= 3 && isActiveIndex <= 6}>
            <Item isActive={isActiveIndex >= 4}>
              <Strong>??????</Strong>??????
            </Item>
            <Item isActive={isActiveIndex >= 5}>
              <Strong>????????????</Strong>2022.3.13 ~ 2022.5.31
            </Item>
            <Item isActive={isActiveIndex >= 6}>
              ??? <strong>1,898???</strong>??? ????????? ??????????????????.
            </Item>
          </FirstScreen>
        </>
      )}
      <Screen isActive={isActiveIndex >= 7}>
        <LoveText isActive={isActiveIndex >= 8} color={palette.pink}>
          ????????? ?????????. ?????? ?????????!????????
        </LoveText>
        <Spacing size={80} />
        <AnimatedButton
          isActive={isActiveIndex >= 9}
          width={120}
          onClick={handleBackClick}
          type={"secondary"}
        >
          ????????????
        </AnimatedButton>
        <Spacing size={16} />
        <Description isActive={isActiveIndex >= 9}>
          ??? ???????????? <LinkText>nemonemo.dogmadevs.com</LinkText> ?????????
          <br />
          ???????????? ?????? ????????? ??? ?????????.
        </Description>
      </Screen>
    </Container>
  );
};

export default EndingCredit;
