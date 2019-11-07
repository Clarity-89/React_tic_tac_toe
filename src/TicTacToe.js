import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMS,
  GAME_MODES
} from "./constants";
import Board from "./Board";
import { getRandomInt, switchPlayer } from "./utils";
import { minimax } from "./minimax";
import { ResultModal } from "./ResultModal";
import { border } from "./styles";

const arr = new Array(DIMS ** 2).fill(null);
const board = new Board();

const TicTacToe = ({ squares = arr }) => {
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(squares);
  const [winner, setWinner] = useState(null);
  const [nextMove, setNextMove] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(GAME_MODES.medium);

  /**
   * On every move, check if there is a winner. If yes, set game state to over and open result modal
   */
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
      // Slight delay for the modal so there is some time to see the last move
      setTimeout(() => setModalOpen(true), 300);
    };

    if (winner !== null && gameState !== GAME_STATES.over) {
      declareWinner(winner);
    }
  }, [gameState, grid, nextMove]);

  /**
   * Set the grid square with respective player that made the move. Only make a move when the game is in progress.
   * useCallback is necessary to prevent unnecessary recreation of the function, unless gameState changes, since it is
   * being tracked in useEffect
   * @type {Function}
   */
  const move = useCallback(
    (index, player) => {
      if (player && gameState === GAME_STATES.inProgress) {
        setGrid(grid => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState]
  );

  /**
   * Make computer move. If it's the first move (board is empty), make move at any random cell to skip
   * unnecessary minimax calculations
   * @type {Function}
   */
  const computerMove = useCallback(() => {
    // Important to pass a copy of the grid here
    const board = new Board(grid.concat());
    const emptyIndices = board.getEmptySquares(grid);
    let index;
    switch (mode) {
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
      case GAME_MODES.medium:
        // Medium level is basically ~half of the moves are minimax and the other ~half random
        const smartMove = !board.isEmpty(grid) && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(board, players.computer)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
        break;
      case GAME_MODES.difficult:
      default:
        index = board.isEmpty(grid)
          ? getRandomInt(0, 8)
          : minimax(board, players.computer)[1];
    }
    if (!grid[index]) {
      move(index, players.computer);
      setNextMove(players.human);
    }
  }, [move, grid, players, mode]);

  /**
   * Make computer move when it's computer's turn
   */
  useEffect(() => {
    let timeout;
    if (
      nextMove !== null &&
      nextMove === players.computer &&
      gameState !== GAME_STATES.over
    ) {
      // Delay computer moves to make them more natural
      timeout = setTimeout(() => {
        computerMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, computerMove, players.computer, gameState]);

  const humanMove = index => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.computer);
    }
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

  const changeMode = e => {
    setMode(e.target.value);
  };

  return gameState === GAME_STATES.notStarted ? (
    <Screen>
      <Inner>
        <ChooseText>Select difficulty</ChooseText>
        <select onChange={changeMode} value={mode}>
          {Object.keys(GAME_MODES).map(key => {
            const gameMode = GAME_MODES[key];
            return (
              <option key={gameMode} value={gameMode}>
                {key}
              </option>
            );
          })}
        </select>
      </Inner>
      <Inner>
        <ChooseText>Choose your player</ChooseText>
        <ButtonRow>
          <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
          <p>or</p>
          <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
        </ButtonRow>
      </Inner>
    </Screen>
  ) : (
    <Container dims={DIMS}>
      {grid.map((value, index) => {
        const isActive = value !== null;

        return (
          <Square
            data-testid={`square_${index}`}
            key={index}
            onClick={() => humanMove(index)}
          >
            {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
          </Square>
        );
      })}
      <Strikethrough
        styles={
          gameState === GAME_STATES.over && board.getStrikethroughStyles()
        }
      />
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
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  ${border};

  &:hover {
    cursor: pointer;
  }
`;

Square.displayName = "Square";

const Marker = styled.p`
  font-size: 68px;
`;

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Screen = styled.div``;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const ChooseText = styled.p``;

const Strikethrough = styled.div`
  position: absolute;
  ${({ styles }) => styles}
  background-color: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

export default TicTacToe;
