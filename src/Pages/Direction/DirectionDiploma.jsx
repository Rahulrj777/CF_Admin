import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

const DirectionDiplomaAdmin = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [pdf, setPdf] = useState(null);
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDiplomas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/directiondiploma`);
      setDiplomas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiplomas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !pdf) return alert("Title and PDF required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("pdf", pdf);

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/directiondiploma/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setSubtitle("");
      setPdf(null);
      fetchDiplomas();
      alert("✅ Diploma uploaded!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this diploma?")) return;
    try {
      await axios.delete(`${API_BASE}/directiondiploma/${_id}`);
      fetchDiplomas();
      alert("🗑 Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Direction Diploma Admin</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="border p-2"
        />
        <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} required />
        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white py-2 rounded ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Uploading..." : "Upload Diploma"}
        </button>
      </form>

      <h3 className="mt-6 font-semibold text-xl">Saved Diplomas</h3>
      <ul className="mt-2">
        {diplomas.map((d) => (
          <li key={d._id} className="flex items-center justify-between border p-2 mb-2">
            <div>
              <p className="font-medium">{d.title}</p>
              {d.subtitle && <p className="text-sm text-gray-500">{d.subtitle}</p>}
              <a href={d.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                View PDF
              </a>
            </div>
            <button onClick={() => handleDelete(d._id)} className="text-red-500 font-bold">
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectionDiplomaAdmin;
