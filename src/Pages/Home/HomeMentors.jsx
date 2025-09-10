import { useState, useEffect } from "react";

const HomeMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${API_BASE}/mentors`);
        const data = await res.json();
        console.log("Fetched mentors:", data);
        setMentors(data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors");
      }
    };
    fetchMentors();
  }, [API_BASE]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE}/mentors/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMentors((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Frontend upload error:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/mentors/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setMentors((prev) => prev.filter((b) => b._id !== id));
      } else {
        setError(data.error || "Failed to delete mentor");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting mentor");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        👨‍🏫 Upload Mentor Photo
      </h2>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-4"
      >
        <label className="block font-medium mb-2">
          Select Mentor Image:
        </label>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="flex-1 border-2 border-dashed border-gray-300 rounded p-3 cursor-pointer"
          />
          <button
            type="submit"
            disabled={!image || uploading}
            className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition ${
              uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "🚀 Upload"}
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        📂 Existing Mentors
      </h3>

      {mentors.length === 0 ? (
        <p className="text-gray-500 text-center">
          No mentors uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="relative border rounded-lg overflow-hidden shadow-md bg-white"
            >
              <img
                src={mentor.imageUrl}
                alt="mentor"
                className="w-full h-55 lg:h-70 object-contain lg:object-cover "
              />
              <button
                onClick={() => handleDelete(mentor._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeMentor;
