export default function ProjectList({ projects, markAsCompleted }) {
  const ongoingProjects = projects.filter((p) => p.status !== "completed");
  const completedProjects = projects.filter((p) => p.status === "completed");
  console.log("Projects Data:", ongoingProjects);

  return (
    <div>
      <h2 className="text-xl font-bold">Ongoing Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        {ongoingProjects.map((project, index) => (  // CHANGED: Added 'index' fallback
          <div key={project.id || index} className="bg-green-100 p-4 rounded-lg shadow">
<h3 className="font-bold">{project.project_name ? project.project_name : "Unnamed Project"}</h3>
            <p>Deadline: {project.deadline}</p>
            <p>Project Status: {project.status || "Unpaid"}</p>
            <button
              onClick={() => markAsCompleted(project.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Mark as Completed
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-6">Completed Projects</h2>
      <div className="grid grid-cols-3 gap-4">
        {completedProjects.map((project, index) => (  // CHANGED: Added 'index' fallback
          <div key={project.id || index} className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="font-bold">{project.name}</h3>
            <p>Project Completed on: {project.completedDate}</p>
            <p>Project Status: {project.status || "Paid"}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
              Download Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const markAsCompleted = async (projectId) => {
  try {
    const response = await fetch(`/project/change-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to mark project as completed");
    }

    const updatedProject = await response.json();
    console.log("Project marked as completed:", updatedProject);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to mark project as completed");
  }
};
