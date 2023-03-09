import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import TicTacToe from "../TicTacToe";
import { PLAYER_O, PLAYER_X } from "../constants";

// setup userEvent
function setup(jsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

it("should render board with correct number of squares", async () => {
  // Render the game component
  const { user } = setup(<TicTacToe />);
  // Click 'X' to start game as player X
  await user.click(screen.getByText("X"));
  // Check that the correct number of squares is rendered
  expect(screen.getAllByTestId(/square/)).toHaveLength(9);
});

it("should register and display result of human player's move", async () => {
  const { user } = setup(<TicTacToe />);
  await user.click(screen.getByText("X"));

  // Click the first square
  await user.click(screen.getByTestId("square_0"));

  // Validate that it has 'X' rendered
  expect(screen.getByTestId("square_0")).toHaveTextContent("X");

  // Check that we have O in the DOM
  expect(await screen.findByText("O")).toBeInTheDocument();
});

it("should not make a move if the square is not empty", async () => {
  const { user } = setup(
    <TicTacToe
      squares={[PLAYER_X, null, PLAYER_O, null, null, null, null, null, null]}
    />
  );
  await user.click(screen.getByText("X"));

  // Click non-empty square
  await user.click(screen.getByTestId("square_2"));

  expect(screen.getByTestId("square_2")).toHaveTextContent("O");
});

it("should correctly show Player X as a winner", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, null,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, null,     PLAYER_O
  ];
  const { user } = setup(<TicTacToe squares={grid} />);
  await user.click(screen.getByText("X"));

  // Make the winning move
  await user.click(screen.getByTestId("square_2"));

  // Check that result is declared properly
  expect(await screen.findByText("Player X wins!")).toBeInTheDocument();
});

it("should correctly display the draw result", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, PLAYER_O,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, PLAYER_X, PLAYER_O
  ];
  const { user } = setup(<TicTacToe squares={grid} />);
  await user.click(screen.getByText("X"));

  // Make the final move
  await user.click(screen.getByTestId("square_5"));

  // Check that result is declared properly
  expect(await screen.findByText("It's a draw")).toBeInTheDocument();
});

it("should correctly show Player O as a winner", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null,     PLAYER_O,
    PLAYER_X, PLAYER_O, PLAYER_X,
    null,     PLAYER_X, null
  ];
  const { user } = setup(<TicTacToe squares={grid} />);
  await user.click(screen.getByText("X"));

  // Make the move
  await user.click(screen.getByTestId("square_6"));

  // Check that result is declared properly
  expect(await screen.findByText("Player O wins!")).toBeInTheDocument();
});

it("should start a new game after 'Start over' button is pressed", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null,     PLAYER_O,
    PLAYER_X, PLAYER_O, null,
    null,     PLAYER_X, PLAYER_X
  ];
  const { user } = setup(<TicTacToe squares={grid} />);
  await user.click(screen.getByText("X"));

  // Make the winning move
  await user.click(screen.getByTestId("square_6"));
  await user.click(await screen.findByText("Start over"));

  expect(await screen.findByText("Choose your player")).toBeInTheDocument();
});
