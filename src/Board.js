import React, { useState, useEffect, useReducer } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_WIDTH,
  DRAW,
  GAME_STATES,
  SCORES
} from "./constants";
import BoardClass from "./board";

function reducer(state, action) {
  switch (action.type) {
    case "add":
      const g = state.concat();
      g[action.index] = action.player;
      return g;
    default:
      throw new Error();
  }
}
const Board = ({ dims }) => {
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const arr = new Array(dims * dims).fill(null);
  // const [grid, setGrid] = useState(arr);
  const [grid, dispatch] = useReducer(reducer, arr);
  const [winner, setWinner] = useState(null);
  //let grid = arr.concat();

  // TODO deep compare grid
  useEffect(() => {
    const winner = getWinner();
    if (winner) {
      setGameState(GAME_STATES.over);
      declareWinner(winner);
    }
  }, []);

  const move = (index, player) => {
    if (!grid[index]) {
      // setGrid(grid => {
      //   const g = grid.concat();
      //   g[index] = player;
      //   return g;
      // });
      dispatch({ type: "add", index, player });
    }
  };

  const minimax = (board, player) => {
    console.log("gr", board);
    const mult = SCORES[String(player)];
    const empty = board.getEmptySquares();
    console.log("em", empty);
    const l = empty.length;
    let thisScore;
    let maxScore = -1;
    let bestMove = null;

    if (board.getWinner() !== null) {
      return [SCORES[board.getWinner()], 0];
    } else {
      for (let i = 0; i < l; i++) {
        let copy = board.clone();
        board.makeMove(empty[i], player);
        thisScore = mult * minimax(copy, switchPlayer(player))[0];

        if (thisScore >= maxScore) {
          maxScore = thisScore;
          bestMove = empty[i];
        }
      }

      return [mult * maxScore, bestMove];
    }
  };

  const humanMove = index => {
    move(index, players.human);

    // TODO move computer
    computerMove();
  };

  const computerMove = () => {
    const board = new BoardClass(grid);
    const index = minimax(board, players.computer)[1];
    console.log("index", index);
    //move(index, players.computer);
  };

  // Collect indices of empty squares and return them
  const getEmptySquares = () => {
    let squares = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };

  const switchPlayer = player => {
    return player === PLAYER_X ? PLAYER_O : PLAYER_X;
  };

  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
  };

  const getWinner = () => {
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
    let res = null;
    winningCombos.forEach(function(el) {
      if (
        grid[el[0]] !== null &&
        grid[el[0]] === grid[el[1]] &&
        grid[el[0]] === grid[el[2]]
      ) {
        res = grid[el[0]];
      } else if (res === null && getEmptySquares().length === 0) {
        res = DRAW;
      }
    });
    return res;
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

Board.propTypes = {
  dims: PropTypes.number
};

Board.defaultProps = {
  dims: 3
};
export default Board;
