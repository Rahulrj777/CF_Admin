import { useState, useEffect, useRef } from "react"
import axios from "axios"

const StageUnrealDiploma = () => {
  const [contents, setContents] = useState([])
  const [globalPdf, setGlobalPdf] = useState(null)
  const [title, setTitle] = useState("")
  const [children, setChildren] = useState([""])
  const [editingId, setEditingId] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [isPdfSaving, setIsPdfSaving] = useState(false)
  const [isPdfDeleting, setIsPdfDeleting] = useState(false)
  const fileInputRef = useRef(null)

  const API_BASE =
    (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_BASE) ||
    (typeof window !== "undefined" && window.location && window.location.port === "5173"
      ? "http://localhost:5000" // dev: UI on 5173 (Vite), API on 5000
      : "http://localhost:5000")

  const API = `${API_BASE}/stageunrealdiploma`

  // Fetch existing data
  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const res = await axios.get(API)
      setContents(res.data.items || [])
      setGlobalPdf(res.data.pdf || null)
    } catch (err) {
      console.error("[v0] fetchAll error:", err)
    }
  }

  // Handle child change
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

  // Save or update month
  const handleSave = async () => {
    if (!title || children.some((c) => !c.trim())) {
      return alert("Title and children are required")
    }

    try {
      if (editingId) {
        const res = await axios.put(`${API}/${editingId}`, { title, children })
        setContents((prev) => prev.map((c) => (c.id === editingId ? res.data : c)))
      } else {
        const res = await axios.post(API, { title, children })
        setContents((prev) => [...prev, res.data])
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

  // Upload global PDF
  const handlePdfSelect = (e) => {
    const file = e.target.files && e.target.files[0]
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
      setGlobalPdf(res.data.pdf)
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
      await axios.delete(`${API}/pdf`)
      setGlobalPdf(null)
      await fetchAll()
      setPdfFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error(err)
      alert("Error deleting PDF")
    } finally {
      setIsPdfDeleting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      setContents((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (content) => {
    setTitle(content.title)
    setChildren(content.children || [""])
    setEditingId(content.id)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📸 Admin Di Diploma</h2>

      {/* Global PDF Upload */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">Global Diploma PDF</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handlePdfSelect}
          className="block mb-2"
        />

        {pdfFile ? (
          <p className="text-sm mb-2">Selected: {pdfFile.name}</p>
        ) : (
          <p className="text-sm text-gray-500 mb-2">
            Choose a PDF
          </p>
        )}

        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={savePdf}
            disabled={!pdfFile || isPdfSaving}
            className={`px-4 py-2 rounded text-white ${!pdfFile || isPdfSaving ? "bg-gray-400" : "bg-blue-600"}`}
          >
            {isPdfSaving ? "Saving..." : "Save PDF"}
          </button>

          {globalPdf && (
            <button
              onClick={deletePdf}
              disabled={isPdfDeleting}
              className={`px-4 py-2 rounded text-white ${isPdfDeleting ? "bg-gray-400" : "bg-red-600"}`}
            >
              {isPdfDeleting ? "Deleting..." : "Delete PDF"}
            </button>
          )}
        </div>

        {globalPdf && (
          <a href={`${API_BASE}${globalPdf}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            View Global PDF
          </a>
        )}
      </div>

      {/* Month Form */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        />

        {children.map((child, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder={`Content ${index + 1}`}
              value={child}
              onChange={(e) => handleChildChange(index, e.target.value)}
              className="border rounded p-2 flex-1"
            />
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeChild(index)}>
              Remove
            </button>
          </div>
        ))}

        <button onClick={addChild} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          + Add Child
        </button>

        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded">
          {editingId ? "Update" : "Save"}
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {contents.map((content) => (
          <div key={content.id} className="bg-gray-50 p-4 border rounded-lg shadow">
            <h3 className="font-semibold text-lg">{content.title}</h3>
            <ul className="list-disc pl-6">
              {content.children?.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(content)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(content.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StageUnrealDiploma
