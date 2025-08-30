import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../Utils/Api.js"

const HomeFilmography = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);

  // Fetch all filmography items
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/filmography`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching filmography items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Upload new filmography image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${API_BASE}/filmography/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // res.data.item is now just res.data in our MongoDB setup
      setItems([...items, res.data]);
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Delete filmography item
  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${API_BASE}/filmography/${_id}`);
      setItems(items.filter(item => item._id !== _id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Filmography</h2>
      
      <form onSubmit={handleUpload} className="mb-6 flex gap-2 items-center">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item._id} className="relative border rounded overflow-hidden">
            <img
              src={item.imageUrl} // use MongoDB + Cloudinary URL
              alt=""
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(item._id)}
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

export default HomeFilmography;
