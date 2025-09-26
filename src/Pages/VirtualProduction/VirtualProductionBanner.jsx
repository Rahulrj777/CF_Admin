import { useState, useEffect } from "react";
import { API_BASE } from "../../Utils/Api.js";

const VirtualProductionBanner = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/virtualproductionbanner`);
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
    if (!image) {
      alert("⚠️ Please select an image before uploading.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE}/virtualproductionbanner/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        alert(`❌ Upload failed: ${data.error}`);
      } else {
        setBanners((prev) => [...prev, data]);
        alert("✅ Banner uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`❌ Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "❓ Are you sure you want to delete this banner?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/virtualproductionbanner/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
        alert("🗑️ Banner deleted successfully!");
      } else {
        alert(`❌ Delete failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(`❌ Delete failed: ${err.message}`);
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
              className="border-2 border-dashed border-gray-300 cursor-pointer p-4 rounded-lg w-full"
            />
          </div>

          {/* upload button */}
          <button
            type="submit"
            disabled={!image || uploading}
            className={`px-6 py-3 rounded-md text-white cursor-pointer font-semibold transition
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
              className="relative border rounded-lg overflow-hidden shadow-md bg-white flex flex-col group"
            >
              <img
                src={banner.imageUrl}
                alt="banner"
                className="h-42 w-full object-fill"
              />
              <button
                onClick={() => handleDelete(banner._id)}
                className="absolute top-2 right-2 cursor-pointer bg-red-500 text-white px-2 py-1 rounded opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
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

export default VirtualProductionBanner;
