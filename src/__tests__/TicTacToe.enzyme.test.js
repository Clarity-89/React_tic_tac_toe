import React from "react";
import { mount } from "enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import TicTacToe from "../TicTacToe";
import { PLAYER_O, PLAYER_X } from "../constants";
import { fireEvent, render, waitForElement } from "@testing-library/react";

configure({ adapter: new Adapter() });

it("should render board with correct number of squares", () => {
  // Render the game component
  const wrapper = mount(<TicTacToe />);

  // Find the 'X' button
  const buttonX = wrapper.findWhere(
    component => component.name() === "button" && component.text() === "X"
  );

  // Press it
  buttonX.simulate("click");

  // Check that board is rendered
  expect(wrapper.find("Square").length).toBe(9);
  //expect(wrapper.find('div[data-testid^="square"]').length).toBe(9);
});

it("should register and display result of human player's move", async () => {
  // Render the game component
  const wrapper = mount(<TicTacToe />);
});
