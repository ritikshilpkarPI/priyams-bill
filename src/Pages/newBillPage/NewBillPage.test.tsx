import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import NewBillPage from "./NewBillPage"; // Ensure this path is correct
import "@testing-library/jest-dom";

jest.useFakeTimers();

describe("Search Component", () => {
  it("renders the input field", () => {
    render(<NewBillPage />);
    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeDefined();
  });
  
});