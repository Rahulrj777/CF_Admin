import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../Utils/Api.js";

const HomeMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch mentors on mount
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get(`${API_BASE}/homementors`);
        setMentors(res.data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors");
      }
    };
    fetchMentors();
  }, []);

  // ✅ Handle file select
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // ✅ Upload new mentor
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(`${API_BASE}/homementors/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMentors((prev) => [...prev, res.data]);
      setImage(null);
      setError(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload mentor image");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete mentor
  const handleDelete = async (_id) => {
    try {
      const res = await axios.delete(`${API_BASE}/homementors/${_id}`);
      if (res.data.success) {
        setMentors((prev) => prev.filter((m) => m._id !== _id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete mentor");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Mentors</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 flex gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
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

      {/* Mentor grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="relative border rounded-lg p-3 text-center shadow-sm"
          >
            <img
              src={mentor.imageUrl}
              alt="Mentor"
              className="w-32 h-32 object-cover mx-auto rounded-full"
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

export default HomeMentors;
