"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";

export default function ProjectDetailsPage({ params }) {
  const router = useRouter();
  const projectId = params?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then((res) => res.json())
        .then((data) => setProject(data))
        .catch((err) => console.error("Error fetching project:", err));
    }
  }, [projectId]);

  const addTask = async (task) => {
    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      const newTask = await res.json();
      setProject((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
      setIsAddTaskModalOpen(false);
    }
  };

  const updateTask = async () => {
    const res = await fetch(`/api/projects/${projectId}/tasks/${selectedTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedTask),
    });
    if (res.ok) {
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === selectedTask.id ? selectedTask : task)),
      }));
      setIsEditTaskModalOpen(false);
    }
  };

  const markTaskCompleted = async (taskId) => {
    const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/complete`, {
      method: "PATCH",
    });
    if (res.ok) {
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, status: "Completed" } : task)),
      }));
    }
  };

  const updateProject = async () => {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) setIsModalOpen(false);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar activePage="projects" />
      <div className="flex-1 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button onClick={() => router.back()} className="bg-gray-300 px-4 py-2 rounded">Back</button>
        </div>
        <div className="bg-white p-6 rounded shadow mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{project.name}</h3>
            <button onClick={() => setIsModalOpen(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
          </div>
          <p className="text-gray-600">{project.description}</p>
        </div>

        {/* Task List */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <h3 className="text-xl font-bold">View All Tasks</h3>
          <button onClick={() => setIsAddTaskModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-2"> Add Task</button>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {project.tasks.map((task) => (
              <div key={task.id} className={`p-4 rounded shadow ${task.status === "Completed" ? "bg-gray-200" : "bg-green-100"}`}>
                <h4 className="font-bold">{task.title}</h4>
                {task.status === "Ongoing" && (
                  <button onClick={() => setSelectedTask(task)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-2">Edit Task</button>
                )}
                {task.status === "Ongoing" ? (
                  <button onClick={() => markTaskCompleted(task.id)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-2">Mark as Completed</button>
                ) : (
                  <p className="text-gray-500 mt-2">Task Ended</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">View All Tasks</h3>
            <button onClick={() => setIsAddTaskModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-2"> Add Task</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
          {project.tasks.map((task) => (
  <div key={task.id} className={`p-4 rounded shadow ${task.status === "Completed" ? "bg-gray-200" : "bg-green-100"}`}>
    <h4 className="font-bold">{task.title}</h4>
    <ul className="list-disc list-inside text-sm text-gray-600">
      {task.details.map((detail, index) => (
        <li key={index}>{detail}</li>
      ))}
    </ul>
    
    {/* Show "Edit Task" button only if task is ongoing */}
    {task.status === "Ongoing" && (
      <button onClick={() => openEditTaskModal(task)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-2">Edit Task</button>
    )}

    {/* Mark as Completed Button */}
    {task.status === "Ongoing" ? (
      <button onClick={() => markTaskCompleted(task.id)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-2">Mark as Completed</button>
    ) : (
      <p className="text-gray-500 mt-2">Task Ended</p>
    )}
  </div>
))}

          </div>
        </div>
      </div>

{/* Add Task Modal */}
{isAddTaskModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg w-[600px]">
      <h3 className="text-xl font-bold mb-4">Add Task Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Task Name</label>
          <input type="text" className="w-full p-2 border rounded bg-green-50"/>
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea className="w-full p-2 border rounded bg-green-50"></textarea>
        </div>
        <div>
          <label className="block font-medium">Estimated Work Time-span (hrs)</label>
          <input type="number" className="w-full p-2 border rounded bg-green-50"/>
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={() => setIsAddTaskModalOpen(false)} className="text-green-600 text-2xl">✅</button>
        <button onClick={() => setIsAddTaskModalOpen(false)} className="text-red-600 text-2xl">❌</button>
      </div>
    </div>
  </div>
)}

{/* Edit Task Modal */}
{isEditTaskModalOpen && currentTask && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg w-[600px]">
      <h3 className="text-xl font-bold mb-4">Edit Task Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Task Name</label>
          <input type="text" className="w-full p-2 border rounded bg-green-50" value={currentTask.title} onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})} />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea className="w-full p-2 border rounded bg-green-50" value={currentTask.details.join(", ")} onChange={(e) => setCurrentTask({...currentTask, details: e.target.value.split(", ")})}></textarea>
        </div>
        <div>
          <label className="block font-medium">Estimated Work Time-span (hrs)</label>
          <input type="number" className="w-full p-2 border rounded bg-green-50" value={currentTask.timeSpan || ""} onChange={(e) => setCurrentTask({...currentTask, timeSpan: e.target.value})}/>
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={() => setIsEditTaskModalOpen(false)} className="text-green-600 text-2xl">✅</button>
        <button onClick={() => setIsEditTaskModalOpen(false)} className="text-red-600 text-2xl">❌</button>
      </div>
    </div>
  </div>
)}



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
            onChange={(e) => setProject({ ...project, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">End Date</label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 border rounded bg-green-50"
              value={project.dueDate}
              onChange={(e) => setProject({ ...project, dueDate: e.target.value })}
            />
            <span className="absolute right-3 top-3 text-gray-500">📅</span>
          </div>
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded bg-green-50"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Estimated Work Time-span (hrs)</label>
          <input
            type="number"
            className="w-full p-2 border rounded bg-green-50"
            value={project.timeRemaining}
            onChange={(e) => setProject({ ...project, timeRemaining: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Repository Link (GitHub)</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-green-50"
            value={project.attachments}
            onChange={(e) => setProject({ ...project, attachments: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Requirements</label>
          <textarea
            className="w-full p-2 border rounded bg-green-50"
            value={project.requirements}
            onChange={(e) => setProject({ ...project, requirements: e.target.value })}
          ></textarea>
        </div>
      </div>

      {/* Save & Cancel Icons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={() => setIsModalOpen(false)} className="text-green-600 text-2xl">✅</button>
        <button onClick={() => setIsModalOpen(false)} className="text-red-600 text-2xl">❌</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
