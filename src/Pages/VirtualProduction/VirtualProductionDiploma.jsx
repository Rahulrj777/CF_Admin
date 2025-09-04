import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [loading, setLoading] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";
  const API = `${API_BASE}/virtualproductiondiploma`;

  const links = [
    { label: "Virtual Production CFA", url: "/virtual_production/cfa" },
    {
      label: "Virtual Production Stage Unreal",
      url: "/virtual_production/stage_unreal",
    },
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
    if (
      !form.courseTitle ||
      !form.timeline ||
      !form.detailTitle ||
      !form.description ||
      !form.link
    )
      return alert("⚠️ All fields are required!");

    try {
      setLoading(true);
      const fd = new FormData();

      // Map frontend names to backend schema names
      fd.append("course", form.courseTitle);
      fd.append("time", form.timeline);
      fd.append("title", form.detailTitle);
      fd.append("description", form.description);
      fd.append("link", form.link);

      if (image) fd.append("image", image);

      if (editId) await axios.put(`${API}/${editId}`, fd);
      else await axios.post(API, fd);

      setForm({
        courseTitle: "",
        timeline: "",
        detailTitle: "",
        description: "",
        link: "",
      });
      setImage(null);
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      if (editId === id) setEditId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed. Try again.");
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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-8">
        🎓 Virtual Production Diploma Admin
      </h2>

      {/* Form */}
      <form
        onSubmit={submit}
        className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-indigo-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Course Title"
            value={form.courseTitle}
            onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
            className="w-full border-2 border-indigo-300 rounded-md p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
          />
          <input
            placeholder="Timeline"
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
            className="w-full border-2 border-indigo-300 rounded-md p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
          />
        </div>
        <input
          placeholder="Detail Title"
          value={form.detailTitle}
          onChange={(e) => setForm({ ...form, detailTitle: e.target.value })}
          className="w-full border-2 border-indigo-300 rounded-md p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border-2 border-indigo-300 rounded-md p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
        />

        <select
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full border-2 border-indigo-300 rounded-md p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
        >
          <option value="">-- Select Link --</option>
          {links.map((l) =>
            !usedLinks.includes(l.url) || form.link === l.url ? (
              <option key={l.url} value={l.url}>
                {l.label}
              </option>
            ) : null
          )}
        </select>

        <div className="border-2 border-dashed border-indigo-300 p-4 rounded-md text-center cursor-pointer">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mx-auto w-48 h-32 object-cover rounded-md shadow"
              />
            ) : (
              <span className="text-indigo-400">
                📁 Drag & Drop or Click to Upload
              </span>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {editId ? "✏️ Update Course" : "💾 Add Course"}
        </button>
      </form>

      {/* Course List */}
      <h3 className="text-2xl font-semibold mt-10 mb-6 text-indigo-600">
        📌 Existing Courses
      </h3>
      {list.length === 0 ? (
        <p className="text-gray-500">No courses added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <div
              key={c._id}
              className="border border-indigo-200 rounded-xl shadow-md overflow-hidden flex flex-col bg-white"
            >
              <img
                src={c.imageUrl}
                alt={c.course}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-bold text-indigo-600">{c.course}</h4>
                <p className="text-red-500 font-semibold">{c.time}</p>
                <p className="text-gray-700 mt-1">{c.title}</p>
                <p className="text-gray-500 text-sm mt-1 flex-grow">
                  {c.description}
                </p>
                <Link
                  to={c.link}
                  className="text-blue-500 underline text-sm mt-2"
                >
                  {links.find((l) => l.url === c.link)?.label || c.link}
                </Link>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => edit(c)}
                    className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => del(c._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md font-semibold"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
