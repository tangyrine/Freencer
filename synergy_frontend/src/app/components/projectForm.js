"use client";
import { useState } from "react";

export default function ProjectForm({ onClose, setProjects }) {
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    estimated_total_hours: "",
    github_repository_link: "",
    requirements: "",
    deadline: "",
    budget_estimated: "",
    clientperhourpay: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "estimated_total_hours" && value !== ""
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting Form Data:", formData);

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
      // First check if the backend is accessible
      const healthCheck = await fetch("http://localhost:5000/test-db", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!healthCheck.ok) {
        throw new Error(
          "Backend server is not responding. Please check if the server is running."
        );
      }

      const response = await fetch("http://localhost:5000/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      console.log("Project created:", data);
      // Refresh the projects list
      const projectsResponse = await fetch(
        "http://localhost:5000/project/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const projectsData = await projectsResponse.json();
      setProjects(projectsData.projects || []);
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      if (error.message.includes("Failed to fetch")) {
        alert(
          "Unable to connect to the server. Please check if the backend server is running."
        );
      } else {
        alert(error.message || "Failed to save project");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-medium mb-4">Add Project Details</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Deadline *</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Estimated Hours
          </label>
          <input
            type="number"
            name="estimated_total_hours"
            value={formData.estimated_total_hours}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            GitHub Repository Link
          </label>
          <input
            type="text"
            name="github_repository_link"
            value={formData.github_repository_link}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Budget Estimated
          </label>
          <input
            type="number"
            name="budget_estimated"
            value={formData.budget_estimated}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Client Per Hour Pay
          </label>
          <input
            type="number"
            name="clientperhourpay"
            value={formData.clientperhourpay}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
          >
            Create Project
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
