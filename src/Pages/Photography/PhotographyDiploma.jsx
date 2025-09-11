import { useState, useEffect } from "react"
import axios from "axios"
import { Camera, Upload, Trash2, Edit3, Plus, Minus, Eye, Loader2 } from "lucide-react"

const PhotographyDiploma = () => {
  const [contents, setContents] = useState([])
  const [savedPdf, setSavedPdf] = useState("")
  const [title, setTitle] = useState("")
  const [children, setChildren] = useState([""])
  const [editingId, setEditingId] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingContent, setIsSavingContent] = useState(false)
  const [isSavingPdf, setIsSavingPdf] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com"
  const API = `${API_BASE}/photographydiploma`

  useEffect(() => {
    fetchDiplomaData()
  }, [])

  const fetchDiplomaData = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(API)
      const items = (res.data.items || []).map((item) => ({
        ...item,
        id: item._id,
      }))
      setContents(items)
      setSavedPdf(res.data.diplomaPdf?.pdfName ? `${API}/pdf/view` : "")
    } catch (err) {
      console.error("Error fetching diploma data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChildChange = (index, value) => {
    const updated = [...children]
    updated[index] = value
    setChildren(updated)
  }

  const addChild = () => setChildren([...children, ""])
  const removeChild = (index) => {
    const updated = children.filter((_, i) => i !== index)
    setChildren(updated.length ? updated : [""])
  }

  const saveContent = async () => {
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }
    if (children.some((c) => !c.trim())) {
      alert("Please fill in all content fields")
      return
    }

    if (!window.confirm("Are you sure you want to save this content?")) return

    try {
      setIsSavingContent(true)
      if (editingId) {
        const res = await axios.put(`${API}/${editingId}`, { title, children })
        setContents((prev) => prev.map((c) => (c.id === editingId ? { ...res.data, id: res.data._id } : c)))
        alert("Content updated successfully!")
      } else {
        const res = await axios.post(API, { title, children })
        setContents((prev) => [...prev, { ...res.data, id: res.data._id }])
        alert("Content saved successfully!")
      }

      setTitle("")
      setChildren([""])
      setEditingId(null)
    } catch (err) {
      console.error("Error saving content:", err)
      alert("Error saving content. Please try again.")
    } finally {
      setIsSavingContent(false)
    }
  }

  const savePdf = async () => {
    if (!pdf) {
      alert("Please select a PDF file")
      return
    }

    if (!window.confirm("Are you sure you want to upload this PDF?")) return

    const formData = new FormData()
    formData.append("pdf", pdf)

    try {
      setIsSavingPdf(true)
      await axios.post(`${API}/pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setSavedPdf(`${API}/pdf/view`)
      setPdf(null)
      alert("PDF uploaded successfully!")
    } catch (err) {
      console.error("Error uploading PDF:", err)
      alert("Error uploading PDF. Please try again.")
    } finally {
      setIsSavingPdf(false)
    }
  }

  const deletePdf = async () => {
    if (!window.confirm("Are you sure you want to delete this PDF? This action cannot be undone.")) return

    try {
      await axios.delete(`${API}/pdf`)
      setSavedPdf("")
      alert("PDF deleted successfully!")
    } catch (err) {
      console.error("Error deleting PDF:", err)
      alert("Error deleting PDF. Please try again.")
    }
  }

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")) return

    try {
      await axios.delete(`${API}/${_id}`)
      setContents((prev) => prev.filter((c) => c._id !== _id))
      alert("Entry deleted successfully!")
    } catch (err) {
      console.error("Error deleting entry:", err)
      alert("Error deleting entry. Please try again.")
    }
  }

  const handleEdit = (content) => {
    setTitle(content.title)
    setChildren(content.children || [""])
    setEditingId(content.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium">Loading Photography Diploma Admin...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Photography Diploma Admin Panel
          </h1>
          <p className="text-gray-600 text-lg">Manage your Photography diploma content and resources</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Management Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Content Management
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />

              {children.map((child, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Content ${idx + 1}...`}
                    value={child}
                    onChange={(e) => handleChildChange(idx, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                  />
                  <button
                    onClick={() => removeChild(idx)}
                    className="p-3 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-xl transition-colors duration-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  onClick={addChild}
                  className="flex items-center gap-2 px-4 cursor-pointer py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Content
                </button>
                <button
                  onClick={saveContent}
                  disabled={isSavingContent}
                  className="flex items-center gap-2 px-6 cursor-pointer py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isSavingContent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  {editingId ? "Update Content" : "Save Content"}
                </button>
              </div>
            </div>
          </div>

          {/* PDF Management Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                PDF Management
              </h2>
            </div>

            {savedPdf ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800 font-medium mb-3">PDF is uploaded and ready</p>
                  <div className="flex gap-3">
                    <a
                      href={savedPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      View PDF
                    </a>
                    <button
                      onClick={deletePdf}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {pdf ? (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-purple-800 font-medium mb-2">Selected: {pdf.name}</p>
                    <button
                      onClick={savePdf}
                      disabled={isSavingPdf}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {isSavingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload PDF
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Choose a PDF file to upload (10MB)</p>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdf(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Saved Content Display */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Saved Content
          </h3>

          {contents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No content added yet. Create your first entry above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => (
                <div
                  key={content._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h4 className="font-bold text-gray-800 text-lg mb-3">{content.title}</h4>
                  <ul className="space-y-1 mb-4 flex-grow">
                    {content.children?.map((child, idx) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                        {child}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(content)}
                      className="flex items-center gap-1 px-3 py-2 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm transition-colors duration-200"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(content._id)}
                      className="flex items-center gap-1 px-3 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhotographyDiploma
