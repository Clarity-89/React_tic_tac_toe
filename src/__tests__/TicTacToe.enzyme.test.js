import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import TicTacToe from "../TicTacToe";
import { PLAYER_O, PLAYER_X } from "../constants";

configure({ adapter: new Adapter() });

// Helper function to get button by a text
const findButtonByText = (wrapper, text) => {
  return wrapper.findWhere(
    component => component.name() === "button" && component.text() === text
  );
};

beforeEach(() => {
  jest.useFakeTimers();
});

it("should render board with correct number of squares", () => {
  // Render the game component
  const wrapper = mount(<TicTacToe />);

  // Find the 'X' button
  const buttonX = findButtonByText(wrapper, "X");

  // Press it
  buttonX.simulate("click");

  // Check that board is rendered
  expect(wrapper.find("Square").length).toBe(9);
});

it("should register and display result of human player's move", async () => {
  // Render the game component
  const wrapper = mount(<TicTacToe />);
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  const firstSquare = wrapper.find("Square").at(0);

  // Click the first square
  firstSquare.simulate("click");

  // Validate that it has 'X' rendered
  expect(firstSquare.text()).toBe("X");
});

it("should not make a move if the square is not empty", () => {
  const wrapper = mount(
    <TicTacToe
      squares={[PLAYER_X, null, PLAYER_O, null, null, null, null, null, null]}
    />
  );
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  // Get non-empty square
  const nonEmptySquare = wrapper.find("Square").at(2);

  // Click it
  nonEmptySquare.simulate("click");

  // Check that text content stays the same
  expect(nonEmptySquare.text()).toBe("O");
});

it("should correctly show Player X as a winner", () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, null,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, null,     PLAYER_O
  ];
  const wrapper = mount(<TicTacToe squares={grid} />);
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  // Make the winning move
  wrapper
    .find("Square")
    .at(2)
    .simulate("click");

  // Wait for result modal to appear
  act(() => {
    jest.runAllTimers();
  });
  wrapper.update();

  // Check that result is declared properly
  expect(wrapper.find("ModalContent").text()).toBe("Player X wins!");
});

it("should correctly display the draw result", () => {
  // prettier-ignore
  const grid = [
    PLAYER_X, PLAYER_X, PLAYER_O,
    PLAYER_O, PLAYER_O, null,
    PLAYER_X, PLAYER_X, PLAYER_O
  ];
  const wrapper = mount(<TicTacToe squares={grid} />);
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  // Make the final move
  wrapper
    .find("Square")
    .at(5)
    .simulate("click");

  // Wait for result modal to appear
  act(() => {
    jest.runAllTimers();
  });
  wrapper.update();

  // Check that result is declared properly
  expect(wrapper.find("ModalContent").text()).toBe("It's a draw");
});

it("should correctly show Player O as a winner", () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null,     PLAYER_O,
    PLAYER_X, PLAYER_O, PLAYER_X,
    null,     PLAYER_X, null
  ];
  const wrapper = mount(<TicTacToe squares={grid} />);
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  // Make the move
  wrapper
    .find("Square")
    .at(6)
    .simulate("click");

  // Wait for the computer move
  act(() => {
    jest.runAllTimers();
  });

  wrapper.update();

  // Check that result is declared properly
  expect(wrapper.find("ModalContent").text()).toBe("Player O wins!");
});

it("should start a new game after 'Start over' button is pressed", () => {
  // prettier-ignore
  const grid = [
    PLAYER_O, null,     PLAYER_O,
    PLAYER_X, PLAYER_O, null,
    null,     PLAYER_X, PLAYER_X
  ];
  const wrapper = mount(<TicTacToe squares={grid} />);
  const buttonX = findButtonByText(wrapper, "X");
  buttonX.simulate("click");

  // Make the winning move
  wrapper
    .find("Square")
    .at(6)
    .simulate("click");

  act(() => {
    jest.runAllTimers();
  });

  // Re-render component
  wrapper.update();

  // Get restart button and click it
  const restartButton = findButtonByText(wrapper, "Start over");
  restartButton.simulate("click");

  // Verify that new game screen is shown
  const choosePlayer = wrapper.findWhere(
    component =>
      component.name() === "p" && component.text() === "Choose your player"
  );
  expect(choosePlayer.length).toBe(1);
});
