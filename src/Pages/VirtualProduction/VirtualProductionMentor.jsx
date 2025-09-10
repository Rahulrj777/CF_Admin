import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const VirtualProductionMentor = () => {
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
      const res = await axios.get(`${API_BASE}/virtualproductionmentor`);
      const mentorData = res.data?.virtualProduction?.mentor || [];
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
        `${API_BASE}/virtualproductionmentor/upload`,
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
      const url = `${API_BASE}/virtualproductionmentor/${encodeURIComponent(publicId)}`;
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
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        👥 Manage Mentors
      </h2>

      {/* Upload Form */}
      <div className="mb-10 bg-gray-50 p-6 rounded-xl shadow-inner">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter mentor description..."
          className="border-2 border-gray-300 p-3 w-full mb-4 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-4 border-2 border-dashed border-gray-300 p-3 rounded-lg cursor-pointer"
        />

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-contain object-top mx-auto rounded-lg shadow-md border"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full cursor-pointer md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          🚀 Upload Mentor
        </button>
      </div>

      {message && (
        <p className="mb-8 text-center text-sm text-green-600 font-medium">
          {message}
        </p>
      )}

      {/* Mentors List */}
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        📋 Current Mentors
      </h3>
      {mentors.length === 0 ? (
        <p className="text-center text-gray-500">No mentors uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-8">
          {mentors.map((mentor) => (
            <div
              key={mentor.publicId}
              className="relative border rounded-xl p-6 text-center shadow hover:shadow-md transition group"
            >
              <img
                src={mentor.imageUrl}
                alt="Mentor"
                className="w-32 h-32 object-cover object-top mx-auto rounded-lg border shadow-sm"
              />
              <p className="mt-4 text-sm text-gray-700">{mentor.description}</p>
               <button
                onClick={() => handleDelete(mentor._id)}
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
};

export default VirtualProductionMentor;
