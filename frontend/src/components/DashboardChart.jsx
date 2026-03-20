import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// Bar Chart
export const BarChart = ({ data }) => {
  return <Bar data={data} />;
};

// Doughnut Chart
export const DoughnutChart = ({ data }) => {
  return <Doughnut data={data} />;
};

// Line Chart
export const LineChart = ({ data }) => {
  return <Line data={data} />;
};