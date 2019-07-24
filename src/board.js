import { DRAW } from "./constants";

export default class Board {
  constructor(grid) {
    this.grid = new Array(9).fill(null);
  }

  makeMove = (square, player) => {
    console.log("ind", square, player);
    this.grid[square] = player;
  };

  // Collect indices of empty squares and return them
  getEmptySquares = () => {
    let squares = [];
    this.grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };

  getWinner = () => {
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
    winningCombos.forEach(el => {
      if (
        this.grid[el[0]] !== null &&
        this.grid[el[0]] === this.grid[el[1]] &&
        this.grid[el[0]] === this.grid[el[2]]
      ) {
        res = this.grid[el[0]];
      } else if (res === null && this.getEmptySquares().length === 0) {
        res = DRAW;
      }
    });
    return res;
  };

  clone = () => {
    return new Board(this.grid);
  };
}
