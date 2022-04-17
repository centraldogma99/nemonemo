import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import CreateAnswerPage from "../pages/CreateAnswerPage";
import GameboardPage from "../pages/GameboardPage";
import { gameboardState } from "../stores/gameboard";

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TabDiv = styled.div`
  border: 1px solid black;
  text-align: center;
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

  return <TabDiv onClick={handleClick}>{children}</TabDiv>;
};

const Layout = () => {
  const currentPage = useRecoilValue(pageState);

  return (
    <div>
      <h1>nemonemo logic by junyeong</h1>
      <TabContainer>
        <Tab to={Page.Create}>Create</Tab>
        <Tab to={Page.Solve}>Solve</Tab>
      </TabContainer>
      {currentPage === Page.Create && <CreateAnswerPage />}
      {currentPage === Page.Solve && <GameboardPage />}
    </div>
  );
};

export default Layout;
