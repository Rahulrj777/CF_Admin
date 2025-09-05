import { useState, useEffect, useRef } from "react"
import axios from "axios"

const ActingDiploma = () => {
  const [contents, setContents] = useState([])
  const [globalPdf, setGlobalPdf] = useState(null)
  const [title, setTitle] = useState("")
  const [children, setChildren] = useState([""])
  const [editingId, setEditingId] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [isPdfSaving, setIsPdfSaving] = useState(false)
  const [isPdfDeleting, setIsPdfDeleting] = useState(false)
  const fileInputRef = useRef(null)

  const API_BASE = import.meta.env.VITE_API_BASE || "https://cf-server-tr24.onrender.com"
  const API = `${API_BASE}/actingdiploma`

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const res = await axios.get(API)
      const items = (res.data.items || []).map((item) => ({
        ...item,
        id: item._id, // map MongoDB _id to id
      }))
      setContents(items)
      setGlobalPdf(res.data.pdf || null)
    } catch (err) {
      console.error("[fetchAll] error:", err)
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
    if (!title || children.some((c) => !c.trim())) return alert("Title and children are required")

    try {
      if (editingId) {
        // ✅ send JSON only
        const res = await axios.put(`${API}/${editingId}`, { title, children })
        setContents((prev) => prev.map((c) => (c.id === editingId ? res.data : c)))
      } else {
        const res = await axios.post(API, { title, children })
        setContents((prev) => [...prev, { ...res.data, id: res.data._id }])
      }

      await fetchAll()
    } catch (err) {
      console.error(err)
      alert("Error saving content")
    }

    setTitle("")
    setChildren([""])
    setEditingId(null)
  }

  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed")
      e.target.value = ""
      return
    }
    setPdfFile(file)
  }

  const savePdf = async () => {
    if (!pdfFile) return alert("Please choose a PDF first.")
    const formData = new FormData()
    formData.append("pdf", pdfFile)

    try {
      setIsPdfSaving(true)
      const res = await axios.post(`${API}/pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setGlobalPdf(res.data.pdfUrl)
      await fetchAll()
      setPdfFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error(err)
      alert("Error uploading PDF")
    } finally {
      setIsPdfSaving(false)
    }
  }

  const deletePdf = async () => {
    try {
      setIsPdfDeleting(true)
      console.log("Attempting to delete PDF from:", `${API}/pdf`)

      const response = await axios.delete(`${API}/pdf`)
      console.log("Delete response:", response)

      setGlobalPdf(null)
      await fetchAll()
      setPdfFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error("Delete PDF error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
        method: err.config?.method,
      })

      if (err.response?.status === 404) {
        alert("PDF delete endpoint not found. Please check your backend routing configuration.")
      } else {
        alert(`Error deleting PDF: ${err.response?.data?.message || err.message}`)
      }
    } finally {
      setIsPdfDeleting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return
    try {
      await axios.delete(`${API}/${id}`)
      setContents((prev) => prev.filter((c) => c.id !== id))
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-8">📸 Stage Unreal Diploma Admin</h2>

      {/* Global PDF Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-indigo-200">
        <h3 className="text-xl font-semibold mb-4">Global Diploma PDF</h3>
        <input
          ref={fileInputRef}
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={handlePdfSelect}
          className="mb-2"
        />
        {pdfFile && <p className="text-gray-700 mb-2">Selected: {pdfFile.name}</p>}
        <div className="flex gap-2 mb-2">
          <button
            onClick={savePdf}
            disabled={!pdfFile || isPdfSaving}
            className={`px-4 py-2 rounded font-semibold text-white ${
              !pdfFile || isPdfSaving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isPdfSaving ? "Saving..." : "Save PDF"}
          </button>
          {globalPdf && (
            <button
              onClick={deletePdf}
              disabled={isPdfDeleting}
              className={`px-4 py-2 rounded font-semibold text-white ${
                isPdfDeleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isPdfDeleting ? "Deleting..." : "Delete PDF"}
            </button>
          )}
        </div>
        {globalPdf && (
          <a href={globalPdf} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            View Global PDF
          </a>
        )}
      </div>

      {/* Month / Children Form */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-indigo-200">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 border-indigo-300 rounded-md p-3 w-full mb-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
        />
        {children.map((child, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder={`Content ${idx + 1}`}
              value={child}
              onChange={(e) => handleChildChange(idx, e.target.value)}
              className="border-2 border-indigo-300 rounded-md p-3 flex-1 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            />
            <button
              onClick={() => removeChild(idx)}
              className="bg-red-500 text-white px-3 py-2 rounded-md font-semibold hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addChild}
          className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold mb-4 hover:bg-blue-600"
        >
          + Add Child
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
        >
          {editingId ? "Update" : "Save"}
        </button>
      </div>

      {/* List */}
      <h3 className="text-2xl font-semibold mb-4 text-indigo-600">📌 Existing Entries</h3>
      {contents.length === 0 ? (
        <p className="text-gray-500">No entries added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((c) => (
            <div key={c.id} className="bg-white shadow-md border border-indigo-200 rounded-xl p-4 flex flex-col">
              <h4 className="font-bold text-indigo-600 text-lg mb-2">{c.title}</h4>
              <ul className="list-disc pl-6 flex-grow">
                {c.children?.map((child, idx) => (
                  <li key={idx} className="text-gray-700">
                    {child}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(c)}
                  className="flex-1 bg-yellow-400 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActingDiploma
