// AdminDiploma.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function VirtualProductionDiploma() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    courseTitle: "",
    timeline: "",
    detailTitle: "",
    description: "",
    link: "",
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";
  const API = `${API_BASE}/virtualproduction/diploma`;

  const links = [
    { label: "Virtual Production CFA", url: "/virtual_production/cfa" },
    { label: "Virtual Production Stage Unreal", url: "/virtual_production/stage_unreal" },
  ];

  const fetchData = async () => {
    try {
      const { data } = await axios.get(API);
      setList(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (image) fd.append("image", image);

      if (editId) {
        await axios.put(`${API}/${editId}`, fd);
      } else {
        await axios.post(API, fd);
      }

      setForm({ courseTitle: "", timeline: "", detailTitle: "", description: "", link: "" });
      setImage(null);
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error("[v0] Submit failed:", err);
      alert(err?.response?.data?.message || "Failed to save. Please try again.");
    }
  };

  const del = async (id) => {
    if (confirm("Delete this course?")) {
      try {
        await axios.delete(`${API}/${id}`);
        if (editId === id) setEditId(null);
        fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
        alert(err?.response?.data?.message || "Failed to delete.");
        fetchData();
      }
    }
  };

  const edit = (item) => {
    setForm({
      courseTitle: item.course ?? "",
      timeline: item.time ?? "",
      detailTitle: item.title ?? "",
      description: item.description ?? "",
      link: item.link ?? "",
    });
    setImage(null);
    setEditId(item._id);
  };

  const usedLinks = list
    .filter((c) => !editId || String(c._id) !== String(editId))
    .map((c) => c.link ?? "");

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center text-yellow-400">
        Virtual Production Diploma Admin
      </h1>

      <form
        onSubmit={submit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-4"
      >
        <input
          placeholder="Course Title"
          value={form.courseTitle}
          onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
          className="w-full p-3 rounded-md text-black focus:outline-yellow-400"
        />
        <input
          placeholder="Timeline"
          value={form.timeline}
          onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          className="w-full p-3 rounded-md text-black focus:outline-yellow-400"
        />
        <input
          placeholder="Detail Title"
          value={form.detailTitle}
          onChange={(e) => setForm({ ...form, detailTitle: e.target.value })}
          className="w-full p-3 rounded-md text-black focus:outline-yellow-400"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 rounded-md text-black focus:outline-yellow-400"
        />
        <select
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full p-3 rounded-md text-black focus:outline-yellow-400"
        >
          <option value="">-- Select Link --</option>
          {links.map(
            (l) =>
              !usedLinks.includes(l.url) || form.link === l.url ? (
                <option key={l.url} value={l.url}>
                  {l.label}
                </option>
              ) : null
          )}
        </select>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-white" />

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 transition-colors py-3 rounded-md font-semibold"
        >
          {editId ? "Update Course" : "Add Course"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
        {list.map((c) => (
          <div key={c._id} className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center">
            <img
              src={c.imageUrl}
              alt={c.course}
              className="h-40 object-contain mb-3 rounded-md"
            />
            <h3 className="text-xl font-bold text-yellow-400">{c.course}</h3>
            <p className="text-red-400 font-semibold">{c.time}</p>
            <p className="text-sm mt-1">{c.title}</p>
            <p className="text-xs text-gray-300 mt-1">{c.description}</p>
            <Link to={c.link} className="text-blue-400 underline text-sm mt-1">
              {links.find((l) => l.url === c.link)?.label || c.link}
            </Link>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => edit(c)}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-black font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => del(c._id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
