import { minimax } from "../minimax";
import Board from "../Board";
import { PLAYER_O, PLAYER_X } from "../constants";

let board;
it("should correctly identify the best move", function() {
  board = new Board([
    null,
    PLAYER_O,
    null,
    null,
    PLAYER_X,
    null,
    PLAYER_X,
    PLAYER_X,
    PLAYER_O
  ]);
  expect(minimax(board, PLAYER_O)[1]).toBe(2);
  board = new Board([
    PLAYER_X,
    null,
    null,
    null,
    PLAYER_O,
    PLAYER_X,
    PLAYER_O,
    PLAYER_X,
    PLAYER_O
  ]);
  expect(minimax(board, PLAYER_O)[1]).toBe(2);
  board = new Board([
    PLAYER_O,
    null,
    null,
    null,
    PLAYER_X,
    PLAYER_X,
    null,
    PLAYER_O,
    PLAYER_X
  ]);
  expect(minimax(board, PLAYER_X)[1]).toBe(6);
});
