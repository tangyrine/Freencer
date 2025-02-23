"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
        projectInsights: "Your projects are trending upwards with a 15% increase in engagement.",
        growthAreas: "Improving response times in tasks could boost efficiency by 10%.",
      });
    }, 2000);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar activePage="performance" />
      <div className="flex-1 p-6 overflow-y-auto max-h-screen">
        <h1 className="text-3xl font-bold mb-4">Performance Dashboard</h1>
        
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">My Growth Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap mt-4 gap-4">
          <div className="w-full sm:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Project Insights</h3>
            <p className="mt-2">{aiInsights.projectInsights}</p>
          </div>
          <div className="w-full sm:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Growth or Things to Improve</h3>
            <p className="mt-2">{aiInsights.growthAreas}</p>
          </div>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={performanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
