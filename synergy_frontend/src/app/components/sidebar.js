"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const activePage = pathname ? pathname.split("/")[1] : "";

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Payments", path: "/payments" },
    { name: "Performance", path: "/performance" },
  ];

  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
    
        const res = await fetch("http://localhost:5000/user/display_user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
    
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch user: ${errorText}`);
        }
    
        const data = await res.json();
        console.log("✅ User data:", data);
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user:", error.message);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
  
      const res = await fetch("http://localhost:5000/user/edit_user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          profilePic: user.profilePic, // Ensure this matches backend expectations
        }),
        credentials: "include",
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update user: ${errorText}`);
      }
  
      const updatedUser = await res.json();
      console.log("✅ User updated successfully:", updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error saving user details:", error.message);
    }
  };
  

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        await fetch("http://localhost:5000/user/delete_user", { method: "DELETE", credentials: "include" });
        setShowProfile(false);
        handleLogout();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-4">
      <h2 className="text-green-600 text-2xl font-bold">Freencer</h2>
      <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded" onClick={() => setShowProfile(true)}>
        Profile
      </button>

      {showProfile && user && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Profile Details</h3>
        <button
          onClick={() => setShowProfile(false)} // Close the modal
          className="text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center">
        {user.profilePic ? (
          <img src={user.profilePic} alt="Profile" className="w-24 h-24 rounded-full border" />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <input type="file" className="mt-2" accept="image/*" onChange={handleProfilePicChange} />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Name:</label>
        <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="w-full border rounded p-2 bg-green-100" disabled={!isEditing} />
        <label className="block text-gray-700 mt-2">Email:</label>
        <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="w-full border rounded p-2 bg-green-100" disabled={!isEditing} />
        <label className="block text-gray-700 mt-2">Phone Number:</label>
        <input type="text" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} className="w-full border rounded p-2 bg-green-100" disabled={!isEditing} />
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={handleDelete} className="bg-orange-500 text-white py-2 px-4 rounded">Delete</button>
        {isEditing ? (
          <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 rounded">Save</button>
        ) : (
          <button onClick={handleEdit} className="bg-gray-300 text-gray-700 py-2 px-4 rounded flex items-center">Edit ✏️</button>
        )}
      </div>
    </div>
  </div>
)}


      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className={`p-2 rounded my-2 ${activePage === item.path.substring(1) ? "bg-green-500 text-white" : ""}`}>
              <Link href={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <button className="mt-6 w-full bg-red-500 text-white py-2 rounded" onClick={handleLogout}>Logout</button>
    </div>
  );
}
