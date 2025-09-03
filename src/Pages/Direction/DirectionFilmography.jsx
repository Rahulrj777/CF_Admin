import { useState, useEffect } from "react";

const DirectionFilmography = () => {
  const [filmographys, setFilmographys] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // ✅ Fetch existing filmographys on mount
  useEffect(() => {
    const fetchFilmographys = async () => {
      try {
        const res = await fetch(`${API_BASE}/directionfilmography`);
        const data = await res.json();
        console.log("Fetched filmographys:", data);
        setFilmographys(data);
      } catch (err) {
        console.error("Error fetching filmographys:", err);
        setError("Failed to load filmographys");
      }
    };
    fetchFilmographys();
  }, [API_BASE]);

  // ✅ Upload new filmography
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE}/directionfilmography/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setFilmographys((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Frontend upload error:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete filmography (from backend + state)
const handleDelete = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/directionfilmography/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setFilmographys((prev) => prev.filter((b) => b._id !== id));
    } else {
      setError(data.error || "Failed to delete filmography");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("Error deleting filmography");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Direction Filmographys</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 flex gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
          disabled={!image || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* filmography grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filmographys.map((filmography) => (
          <div
            key={filmography._id}
            className="relative border rounded-lg overflow-hidden"
          >
            <img
              src={filmography.imageUrl}
              alt="filmography"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(filmography._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectionFilmography;
