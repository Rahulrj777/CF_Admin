import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const DirectionFilmography = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Load existing filmography
  useEffect(() => {
    axios
      .get(`${API_BASE}/directionfilmography`)
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error(err);
        setItems([]);
      });
  }, []);

  // Handle file selection + preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  // Upload file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true); // ✅ start uploading
      const res = await axios.post(
        `${API_BASE}/directionfilmography/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setItems((prev) => [...prev, res.data.item]);
      setFile(null);
      setPreview(null);
      setMessage("✅ Uploaded successfully");
    } catch (err) {
      console.error("Upload failed", err);
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false); // ✅ end uploading
    }
  };

  // Delete item
  const handleDelete = async (publicId) => {
    try {
      const url = `${API_BASE}/cinematographyfilmography/${encodeURIComponent(
        publicId
      )}`;
      console.log("Deleting mentor at:", url);

      await axios.delete(url);
      setItems((prev) => prev.filter((item) => item.publicId !== publicId));
      setMessage("🗑️ Mentor deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      setMessage("❌ Delete failed. Try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Filmography</h2>

      <form onSubmit={handleUpload} className="mb-6">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 ml-2 rounded"
        >
          Upload
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.publicId} className="relative">
            <img
              src={item.imageUrl}
              alt=""
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(item.publicId)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectionFilmography;
