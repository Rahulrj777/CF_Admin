import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const DirectionFilmography = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Load existing filmography
  useEffect(() => {
    axios
      .get(`${API_BASE}/directionfilmography`)
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error(err);
        setItems([]);
      });
  }, []);

  // Handle file selection + preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  // Upload file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true); // ✅ start uploading
      const res = await axios.post(
        `${API_BASE}/directionfilmography/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setItems((prev) => [...prev, res.data.item]);
      setFile(null);
      setPreview(null);
      setMessage("✅ Uploaded successfully");
    } catch (err) {
      console.error("Upload failed", err);
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false); // ✅ end uploading
    }
  };

  // Delete item
  const handleDelete = async (publicId) => {
    try {
      const url = `${API_BASE}/cinematographyfilmography/${encodeURIComponent(
        publicId
      )}`;
      console.log("Deleting mentor at:", url);

      await axios.delete(url);
      setItems((prev) => prev.filter((item) => item.publicId !== publicId));
      setMessage("🗑️ Mentor deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      setMessage("❌ Delete failed. Try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">🎬 Upload Filmography</h2>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-4"
      >
        <label className="block font-medium mb-2">Select Filmography Image:</label>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            disabled={!file || uploading}
            className={`px-6 py-3 rounded-md text-white font-semibold transition ${
              uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "🚀 Upload"}
          </button>
        </div>
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover mx-auto rounded-lg shadow"
            />
          </div>
        )}
      </form>

      {message && (
        <p className="text-center mb-6 text-sm text-gray-700">{message}</p>
      )}

      {/* Items Grid */}
      <h3 className="text-xl font-semibold mb-6 text-gray-800">📂 Existing Filmography</h3>
      {items.length === 0 ? (
        <p className="text-gray-500 text-center">No filmography uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.publicId}
              className="relative border rounded-lg overflow-hidden shadow-md bg-white"
            >
              <img
                src={item.imageUrl}
                alt="Filmography"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleDelete(item.publicId)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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

export default DirectionFilmography;
