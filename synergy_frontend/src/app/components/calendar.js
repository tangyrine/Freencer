"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarComponent() {
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        const response = await fetch("/api/projects"); // Modify this endpoint as needed
        const data = await response.json();
    
        const formattedDeadlines = data.map(project => ({
          date: new Date(project.deadline), // Ensure deadline is in a valid date format
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
