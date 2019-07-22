import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Board = ({ dims }) => {
  const arr = new Array(dims * dims).fill(1);
  return (
    <Container dims={dims}>
      {arr.map((dim, key) => (
        <Square key={key} />
      ))}
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
`;

Board.propTypes = {
  dims: PropTypes.number
};

Board.defaultProps = {
  dims: 3
};
export default Board;
