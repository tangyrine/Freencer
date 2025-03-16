"use client";
import { useRouter } from "next/navigation";

export default function ProjectList({ projects, onMarkAsCompleted }) {
  const router = useRouter();
  const ongoingProjects = projects.filter((p) => p.status !== "completed");
  const completedProjects = projects.filter((p) => p.status === "completed");
  console.log("Projects Data:", ongoingProjects);

  const handleProjectClick = (project) => {
    // Navigate to project details
    router.push(`/project/display/${project.project_id}`);
    console.log("Navigating to:", `/project/display/${project.project_id}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Ongoing Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        {ongoingProjects.map((project, index) => (
          <div
            key={project.project_id || index}
            className="bg-green-100 p-4 rounded-lg shadow cursor-pointer"
            onClick={() => handleProjectClick(project)}
          >
            <h3 className="font-bold">
              {project.project_name || "Unnamed Project"}
            </h3>
            <p>Deadline: {project.deadline}</p>
            <p>Project Status: {project.status || "Unpaid"}</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the button
                onMarkAsCompleted(project.project_id);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Mark as Completed
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-6">Completed Projects</h2>
      <div className="grid grid-cols-3 gap-4">
        {completedProjects.map((project, index) => (
          <div
            key={project.project_id || index}
            className="bg-blue-100 p-4 rounded-lg shadow cursor-pointer"
            onClick={() => handleProjectClick(project)}
          >
            <h3 className="font-bold">
              {project.project_name || "Unnamed Project"}
            </h3>
            <p>
              Project Completed on:{" "}
              {project.completion_date || project.deadline}
            </p>
            <p>Project Status: {project.status || "Paid"}</p>
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Download Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
