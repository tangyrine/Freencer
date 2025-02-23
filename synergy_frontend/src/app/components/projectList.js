export default function ProjectList({ projects, markAsCompleted }) {
  const ongoingProjects = projects.filter((p) => p.status !== "Completed");
  const completedProjects = projects.filter((p) => p.status === "Completed");

  return (
    <div>
      <h2 className="text-xl font-bold">Ongoing Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        {ongoingProjects.map((project) => (
          <div key={project.id} className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="font-bold">{project.name}</h3>
            <p>Progress: {project.progress || 0}% done</p>
            <p>Deadline: {project.deadline}</p>
            <p>Payment Status: {project.paymentStatus || "Unpaid"}</p>
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
        {completedProjects.map((project) => (
          <div key={project.id} className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="font-bold">{project.name}</h3>
            <p>Project Completed on: {project.completedDate}</p>
            <p>Payment Status: {project.paymentStatus || "Paid"}</p>
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
    const response = await fetch(`/api/projects/${projectId}/complete`, {
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
