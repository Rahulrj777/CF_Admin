import { useState, useEffect } from "react";
import axios from "axios";

const VirtualProductionBanner = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/virtualproductionbanner/");
      setBanners(res.data);
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Upload banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/virtualproductionbanner/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImage(null);
      fetchBanners();
    } catch (err) {
      console.error("Error uploading banner:", err);
    }
  };

  // Delete banner
  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`http://localhost:5000/virtualproductionbanner/${fileName}`);
      fetchBanners();
    } catch (err) {
      console.error("Error deleting banner:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Home Banners</h2>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 flex gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Upload
        </button>
      </form>

      {/* Banner List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative border rounded-lg overflow-hidden"
          >
            <img
              src={banner.url}
              alt="banner"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(banner.fileName)}
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

export default VirtualProductionBanner;
