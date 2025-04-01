"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection after signup

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize router for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");
    console.log("Submitting form data:", formData);

    try {
      const response = await fetch(
        "http://localhost:5000/auth/create/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Token stored:", data.token);
        setMessage("✅ User created successfully!");
        router.push("/dashboard");
      } else {
        console.error("Signup failed:", data.error);
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setMessage("❌ Failed to connect to server.");
    }
  };

  return (
    <div className="flex min-h-screen text-black">
      {/* Left side with logo */}
      <div className="w-1/2 bg-gradient-to-br from-green-800 to-black flex flex-col items-center justify-center text-white">
        <img src="/logo.png" alt="Freencer Logo" className="w-300 h-300" />
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex flex-col justify-center p-8 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              className="w-full p-3 border rounded bg-green-50"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border rounded bg-green-50"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Phone Number:</label>
            <input
              type="text"
              name="phone"
              className="w-full p-3 border rounded bg-green-50"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">
              Create a Strong Password:
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border rounded bg-green-50"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full p-3 border rounded bg-green-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>

        {message && <p className="mt-4 text-red-600 text-center">{message}</p>}

        <p className="mt-6 text-center text-black">
          Already have an account?{" "}
          <a href="/login" className="text-green-600">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
