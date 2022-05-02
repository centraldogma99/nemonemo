import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { palette } from "../components/palette";
import { Button } from "../components/Button";
import CreateAnswerPage from "./CreateAnswerPage";
import GameboardPage from "./GameboardPage";
import { atom, useRecoilState } from "recoil";

const Body = styled.div`
  height: 100vh;
  background-color: #fbeaeb;
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

  margin-top: 12px;
  margin-bottom: 36px;
`;

const Item = styled(Button)`
  margin-bottom: 12px;
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

  const handleCreateClick = useCallback(() => {
    setContent(Content.Create);
  }, [setContent]);

  return (
    <Body>
      <Wrapper>
        {content === undefined && (
          <Container>
            <img src={"logo.png"} width={110} />
            <Title>네모네모로직</Title>
            <Item onClick={handleSolveClick}>풀래요!</Item>
            <Item onClick={handleCreateClick}>만들래요!</Item>
          </Container>
        )}
        {content === Content.Create && <CreateAnswerPage />}
        {content === Content.Solve && <GameboardPage />}
      </Wrapper>
    </Body>
  );
};

export default IntroPage;
