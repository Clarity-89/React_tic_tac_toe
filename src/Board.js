import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { SQUARE_WIDTH } from "./constants";

const Board = ({ dims }) => {
  const [activeSquares, setActiveSquares] = useState([]);
  const arr = new Array(dims * dims).fill(1);
  const activeSquare = key => activeSquares.find(sq => sq.key === key);

  const onSquareClick = square => {
    setActiveSquares(squares => [...squares, square]);
  };
  return (
    <Container dims={dims}>
      {arr.map((dim, key) => {
        const active = activeSquare(key);
        return (
          <Square
            data-testid="square"
            key={key}
            onClick={() => onSquareClick({ key, type: "X" })}
          >
            {active && <Marker>{active.type}</Marker>}
          </Square>
        );
      })}
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

Board.propTypes = {
  dims: PropTypes.number
};

Board.defaultProps = {
  dims: 3
};
export default Board;
