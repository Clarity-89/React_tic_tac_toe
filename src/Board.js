import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

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
          <Square key={key} onClick={() => onSquareClick({ key, type: "X" })}>
            {active && <span>{active.type}</span>}
          </Square>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: ${({ dims }) => `${dims * 55}px`};
  flex-flow: wrap;
`;
const Square = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid black;

  &:hover {
    cursor: pointer;
  }
`;

Board.propTypes = {
  dims: PropTypes.number
};

Board.defaultProps = {
  dims: 3
};
export default Board;
