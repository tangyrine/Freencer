"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import Sidebar from "../components/sidebar";
import CalendarComponent from "../components/calendar";
import GrowthChart from "../components/growthChart";
import Notifications from "../components/notifications";
import ProjectList from "../components/projectList";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [reminders, setReminders] = useState([]); // Store notifications
  const [deadlines, setDeadlines] = useState([]); // Store deadlines
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // For project redirection

  useEffect(() => {
    async function getData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          window.location.href = "/login";
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id; // Extract user_id from JWT

        // Fetch projects
        const projectRes = await fetch("http://localhost:5000/project/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projectData = await projectRes.json();

        // Fetch reminders (Notifications from backend)
        const reminderRes = await fetch("http://localhost:5000/reminder/create", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reminderData = await reminderRes.json();

        // Extract deadlines from projects
        const userProjects = projectData.projects || [];
        const formattedDeadlines = userProjects
          .filter(project => project.user_id === userId && project.deadline) // Ensure project belongs to user and has a deadline
          .map(project => ({
            date: new Date(project.deadline), // Convert deadline to Date object
            name: project.name,
          }));

        setProjects(userProjects);
        setReminders(reminderData);
        setDeadlines(formattedDeadlines);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  /* AI INTEGRATION - Project Risk Analysis (Placeholder) */
  async function analyzeProjectRisk(project) {
    const aiPrediction = await fetch("https://ai-api.com/analyze", {
      method: "POST",
      body: JSON.stringify({ project }),
    });
    return aiPrediction.json();
  }

  // Function to handle project click (Navigate to project details)
  const handleProjectClick = (projectId) => {
    router.push(`/project/display`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : !Array.isArray(projects) ? (
          <div className="flex flex-col items-center justify-center h-[70vh] bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold text-red-600">Error Loading Projects</h2>
            <p className="text-red-500">Please try again later.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold">No Projects Added Yet</h2>
            <p>Let's add your first project!</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              + Create New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <GrowthChart />
              <ProjectList projects={projects} onProjectClick={handleProjectClick} />
            </div>
            <div>
              {/* Pass deadlines to CalendarComponent */}
              <CalendarComponent deadlines={deadlines} />
              <Notifications reminders={reminders} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
