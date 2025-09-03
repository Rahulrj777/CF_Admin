import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const DirectorMentor = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [mentors, setMentors] = useState([]);

  // Fetch mentors on load
  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/directionmentor`);
      const mentorData = res.data?.direction?.mentor || [];
      setMentors(Array.isArray(mentorData) ? mentorData : []);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setMentors([]);
    }
  };

  // Handle image select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Upload image + paragraph
  const handleUpload = async () => {
    if (!file || !description.trim()) {
      setMessage("⚠️ Please provide both an image and a description.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);

    try {
      const res = await axios.post(
        `${API_BASE}/directionmentor/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      fetchMentors();
      setFile(null);
      setPreview(null);
      setDescription("");
      setMessage("✅ Mentor uploaded successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Upload failed. Try again.");
    }
  };

  // Delete mentor
  const handleDelete = async (publicId) => {
    try {
      const url = `${API_BASE}/directionmentor/${encodeURIComponent(publicId)}`;
      console.log("Deleting mentor at:", url);

      await axios.delete(url);
      setMentors((prev) => prev.filter((m) => m.publicId !== publicId));
      setMessage("🗑️ Mentor deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      setMessage("❌ Delete failed. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Mentors</h2>

      {/* Upload Form */}
      <div className="mb-8">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter mentor description"
          className="border p-2 w-full mb-4 rounded h-24"
        />

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
          Upload Mentor
        </button>
      </div>

      {message && <p className="mb-6 text-center text-sm">{message}</p>}

      {/* Mentors List */}
      <h3 className="text-xl font-semibold mb-4">Current Mentors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.publicId}
            className="border rounded-lg p-4 text-center shadow-sm"
          >
            <img
              src={mentor.imageUrl}
              alt="Mentor"
              className="w-32 h-32 object-cover mx-auto rounded-lg"
            />
            <p className="mt-4 text-sm text-gray-700">{mentor.designation}</p>
            <button
              onClick={() => handleDelete(mentor.publicId)}
              className="mt-4 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectorMentor;
