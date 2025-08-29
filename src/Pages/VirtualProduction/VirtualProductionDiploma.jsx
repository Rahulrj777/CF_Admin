// AdminDiploma.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/virtualproductiondiploma";

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

  const links = [
    { label: "Virtual Production CFA", url: "/virtual_production/cfa" },
    {
      label: "Virtual Production Stage Unreal",
      url: "/virtual_production/stage_unreal",
    },
  ];

  const fetchData = async () => {
    const { data } = await axios.get(API);
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      // ensure all fields are strings to keep inputs controlled
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (image) fd.append("image", image);

      if (editId) {
        await axios.put(`${API}/${editId}`, fd);
      } else {
        await axios.post(API, fd);
      }
      // reset form safely
      setForm({
        courseTitle: "",
        timeline: "",
        detailTitle: "",
        description: "",
        link: "",
      });
      setImage(null);
      setEditId(null);
      await fetchData();
    } catch (err) {
      console.error("[v0] Submit failed:", err);
      alert(
        err?.response?.data?.message || "Failed to save. Please try again."
      );
    }
  };

  const del = async (id) => {
    if (confirm("Delete?")) {
      try {
        await axios.delete(`${API}/${id}`);
        // if we were editing the same item, clear edit state
        if (editId === id) setEditId(null);
        await fetchData();
      } catch (err) {
        console.error("[v0] Delete failed:", err);
        alert(
          err?.response?.data?.message ||
            "Failed to delete. It may have already been removed."
        );
        await fetchData();
      }
    }
  };

  const edit = (item) => {
    setForm({
      courseTitle: item.courseTitle ?? "",
      timeline: item.timeline ?? "",
      detailTitle: item.detailTitle ?? "",
      description: item.description ?? "",
      link: item.link ?? "",
    });
    setImage(null);
    setEditId(item.id);
  };

  // Get links already used
  const usedLinks = list
    .filter((c) => !editId || String(c.id) !== String(editId))
    .map((c) => c.link ?? "");

  return (
    <div className="p-4 text-white">
      <form onSubmit={submit} className="space-y-3 p-4 rounded-md">
        <input
          placeholder="Course Title"
          value={form.courseTitle}
          onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
          className="w-full p-2 text-black"
        />
        <input
          placeholder="Timeline"
          value={form.timeline}
          onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          className="w-full p-2 text-black"
        />
        <input
          placeholder="Detail Title"
          value={form.detailTitle}
          onChange={(e) => setForm({ ...form, detailTitle: e.target.value })}
          className="w-full p-2 text-black"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 text-black"
        />

        {/* Dropdown instead of Explore Link input */}
        <select
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full p-2 text-black"
        >
          <option value="">-- Select Link --</option>
          {links.map(
            (l) =>
              !usedLinks.includes(l.url) || form.link === l.url ? (
                <option key={l.url} value={l.url}>
                  {l.label}
                </option>
              ) : null // hide already used links
          )}
        </select>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button className="bg-red-600 px-4 py-2 rounded-md">
          {editId ? "Update" : "Save"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {list.map((c) => (
          <div key={c.id} className="bg-gray-800 p-4 rounded-md">
            <img
              src={`http://localhost:5000${c.image}`}
              alt=""
              className="h-32 object-contain mx-auto"
            />
            <h3 className="text-lg font-bold">{c.courseTitle}</h3>
            <p className="text-red-500">{c.timeline}</p>
            <p className="text-sm">{c.detailTitle}</p>
            <p className="text-xs text-gray-300">{c.description}</p>
            <Link to={c.link} className="text-blue-400 underline text-xs">
              {links.find((l) => l.url === c.link)?.label || c.link}
            </Link>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => edit(c)}
                className="bg-yellow-500 px-3 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => del(c.id)}
                className="bg-red-600 px-3 py-1 rounded-md"
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
