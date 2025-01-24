import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export const LineGraph: React.FC<LineGraphProps> = ({ data, width, height }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const date = data.map((d) => d.date);

    const x = d3
      .scalePoint<string>()
      .domain(date)
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.value) || 0,
        d3.max(data, (d) => d.value) || 0
      ])
      .nice()
      .range([height - marginBottom, marginTop]);

    const line = d3
      .line<SampleData>()
      .x((d) => x(d.date) as number)
      .y((d) => y(d.value) as number);

    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr(
        "style",
        "max-width: 100%; height: auto; font: 15px sans-serif; overflow: visible;"
      )
      .style("-webkit-tap-highlight-color", "transparent");

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    xAxis.selectAll("text").style("font-size", "15px");

    const yAxis = svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
      );

    yAxis.selectAll("text").style("font-size", "15px");

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line as any);

    const tooltip = svg.append("g").style("display", "none");

    tooltip.append("circle").attr("r", 4.5).attr("fill", "steelblue");

    const tooltipText = tooltip
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("fill", "black");

    svg.on("mousemove", function (event) {
      const [mx] = d3.pointer(event);
      const closestDateIndex = Math.round((mx - marginLeft) / (x.step() || 1));
      const closestDate = date[closestDateIndex];
      const datum = data.find((d) => d.date === closestDate);

      if (datum) {
        tooltip
          .style("display", null)
          .attr("transform", `translate(${x(datum.date)},${y(datum.value)})`);
        tooltipText.text(`${datum.date}: ${datum.value}`);
      }
    });

    svg.on("mouseleave", () => tooltip.style("display", "none"));
  }, [data, width, height]);

  return <div data-testid="graph-svg" ref={chartRef}></div>;
};