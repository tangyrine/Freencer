"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import GrowthChart from "../components/growthChart";

export default function Payments() {
  const [payments, setPayments] = useState([]);
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
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // If using JWT
                }
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
        <h1 className="text-3xl font-bold mb-4">Payment History</h1>
        <GrowthChart />

        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Payment History</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-left border-collapse">
  <thead>
    <tr className="bg-green-200">
      <th>Project Name</th>
      <th>Amount</th>
      <th>Start Date</th>
      <th>Deadline</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {payments.map((payment) => (
      <tr key={payment.id || payment._id}>
        <td>{payment.project_name}</td> {/* Check the exact field name */}
        <td>{parseFloat(payment.total_amount).toFixed(2)}</td>
        <td>{new Date(payment.start_date).toLocaleString()}</td> {/* Convert timestamp */}
        <td>{new Date(payment.deadline).toLocaleString()}</td>
        <td>
          <span className="bg-yellow-300 px-2 py-1 rounded">{payment.status}</span>
        </td>
        <td>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
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
