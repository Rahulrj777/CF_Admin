import { useState, useEffect } from "react";

const StageUnrealBanner = () => {
  const [banners, setBanners] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // ✅ Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/stageunrealbanner`);
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners");
      }
    };
    fetchBanners();
  }, [API_BASE]);

  // ✅ Upload new banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", video);

    try {
      const res = await fetch(`${API_BASE}/stageunrealbanner/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setBanners((prev) => [...prev, data]);
        setVideo(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete banner
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/stageunrealbanner/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
      } else {
        setError(data.error || "Failed to delete video");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting video");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🎥 Manage Stage Unreal Videos
      </h2>

      {error && (
        <div className="text-red-600 mb-6 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="mb-10 bg-gray-50 p-6 rounded-xl shadow-inner space-y-4"
      >
        <label className="block font-medium mb-2 text-gray-700">
          Upload Stage Unreal Video:
        </label>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={!video || uploading}
            className={`px-6 py-3 rounded-md text-white font-semibold transition
        ${
          uploading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
          >
            {uploading ? "Uploading..." : "🚀 Upload Video"}
          </button>
        </div>
      </form>

      {/* Video List */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        📂 Uploaded Videos
      </h3>
      {banners.length === 0 ? (
        <p className="text-center text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="relative border rounded-xl overflow-hidden shadow hover:shadow-md transition"
            >
              <video
                src={banner.videoUrl}
                controls
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleDelete(banner._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StageUnrealBanner;
