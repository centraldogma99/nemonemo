import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import CreateAnswerPage from "../pages/CreateAnswerPage";
import GameboardPage from "../pages/GameboardPage";
import { gameboardState } from "../stores/gameboard";
import { Button } from "./Button";

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Wrapper = styled.div`
  margin: auto;
  width: 60%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

enum Page {
  Create,
  Solve,
}

const pageState = atom({
  key: "pageState",
  default: Page.Solve,
});

interface TabProps {
  to: Page;
}

const Tab = ({ to, children }: TabProps & React.HTMLProps<HTMLDivElement>) => {
  const setPage = useSetRecoilState(pageState);
  const setGameboard = useSetRecoilState(gameboardState);

  const handleClick = useCallback(() => {
    setGameboard([]);
    setPage(to);
  }, [setPage, to]);

  return <Button onClick={handleClick}>{children}</Button>;
};

const Layout = () => {
  const currentPage = useRecoilValue(pageState);

  return (
    <Wrapper>
      <TabContainer>
        <Tab to={Page.Create}>Create</Tab>
        <Tab to={Page.Solve}>Solve</Tab>
      </TabContainer>
      {currentPage === Page.Create && <CreateAnswerPage />}
      {currentPage === Page.Solve && <GameboardPage />}
    </Wrapper>
  );
};

export default Layout;
