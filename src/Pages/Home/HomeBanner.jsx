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

  const formData = new FormData();
  formData.append("image", image); // "image" must match your multer field name

  try {
    const res = await fetch("https://cf-server-tr24.onrender.com/homebanner/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.error) {
      console.error("Upload error:", data.error);
      return;
    }

    console.log("Uploaded image:", data);
    // Optionally update local state to show banner
    setBanners((prev) => [...prev, data]);
  } catch (err) {
    console.error("Frontend upload error:", err);
  }
};

  const handleDelete = (public_id) => {
    // Just remove from local state (optional: send to backend to delete from DB)
    setBanners(banners.filter((b) => b.public_id !== public_id));
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
            key={banner.public_id}
            className="relative border rounded-lg overflow-hidden"
          >
            <img
              src={banner.imageUrl || "/placeholder.svg"}
              alt="banner"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(banner.public_id)}
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
