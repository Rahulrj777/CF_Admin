import { useState, useEffect } from "react";

const HomeMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com";

  // ✅ Fetch existing mentors on mount
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

  // ✅ Upload new mentor
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

  // ✅ Delete mentor (from backend + state)
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
    <div className="w-full md:max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        👨‍🏫 Manage Mentors
      </h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-lg shadow mb-10 space-y-5"
      >
        <label className="block mb-2 font-medium">Upload Mentor Photo:</label>

        {/* Wrap file box + button together */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image Upload */}
          <div className="flex-1">
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                id="mentor-upload"
              />
              <label
                htmlFor="mentor-upload"
                className="cursor-pointer text-sm block"
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="mx-auto w-48 h-48 object-contain object-top rounded-lg shadow"
                  />
                ) : (
                  <span className="text-gray-500">
                    Drag & Drop or Click to Upload
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={!image || uploading}
            className={`w-full md:w-auto px-6 py-3 rounded-md text-white font-semibold transition ${
              uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "🚀 Upload Mentor"}
          </button>
        </div>
      </form>

      {/* Mentor grid */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        📌 Existing Mentors
      </h3>
      {mentors.length === 0 ? (
        <p className="text-gray-500">No mentors uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={mentor.imageUrl}
                alt="mentor"
                className="h-50 w-full object-contain"
              />
              <div className="p-4 flex flex-col flex-grow">
                <button
                  onClick={() => handleDelete(mentor._id)}
                  className="mt-auto px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeMentor;
