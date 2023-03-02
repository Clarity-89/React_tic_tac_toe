import { PLAYER_O, PLAYER_X } from "./constants";

export const switchPlayer = (player: number) => {
  return player === PLAYER_X ? PLAYER_O : PLAYER_X;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
