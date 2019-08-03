import { SCORES } from "./constants";
import { switchPlayer } from "./utils";

export const minimax = (board, player) => {
  const mult = SCORES[String(player)];
  let thisScore;
  let maxScore = -1;
  let bestMove = null;

  if (board.getWinner() !== null) {
    return [SCORES[board.getWinner()], 0];
  } else {
    for (let empty of board.getEmptySquares()) {
      let copy = board.clone();
      copy.makeMove(empty, player);
      thisScore = mult * minimax(copy, switchPlayer(player))[0];

      if (thisScore >= maxScore) {
        maxScore = thisScore;
        bestMove = empty;
      }
    }

    return [mult * maxScore, bestMove];
  }
};
