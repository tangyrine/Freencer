import { useState } from "react";
import axios from "axios";

export default function InvoiceModal({ onClose }) {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "Auto-generated",
    invoiceDate: "",
    email: "",
    paymentInfo: "",
    clientName: "",
    clientEmail: "",
    projectName: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    hourlyRate: "",
    hoursWorked: "",
    fixedFee: "",
    finalAmount: "",
    paymentDeadline: "",
  });

  const handleChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/invoice/create",
        invoiceData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Invoice created successfully");
      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            disabled
            className="bg-gray-100 p-2 rounded w-full"
          />
          <input
            type="date"
            name="invoiceDate"
            value={invoiceData.invoiceDate}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={invoiceData.email}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <input
            type="text"
            name="paymentInfo"
            placeholder="Bank / Payment Info"
            value={invoiceData.paymentInfo}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <input
            type="text"
            name="clientName"
            placeholder="Client Name / Company"
            value={invoiceData.clientName}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <input
            type="email"
            name="clientEmail"
            placeholder="Client Email"
            value={invoiceData.clientEmail}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            value={invoiceData.projectName}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <textarea
            name="projectDescription"
            placeholder="Project Description"
            value={invoiceData.projectDescription}
            onChange={handleChange}
            className="p-2 rounded w-full h-20"
          />
          <input
            type="date"
            name="startDate"
            value={invoiceData.startDate}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <input
            type="date"
            name="endDate"
            value={invoiceData.endDate}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <div>
            <p>Hourly Pay</p>
            <input
              type="number"
              name="hourlyRate"
              placeholder="Hourly Rate"
              value={invoiceData.hourlyRate}
              onChange={handleChange}
              className="p-2 rounded w-full"
            />
            <input
              type="number"
              name="hoursWorked"
              placeholder="Hours Worked"
              value={invoiceData.hoursWorked}
              onChange={handleChange}
              className="p-2 rounded w-full mt-2"
            />
          </div>
          <div>
            <p>Fixed Pay</p>
            <input
              type="number"
              name="fixedFee"
              placeholder="Fixed Fee"
              value={invoiceData.fixedFee}
              onChange={handleChange}
              className="p-2 rounded w-full"
            />
          </div>
          <input
            type="number"
            name="finalAmount"
            placeholder="Final Amount"
            value={invoiceData.finalAmount}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
          <input
            type="date"
            name="paymentDeadline"
            value={invoiceData.paymentDeadline}
            onChange={handleChange}
            className="p-2 rounded w-full"
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Discard
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save & Send
          </button>
        </div>
      </div>
    </div>
  );
}
