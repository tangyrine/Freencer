"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {jwtDecode} from "jwt-decode"; // Make sure to install this package

export default function CalendarComponent() {
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          window.location.href = "/login";
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id; // Extract user_id from JWT

        const response = await fetch(`http://localhost:5000/project/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();

        if (!Array.isArray(data.projects)) {
          console.error("Invalid response format:", data);
          return;
        }

        const formattedDeadlines = data.projects
          .filter(project => project.deadline) // Ensure deadline exists
          .map(project => ({
            date: new Date(project.deadline),
            name: project.name,
          }));

        setDeadlines(formattedDeadlines);
      } catch (error) {
        console.error("Error fetching deadlines:", error);
      }
    }

    fetchDeadlines();
  }, []);

  // Highlight dates with deadlines
  const tileClassName = ({ date }) => {
    return deadlines.some(d => d.date.toDateString() === date.toDateString())
      ? "bg-red-200 rounded-full text-white font-bold" // Mark deadlines in red
      : "";
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-2">My Deadlines</h2>
      <Calendar tileClassName={tileClassName} />
    </div>
  );
}
