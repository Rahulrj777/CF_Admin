import { useState, useEffect } from "react";
import axios from "axios";

export default function VfxHighlights() {
  const [titleLine, setTitleLine] = useState("");
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // Fetch highlights from MongoDB/Cloudinary
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vfxhighlights`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching highlights:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle new highlight upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !titleLine) return alert("⚠️ Image and title required");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("titleLine", titleLine);

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/vfxhighlights/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(null);
      setTitleLine("");
      fetchItems();
      alert("✅ Highlight uploaded!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this highlight?"))
      return;

    try {
      await axios.delete(`${API_BASE}/vfxhighlights/${_id}`);
      fetchItems();
      alert("🗑️ Deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Delete failed. Try again.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        👥 Manage Mentors
      </h2>

      {/* Upload Form */}
      <div className="mb-10 bg-gray-50 p-6 rounded-xl shadow-inner">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter mentor description..."
          className="border-2 border-gray-300 p-3 w-full mb-4 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-4 border-2 border-dashed border-gray-300 p-3 rounded-lg cursor-pointer"
        />

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover mx-auto rounded-lg shadow-md border"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          🚀 Upload Mentor
        </button>
      </div>

      {message && (
        <p className="mb-8 text-center text-sm text-green-600 font-medium">
          {message}
        </p>
      )}

      {/* Mentors List */}
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        📋 Current Mentors
      </h3>
      {mentors.length === 0 ? (
        <p className="text-center text-gray-500">No mentors uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-8">
          {mentors.map((mentor) => (
            <div
              key={mentor.publicId}
              className="border rounded-xl p-6 text-center shadow hover:shadow-md transition"
            >
              <img
                src={mentor.imageUrl}
                alt="Mentor"
                className="w-32 h-32 object-cover mx-auto rounded-lg border shadow-sm"
              />
              <p className="mt-4 text-sm text-gray-700">{mentor.description}</p>
              <button
                onClick={() => handleDelete(mentor.publicId)}
                className="mt-4 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
