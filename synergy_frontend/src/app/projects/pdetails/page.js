"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";

export default function ProjectDetailsPage({ params }) {
  const router = useRouter();
  const projectId = params?.id;
  const userId = "yourUserId"; // Replace with actual user ID logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState({
    name: "",
    startDate: "", // ✅ Added to prevent undefined error
    dueDate: "",
    description: "",
    timeRemaining: "",
    attachments: "",
    requirements: "",
    tasks: [],
  });

  // ✅ Fetch Project Details
  useEffect(() => {
    if (userId) {
      fetch(`/project/display/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched project data:", data);
          setProject({
            name: data.name || "",
            startDate: data.startDate || "", // ✅ Ensuring startDate exists
            dueDate: data.dueDate || "",
            description: data.description || "",
            timeRemaining: data.timeRemaining || "",
            attachments: data.attachments || "",
            requirements: data.requirements || "",
            tasks: data.tasks || [],
          });
        })
        .catch((err) => console.error("Error fetching project:", err));
    }
  }, [userId]);

  // ✅ Validate & Update Project
  const updateProject = async () => {
    if (!project.name.trim() || !project.dueDate.trim()) {
      alert("Project Name and Deadline are required!");
      return;
    }

    console.log("Submitting project data:", project);

    const res = await fetch(`/project/edit/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    if (res.ok) {
      console.log("Project updated successfully!");
      setIsModalOpen(false);
    } else {
      console.error("Failed to update project");
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar activePage="projects" />
      <div className="flex-1 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button
            onClick={() => router.back()}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
        <div className="bg-white p-6 rounded shadow mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{project.name}</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-600">{project.description}</p>
        </div>
      </div>

      {/* Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-[600px]">
            <h3 className="text-xl font-bold mb-4">Edit Project Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-medium">Project Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-green-50"
                  value={project.name}
                  onChange={(e) =>
                    setProject({ ...project, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded bg-green-50"
                    value={project.startDate}
                    onChange={(e) =>
                      setProject({ ...project, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium">End Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded bg-green-50"
                    value={project.dueDate}
                    onChange={(e) =>
                      setProject({ ...project, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  className="w-full p-2 border rounded bg-green-50"
                  value={project.description}
                  onChange={(e) =>
                    setProject({ ...project, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block font-medium">
                  Estimated Work Time-span (hrs)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-green-50"
                  value={project.timeRemaining}
                  onChange={(e) =>
                    setProject({ ...project, timeRemaining: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-medium">
                  Repository Link (GitHub)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-green-50"
                  value={project.attachments}
                  onChange={(e) =>
                    setProject({ ...project, attachments: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-medium">Requirements</label>
                <textarea
                  className="w-full p-2 border rounded bg-green-50"
                  value={project.requirements}
                  onChange={(e) =>
                    setProject({ ...project, requirements: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            {/* Save & Cancel Icons */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={updateProject}
                className="text-green-600 text-2xl"
              >
                ✅
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-600 text-2xl"
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
