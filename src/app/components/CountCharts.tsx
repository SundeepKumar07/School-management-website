"use client";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";


const CountChart = ({boys, girls}: {boys: number, girls: number}) => {
  const data = [
    { name: "Total", uv: boys+girls, fill: 'white' },
    { name: "Boys", uv: boys, fill: "#3498db" },
    { name: "Girls", uv: girls, fill: "#07bc0c" },
  ];
  return (
    <div className="h-full w-full pt-5">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="90%"
          barSize={27}
          data={data}
        >
          <RadialBar
            label={{ position: "insideStart", fill: "#fff" }}
            background
            dataKey="uv"
            isAnimationActive={true} // Recharts built-in animation
          />
        </RadialBarChart>
      </ResponsiveContainer>
      </div>
  );
};

export default CountChart;
