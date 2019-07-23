import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { PLAYER_X, PLAYER_O, SQUARE_WIDTH } from "./constants";

const Board = ({ dims }) => {
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameStarted, setGameStarted] = useState(false);
  const arr = new Array(dims * dims).fill(null);
  const [grid, setGrid] = useState(arr);

  // TODO deep compare grid
  useEffect(() => {
    if (checkWin()) {
      declareWinner();
    }
  }, [grid]);

  const humanMove = index => {
    if (!grid[index]) {
      setGrid(grid => {
        const g = grid.concat();
        g[index] = players.human;
        return g;
      });
    }

    // TODO move computer
  };

  const computerMove = () => {
    const index = 1;
    setGrid(grid => {
      grid[index] = players.computer;
      return grid;
    });
  };

  const getEmptySquares = () => {
    return grid.filter(square => square === null);
  };

  const switchPlayer = player => {
    return player === PLAYER_X ? PLAYER_O : PLAYER_X;
  };

  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameStarted(true);
  };

  const checkWin = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return null;
  };

  const declareWinner = () => null;
  return gameStarted ? (
    <Container dims={dims}>
      {grid.map((value, index) => {
        const isActive = value !== null;

        return (
          <Square
            data-testid="square"
            key={index}
            onClick={() => humanMove(index)}
          >
            {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
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
