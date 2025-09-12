import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE } from "../../Utils/Api.js";

const categories = [
  "guest-lecture",
  "highlights",
  "new-launches",
  "review",
  "student-works",
];

const VideoGalleryBanner = () => {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/videogallerybanner/${category}`);
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [category]);

  const handleUpload = async () => {
    if (videos.length >= 5) {
      return alert("Maximum 5 videos allowed for this category. Please delete one first.");
    }
    if (!file) return alert("Please select a video");
    if (!title.trim()) return alert("Please enter a title");

    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("category", category);

    try {
      await axios.post(`${API_BASE}/videogallerybanner/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchVideos();
      setFile(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (_id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${API_BASE}/videogallerybanner/${_id}`);
      await fetchVideos();
      alert("Video deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert(`Delete failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎬 Video Gallery Banner
          </h1>
          <p className="text-gray-600">Upload and manage up to 5 banner videos per category</p>
        </div>

        {/* Upload Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📤 Upload New Banner Video</h2>

          {videos.length >= 5 ? (
            <p className="text-red-600 font-medium">
              Maximum of 5 videos reached in this category. Delete one to upload a new video.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border-2 border-dashed cursor-pointer border-indigo-300 rounded-lg p-4 bg-white focus:border-indigo-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg p-4 bg-white focus:border-indigo-500 focus:outline-none"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg p-4 bg-white focus:border-indigo-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                onClick={handleUpload}
                disabled={!file || !title || uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}

          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Video List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📹 Uploaded Videos in "{category}" ({videos.length}/5)
          </h2>
          {videos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">📹</div>
              <p className="text-gray-500">No videos uploaded yet</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-80">
                      <video
                        controls
                        className="w-full rounded-lg shadow-md"
                        preload="metadata"
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                      </video>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {video.title || "Untitled Video"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          📂 Category: <span className="font-medium">{video.category}</span>
                        </p>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGalleryBanner;
