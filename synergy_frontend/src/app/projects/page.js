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
      const token = localStorage.getItem("token"); // Get stored token
      if (!token) {
        console.error("No token found, cannot fetch projects.");
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch("http://localhost:5000/project/dashboard", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send auth token
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
    router.push(`/project/display/${project.project_id}`);
  };

  const toggleProjectStatus = (project) => {
    const newStatus = project.status === "ongoing" ? "paused" : "ongoing";

    fetch("/project/change-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: project.project_id, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects((prev) =>
            prev.map((p) =>
              p.project_id === project.project_id ? { ...p, status: newStatus } : p
            )
          );
        }
      })
      .catch(() => alert("Failed to update project status"));
  };

  return (
    <div className="flex text-black">
      <Sidebar activePage="projects" />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Projects</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            + Create New Project
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* ✅ Display ongoing projects */}
            <h3 className="mt-8 text-2xl font-semibold">Ongoing Projects</h3>
            <div className="grid grid-cols-2 gap-6 mt-4">
              {projects
                .filter((p) => p.status !== "completed")
                .map((project) => (
                  <div
                    key={project.project_id}
                    className="p-4 bg-green-50 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-green-100"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div>
                      <h4 className="text-lg font-semibold">{project.project_name}</h4>
                      <p className="text-sm text-gray-600">Deadline: {project.deadline}</p>
                      <p className="text-sm text-red-500">Project Status: {project.status}</p>
                    </div>
                    <button onClick={() => toggleProjectStatus(project)}>
                      {project.status === "ongoing" ? "Pause" : "Start"}
                    </button>
                  </div>
                ))}
            </div>

            {/* ✅ Display completed projects */}
            <h3 className="mt-8 text-2xl font-semibold">Completed Projects</h3>
            <div className="grid grid-cols-3 gap-6 mt-4">
              {projects
                .filter((p) => p.status === "completed")
                .map((project) => (
                  <div
                    key={project.project_id}
                    className="p-4 bg-green-100 rounded-lg shadow-md text-center"
                  >
                    <h4 className="text-lg font-semibold">{project.project_name}</h4>
                    <p className="text-sm text-gray-600">
                      Project Completed on {project.deadline}
                    </p>
                    <p className="text-sm text-green-600">Project Status: {project.status || "Paid"}</p>
                    <button className="mt-2 bg-white text-green-600 border border-green-600 px-4 py-2 rounded-lg">
                      Download Invoice
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      {showForm && <ProjectForm onClose={() => setShowForm(false)} setProjects={setProjects} />}
    </div>
  );
}
