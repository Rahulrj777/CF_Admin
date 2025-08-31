import { useState } from "react";

// Replace these with your Cloudinary details
const CLOUD_NAME = "dshnmht7c";
const UPLOAD_PRESET = "CF_Frontend";

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
const handleUpload = async (e) => {
  e.preventDefault();
  if (!image) return;

  setUploading(true); // ✅ 4th point: start uploading

  const formData = new FormData();
  formData.append("image", image); // must match multer field name

  try {
    // ✅ 3rd point: use dynamic backend URL
    const API_BASE = import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";
    const res = await fetch(`${API_BASE}/homebanner/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded image:", data);

    if (data.error) {
      console.error("Upload error:", data.error);
      setError(data.error);
    } else {
      console.log("Uploaded image:", data);
      setBanners((prev) => [...prev, data]);
    }
  } catch (err) {
    console.error("Frontend upload error:", err);
    setError(err.message);
  } finally {
    setUploading(false); // ✅ 4th point: finish uploading
  }
};

  const handleDelete = (publicId) => {
    // Just remove from local state (optional: send to backend to delete from DB)
    setBanners(banners.filter((b) => b.publicId !== publicId));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Home Banners</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.publicId}
            className="relative border rounded-lg overflow-hidden"
          >
            <img
              src={banner.imageUrl || "/placeholder.svg"}
              alt="banner"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(banner.publicId)}
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

export default HomeBanner;
