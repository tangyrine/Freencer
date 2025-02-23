"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import GrowthChart from "../components/growthChart";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:5000/api/projects/user"); // Fetch projects for the logged-in user
        const data = await response.json();

        // Extract payment details from projects
        const formattedPayments = data.map((project) => ({
          id: project.id,
          name: project.name,
          amount: project.payment?.amount || "₹0",
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.payment?.status || "Pending",
        }));

        setPayments(formattedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
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
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-200">
                  <th className="p-2 text-left">Project Name</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Start Date</th>
                  <th className="p-2 text-left">End Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="p-2">{payment.name}</td>
                    <td className="p-2">{payment.amount}</td>
                    <td className="p-2">{payment.startDate}</td>
                    <td className="p-2">{payment.endDate}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded ${payment.status === "Paid" ? "bg-green-200" : "bg-yellow-200"}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {payment.status === "Paid" && (
                        <button className="bg-green-600 text-white px-4 py-1 rounded">Download Invoice</button>
                      )}
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
