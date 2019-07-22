import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Board from "../Board";

afterEach(cleanup);

it("should render board with correct number of squares according to the dimensions", () => {
  const { getAllByTestId } = render(<Board dims={4} />);
  expect(getAllByTestId("square").length).toEqual(16);
});
