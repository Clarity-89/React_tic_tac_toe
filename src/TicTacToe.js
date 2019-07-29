import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_WIDTH,
  DRAW,
  GAME_STATES,
  DIMS
} from "./constants";
import BoardClass from "./Board";
import { switchPlayer } from "./utils";
import { minimax } from "./minimax";
import { ResultModal } from "./ResultModal";

const TicTacToe = () => {
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const arr = new Array(DIMS * DIMS).fill(null);
  const [grid, setGrid] = useState(arr);
  const [winner, setWinner] = useState(null);
  const [nextMove, setNextMove] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const board = new BoardClass();

  useEffect(() => {
    const winner = board.getWinner(grid);
    const declareWinner = winner => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          winnerStr = "Player X wins!";
          break;
        case PLAYER_O:
          winnerStr = "Player O wins!";
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
      setModalOpen(true);
    };

    if (winner !== null && gameState !== GAME_STATES.over) {
      declareWinner(winner);
    }
  }, [board, gameState, grid, nextMove]);

  const move = useCallback(
    (index, player) => {
      if (!grid[index] && player && gameState === GAME_STATES.inProgress) {
        setGrid(grid => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState, grid]
  );

  const computerMove = useCallback(() => {
    // Important to pass a copy of grid here
    const board = new BoardClass(grid.concat());
    const index = minimax(board, players.computer)[1];
    move(index, players.computer);
    setNextMove(players.human);
  }, [move, grid, players]);

  useEffect(() => {
    if (nextMove !== null && nextMove === players.computer) {
      computerMove();
    }
  }, [nextMove, computerMove, players.computer]);

  const humanMove = index => {
    move(index, players.human);
    setNextMove(players.computer);
  };

  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextMove(PLAYER_X);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(arr);
    setModalOpen(false);
  };

  return gameState === GAME_STATES.notStarted ? (
    <Screen>
      <Inner>
        <ChooseText>Choose your player</ChooseText>
        <span onClick={() => choosePlayer(PLAYER_X)}>X</span> or{" "}
        <span onClick={() => choosePlayer(PLAYER_O)}>O</span>
      </Inner>
    </Screen>
  ) : (
    <Container dims={DIMS}>
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
      <ResultModal
        isOpen={modalOpen}
        winner={winner}
        close={() => setModalOpen(false)}
        startNewGame={startNewGame}
      />
    </Container>
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

const Screen = styled.div``;
const Inner = styled.div``;
const ChooseText = styled.p``;

TicTacToe.propTypes = {
  dims: PropTypes.number
};

TicTacToe.defaultProps = {
  dims: 3
};
export default TicTacToe;
