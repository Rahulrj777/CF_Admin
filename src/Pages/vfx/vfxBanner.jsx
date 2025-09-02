import { useState, useEffect } from "react";

const VfxBanner = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/vfxbanner`);
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
      const res = await fetch(`${API_BASE}/vfxbanner/upload`, {
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
      const res = await fetch(`${API_BASE}/vfxbanner/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setBanners((prev) => prev.filter((b) => b._id !== id));
      else setError(data.error || "Failed to delete banner");
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting banner");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Vfx Banners</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 flex gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
          disabled={!image || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Banner grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner._id} className="relative border rounded-lg overflow-hidden">
            <img src={banner.imageUrl} alt="banner" className="w-full h-40 object-cover" />
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

export default VfxBanner;
