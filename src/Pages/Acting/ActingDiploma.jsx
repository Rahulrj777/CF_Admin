"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { FileText, Upload, Eye, Trash2, Plus, Edit, Save, Loader2 } from "lucide-react"

const ActingDiploma = () => {
  const [contents, setContents] = useState([])
  const [savedPdf, setSavedPdf] = useState("")
  const [title, setTitle] = useState("")
  const [children, setChildren] = useState([""])
  const [editingId, setEditingId] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingContent, setIsSavingContent] = useState(false)
  const [isSavingPdf, setIsSavingPdf] = useState(false)
  const [isDeletingPdf, setIsDeletingPdf] = useState(false)
  const fileInputRef = useRef(null)

  const API_BASE = import.meta.env.VITE_API_BASE 
  const API = `${API_BASE}/actingdiploma`

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
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
      console.error("[fetchAll] error:", err)
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

  const handleSave = async () => {
    if (!title || children.some((c) => !c.trim())) {
      alert("Title and all content fields are required")
      return
    }

    if (!window.confirm(editingId ? "Update this entry?" : "Save this entry?")) return

    try {
      setIsSavingContent(true)
      if (editingId) {
        const res = await axios.put(`${API}/${editingId}`, { title, children })
        setContents((prev) => prev.map((c) => (c.id === editingId ? { ...res.data, id: res.data._id } : c)))
      } else {
        const res = await axios.post(API, { title, children })
        setContents((prev) => [...prev, { ...res.data, id: res.data._id }])
      }

      setTitle("")
      setChildren([""])
      setEditingId(null)
    } catch (err) {
      console.error(err)
      alert("Error saving content")
    } finally {
      setIsSavingContent(false)
    }
  }

  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed")
      e.target.value = ""
      return
    }
    setPdf(file)
  }

  const savePdf = async () => {
    if (!pdf) return alert("Please choose a PDF first.")
    if (!window.confirm("Upload this PDF?")) return

    const formData = new FormData()
    formData.append("pdf", pdf)

    try {
      setIsSavingPdf(true)
      await axios.post(`${API}/pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setSavedPdf(`${API}/pdf/view`)
      setPdf(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error(err)
      alert("Error uploading PDF")
    } finally {
      setIsSavingPdf(false)
    }
  }

  const deletePdf = async () => {
    if (!window.confirm("Are you sure you want to delete the PDF?")) return

    try {
      setIsDeletingPdf(true)
      await axios.delete(`${API}/pdf`)
      setSavedPdf("")
      setPdf(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error(err)
      alert("Error deleting PDF")
    } finally {
      setIsDeletingPdf(false)
    }
  }

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return
    try {
      await axios.delete(`${API}/${_id}`)
      setContents((prev) => prev.filter((c) => c._id !== _id))
    } catch (err) {
      console.error(err)
      alert("Delete failed")
    }
  }

  const handleEdit = (content) => {
    setTitle(content.title)
    setChildren(content.children || [""])
    setEditingId(content.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium">Loading Acting Diploma...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-2">
            Acting Diploma Admin
          </h1>
          <p className="text-gray-600 text-lg">Manage curriculum content and diploma PDF</p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Text Content Management */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl font-bold">Curriculum Content</h2>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />

              {children.map((child, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    placeholder={`Content ${idx + 1}...`}
                    value={child}
                    onChange={(e) => handleChildChange(idx, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                  <button
                    onClick={() => removeChild(idx)}
                    className="px-4 py-3 bg-red-500 cursor-pointer text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  onClick={addChild}
                  className="flex items-center cursor-pointer gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Content
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSavingContent}
                  className="flex items-center gap-2 px-6 py-3 cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
                >
                  {isSavingContent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    <Edit className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSavingContent ? "Saving..." : editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>

          {/* PDF Management */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl font-bold">Diploma PDF</h2>
              </div>
            </div>

            {!savedPdf ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload diploma PDF (10MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-500 text-white cursor-pointer rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Choose PDF File
                  </button>
                </div>

                {pdf && (
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-3">Selected: {pdf.name}</p>
                    <button
                      onClick={savePdf}
                      disabled={isSavingPdf}
                      className="flex items-center gap-2 px-6 cursor-pointer py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                    >
                      {isSavingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isSavingPdf ? "Uploading..." : "Upload PDF"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <FileText className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-green-800 font-medium mb-4">PDF uploaded successfully!</p>
                <div className="flex gap-3 justify-center">
                  <a
                    href={savedPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View PDF
                  </a>
                  <button
                    onClick={deletePdf}
                    disabled={isDeletingPdf}
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeletingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {isDeletingPdf ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Entries */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-600" />
            Saved Entries
          </h3>

          {contents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No entries added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow"
                >
                  <h4 className="font-bold text-gray-800 text-lg mb-3">{c.title}</h4>
                  <ul className="space-y-1 mb-4 text-sm text-gray-600">
                    {c.children?.map((child, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                        {child}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="flex-1 flex items-center cursor-pointer justify-center gap-2 px-3 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex-1 flex items-center cursor-pointer justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default ActingDiploma
