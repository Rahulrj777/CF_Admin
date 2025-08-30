import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../Utils/Api.js"; 

const HomeMentors = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [mentors, setMentors] = useState([]);

  // Fetch mentors
  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/mentors`);
      setMentors(res.data);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${API_BASE}/mentors/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Upload successful!");
      setFile(null);
      setPreview(null);
      setMentors((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Upload failed. Try again.");
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${API_BASE}/mentors/${_id}`);
      setMentors((prev) => prev.filter((m) => m._id !== _id));
      setMessage("🗑️ Mentor deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("❌ Delete failed. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Mentor Image</h2>

      <div className="mb-8">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover mx-auto rounded-lg shadow"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      {message && <p className="mb-6 text-center text-sm">{message}</p>}

      <h3 className="text-lg font-semibold mb-4">Mentors List</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="border rounded-lg p-3 text-center shadow-sm"
          >
            <img
              src={mentor.imageUrl} // Cloudinary URL
              alt="Mentor"
              className="w-32 h-32 object-cover mx-auto rounded-full"
            />
            <button
              onClick={() => handleDelete(mentor._id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
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
