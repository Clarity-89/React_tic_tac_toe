import { SCORES } from "./constants";
import { switchPlayer } from "./utils";
import Board from "./Board";

export const minimax = (
  board: Board,
  player: number
): [number, number | null] => {
  const multiplier = SCORES[String(player)];
  let thisScore;
  let maxScore = -1;
  let bestMove = null;
  const winner = board.getWinner();
  if (winner !== null) {
    return [SCORES[winner], 0];
  } else {
    for (const square of board.getEmptySquares()) {
      let copy: Board = board.clone();
      copy.makeMove(square, player);
      thisScore = multiplier * minimax(copy, switchPlayer(player))[0];

      if (thisScore >= maxScore) {
        maxScore = thisScore;
        bestMove = square;
      }
    }

    return [multiplier * maxScore, bestMove];
  }
};
