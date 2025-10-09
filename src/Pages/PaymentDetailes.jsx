import { useEffect, useState } from "react";
import { API_BASE } from "../Utils/Api";

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all payments
  const fetchPayments = () => {
    fetch(`${API_BASE}/payment/`)
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => alert("Failed to fetch payments!"));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Edit payment
  const handleEdit = (payment) => {
    setEditingPayment(payment._id);
    setFormData({ ...payment.client, amount: payment.amount, transactionId: payment.transactionId, status: payment.status });
  };

  // Save edited payment
  const handleSave = async (id) => {
    try {
      await fetch(`${API_BASE}/payment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: formData, amount: formData.amount, transactionId: formData.transactionId, status: formData.status }),
      });
      alert("Payment updated successfully!");
      setEditingPayment(null);
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes!");
    }
  };

  return (
    <div className="p-6 max-w-full overflow-x-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Details</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Father Name</th>
            <th className="border px-4 py-2">Father Phone</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Gender</th>
            <th className="border px-4 py-2">DOB</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">City</th>
            <th className="border px-4 py-2">State</th>
            <th className="border px-4 py-2">Country</th>
            <th className="border px-4 py-2">Courses</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Transaction ID</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="text-sm">
              {editingPayment === p._id ? (
                <>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.fatherName || ""}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.fatherPhone || ""}
                      onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.age || ""}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                      type="number"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.gender || ""}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.dob || ""}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                      type="date"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.state || ""}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.country || ""}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.courses?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, courses: e.target.value.split(",").map(c => c.trim()) })
                      }
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.amount || ""}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                      type="number"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.transactionId || ""}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      value={formData.status || ""}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1 space-x-1">
                    <button
                      onClick={() => handleSave(p._id)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPayment(null)}
                      className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border px-2 py-1">{p.client.name}</td>
                  <td className="border px-2 py-1">{p.client.email}</td>
                  <td className="border px-2 py-1">{p.client.phone}</td>
                  <td className="border px-2 py-1">{p.client.fatherName}</td>
                  <td className="border px-2 py-1">{p.client.fatherPhone}</td>
                  <td className="border px-2 py-1">{p.client.age}</td>
                  <td className="border px-2 py-1">{p.client.gender}</td>
                  <td className="border px-2 py-1">{p.client.dob}</td>
                  <td className="border px-2 py-1">{p.client.address}</td>
                  <td className="border px-2 py-1">{p.client.city}</td>
                  <td className="border px-2 py-1">{p.client.state}</td>
                  <td className="border px-2 py-1">{p.client.country}</td>
                  <td className="border px-2 py-1">{p.client.courses.join(", ")}</td>
                  <td className="border px-2 py-1">₹{p.amount}</td>
                  <td className="border px-2 py-1">{p.transactionId}</td>
                  <td className="border px-2 py-1">{p.status}</td>
                  <td className="border px-2 py-1">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="border px-2 py-1 space-x-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentDetails;
