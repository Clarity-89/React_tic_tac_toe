import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TicTacToe from "../TicTacToe";
import { PLAYER_O, PLAYER_X } from "../constants";

afterEach(cleanup);

it("should render board with correct number of squares", () => {
  // Render the game component
  const { getAllByTestId, getByText } = render(<TicTacToe />);
  // Click 'X' to start game as player X
  fireEvent.click(getByText("X"));
  // Check that the correct number of squares is rendered
  expect(getAllByTestId(/square/).length).toEqual(9);
});

it("should register and display result of human player's move", async () => {
  const { getByTestId, getByText } = render(<TicTacToe />);
  fireEvent.click(getByText("X"));

  // Click the first square
  fireEvent.click(getByTestId("square_0"));

  // Validate that it has 'X' rendered
  expect(getByTestId("square_0")).toHaveTextContent("X");
  // Wait for computer move
  await waitForElement(() => getByText("O"));
  // Check that we have O in the DOM
  expect(getByText("O")).toBeInTheDocument();
});

it("should not make a move if the square is not empty", () => {
  const { getByTestId, getByText } = render(
    <TicTacToe
      squares={[PLAYER_X, null, PLAYER_O, null, null, null, null, null, null]}
    />
  );
  fireEvent.click(getByText("X"));

  // Click non-empty square
  fireEvent.click(getByTestId("square_2"));

  expect(getByTestId("square_2")).toHaveTextContent("O");
});

it("should correctly show Player X as a winner", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, null,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, null,     PLAYER_O
  ];
  const { getByTestId, getByText } = render(<TicTacToe squares={grid} />);
  fireEvent.click(getByText("X"));

  // Make the winning move
  fireEvent.click(getByTestId("square_2"));

  // Wait for result modal to appear
  await waitForElement(() => getByText("Start over"));

  // Check that result is declared properly
  expect(getByText("Player X wins!")).toBeInTheDocument();
});

it("should correctly display the draw result", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, PLAYER_O,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, PLAYER_X, PLAYER_O
  ];
  const { getByTestId, getByText } = render(<TicTacToe squares={grid} />);
  fireEvent.click(getByText("X"));

  // Make the final move
  fireEvent.click(getByTestId("square_5"));

  // Wait for result modal to appear
  await waitForElement(() => getByText("Start over"));

  // Check that result is declared properly
  expect(getByText("It's a draw")).toBeInTheDocument();
});

it("should correctly show Player O as a winner", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null,     PLAYER_O,
    PLAYER_X, PLAYER_O, PLAYER_X,
    null,     PLAYER_X, null
  ];
  const { getByTestId, getByText } = render(<TicTacToe squares={grid} />);
  fireEvent.click(getByText("X"));

  // Make the move
  fireEvent.click(getByTestId("square_6"));

  // Wait for result modal to appear
  await waitForElement(() => getByText("Start over"));

  // Check that result is declared properly
  expect(getByText("Player O wins!")).toBeInTheDocument();
});

it("should start a new game after 'Start over' button is pressed", async () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null,     PLAYER_O,
    PLAYER_X, PLAYER_O, null,
    null,     PLAYER_X, PLAYER_X
  ];
  const { getByTestId, getByText } = render(<TicTacToe squares={grid} />);
  fireEvent.click(getByText("X"));

  // Make the winning move
  fireEvent.click(getByTestId("square_6"));

  await waitForElement(() => getByText("Start over"));
  fireEvent.click(getByText("Start over"));

  await waitForElement(() => getByText("Choose your player"));
  expect(getByText("Choose your player")).toBeInTheDocument();
});
