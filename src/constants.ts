//Board dimensions
export const DIMENSIONS = 3;
export const DRAW = 0;
export const PLAYER_X = 1;
export const PLAYER_O = 2;
export const SCORES: Record<string, number> = {
  1: 1,
  0: 0,
  2: -1,
};
export const SQUARE_DIMS = 100;
export const GAME_STATES = {
  notStarted: "not_started",
  inProgress: "in_progress",
  over: "over",
};

export const GAME_MODES: Record<string, string> = {
  easy: "easy",
  medium: "medium",
  difficult: "difficult",
};
