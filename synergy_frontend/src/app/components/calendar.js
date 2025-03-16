"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { jwtDecode } from "jwt-decode";

export default function CalendarComponent() {
  const [deadlines, setDeadlines] = useState([]);
  const [value, setValue] = useState(new Date());

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
        const userId = decodedToken.user_id;

        const response = await fetch(
          `http://localhost:5000/project/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();

        if (!Array.isArray(data.projects)) {
          console.error("Invalid response format:", data);
          return;
        }

        const formattedDeadlines = data.projects
          .filter((project) => project.deadline)
          .map((project) => ({
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
  const tileClassName = ({ date, view }) => {
    // Only apply to month view
    if (view !== "month") return null;

    // Check if the date has a deadline
    const hasDeadline = deadlines.some(
      (d) =>
        d.date.getDate() === date.getDate() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getFullYear() === date.getFullYear()
    );

    // Check if the date is today
    const isToday = date.toDateString() === new Date().toDateString();

    if (hasDeadline) return "bg-green-500 text-white rounded-full";
    if (isToday) return "bg-red-500 text-white rounded-full";
    return "";
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-medium mb-4">My schedule</h2>
      <div className="custom-calendar-container">
        <Calendar
          onChange={setValue}
          value={value}
          tileClassName={tileClassName}
          prevLabel={<span className="text-gray-500">&lt;</span>}
          nextLabel={<span className="text-gray-500">&gt;</span>}
          prev2Label={null}
          next2Label={null}
          minDetail="month"
          className="rounded-lg border-0 shadow-none"
        />
      </div>
      <style jsx global>{`
        /* Custom styling for the calendar */
        .custom-calendar-container .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }

        .custom-calendar-container .react-calendar__navigation {
          margin-bottom: 0.5rem;
          height: auto;
        }

        .custom-calendar-container .react-calendar__navigation button {
          min-width: 32px;
          background: none;
        }

        .custom-calendar-container
          .react-calendar__navigation
          button:enabled:hover,
        .custom-calendar-container
          .react-calendar__navigation
          button:enabled:focus {
          background-color: #f0f0f0;
          border-radius: 50%;
        }

        .custom-calendar-container .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75rem;
          color: #6b7280;
          padding-bottom: 0.25rem;
        }

        .custom-calendar-container
          .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
        }

        .custom-calendar-container
          .react-calendar__month-view__weekdays__weekday
          abbr {
          text-decoration: none;
        }

        .custom-calendar-container .react-calendar__tile {
          padding: 0.75rem 0.5rem;
          text-align: center;
          line-height: 1;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .custom-calendar-container .react-calendar__tile:enabled:hover,
        .custom-calendar-container .react-calendar__tile:enabled:focus {
          background-color: #f3f4f6;
          border-radius: 9999px;
        }

        .custom-calendar-container .react-calendar__tile--active {
          background-color: #3b82f6;
          color: white;
          border-radius: 9999px;
        }

        .custom-calendar-container .react-calendar__tile--active:enabled:hover,
        .custom-calendar-container .react-calendar__tile--active:enabled:focus {
          background-color: #2563eb;
        }

        .custom-calendar-container
          .react-calendar__month-view__days__day--weekend {
          color: #ef4444;
        }

        .custom-calendar-container
          .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
