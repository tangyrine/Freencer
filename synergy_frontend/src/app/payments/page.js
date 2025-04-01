"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";

export default function Payments() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      project_name: "E-commerce Website",
      total_amount: 2500,
      start_date: "2024-02-01",
      deadline: "2024-04-01",
      status: "paid",
    },
    {
      id: 2,
      project_name: "Mobile App Development",
      total_amount: 3500,
      start_date: "2024-02-15",
      deadline: "2024-05-15",
      status: "paid",
    },
    {
      id: 3,
      project_name: "Dashboard Redesign",
      total_amount: 1800,
      start_date: "2024-03-01",
      deadline: "2024-04-20",
      status: "pending",
    },
    {
      id: 4,
      project_name: "CRM System",
      total_amount: 4200,
      start_date: "2024-02-20",
      deadline: "2024-05-20",
      status: "pending",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/task/invoice", {
          method: "GET",
          credentials: "include", // If using cookies for auth
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If using JWT
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch invoices: ${response.status}`);
        }
        const data = await response.json();
        console.log("Invoices:", data);
        setPayments(data); // Ensure this is the correct setter function
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar activePage="payments" />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Payment History</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              <p>Error: {error}</p>
              <p className="text-sm mt-2">
                Please try again later or contact support if the issue persists.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-200 text-gray-800">
                  <th className="px-4 py-3 rounded-l-lg">Project Name</th>{" "}
                  {/* Left rounded corner */}
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Action</th>{" "}
                  {/* Right rounded corner */}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id || payment._id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{payment.project_name}</td>
                    <td className="px-4 py-3">
                      {parseFloat(payment.total_amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(payment.start_date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(payment.deadline).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
