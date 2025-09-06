import { useState, useEffect } from "react";

const StageUnrealBanner = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/stageunrealbanner`);
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners");
      }
    };
    fetchBanners();
  }, [API_BASE]);

  // Upload new banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE}/stageunrealbanner/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) setError(data.error);
      else setBanners((prev) => [...prev, data]);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/stageunrealbanner/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) setBanners((prev) => prev.filter((b) => b._id !== id));
      else setError(data.error || "Failed to delete banner");
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting banner");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🖼 Manage Banners
      </h2>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-5"
      >
        <label className="block mb-2 font-medium">Upload Banner:</label>

        {/* make all controls inline */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* file input */}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="border-2 border-dashed border-gray-300 p-4 rounded-lg w-full"
            />
          </div>

          {/* upload button */}
          <button
            type="submit"
            disabled={!image || uploading}
            className={`px-6 py-3 rounded-md text-white font-semibold transition
        ${
          uploading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
          >
            {uploading ? "Uploading..." : "🚀 Upload Banner"}
          </button>
        </div>
      </form>

      {/* Existing Banners */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        📌 Existing Banners
      </h3>
      {banners.length === 0 ? (
        <p className="text-gray-500">No banners uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={banner.imageUrl}
                alt="banner"
                className="h-40 w-full object-fill"
              />
              <div className="p-4 flex flex-col flex-grow">
                <button
                  onClick={() => handleDelete(banner._id)}
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

export default StageUnrealBanner;
