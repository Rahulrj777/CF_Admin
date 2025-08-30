import { useState, useEffect } from "react";
import axios from "axios";

const StageUnrealFilmography = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/stageunrealfilmography")
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/stageunrealfilmography/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setItems([...items, res.data.item]);
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/stageunrealfilmography/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Filmography</h2>
      
      <form onSubmit={handleUpload} className="mb-6">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" className="bg-black text-white px-4 py-2 ml-2 rounded">
          Upload
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <img src={`http://localhost:5000${item.image}`} alt="" className="w-full h-40 object-cover" />
            <button
              onClick={() => handleDelete(item.id)}
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

export default StageUnrealFilmography;
