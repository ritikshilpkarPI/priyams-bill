import React from "react";
import { render, screen } from "@testing-library/react";
import { GraphComponent } from "./GraphComponent"; 
import * as d3 from 'd3';

jest.mock('d3', () => ({
  max: jest.fn(), 
  scalePoint: jest.fn().mockReturnValue({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    step: jest.fn().mockReturnValue(50),
  }),
  scaleLinear: jest.fn().mockReturnValue({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    nice: jest.fn().mockReturnThis(),
  }),
  line: jest.fn().mockReturnValue({
    x: jest.fn().mockReturnThis(),
    y: jest.fn().mockReturnThis(),
  }),
  select: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(), 
    append: jest.fn().mockReturnThis(), 
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(), 
    call: jest.fn().mockReturnThis(), 
    on: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(), 
    datum: jest.fn().mockReturnThis(), 
  }),
  pointer: jest.fn().mockReturnValue([100]), 
  axisBottom: jest.fn().mockReturnThis(),
  axisLeft: jest.fn().mockReturnThis(),
}));

describe('GraphComponent', () => {
  const testData = [
    { date: 'Jan', value: 157.5 },
    { date: 'Feb', value: 165.0 },
    { date: 'Mar', value: 172.8 },
    { date: 'Apr', value: 168.2 },
    { date: 'May', value: 175.4 },
  ];
  const width = 300;
  const height = 200;

  it("renders an SVG element", () => {
    render(<GraphComponent data={testData} width={width} height={height} />);
    const svgElement = screen.getByTestId("graph-svg");
    expect(svgElement).toBeInTheDocument();
  });
});