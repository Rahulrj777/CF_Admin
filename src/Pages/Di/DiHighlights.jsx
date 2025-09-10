import { useState, useEffect } from "react";
import axios from "axios";

export default function DiHighlights() {
  const [titleLine, setTitleLine] = useState("");
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // Fetch highlights from MongoDB/Cloudinary
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dihighlights`);
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
      await axios.post(`${API_BASE}/dihighlights/upload`, formData, {
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
      await axios.delete(`${API_BASE}/dihighlights/${_id}`);
      fetchItems();
      alert("🗑️ Deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Delete failed. Try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🎬 Cinema Factory Di Highlights
      </h2>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-5"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Image Upload */}
          <div className="w-full md:w-1/2">
            <label className="block mb-2 font-medium">Upload Image:</label>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer text-center">
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer text-sm">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="mx-auto w-48 h-32 object-contain rounded-lg shadow"
                  />
                ) : (
                  <span className="text-gray-500">
                    Drag & Drop or Click to Upload
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Title Input */}
          <div className="w-full md:w-1/2">
            <label className="block mb-2 font-medium">Highlight Title:</label>
            <input
              type="text"
              value={titleLine}
              onChange={(e) => setTitleLine(e.target.value)}
              placeholder="Enter highlight title"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-green-200"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Uploading..." : "🚀 Upload Highlight"}
        </button>
      </form>

      {/* Existing Highlights */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        📌 Existing Highlights
      </h3>
      {items.length === 0 ? (
        <p className="text-gray-500">No highlights uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg justify-center items-center overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={item.imageUrl}
                alt="Exclusive"
                className="h-40 w-40 object-contain"
              />
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-center font-medium mb-3">{item.titleLine}</p>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="mt-auto px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
