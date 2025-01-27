import React, { useState } from "react";
import {
  Chart,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Colors,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import "../css/AdminGraph.css";

Chart.register(
  Tooltip,
  Legend,
  Colors,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

interface Wave {
  id: number;
  message: string;
  createdAt: string;
  image: string;
  first_name: string;
}

interface User {
  id: number;
  first_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  status: number;
}

interface GraphProps {
  users: User[];
  waves: Wave[];
}

const Graph: React.FC<GraphProps> = ({ users, waves }) => {
  const [chartType, setChartType] = useState<"pie" | "bar" | "line">("pie");

  const totalUsers = users.length;
  const totalActiveUsers = users.filter((user) => user.status === 1).length;
  const totalInactiveUsers = users.filter(
    (user) => user.status === 0
  ).length;
  const totalWaves = waves.length;

  const data = {
    labels: ["Total Users", "Active Users", "Inactive Users", "Total Waves"],
    datasets: [
      {
        label: "Statistics",
        data: [totalUsers, totalActiveUsers, totalInactiveUsers, totalWaves],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        borderWidth: 1,
      },
    },
  };
  
  const handleChartChange = (type: "pie" | "bar" | "line") => {
    setChartType(type);
  };

  return (
    <div className="chart-container">
      <div className="chart-heading">
        {/* Add heading or content here */}
      </div>

      <div className="chart-options">
        <button
          onClick={() => handleChartChange("pie")}
          className={chartType === "pie" ? "active" : ""}
        >
          Pie
        </button>
        <button
          onClick={() => handleChartChange("bar")}
          className={chartType === "bar" ? "active" : ""}
        >
          Bar
        </button>
        <button
          onClick={() => handleChartChange("line")}
          className={chartType === "line" ? "active" : ""}
        >
          Line
        </button>
      </div>

      <div className="chart">
        {chartType === "pie" && <Pie options={options} data={data} />}
        {chartType === "bar" && <Bar options={options} data={data} />}
        {chartType === "line" && <Line options={options} data={data} />}
      </div>
    </div>
  );
};

export default Graph;
