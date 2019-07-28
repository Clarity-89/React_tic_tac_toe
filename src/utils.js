import { PLAYER_O, PLAYER_X } from "./constants";

export const switchPlayer = player => {
  return player === PLAYER_X ? PLAYER_O : PLAYER_X;
};
