import React from "react";
import styled from "styled-components";
import Board from "./Board";

function App() {
  return (
    <Main>
      <Board />
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
export default App;
