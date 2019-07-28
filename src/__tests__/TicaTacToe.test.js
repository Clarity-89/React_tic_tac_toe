import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TicTacToe from "../TicTacToe";

afterEach(cleanup);

it("should render board with correct number of squares", () => {
  const { getAllByTestId, getByText } = render(<TicTacToe />);
  fireEvent.click(getByText("X"));
  expect(getAllByTestId("square").length).toEqual(9);
});
