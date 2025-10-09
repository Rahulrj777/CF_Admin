import { useEffect, useState } from "react";
import { API_BASE } from "../Utils/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all payments
  const fetchPayments = () => {
    fetch(`${API_BASE}/payment/`)
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Delete payment with confirmation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await fetch(`${API_BASE}/payment/${id}`, { method: "DELETE" });
        toast.success("Payment deleted successfully!");
        fetchPayments();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete payment!");
      }
    }
  };

  // Edit payment: open modal/form
  const handleEdit = (payment) => {
    setEditingPayment(payment._id);
    setFormData({ ...payment.client });
  };

  // Save edited payment
  const handleSave = async (id) => {
    try {
      await fetch(`${API_BASE}/payment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: formData }),
      });
      toast.success("Payment edited successfully!");
      setEditingPayment(null);
      fetchPayments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Details</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Courses</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="text-sm">
                <td className="border px-4 py-2">
                  {editingPayment === p._id ? (
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    p.client.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingPayment === p._id ? (
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    p.client.email
                  )}
                </td>
                <td className="border px-4 py-2">{p.client.phone}</td>
                <td className="border px-4 py-2">
                  {p.client.courses?.join(", ")}
                </td>
                <td className="border px-4 py-2">₹{p.amount}</td>
                <td className="border px-4 py-2">{p.status}</td>
                <td className="border px-4 py-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  {editingPayment === p._id ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDetails;
