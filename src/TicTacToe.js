import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_WIDTH,
  DRAW,
  GAME_STATES
} from "./constants";
import BoardClass from "./Board";
import { switchPlayer } from "./utils";
import { minimax } from "./minimax";

const TicTacToe = ({ dims }) => {
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const arr = new Array(dims * dims).fill(null);
  // const [grid, setGrid] = useState(arr);
  const [grid, setGrid] = useState(arr);
  const [winner, setWinner] = useState(null);
  const [nextMove, setNextMove] = useState(null);
  const board = new BoardClass();

  // TODO deep compare grid
  useEffect(() => {
    const winner = board.getWinner(grid);
    if (winner) {
      setGameState(GAME_STATES.over);
      declareWinner(winner);
    }
  }, []);

  useEffect(() => {
    console.log("current move", nextMove, players);
    // if (nextMove.player !== null) move(nextMove);
    if (nextMove !== null && nextMove === players.computer) {
      console.log("moving");
      computerMove();
    }
  });

  const move = (index, player) => {
    if (!grid[index] && player) {
      //  setNextMove(player);
      setGrid(grid => {
        const gridCopy = grid.concat();
        gridCopy[index] = player;
        return gridCopy;
      });
    }
  };

  const humanMove = index => {
    move(index, players.human);
    setNextMove(players.computer);
  };

  const computerMove = () => {
    // Important to pass a copy of grid here
    console.log("grid", grid.concat());
    const board = new BoardClass(grid.concat());
    const index = minimax(board, players.computer)[1];
    move(index, players.computer);
    setNextMove(players.human);
  };
  console.log("players", players);
  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
  };

  const declareWinner = winner => {
    let winnerStr;
    switch (winner) {
      case PLAYER_X:
        winnerStr = "The winner is Player X";
        break;
      case PLAYER_O:
        winnerStr = "The winner is Player O";
        break;
      case DRAW:
      default:
        winnerStr = "It's a draw";
    }
    setWinner(winnerStr);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    //setGrid(arr);
  };

  console.log("gridddd", grid);
  switch (gameState) {
    case GAME_STATES.inProgress:
      return (
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
      );
    case GAME_STATES.notStarted:
    default:
      return (
        <Screen>
          <Inner>
            <ChooseText>Choose your player</ChooseText>
            <span onClick={() => choosePlayer(PLAYER_X)}>X</span> or{" "}
            <span onClick={() => choosePlayer(PLAYER_O)}>O</span>
          </Inner>
        </Screen>
      );
    case GAME_STATES.over:
      return (
        <Screen>
          <p>{winner}</p>
          <Button onClick={startNewGame}>Start over</Button>
        </Screen>
      );
  }
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
const Button = styled.button``;

TicTacToe.propTypes = {
  dims: PropTypes.number
};

TicTacToe.defaultProps = {
  dims: 3
};
export default TicTacToe;
