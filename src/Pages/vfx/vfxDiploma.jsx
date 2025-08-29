import { useState, useEffect } from "react";
import axios from "axios";

const VfxDiplomaAdmin = () => {
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [images, setImages] = useState([]);
  const [savedPdf, setSavedPdf] = useState(null);

  // 🔹 Fetch images & PDF on mount
  useEffect(() => {
    fetchImages();
    fetchPdf();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/vfxdiploma");
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images", err);
    }
  };

  const fetchPdf = async () => {
    try {
      const res = await axios.get("http://localhost:5000/vfxdiploma/pdf");
      setSavedPdf(res.data); // { pdf: "/uploads/vfx/diploma/xxx.pdf" }
    } catch (err) {
      console.error("Error fetching PDF", err);
    }
  };

  // 🔹 Upload image
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("http://localhost:5000/vfxdiploma/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchImages(); // refresh list
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // 🔹 Delete image
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vfxdiploma/${id}`);
      fetchImages(); // refresh list
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // 🔹 Upload PDF
  const handlePdfUpload = async () => {
    if (!pdf) return;
    const formData = new FormData();
    formData.append("pdf", pdf);

    try {
      const res = await axios.post("http://localhost:5000/vfxdiploma/upload-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSavedPdf(res.data);
      setPdf(null);
    } catch (err) {
      console.error("PDF upload failed", err);
    }
  };

  const handlePdfDelete = async () => {
  try {
    await axios.delete("http://localhost:5000/vfxdiploma/pdf");
    setSavedPdf(null);
  } catch (err) {
    console.error("PDF delete failed", err);
  }
};


  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h2 className="text-2xl font-bold mb-6">🎨 VFX Diploma – Manage Content</h2>

      {/* ---------------- IMAGE SECTION ---------------- */}
      <h3 className="text-xl font-semibold mb-4">🖼 Manage Software Images</h3>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-black"
        />
        <button
          onClick={handleUpload}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Upload Image
        </button>
      </div>

      {images.length === 0 ? (
        <p className="text-gray-400">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={`http://localhost:5000${img.url}`}
                alt="software"
                className="w-28 md:w-40 object-contain rounded-lg border border-black p-2"
              />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-1 right-1 bg-white bg-opacity-70 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- PDF SECTION ---------------- */}
      <h3 className="text-xl font-semibold mb-4">📄 Manage Diploma PDF</h3>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          className="text-sm text-black"
        />
        <button
          onClick={handlePdfUpload}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          Upload PDF
        </button>
      </div>

     {savedPdf?.pdf ? (
        <div className="mt-4 relative inline-block group">
            <a
            href={`http://localhost:5000${savedPdf.pdf}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 pr-11 rounded text-white text-sm"
            >
            📥 See Pdf 
            </a>

            {/* Delete button */}
            <button
            onClick={async () => {
                try {
                await axios.delete("http://localhost:5000/vfxdiploma/pdf");
                setSavedPdf(null);
                } catch (err) {
                console.error("PDF delete failed", err);
                }
            }}
            className="absolute top-0 right-2 bg-red-500 bg-opacity-70 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
            ✕
            </button>
        </div>
        ) : (
        <p className="text-gray-400">No PDF uploaded yet.</p>
        )}
    </div>
  );
};

export default VfxDiplomaAdmin;
