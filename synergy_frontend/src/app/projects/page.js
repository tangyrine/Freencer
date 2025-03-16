"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import ProjectForm from "../components/projectForm";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot fetch projects.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/project/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("Fetched Projects:", data.projects);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    router.push(`/projects/pdetails?id=${project.project_id}`);
  };

  const toggleProjectStatus = async (e, project) => {
    e.stopPropagation(); // Prevent triggering the card click
    const newStatus = project.status === "ongoing" ? "paused" : "ongoing";

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/project/change-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: project.project_id,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.project_id === project.project_id
              ? { ...p, status: newStatus }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
      alert("Failed to update project status");
    }
  };

  // Calculate progress percentage (mock function - replace with actual logic)
  const getProgressPercentage = (project) => {
    // This is a placeholder - implement your actual progress calculation logic
    return project.progress || (Math.floor(Math.random() * 5) + 1) * 20; // Random 20%, 40%, etc.
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar activePage="projects" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
            <span>i</span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2 mb-8"
        >
          <span className="text-2xl">+</span> Create New Project
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading projects...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-medium mb-4">Ongoing Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {projects
                .filter((p) => p.status !== "completed")
                .map((project) => (
                  <div
                    key={project.project_id}
                    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{project.project_name}</h3>
                      <button
                        key={`status-btn-${project.project_id}`}
                        className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white"
                        onClick={(e) => toggleProjectStatus(e, project)}
                      >
                        <span>▶</span>
                      </button>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Progress: {getProgressPercentage(project)}% done
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${getProgressPercentage(project)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm mt-4">
                      <p>
                        Deadline:{" "}
                        {new Date(project.deadline).toLocaleDateString()}
                      </p>
                      <p>Payment Status: Unpaid</p>
                    </div>
                  </div>
                ))}
            </div>

            <h2 className="text-xl font-medium mb-4">Completed Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects
                .filter((p) => p.status === "completed")
                .map((project) => (
                  <div
                    key={project.project_id}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <h3 className="font-medium mb-2">{project.project_name}</h3>
                    <p
                      key={`completion-${project.project_id}`}
                      className="text-sm mb-1"
                    >
                      Project Completed on:{" "}
                      {new Date(
                        project.completion_date || project.deadline
                      ).toLocaleDateString()}
                    </p>
                    <p
                      key={`payment-${project.project_id}`}
                      className="text-sm mb-4"
                    >
                      Payment Status: Paid
                    </p>
                    <button
                      key={`invoice-btn-${project.project_id}`}
                      className="w-full border border-green-600 text-green-600 py-2 rounded text-sm hover:bg-green-50"
                    >
                      Download Invoice
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          setProjects={setProjects}
        />
      )}
    </div>
  );
}
