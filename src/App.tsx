import styled from "styled-components";
import TicTacToe from "./TicTacToe";
import "papercss/dist/paper.min.css";

export default function App() {
  return (
    <>
      <Main>
        <TicTacToe />
      </Main>
      <Footer>
        <FooterInner>
          View the code on{" "}
          <a href="https://github.com/Clarity-89/React_tic_tac_toe">Github</a>
        </FooterInner>
      </Footer>
    </>
  );
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  width: 100%;
  flex: 0 0 auto;
`;

const FooterInner = styled.div`
  padding: 16px 0;
`;
