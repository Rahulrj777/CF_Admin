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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Stage Unreal Videos</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 flex gap-4 items-center">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className="border p-2"
        />
        <button
          type="submit"
          disabled={!video || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Video List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="relative border rounded-lg overflow-hidden"
          >
            <video
              src={banner.videoUrl}
              controls
              className="w-full h-64 object-cover"
            />
            <button
              onClick={() => handleDelete(banner._id)}
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

export default StageUnrealBanner;
