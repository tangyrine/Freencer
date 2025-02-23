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
    if (projectId) {
      fetch(`/api/project/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_id: projectId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.project) {
            setProject(data.project);
            setIsRunning(data.project.status === "ongoing");
          } else {
            setError("Project not found");
          }
        })
        .catch(() => setError("Failed to fetch project details"))
        .finally(() => setLoading(false));
    }
  }, [projectId]);
  

  const handleProjectClick = (project) => {
    router.push(`/project-details/${project.project_id}`);
  };

  const toggleProjectStatus = () => {
    const newStatus = isRunning ? "pause" : "start";
    fetch(`/api/project/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_id: projectId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.project) {
          setIsRunning(data.project.status === "ongoing");
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
                      <h4 className="text-lg font-semibold">
                        {project.project_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Deadline: {project.deadline}
                      </p>
                      <p className="text-sm text-red-500">
                        Payment Status: {project.status}
                      </p>
                    </div>
                    <button 
  className={`mt-4 px-6 py-3 rounded-lg font-semibold ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
  onClick={toggleProjectStatus}
>
  {isRunning ? "Pause" : "Start"}
</button>

                  </div>
                ))}
            </div>

            <h3 className="mt-8 text-2xl font-semibold">Completed Projects</h3>
            <div className="grid grid-cols-3 gap-6 mt-4">
              {projects
                .filter((p) => p.status === "completed")
                .map((project) => (
                  <div
                    key={project.project_id}
                    className="p-4 bg-green-100 rounded-lg shadow-md text-center"
                  >
                    <h4 className="text-lg font-semibold">
                      {project.project_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Project Completed on {project.deadline}
                    </p>
                    <p className="text-sm text-green-600">
                      Payment Status: Paid
                    </p>
                    <button className="mt-2 bg-white text-green-600 border border-green-600 px-4 py-2 rounded-lg">
                      Download Invoice
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      {showForm && (
        <ProjectForm onClose={() => setShowForm(false)} setProjects={setProjects} />
      )}
    </div>
  );
}
