import { useEffect, useState } from "react";
import { API_BASE } from "../Utils/Api";

const PaymentDetailes = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/payment/`) // GET all payments
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Course</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Transaction ID</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        // PaymentDetailes.jsx
        <tbody>
          {payments.map((p, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{p.client.name}</td>
              <td className="border px-4 py-2">{p.client.email}</td>
              <td className="border px-4 py-2">{p.client.phone}</td>
              <td className="border px-4 py-2">{p.client.fatherName}</td>
              <td className="border px-4 py-2">{p.client.fatherPhone}</td>
              <td className="border px-4 py-2">{p.client.age}</td>
              <td className="border px-4 py-2">{p.client.gender}</td>
              <td className="border px-4 py-2">{p.client.dob}</td>
              <td className="border px-4 py-2">{p.client.address}</td>
              <td className="border px-4 py-2">{p.client.city}</td>
              <td className="border px-4 py-2">{p.client.state}</td>
              <td className="border px-4 py-2">{p.client.country}</td>
              <td className="border px-4 py-2">
                {p.client.courses.join(", ")}
              </td>
              <td className="border px-4 py-2">₹{p.amount}</td>
              <td className="border px-4 py-2">{p.transactionId}</td>
              <td className="border px-4 py-2">{p.status}</td>
              <td className="border px-4 py-2">
                {new Date(p.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentDetailes;
