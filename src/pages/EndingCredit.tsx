import React from "react";
import styled from "@emotion/styled";
import { palette } from "../components/palette";
import Spacing from "../components/Spacing";

const Typo = styled.div`
  color: ${palette.blue};
  font-size: 1.5rem;
  margin-top: 1rem;
  &:first-of-type {
    margin-top: 0;
  }
`;

const Title = styled(Typo)`
  font-size: 2.5rem;
  font-weight: bold;
`;

const Item = styled(Typo)`
  margin-top: 2rem;
`;

const LinkText = styled.span`
  font-weight: 600;
`;

const EndingCredit = () => {
  return (
    <>
      <Title>네모네모로직 for 해련</Title>
      <Typo>
        생일 기념으로, 오로지 해련이만을 위해 만든 네모네모로직 이에요.
      </Typo>
      <Spacing size={32} />
      <Item>
        <strong>제작</strong> 준영
      </Item>
      <Item>
        <strong>제작기간</strong> 2022.3.13 ~ 2022.5.31
      </Item>
      <Item>
        총 <strong>2,123줄</strong>의 코드로 만들어졌어요.
      </Item>
      <Item>
        이 페이지는 <LinkText>nemonemo.dogmadevs.com</LinkText> 링크로 언제든지
        접속할 수 있어요.
      </Item>
    </>
  );
};

export default EndingCredit;
