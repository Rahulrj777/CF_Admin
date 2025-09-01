import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const DirectionDiplomaAdmin = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [pdf, setPdf] = useState(null);
  const [diplomas, setDiplomas] = useState([]);

  // Fetch saved diplomas
  useEffect(() => {
    axios
      .get(`${API_BASE}/directiondiploma`)
      .then((res) => {
        setDiplomas(res.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // Add new diploma
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !pdf) return alert("Title and PDF are required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("pdf", pdf);

    try {
      const res = await axios.post(`${API_BASE}/directiondiploma`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDiplomas([...diplomas, res.data.data]);
      setTitle("");
      setSubtitle("");
      setPdf(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete PDF
  const handleDeletePdf = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/directiondiploma/pdf`, { data: { _id: id } });
      setDiplomas((prev) =>
        prev.map((d) => (d._id === id ? { ...d, pdfUrl: null, publicId: null } : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete entire diploma item
  const handleDeleteDiploma = async (id) => {
    try {
      await axios.delete(`${API_BASE}/directiondiploma/${id}`);
      setDiplomas((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Direction Diploma Admin</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 text-black">
        <div>
          <label className="block">Title (required)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full my-1"
          />
        </div>
        <div>
          <label className="block">Subtitle (optional)</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="border p-2 w-full my-1"
          />
        </div>
        <div>
          <label className="block">Upload PDF (required)</label>
          <input type="file" onChange={(e) => setPdf(e.target.files[0])} />
        </div>
        <button type="submit" className="bg-green-500 px-4 py-2 mt-2 text-white">
          Add Diploma
        </button>
      </form>

      {/* Saved diplomas */}
      <div className="mt-10 text-black">
        <h3 className="text-xl mb-2">Saved Diplomas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diplomas.map((d) => (
            <div key={d._id} className="border p-4 rounded shadow">
              <h4 className="font-bold">{d.title}</h4>
              {d.subtitle && <p>{d.subtitle}</p>}
              {d.pdfUrl ? (
                <div className="flex items-center gap-x-2 mt-2">
                  <a href={d.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeletePdf(d._id)}
                  >
                    Delete PDF
                  </button>
                </div>
              ) : (
                <p className="text-red-500 mt-1">No PDF uploaded</p>
              )}
              <button
                className="text-red-600 mt-2"
                onClick={() => handleDeleteDiploma(d._id)}
              >
                Delete Diploma
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectionDiplomaAdmin;
