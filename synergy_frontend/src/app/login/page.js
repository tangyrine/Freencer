"use client"; // Required in Next.js App Router for useState

import { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation after login

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize router for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token in localStorage
        setMessage("✅ Login successful!");
        router.push("/dashboard"); // Redirect to dashboard after login
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to server.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with branding */}
      <div className="w-1/2 bg-gradient-to-br from-green-800 to-black flex flex-col items-center justify-center text-white">
        <img src="/logo.png" alt="Freencer Logo" className="w-300 h-300" />
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex flex-col justify-center p-8 bg-white text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back!</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input type="email" name="email" className="w-full p-3 border rounded bg-green-50" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-gray-700">Enter Password:</label>
            <input type="password" name="password" className="w-full p-3 border rounded bg-green-50" onChange={handleChange} required />
          </div>

          <div className="flex justify-between text-sm">
            <span></span>
            <a href="/forgot-password" className="text-gray-600">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">Log in</button>
        </form>

        {message && <p className="mt-4 text-red-600 text-center">{message}</p>}

        <div className="mt-6 text-center">
          <hr className="my-4 border-gray-300"/>
          <p>Create New Account?</p>
          <a href="/signup" className="text-green-600 font-bold">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
