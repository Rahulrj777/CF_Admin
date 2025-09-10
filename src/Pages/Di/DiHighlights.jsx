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
// Upload highlight
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!image || !titleLine) {
    alert("⚠️ Please provide both an image and a title.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);
  formData.append("titleLine", titleLine);

  try {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/dihighlights/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setImage(null);
    setTitleLine("");
    fetchItems(); // refresh the list
    alert("✅ Highlight uploaded successfully!");
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err.message);
    alert(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
  } finally {
    setLoading(false);
  }
};

// Delete highlight with confirmation
const handleDelete = async (_id) => {
  const confirmed = window.confirm("❓ Are you sure you want to delete this highlight?");
  if (!confirmed) return;

  try {
    await axios.delete(`${API_BASE}/dihighlights/${_id}`);
    fetchItems(); // refresh the list
    alert("🗑️ Highlight deleted successfully!");
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
    alert(`❌ Delete failed: ${err.response?.data?.error || err.message}`);
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
                className="hidden cursor-pointer"
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
          className={`w-full py-3 rounded-md cursor-pointer text-white font-semibold transition ${
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative border rounded-lg justify-center items-center overflow-hidden shadow-md bg-white flex flex-col group"
            >
              <img
                src={item.imageUrl}
                alt="Exclusive"
                className="h-40 w-40 object-cover mx-auto mt-4"
              />
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-center font-medium mb-3">{item.titleLine}</p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-2 right-2 cursor-pointer bg-red-500 text-white px-3 py-2 rounded opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
