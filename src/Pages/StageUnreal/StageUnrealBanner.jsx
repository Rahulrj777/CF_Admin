import { useState, useEffect } from "react";
import axios from "axios";

const StageUnrealBanner = () => {
  const [banners, setBanners] = useState([]);
  const [video, setVideo] = useState(null);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/stageunrealbanner/");
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
    if (!video) return;

    const formData = new FormData();
    formData.append("video", video);

    try {
      await axios.post("http://localhost:5000/stageunrealbanner/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setVideo(null);
      fetchBanners();
    } catch (err) {
      console.error("Error uploading video:", err);
    }
  };

  // Delete banner
  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`http://localhost:5000/stageunrealbanner/${fileName}`);
      fetchBanners();
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Stage Unreal Videos</h2>

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
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Upload
        </button>
      </form>

      {/* Video List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative border rounded-lg overflow-hidden"
          >
            <video
              src={banner.url}
              controls
              className="w-full h-64 object-cover"
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

export default StageUnrealBanner;
