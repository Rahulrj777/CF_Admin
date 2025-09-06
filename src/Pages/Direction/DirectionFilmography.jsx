import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const DirectionFilmography = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(""); // add this at the top

  useEffect(() => {
    axios
      .get(`${API_BASE}/directionfilmography`)
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
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${API_BASE}/directionfilmography/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setItems([...items, res.data.item]);
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Delete mentor
  const handleDelete = async (publicId) => {
    try {
      const url = `${API_BASE}/directionfilmography/${encodeURIComponent(
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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🎥 Manage Filmographys
      </h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-5"
      >
        <label className="block mb-2 font-medium">Upload Mentor Photo:</label>

        {/* Wrap file box + button together */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Image Upload */}
          <div className="flex-1">
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                id="mentor-upload"
              />
              <label
                htmlFor="mentor-upload"
                className="cursor-pointer text-sm block"
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="mx-auto w-48 h-48 object-cover rounded-lg shadow"
                  />
                ) : (
                  <span className="text-gray-500">
                    Drag & Drop or Click to Upload
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={!image || uploading}
            className={`px-6 py-3 rounded-md text-white font-semibold transition
        ${
          uploading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
          >
            {uploading ? "Uploading..." : "🚀 Upload Mentor"}
          </button>
        </div>
      </form>

      {/* Filmography grid */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        📌 Existing Filmographys
      </h3>
      {filmographys.length === 0 ? (
        <p className="text-gray-500">No filmographys uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {filmographys.map((filmography) => (
            <div
              key={filmography._id}
              className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={filmography.imageUrl}
                alt="filmography"
                className="h-58 w-full object-cover" // taller image like banner/mentor style
              />
              <div className="p-4 flex flex-col flex-grow">
                <button
                  onClick={() => handleDelete(filmography._id)}
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
};

export default DirectionFilmography;
