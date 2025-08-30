import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/mentors";

const HomeMentors = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [mentors, setMentors] = useState([]); // <-- store fetched mentors

  // 📌 Fetch mentors on load
  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await axios.get(API_URL);
      setMentors(res.data);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) {
      setMessage("⚠️ Please provide both name and image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Upload successful!");
      setFile(null);
      setPreview(null);
      setName("");
      setMentors((prev) => [...prev, res.data]); // <-- update UI immediately
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Upload failed. Try again.");
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${API_URL}/${filename}`);
      setMentors((prev) => prev.filter((m) => m.fileName !== filename)); // update UI
      setMessage("🗑️ Mentor deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("❌ Delete failed. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Mentor</h2>

      {/* Upload Form */}
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

      {/* Mentors List */}
      <h3 className="text-lg font-semibold mb-4">Mentors List</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="border rounded-lg p-3 text-center shadow-sm"
          >
            <img
              src={mentor.url}
              alt={mentor.name}
              className="w-32 h-32 object-cover mx-auto rounded-full"
            />
            <p className="mt-2 font-medium">{mentor.name}</p>
            <button
              onClick={() => handleDelete(mentor.fileName)}
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
