"use client";
import { useState } from "react";

export default function ProjectForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    description: "",
    workTime: "",
    repoLink: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.deadline) {
      alert("Project Name and Deadline are required");
      return;
    }
  
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save project");
      }
  
      const data = await response.json();
      onSave(data);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Project Details</h2>
        <input type="text" name="name" placeholder="Project Name" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="date" name="deadline" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="workTime" placeholder="Estimated Work Time" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="repoLink" placeholder="Repository Link" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
        <textarea name="requirements" placeholder="Requirements" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
        
        <div className="flex justify-end space-x-2">
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">✔</button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">✖</button>
        </div>
      </div>
    </div>
  );
}
