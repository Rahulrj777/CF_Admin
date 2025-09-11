import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE } from "../../Utils/Api.js"; // keep your API_BASE import

const NewLaunches = () => {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/videos`);
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a video");
    if (!title.trim()) return alert("Please enter a title");

    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      await axios.post(`${API_BASE}/videos/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchVideos();
      setFile(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (_id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${API_BASE}/videos/${_id}`);
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
            🎬 New Launches Video Gallery
          </h1>
          <p className="text-gray-600">Upload and manage our New Launches</p>
        </div>

        {/* Upload Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📤 Upload New Video</h2>
          <div className="flex lg:flex-col flex-row gap-4">
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 border-2 border-dashed cursor-pointer border-indigo-300 rounded-lg p-4 bg-white focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border rounded-lg p-4 bg-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleUpload}
              disabled={!file || !title || uploading}
              className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 min-w-[120px]"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Video List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📹 Uploaded Videos ({videos.length})
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
                      </div>
                      <div className="flex gap-3">
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

export default NewLaunches;
