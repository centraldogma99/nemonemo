import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "../components/palette";
import { Button } from "../components/Button";
import CreateAnswerPage from "./CreateAnswerPage";
import GameboardPage from "./GameboardPage";
import { atom, useRecoilState } from "recoil";
import Spacing from "../components/Spacing";
import LoginPage from "./LoginPage";

const Body = styled.div`
  height: 100vh;
  background-color: ${palette.pink};
`;

const Wrapper = styled.div`
  margin: auto;
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
  border-radius: 16px;
  background-color: ${palette.pink};
  color: ${palette.blue};
  width: 400px;
`;

const Title = styled.div`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
`;

const Item = styled(Button)`
  margin-bottom: 12px;
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  height: 32px;
  background-color: ${palette.blue};
  color: ${palette.pink};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  a {
    color: ${palette.pink};
  }
`;

export enum Content {
  Create,
  Solve,
}

export const contentState = atom<Content | undefined>({
  key: "contentState",
  default: undefined,
});

const IntroPage = () => {
  const [content, setContent] = useRecoilState(contentState);
  const handleSolveClick = useCallback(() => {
    setContent(Content.Solve);
  }, [setContent]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleCreateClick = useCallback(() => {
    setContent(Content.Create);
  }, [setContent]);

  const handleLogIn = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  return (
    <Body>
      {!isLoggedIn && <LoginPage onSuccessCallback={handleLogIn} />}
      <Wrapper>
        {content === undefined && (
          <Container>
            <img src={"logo.png"} width={110} alt={"logo img"} />
            <Spacing size={12} />
            <Title>네모네모로직</Title>
            <Spacing size={18} />

            <Spacing size={18} />
            <Item onClick={handleSolveClick}>풀래요!</Item>
            <Item onClick={handleCreateClick}>만들래요!</Item>
          </Container>
        )}
        {content === Content.Create && <CreateAnswerPage />}
        {content === Content.Solve && <GameboardPage />}
      </Wrapper>
      <Footer>
        <a href={"https://github.com/centraldogma99/nemonemo"}>Github</a>
      </Footer>
    </Body>
  );
};

export default IntroPage;
