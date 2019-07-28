import { minimax } from "../minimax";
import Board from "../Board";
import { PLAYER_O, PLAYER_X } from "../constants";

it("should correctly identify the best move", function() {
  const board = new Board([null, 2, null, null, 1, null, 1, 1, 2]);
  expect(minimax(board, PLAYER_O)[1]).toBe(2);
});
