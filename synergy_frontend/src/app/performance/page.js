"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

export default function PerformancePage() {
  const [growthData, setGrowthData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [aiInsights, setAiInsights] = useState({
    projectInsights: "Loading AI insights...",
    growthAreas: "Analyzing areas of improvement...",
  });

  useEffect(() => {
    setGrowthData([
      { name: "Week 1", value: 40 },
      { name: "Week 2", value: 30 },
      { name: "Week 3", value: 35 },
      { name: "Week 4", value: 50 },
    ]);

    setPerformanceData([
      { name: "Pellentesque", value: 45, color: "#9370DB" },
      { name: "Sed", value: 25, color: "#FFD700" },
      { name: "LIT", value: 19, color: "#000000" },
      { name: "Facilisi", value: 11, color: "#FF4500" },
      { name: "Diam", value: 3, color: "#4682B4" },
    ]);

    setTimeout(() => {
      setAiInsights({
        projectInsights:
          "Your projects are trending upwards with a 15% increase in engagement.",
        growthAreas:
          "Improving response times in tasks could boost efficiency by 10%.",
      });
    }, 2000);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 via-purple-200 to-indigo-300 text-black">
      <Sidebar activePage="performance" />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Performance Dashboard
        </h1>

        {/* Growth Chart */}
        <div className="mt-6 bg-gradient-to-t from-green-100 to-green-200 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-600 mb-4">
            My Growth Chart
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="flex flex-wrap mt-8 gap-6">
          <div className="w-full sm:w-1/2 bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-blue-700">
              Project Insights
            </h3>
            <p className="mt-2 text-gray-700">{aiInsights.projectInsights}</p>
          </div>
          <div className="w-full sm:w-1/2 bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-yellow-700">
              Growth or Things to Improve
            </h3>
            <p className="mt-2 text-gray-700">{aiInsights.growthAreas}</p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="mt-6 bg-gradient-to-t from-gray-100 to-gray-200 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Performance Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60}
                paddingAngle={5}
                label
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="top" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
