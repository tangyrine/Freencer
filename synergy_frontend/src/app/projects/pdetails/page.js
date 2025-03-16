"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import InvoiceModal from "../../components/invoice";

// Static mock data
const mockProject = {
  project_id: "1",
  project_name: "Website Development",
  description:
    "Building a modern web application with Next.js and Tailwind CSS",
  status: "ongoing",
  start_date: "2024-02-01",
  deadline: "2024-04-01",
  payment_status: "Pending",
  requirements: "Responsive design, Modern UI/UX, Fast loading times",
  attachments: "https://github.com/project-repo",
  progress: 65,
  time_spent: 45,
  time_remaining: 15,
  tasks_completed: "2/3",
  tasks: [
    {
      id: 1,
      title: "Frontend Development",
      details: [
        "Setup Next.js",
        "Implement UI components",
        "Add responsive design",
      ],
      status: "Completed",
    },
    {
      id: 2,
      title: "Backend Integration",
      details: ["API development", "Database setup", "Authentication"],
      status: "In Progress",
    },
    {
      id: 3,
      title: "Testing & Deployment",
      details: ["Unit testing", "Integration testing", "Deploy to production"],
      status: "Pending",
    },
  ],
};

export default function ProjectDetailsPage({ searchParams }) {
  const router = useRouter();
  const projectId = searchParams?.id;
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [project, setProject] = useState(mockProject); // Using mock data
  const [loading, setLoading] = useState(false); // Set to false since we're using static data
  const [error, setError] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const toggleProjectStatus = async () => {
    const newStatus = project.status === "ongoing" ? "paused" : "ongoing";
    setProject((prev) => ({ ...prev, status: newStatus }));
  };

  const markTaskCompleted = (taskId) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, status: "Completed" } : task
      ),
    }));
  };

  const addTask = () => {
    alert("Add task functionality to be implemented");
  };

  const editTask = (taskId) => {
    alert(`Edit task ${taskId} functionality to be implemented`);
  };

  const endTask = (taskId) => {
    markTaskCompleted(taskId);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activePage="projects" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activePage="projects" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate completed tasks percentage
  const completedTasks = project.tasks
    ? project.tasks.filter((task) => task.status === "Completed").length
    : 0;
  const totalTasks = project.tasks ? project.tasks.length : 0;
  const completedTasksRatio =
    totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "0/0";

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar activePage="projects" />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/projects")}
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
              <span>i</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-medium">{project.project_name}</h2>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
            <button
              onClick={toggleProjectStatus}
              className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white"
            >
              <span>{project.status === "ongoing" ? "⏸" : "▶"}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div>
              <p className="font-medium">Start Date:</p>
              <p className="text-gray-600">
                {new Date(project.start_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium">Due Date:</p>
              <p className="text-gray-600">
                {new Date(project.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium">Payment Status:</p>
              <p className="text-gray-600">{project.payment_status}</p>
            </div>
            <div>
              <p className="font-medium">Requirements:</p>
              <p className="text-gray-600">{project.requirements}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-medium">Project Links/Attachments:</p>
            <div className="mt-2 p-4 bg-green-50 rounded-lg">
              {project.attachments ? (
                <a
                  href={project.attachments}
                  className="text-blue-600 hover:underline"
                >
                  {project.attachments}
                </a>
              ) : (
                <p className="text-gray-500">No attachments</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="font-medium mb-2">
              Progress: {project.progress}% done
            </p>
            <div className="w-full bg-blue-100 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 mb-1">Total Time Spent</p>
              <p className="text-xl font-semibold">
                {project.time_spent} Hours
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 mb-1">Time Remaining</p>
              <p className="text-xl font-semibold">
                {project.time_remaining} Hours
              </p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 mb-1">Tasks Completed</p>
              <p className="text-xl font-semibold">{completedTasksRatio}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">View All Tasks</h3>
            <button
              onClick={addTask}
              className="bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50"
            >
              Add Task
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${
                  task.status === "Completed" ? "bg-gray-50" : "bg-green-50"
                }`}
                onClick={() =>
                  setActiveTask(activeTask === task.id ? null : task.id)
                }
              >
                <h4 className="font-medium mb-2">{task.title}</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                  {task.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={() => editTask(task.id)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  {task.status !== "Completed" ? (
                    <button
                      onClick={() => endTask(task.id)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      End Task
                    </button>
                  ) : (
                    <div className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600">
                      Task Ended
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to mark the project as completed?"
                  )
                ) {
                  setProject((prev) => ({ ...prev, status: "completed" }));
                }
              }}
              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
            >
              Mark as completed
            </button>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      {showInvoiceModal && (
        <InvoiceModal
          onClose={() => setShowInvoiceModal(false)}
          project={project}
        />
      )}
    </div>
  );
}
