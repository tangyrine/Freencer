"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import InvoiceModal from "../../components/invoice";

export default function ProjectDetailsPage({ params }) {
  const router = useRouter();
  const projectId = params?.id;
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          } else {
            setError("Project not found");
          }
        })
        .catch(() => setError("Failed to fetch project details"))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  const markTaskCompleted = (taskId) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, status: "Completed" } : task
      ),
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar activePage="projects" />
      <div className="flex-1 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button onClick={() => router.back()} className="bg-gray-300 px-4 py-2 rounded">Back</button>
        </div>
        <div className="bg-white p-6 rounded shadow mt-4">
          <h3 className="text-xl font-bold">{project.project_name}</h3>
          <p className="text-gray-600">{project.description}</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <p><strong>Start Date:</strong> {project.start_date}</p>
            <p><strong>Due Date:</strong> {project.due_date}</p>
            <p><strong>Payment Status:</strong> {project.payment_status}</p>
            <p><strong>Requirements:</strong> {project.requirements}</p>
            <p><strong>Attachments:</strong> <a href={project.attachments} className="text-blue-500">View</a></p>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Progress: {project.progress}% done</p>
            <div className="w-full bg-gray-200 rounded h-3 mt-1">
              <div className="bg-blue-500 h-3 rounded" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-green-100 p-4 rounded text-center">
              <p className="text-lg font-bold">Project Completed in</p>
              <p className="text-2xl font-semibold">{project.time_spent} Hours</p>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <h3 className="text-xl font-bold">View All Tasks</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {project.tasks.map((task) => (
              <div key={task.id} className={`p-4 rounded shadow ${task.status === "Completed" ? "bg-gray-200" : "bg-green-100"}`}>
                <h4 className="font-bold">{task.title}</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {task.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
                {task.status === "Ongoing" ? (
                  <button onClick={() => markTaskCompleted(task.id)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Mark as Completed</button>
                ) : (
                  <p className="text-gray-500 mt-2">Task Ended</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button className="bg-orange-400 text-white px-6 py-3 rounded text-lg">Payment Status</button>
            <button onClick={() => setShowInvoiceModal(true)} className="bg-blue-500 text-white px-6 py-3 rounded text-lg">Generate Invoice</button>
          </div>
        </div>
      </div>
      {showInvoiceModal && <InvoiceModal onClose={() => setShowInvoiceModal(false)} />}
    </div>
  );
}
