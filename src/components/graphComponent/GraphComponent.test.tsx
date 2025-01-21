import React from "react";
import { render, screen } from "@testing-library/react";
import { GraphComponent } from "./GraphComponent"; 

describe("GraphComponent", () => {
  const testData = [50, 100, 150]; 
  const width = 300;
  const height = 200;

  it("renders an SVG element", () => {
    render(<GraphComponent data={testData} width={width} height={height} />);
    const svgElement = screen.getByTestId("graph-svg");
    expect(svgElement).toBeInTheDocument();
  });
});