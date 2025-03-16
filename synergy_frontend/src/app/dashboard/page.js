"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const router = useRouter();

  // Mock data for charts
  const growthData = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 35 },
    { name: "Apr", value: 60 },
    { name: "May", value: 50 },
    { name: "Jun", value: 75 },
  ];

  const pieData = [
    { name: "Completed", value: 45 },
    { name: "In Progress", value: 35 },
    { name: "Pending", value: 20 },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "deadline",
      message: "Project X deadline approaching in 2 days",
      date: "2024-03-20",
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received for Project Y",
      date: "2024-03-19",
    },
    {
      id: 3,
      type: "task",
      message: "New task assigned: Update UI Components",
      date: "2024-03-18",
    },
  ];

  // Mock calendar events
  const calendarEvents = {
    5: { type: "deadline", message: "Project Alpha Due" },
    10: { type: "meeting", message: "Client Meeting at 2 PM" },
    15: { type: "payment", message: "Payment Schedule for Project Beta" },
    20: { type: "task", message: "Start New Feature Development" },
    25: { type: "deadline", message: "Sprint Review" },
  };

  // Mock ongoing projects
  const ongoingProjects = [
    {
      id: 1,
      name: "E-commerce Website",
      progress: 75,
      deadline: "2024-04-15",
      status: "active",
    },
    {
      id: 2,
      name: "Mobile App Development",
      progress: 45,
      deadline: "2024-05-01",
      status: "active",
    },
    {
      id: 3,
      name: "Dashboard Redesign",
      progress: 30,
      deadline: "2024-04-20",
      status: "paused",
    },
  ];

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-white p-2 rounded-lg shadow-sm">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-black">
                  Growth Overview
                </h2>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: "black" }} />
                      <YAxis tick={{ fill: "black" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#22c55e"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Project Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-black">
                  Project Distribution
                </h2>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="text-sm text-black">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ongoing Projects */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-black">
                Ongoing Projects
              </h2>
              <div className="space-y-4">
                {ongoingProjects.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-black">{project.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-black mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-black">
                      Deadline:{" "}
                      {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-black">
                  {currentMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.setMonth(currentMonth.getMonth() - 1)
                        )
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.setMonth(currentMonth.getMonth() + 1)
                        )
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-7 text-center text-sm font-medium text-black">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className="py-2">
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => {
                    const hasEvent = day && calendarEvents[day];
                    const isToday =
                      day &&
                      new Date().getDate() === day &&
                      new Date().getMonth() === currentMonth.getMonth() &&
                      new Date().getFullYear() === currentMonth.getFullYear();

                    return (
                      <div
                        key={index}
                        onClick={() => day && handleDayClick(day)}
                        className={`
                          aspect-square flex items-center justify-center text-sm cursor-pointer
                          ${!day ? "" : "hover:bg-gray-100"}
                          ${hasEvent ? "relative" : ""}
                          ${isToday ? "bg-green-100 rounded-full" : ""}
                          ${
                            selectedDay === day
                              ? "bg-green-200 rounded-full"
                              : ""
                          }
                        `}
                      >
                        {day && (
                          <>
                            <span className="text-black">{day}</span>
                            {hasEvent && (
                              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-black">
                {selectedDay
                  ? `Events for ${selectedDay} ${currentMonth.toLocaleString(
                      "default",
                      { month: "long" }
                    )}`
                  : "Recent Notifications"}
              </h2>
              <div className="space-y-4">
                {selectedDay && calendarEvents[selectedDay] ? (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className={`p-2 rounded-full ${
                        calendarEvents[selectedDay].type === "deadline"
                          ? "bg-red-100"
                          : calendarEvents[selectedDay].type === "payment"
                          ? "bg-green-100"
                          : calendarEvents[selectedDay].type === "meeting"
                          ? "bg-blue-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-black">
                        {calendarEvents[selectedDay].message}
                      </p>
                      <p className="text-xs text-black mt-1">{`${selectedDay} ${currentMonth.toLocaleString(
                        "default",
                        { month: "long" }
                      )}`}</p>
                    </div>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          notification.type === "deadline"
                            ? "bg-red-100"
                            : notification.type === "payment"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <svg
                          className="w-4 h-4 text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-black">
                          {notification.message}
                        </p>
                        <p className="text-xs text-black mt-1">
                          {notification.date}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
