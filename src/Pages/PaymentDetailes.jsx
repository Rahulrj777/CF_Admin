import { useEffect, useState } from "react";
import { API_BASE } from "../Utils/Api";

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    fetch(`${API_BASE}/payment/`)
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch(() => alert("Failed to fetch payments!"));
  };

  const toggleExpand = (id, payment) => {
    if (expandedId === id) {
      setExpandedId(null);
      setEditingPayment(null);
    } else {
      setExpandedId(id);
      setFormData({ ...payment.client, amount: payment.amount, transactionId: payment.transactionId, status: payment.status });
    }
  };

  const handleSave = async (id) => {
    try {
      await fetch(`${API_BASE}/payment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: formData, amount: formData.amount, transactionId: formData.transactionId, status: formData.status }),
      });
      alert("Payment updated successfully!");
      setExpandedId(null);
      setEditingPayment(null);
      fetchPayments();
    } catch {
      alert("Failed to save changes!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await fetch(`${API_BASE}/payment/${id}`, { method: "DELETE" });
        alert("Payment deleted successfully!");
        fetchPayments();
      } catch {
        alert("Failed to delete payment!");
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Details</h1>

      <div className="space-y-4">
        {payments.map((p) => (
          <div key={p._id} className="border rounded shadow-sm">
            {/* Top row */}
            <div className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer">
              <div className="flex space-x-4" onClick={() => toggleExpand(p._id, p)}>
                <div><strong>Name:</strong> {p.client.name}</div>
                <div><strong>Course:</strong> {p.client.courses.join(", ")}</div>
                <div><strong>Phone:</strong> {p.client.phone}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingPayment(p._id)}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <div className="text-xl ml-2 cursor-pointer" onClick={() => toggleExpand(p._id, p)}>
                  {expandedId === p._id ? "▲" : "▼"}
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === p._id && (
              <div className="p-4 space-y-2 bg-white">
                {Object.keys(formData).map(
                  (key) =>
                    key !== "courses" && key !== "name" && key !== "phone" && (
                      <div key={key} className="flex space-x-2 items-center">
                        <span className="font-semibold capitalize w-32">{key.replace(/([A-Z])/g, " $1")}:</span>
                        {editingPayment === p._id ? (
                          <input
                            type={key === "amount" ? "number" : "text"}
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="border rounded px-2 py-1 flex-1"
                          />
                        ) : (
                          <span>{formData[key]}</span>
                        )}
                      </div>
                    )
                )}

                {editingPayment === p._id && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleSave(p._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPayment(null)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentDetails;
