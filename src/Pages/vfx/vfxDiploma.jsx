import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const VfxDiplomaAdmin = () => {
  const [images, setImages] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [savedPdf, setSavedPdf] = useState(null);
  const [fileImage, setFileImage] = useState(null);

  const fetchDiploma = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vfxdiploma`);
      setImages(res.data.images || []);
      setSavedPdf(res.data.pdf || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiploma();
  }, []);

  // ---------------- Image ----------------
  const uploadImage = async () => {
    if (!fileImage) return;
    const formData = new FormData();
    formData.append("image", fileImage);
    await axios.post(`${API_BASE}/vfxdiploma/images`, formData);
    setFileImage(null);
    fetchDiploma();
  };

  const deleteImage = async (publicId) => {
    await axios.delete(`${API_BASE}/vfxdiploma/images/${publicId}`);
    fetchDiploma();
  };

  // ---------------- PDF ----------------
  const uploadPdf = async () => {
    if (!pdf) return;
    const formData = new FormData();
    formData.append("pdf", pdf);
    await axios.post(`${API_BASE}/vfxdiploma/pdf`, formData);
    setPdf(null);
    fetchDiploma();
  };

  const deletePdf = async () => {
    await axios.delete(`${API_BASE}/vfxdiploma/pdf`);
    fetchDiploma();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎨 VFX Diploma Admin</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">🖼 Images</h3>
        <input type="file" onChange={(e) => setFileImage(e.target.files[0])} />
        <button onClick={uploadImage} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
          Upload
        </button>
        <div className="flex gap-4 mt-4 flex-wrap">
          {images.map((img) => (
            <div key={img.publicId} className="relative">
              <img src={img.imageUrl} className="w-24 h-24 object-cover rounded" />
              <button
                onClick={() => deleteImage(img.publicId)}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">📄 PDF</h3>
        <input type="file" onChange={(e) => setPdf(e.target.files[0])} />
        <button onClick={uploadPdf} className="ml-2 px-3 py-1 bg-green-600 text-white rounded">
          Upload PDF
        </button>
        {savedPdf?.pdfUrl && (
          <div className="mt-2 flex items-center gap-2">
            <a href={savedPdf.pdfUrl} target="_blank" className="text-blue-500 underline">
              View PDF
            </a>
            <button onClick={deletePdf} className="px-2 py-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VfxDiplomaAdmin;
