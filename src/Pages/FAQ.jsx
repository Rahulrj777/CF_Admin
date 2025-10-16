// AdminPanel.jsx
import { useState, useEffect } from "react";
import { API_BASE } from "../Utils/Api";

export default function AdminPanel() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "" });

  const fetchFaqs = async () => {
    const res = await fetch(`${API_BASE}/faqs/`);
    const data = await res.json();
    setFaqs(data);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async () => {
    await fetch(`${API_BASE}/faqs/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ question: "", answer: "" });
    fetchFaqs();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      <input
        type="text"
        placeholder="Question"
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
        className="border p-2 m-2 w-full"
      />
      <textarea
        placeholder="Answer"
        value={form.answer}
        onChange={(e) => setForm({ ...form, answer: e.target.value })}
        className="border p-2 m-2 w-full"
      />
      <input
        type="text"
        placeholder="Enter keywords separated by commas"
        value={form.keywords}
        onChange={(e) =>
          setForm({
            ...form,
            keywords: e.target.value.split(",").map((k) => k.trim()),
          })
        }
        className="border p-2 m-2 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add FAQ
      </button>

      <div className="mt-4">
        {faqs.map((faq) => (
          <div key={faq._id} className="border p-2 my-2 rounded">
            <b>Q:</b> {faq.question} <br />
            <b>A:</b> {faq.answer}
          </div>
        ))}
      </div>
    </div>
  );
}
