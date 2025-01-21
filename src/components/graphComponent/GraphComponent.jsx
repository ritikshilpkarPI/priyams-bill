import React,{ useEffect, useRef } from "react";
import * as d3 from "d3";

export const GraphComponent = ({ data, width, height }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return; 

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent")
      .style("margin", "20px")
      .style("overflow", "visible");

    svg.selectAll("*").remove();

    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = new Date().getMonth();
    const monthsToDisplay = data.map((_, i) => {
      const monthIndex = (currentMonthIndex - (data.length - i) + 12) % 12;
      return allMonths[monthIndex];
    });

    const xScale = d3
      .scaleBand()
      .domain(monthsToDisplay)
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) 
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

   
    svg
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .attr("color", "#000");

  
    svg
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${margin.left}, 0)`)
      .attr("color", "#000");

  
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(monthsToDisplay[i]))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - margin.bottom - yScale(d))
      .attr("fill", "#0066CC");
  }, [data, width, height]);

  return <svg ref={svgRef} data-testid="graph-svg"></svg>;
};