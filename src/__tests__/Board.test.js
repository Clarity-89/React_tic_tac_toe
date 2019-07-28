import Board from "../Board";
import { PLAYER_O, PLAYER_X, DRAW } from "../constants";

describe("getEmptySquares", () => {
  it("should get correct empty squares for the board", function() {
    const board = new Board();
    expect(board.getEmptySquares().length).toBe(9);
    expect(board.getEmptySquares()).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    // Check that the number of empty squares is updated after Player X moves
    board.makeMove(0, PLAYER_X);
    expect(board.getEmptySquares().length).toBe(8);

    // Check that the number of empty squares is updated after Player O moves
    expect(board.getEmptySquares()).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    board.makeMove(5, PLAYER_O);
    expect(board.getEmptySquares().length).toBe(7);
    expect(board.getEmptySquares()).toStrictEqual([1, 2, 3, 4, 6, 7, 8]);
  });
});

describe("getWinner", () => {
  let board;
  it("should find a winner", function() {
    board = new Board([1, 1, 1, 2, 2, 1, 2, 1, 2]);
    expect(board.getWinner()).toBe(1);

    board = new Board([null, 2, 2, 1, 1, 1, null, 2, 2]);
    expect(board.getWinner()).toBe(1);

    board = new Board([1, 2, 2, 2, 1, 2, 1, 1, 1]);
    expect(board.getWinner()).toBe(1);

    board = new Board([1, 2, 2, 1, 2, 2, 1, 1, null]);
    expect(board.getWinner()).toBe(1);

    board = new Board([2, 1, 2, null, 1, 2, null, 1, null]);
    expect(board.getWinner()).toBe(1);

    board = new Board([2, 2, 1, null, 2, 1, null, null, 1]);
    expect(board.getWinner()).toBe(1);

    board = new Board([1, 2, 1, 2, 1, 2, 1, null, 1]);
    expect(board.getWinner()).toBe(1);

    board = new Board([2, 2, 1, null, 1, 2, 1, null, null]);
    expect(board.getWinner()).toBe(1);
  });

  it("should show when player 2 wins correctly", function() {
    board = new Board([2, 2, 2, null, 1, 1, null, 1, 1]);
    expect(board.getWinner()).toBe(2);

    board = new Board([null, 1, 1, 2, 2, 2, null, 1, 1]);
    expect(board.getWinner()).toBe(2);

    board = new Board([null, 1, 1, null, 1, 1, 2, 2, 2]);
    expect(board.getWinner()).toBe(2);

    board = new Board([2, 1, null, 2, null, 1, 2, 1, null]);
    expect(board.getWinner()).toBe(2);

    board = new Board([1, 2, 1, null, 2, 1, null, 2, null]);
    expect(board.getWinner()).toBe(2);

    board = new Board([1, 1, 2, 1, 1, 2, null, null, 2]);
    expect(board.getWinner()).toBe(2);

    board = new Board([2, 1, 1, 2, 2, 1, 1, null, 2]);
    expect(board.getWinner()).toBe(2);

    board = new Board([1, 1, 2, null, 2, 1, 2, null, null]);
    expect(board.getWinner()).toBe(2);
  });

  it("should correctly identify when the game draws", function() {
    board = new Board([1, 1, 2, 2, 2, 1, 1, 2, 1]);
    expect(board.getWinner()).toBe(DRAW);

    board = new Board([1, 2, 2, 2, 1, 1, 1, 2, 2]);
    expect(board.getWinner()).toBe(DRAW);
  });

  it("should not show draw when one of the players wins", function() {
    board = new Board([1, 2, 1, 2, 1, 1, 1, 2, 2]);
    expect(board.getWinner()).not.toBe(DRAW);
  });
  it("should not show draw when game is still in process", function() {
    board = new Board([1, 2, 1, 2, 1, 1, 1, null, 2]);
    expect(board.getWinner()).not.toBe(DRAW);
  });

  it("should correctly identify when the game is still in progress", function() {
    board = new Board([1, null, 1, 2, null, 1, 1, null, 2]);
    expect(board.getWinner()).toBe(null);

    board = new Board([1, 2, 1, 2, 1, 1, null, 1, 2]);
    expect(board.getWinner()).toBe(null);
  });
});

describe("makeMove", () => {
  let board;
  it("should put correct player into correct square", function() {
    board = new Board();
    board.makeMove(1, PLAYER_X);
    expect(board.grid[1]).toBe(PLAYER_X);
    board.makeMove(3, PLAYER_O);
    expect(board.grid[3]).toBe(PLAYER_O);
    // Check that other board methods work correct as well
    expect(board.getEmptySquares()).toStrictEqual([0, 2, 4, 5, 6, 7, 8]);
    expect(board.getWinner()).toBe(null);
  });

  it("should not make a move is a square is not empty", function() {
    board = new Board();
    board.makeMove(1, PLAYER_X);
    expect(board.grid[1]).toBe(PLAYER_X);
    board.makeMove(1, PLAYER_O);
    expect(board.grid[1]).toBe(PLAYER_X);
  });
});

describe("clone", function() {
  let board;
  it("should make a copy of the board", function() {
    board = new Board([1, null, null, null, null, null, null, null, null]);
    const copy = board.clone();

    expect(JSON.stringify(board)).toBe(JSON.stringify(copy));
  });

  it("the original board should not be affected by changes to copy", function() {
    board = new Board([1, null, null, null, null, null, null, null, null]);
    const copy = board.clone();
    copy.makeMove(2, PLAYER_O);
    expect(board.grid).not.toStrictEqual(copy.grid);
    expect(board.grid).toStrictEqual([
      1,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]);
  });
});
