import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../Utils/Api.js"; // Import API_BASE

export default function HomeExclusive() {
  const [titleLine, setTitleLine] = useState("");
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/exclusive`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !titleLine) return alert("Image and text required");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("titleLine", titleLine);

    try {
      await axios.post(`${API_BASE}/exclusive`, formData);
      setImage(null);
      setTitleLine("");
      fetchItems();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${API_BASE}/exclusive/${_id}`);
      fetchItems();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">🎬 Cinema Factory Exclusive</h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow mb-8 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Upload Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 w-40 h-28 object-cover rounded-md shadow"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Exclusive Title:</label>
          <input
            type="text"
            value={titleLine}
            onChange={(e) => setTitleLine(e.target.value)}
            placeholder="Enter exclusive title"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Upload
        </button>
      </form>

      {/* Existing Items */}
      <h3 className="text-xl font-semibold mb-4">Existing Exclusive</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border rounded-lg p-3 flex flex-col items-center shadow-sm">
            <img
              src={item.imageUrl} // Updated for Cloudinary
              alt="Exclusive"
              className="w-40 h-28 object-cover rounded-md mb-2"
            />
            <p className="text-sm text-center mb-2">{item.titleLine}</p>
            <button
              onClick={() => handleDelete(item._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
