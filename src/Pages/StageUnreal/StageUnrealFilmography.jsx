import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const StageUnrealFilmography = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(""); // add this at the top

  useEffect(() => {
    axios
      .get(`${API_BASE}/stageunrealfilmography`)
      .then((res) => {
        // If backend sends array → use directly, else fallback to []
        setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setItems([]); // fallback
      });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("⚠️ Please select an image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${API_BASE}/stageunrealfilmography/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setItems([...items, res.data.item]);
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
    }
  };

  // Delete mentor
  const handleDelete = async (publicId) => {
    const confirmed = window.confirm(
      "❓ Are you sure you want to delete this filmography item?"
    );
    if (!confirmed) return;

    try {
      const url = `${API_BASE}/stageunrealfilmography/${encodeURIComponent(
        publicId
      )}`;
      console.log("Deleting mentor at:", url);

      await axios.delete(url);
      setItems((prev) => prev.filter((item) => item.publicId !== publicId));
      alert("🗑️ Filmography item deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert(`❌ Delete failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🎬 Upload Filmography
      </h2>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-4"
      >
        <label className="block font-medium mb-2">
          Select Filmography Image:
        </label>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 border-2 border-dashed border-gray-300 rounded p-3 cursor-pointer"
          />
          <button
            type="submit"
            className="w-full md:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            🚀 Upload
          </button>
        </div>
      </form>

      {/* Items Grid */}
      <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        📂 Existing Filmography
      </h3>
      {items.length === 0 ? (
        <p className="text-gray-500 text-center">
          No filmography uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.publicId}
              className="relative border rounded-lg overflow-hidden shadow-md bg-white group"
            >
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-50 lg:h-70 object-cover"
              />
              <button
                onClick={() => handleDelete(item.publicId)}
                className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StageUnrealFilmography;
