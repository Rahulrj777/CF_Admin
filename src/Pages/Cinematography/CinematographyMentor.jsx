import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const CinematographyMentor = () => {
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
      const res = await axios.get(`${API_BASE}/cinematographymentor`);
      const mentorData = res.data?.cinematography?.mentor || [];
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
        `${API_BASE}/cinematographymentor/upload`,
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
      const url = `${API_BASE}/cinematographymentor/${encodeURIComponent(publicId)}`;
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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        👨‍🏫 Manage Mentors
      </h2>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-5"
      >
        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter mentor description"
          className="border p-3 w-full rounded h-28"
        />

        {/* File input + preview + button */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* File box */}
          <div className="flex-1">
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="mentor-upload"
              />
              <label
                htmlFor="mentor-upload"
                className="cursor-pointer text-sm block"
              >
                {preview ? (
                  <img
                    src={preview}
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

          {/* Upload button */}
          <button
            type="submit"
            className="px-6 py-3 rounded-md text-white font-semibold transition 
          bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            🚀 Upload Mentor
          </button>
        </div>
      </form>

      {message && (
        <p className="mb-6 text-center text-sm text-gray-600">{message}</p>
      )}

      {/* Mentors List */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        📌 Current Mentors
      </h3>
      {mentors.length === 0 ? (
        <p className="text-gray-500">No mentors uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <div
              key={mentor.publicId}
              className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col text-center"
            >
              <img
                src={mentor.imageUrl}
                alt="Mentor"
                className="h-60 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm text-gray-700 mb-4">
                  {mentor.description}
                </p>
                <button
                  onClick={() => handleDelete(mentor.publicId)}
                  className="mt-auto px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
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

export default CinematographyMentor;
