import { useState, useEffect } from "react";

export default function HomeExclusive() {
  const [exclusives, setExclusives] = useState([]);
  const [image, setImage] = useState(null);
  const [titleLine, setTitleLine] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // ✅ Fetch existing exclusives
  useEffect(() => {
    const fetchExclusives = async () => {
      try {
        const res = await fetch(`${API_BASE}/exclusive`);
        const data = await res.json();
        setExclusives(data);
      } catch (err) {
        console.error("Error fetching exclusives:", err);
        setError("Failed to load exclusives");
      }
    };
    fetchExclusives();
  }, [API_BASE]);

  // ✅ Upload new exclusive
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image || !titleLine) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("titleLine", titleLine);

    try {
      const res = await fetch(`${API_BASE}/exclusive/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setExclusives((prev) => [...prev, data]);
        setImage(null);
        setTitleLine("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload exclusive");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete exclusive
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/exclusive/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setExclusives((prev) => prev.filter((ex) => ex._id !== id));
      } else {
        setError(data.error || "Failed to delete exclusive");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting exclusive");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Exclusives</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2"
        />
        <input
          type="text"
          value={titleLine}
          onChange={(e) => setTitleLine(e.target.value)}
          placeholder="Enter exclusive title"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
          disabled={!image || !titleLine || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Exclusives grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exclusives.map((ex) => (
          <div
            key={ex._id}
            className="relative border rounded-lg overflow-hidden"
          >
            <img
              src={ex.imageUrl}
              alt="exclusive"
              className="w-full h-40 object-cover"
            />
            <div className="p-2 font-medium text-center">{ex.titleLine}</div>
            <button
              onClick={() => handleDelete(ex._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
