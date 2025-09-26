import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Trash2,
  X,
  Upload,
  GraduationCap,
  ImageIcon,
  Camera,
} from "lucide-react";
import { API_BASE } from "../../Utils/Api.js";

const VfxDiplomaAdmin = () => {
  const [images, setImages] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [savedPdf, setSavedPdf] = useState("");
  const [fileImage, setFileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileKey, setFileKey] = useState(0);
  const [savingImage, setSavingImage] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);

  const fetchDiploma = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/vfxdiploma`);
      setImages(res.data.images || []);
      setSavedPdf(
        res.data.diplomaPdf?.pdfName ? `${API_BASE}/vfxdiploma/pdf/view` : ""
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiploma();
  }, []);

  // ---------------- Image ----------------
  const uploadImage = async () => {
    if (!fileImage) return;
    setSavingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", fileImage);
      await axios.post(`${API_BASE}/vfxdiploma/images`, formData);
      setFileImage(null);
      setFileKey((k) => k + 1);
      fetchDiploma();
      alert("Image uploaded successfully ✅");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image");
    } finally {
      setSavingImage(false);
    }
  };

  const deleteImage = async (publicId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE}/vfxdiploma/images/${encodeURIComponent(publicId)}`
      );
      fetchDiploma();
      alert("Image deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Error deleting image");
    }
  };

  // ---------------- PDF ----------------
  const uploadPdf = async () => {
    if (!pdf) return;
    setSavingPdf(true);
    try {
      const formData = new FormData();
      formData.append("pdf", pdf);
      await axios.post(`${API_BASE}/vfxdiploma/pdf`, formData);
      setPdf(null);
      setFileKey((k) => k + 1);
      fetchDiploma();
      alert("PDF uploaded successfully ✅");
    } catch (err) {
      console.error("Error uploading PDF:", err);
      alert("Error uploading PDF");
    } finally {
      setSavingPdf(false);
    }
  };

  const deletePdf = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PDF? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/vfxdiploma/pdf`);
      fetchDiploma();
      alert("PDF deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting PDF:", err);
      alert("Error deleting PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-600">
            Loading diploma data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-900 via-pink-800 to-red-800 bg-clip-text text-transparent">
                VFX Diploma Management
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Management Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Image Gallery
                  </h3>
                  <p className="text-orange-100">
                    Upload and manage VFX images
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {fileImage ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <ImageIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-800">
                            {fileImage.name}
                          </p>
                          <p className="text-sm text-blue-600">
                            Ready to upload
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFileImage(null);
                          setFileKey((k) => k + 1);
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={uploadImage}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      disabled={savingImage}
                    >
                      <Upload className="h-4 w-4" />
                      {savingImage ? "Uploading..." : "Upload Image"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full mb-6">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-orange-300 rounded-2xl cursor-pointer bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-4 bg-orange-100 rounded-2xl mb-4">
                        <Upload className="w-10 h-10 text-orange-600" />
                      </div>
                      <p className="mb-2 text-lg font-semibold text-orange-800">
                        Click to upload image
                      </p>
                      <p className="text-sm text-orange-600 font-medium">
                        JPG, PNG, GIF files (max 10MB)
                      </p>
                    </div>
                    <input
                      key={fileKey}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFileImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Image Gallery */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Uploaded Images ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((img) => (
                      <div key={img.publicId} className="relative group">
                        <img
                          src={img.imageUrl || "/placeholder.svg"}
                          alt="VFX Image"
                          className="w-full h-24 object-contain rounded-xl border-2 border-gray-200 group-hover:border-orange-400 transition-colors"
                        />
                        <button
                          onClick={() => deleteImage(img.publicId)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PDF Management Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    PDF Document
                  </h3>
                  <p className="text-blue-100">Upload and manage diploma PDF</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {savedPdf ? (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800 text-lg">
                          PDF Document Available
                        </p>
                        <p className="text-sm text-green-600">
                          Your diploma PDF is ready to view
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={savedPdf}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        View PDF
                      </a>
                      <button
                        onClick={deletePdf}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete PDF
                      </button>
                    </div>
                  </div>
                </div>
              ) : pdf ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-800">
                            {pdf.name}
                          </p>
                          <p className="text-sm text-blue-600">
                            Ready to upload
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPdf(null);
                          setFileKey((k) => k + 1);
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={uploadPdf}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      disabled={savingPdf}
                    >
                      <Upload className="h-4 w-4" />
                      {savingPdf ? "Uploading..." : "Upload PDF"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-blue-300 rounded-2xl cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-4 bg-blue-100 rounded-2xl mb-4">
                        <Upload className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="mb-2 text-lg font-semibold text-blue-800">
                        Click to upload PDF
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        PDF files only (max 10MB)
                      </p>
                    </div>
                    <input
                      key={fileKey}
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdf(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VfxDiplomaAdmin;
