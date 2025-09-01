import { useState, useEffect } from "react";

const HomeMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // ✅ Fetch existing mentors on mount
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${API_BASE}/mentors`);
        const data = await res.json();
        console.log("Fetched mentors:", data);
        setMentors(data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors");
      }
    };
    fetchMentors();
  }, [API_BASE]);

  // ✅ Upload new mentor
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE}/mentors/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMentors((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Frontend upload error:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete mentor (from backend + state)
const handleDelete = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/mentors/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setMentors((prev) => prev.filter((b) => b._id !== id));
    } else {
      setError(data.error || "Failed to delete mentor");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("Error deleting mentor");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Home Mentors</h2>

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

      {/* mentor grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="relative border rounded-lg overflow-hidden"
          >
            <img
              src={mentor.imageUrl}
              alt="mentor"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(mentor._id)}
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

export default HomeMentor;
