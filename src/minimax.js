import { SCORES } from "./constants";
import { switchPlayer } from "./utils";

export const minimax = (board, player) => {
  const mult = SCORES[String(player)];
  const empty = board.getEmptySquares();
  const l = empty.length;
  let thisScore;
  let maxScore = -1;
  let bestMove = null;

  if (board.getWinner() !== null) {
    return [SCORES[board.getWinner()], 0];
  } else {
    for (let i = 0; i < l; i++) {
      let copy = board.clone();
      copy.makeMove(empty[i], player);
      thisScore = mult * minimax(copy, switchPlayer(player))[0];

      if (thisScore >= maxScore) {
        maxScore = thisScore;
        bestMove = empty[i];
      }
    }

    return [mult * maxScore, bestMove];
  }
};
