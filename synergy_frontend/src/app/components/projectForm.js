"use client";
import { useState } from "react";

export default function ProjectForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    project_name: "",
    deadline: "",
    description: "",
    estimated_total_hours: "",
    github_repository_link: "",
    requirements: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "deadline"
          ? new Date(value + "T00:00:00").toISOString().slice(0, 19).replace("T", " ") // Ensure timestamp format
          : name === "estimated_total_hours"
          ? (value === "" ? "" : parseInt(value, 10) || 0) // Allow empty value for estimated hours
          : value,
    }));
  };
  
  
  

  const handleSubmit = async () => {
    console.log("Submitting Form Data:", formData); // Debugging log
  
    if (!formData.project_name || !formData.deadline) {
      alert("Project Name and Deadline are required");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a project");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Send updated data
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save project: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Project created:", data);
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
