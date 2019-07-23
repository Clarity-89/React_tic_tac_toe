import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { PLAYER_X, PLAYER_O, SQUARE_WIDTH } from "./constants";

const Board = ({ dims }) => {
  const [activeSquares, setActiveSquares] = useState([]);
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameStarted, setGameStarted] = useState(false);
  const arr = [...new Array(dims * dims).keys()];
  const activeSquare = key => activeSquares.find(sq => sq.key === key);

  const playerMove = key => {
    setActiveSquares(squares => [...squares, { key, type: players.human }]);
  };

  const getEmptySquares = () => {
    return arr.find(key => !activeSquares.find(square => square.key === key));
  };

  const computerMove = () => {
    const move = 1;
    if (!activeSquare(move)) {
      setActiveSquares(squares => [...squares, move]);
    }

    if (checkWin()) {
      declareWinner();
    }
  };

  const switchPlayer = player => {
    return player === PLAYER_X ? PLAYER_O : PLAYER_X;
  };
  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameStarted(true);
  };

  const checkWin = () => null;

  const declareWinner = () => null;
  return gameStarted ? (
    <Container dims={dims}>
      {arr.map(key => {
        const active = activeSquare(key);

        return (
          <Square
            data-testid="square"
            key={key}
            onClick={() => playerMove(key)}
          >
            {active && <Marker>{active.type === PLAYER_X ? "X" : "O"}</Marker>}
          </Square>
        );
      })}
    </Container>
  ) : (
    <StartScreen>
      <Inner>
        <ChooseText>Choose your player</ChooseText>
        <span onClick={() => choosePlayer(PLAYER_X)}>X</span> or{" "}
        <span onClick={() => choosePlayer(PLAYER_O)}>O</span>
      </Inner>
    </StartScreen>
  );
};

const Container = styled.div`
  display: flex;
  width: ${({ dims }) => `${dims * (SQUARE_WIDTH + 5)}px`};
  flex-flow: wrap;
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_WIDTH}px;
  height: ${SQUARE_WIDTH}px;
  border: 1px solid black;

  &:hover {
    cursor: pointer;
  }
`;

const Marker = styled.span`
  font-size: 48px;
`;

const StartScreen = styled.div``;
const Inner = styled.div``;
const ChooseText = styled.p``;

Board.propTypes = {
  dims: PropTypes.number
};

Board.defaultProps = {
  dims: 3
};
export default Board;
