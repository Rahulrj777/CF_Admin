import { useState, useEffect } from "react"
import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000"

const DirectionDiplomaAdmin = () => {
  const [semester1, setSemester1] = useState([""])
  const [semester2, setSemester2] = useState([""])
  const [pdf, setPdf] = useState(null)
  const [savedData, setSavedData] = useState(null)

  // Fetch saved data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/directiondiploma`)
        const data = res.data.direction.diploma[0] || {
          semester1: [],
          semester2: [],
          pdfUrl: "",
        }
        setSavedData(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  // Add subtitle input
  const addSubtitle = (semester, setSemester) => setSemester([...semester, ""])

  // Update subtitle
  const updateSubtitle = (semester, setSemester, idx, value) => {
    const updated = [...semester]
    updated[idx] = value
    setSemester(updated)
  }

  // Delete subtitle (local state)
  const deleteSubtitleLocal = (semester, setSemester, idx) => {
    const updated = [...semester]
    updated.splice(idx, 1)
    setSemester(updated)
  }

  // Submit subtitles and PDF
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Merge old saved data with new input data
      const mergedSemester1 = [
        ...(savedData?.semester1 || []).map((item) => item.title),
        ...semester1.filter((t) => t.trim() !== ""),
      ]
      const mergedSemester2 = [
        ...(savedData?.semester2 || []).map((item) => item.title),
        ...semester2.filter((t) => t.trim() !== ""),
      ]

      // Send merged arrays
      await axios.post(`${API_BASE}/directiondiploma/text`, {
        semester1: mergedSemester1,
        semester2: mergedSemester2,
      })

      // Upload PDF if selected
      if (pdf) {
        const formData = new FormData()
        formData.append("pdf", pdf)
        await axios.post(`${API_BASE}/directiondiploma/pdf`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      // Refresh data
      const res = await axios.get(`${API_BASE}/directiondiploma`)
      const data = res.data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      }
      setSavedData(data)

      // Clear form after saving
      setSemester1([])
      setSemester2([])
      setPdf(null)

      alert("Saved successfully ✅")
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get(`${API_BASE}/directiondiploma/pdf/download`)
      const { downloadUrl } = response.data

      // Create a temporary link element and trigger download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = "Direction-Diploma.pdf" // Set a default filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Download error:", err)
      alert("Error downloading PDF!")
    }
  }

  // Delete PDF
  const handleDeletePdf = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this PDF?")
    if (!confirmDelete) return // stop if user clicked Cancel

    try {
      await axios.delete(`${API_BASE}/directiondiploma/pdf`)
      const res = await axios.get(`${API_BASE}/directiondiploma`)
      const data = res.data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      }
      setSavedData(data)
      alert("PDF deleted successfully!")
    } catch (err) {
      console.error(err)
      alert("Error deleting PDF!")
    }
  }

  // Delete subtitle from server
  const handleDeleteSubtitle = async (semester, idx) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subtitle?")
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE}/directiondiploma/diploma/subtitle`, {
        data: { semester, index: idx },
      })
      const res = await axios.get(`${API_BASE}/directiondiploma`)
      const data = res.data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      }
      setSavedData(data)

      // Update local state too
      if (semester === "semester1") setSemester1(data.semester1.map((item) => item.title))
      if (semester === "semester2") setSemester2(data.semester2.map((item) => item.title))

      alert("Subtitle deleted successfully!")
    } catch (err) {
      console.error(err)
      alert("Error deleting subtitle!")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg text-black">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">🎬 Direction Diploma</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Semester 1 */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Semester 1</h3>
          {semester1.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center mb-3">
              <input
                value={sub}
                onChange={(e) => updateSubtitle(semester1, setSemester1, i, e.target.value)}
                placeholder="Enter subtitle"
                className="border rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="px-2 py-1 text-red-500 hover:text-red-700"
                onClick={() => deleteSubtitleLocal(semester1, setSemester1, i)}
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
            onClick={() => addSubtitle(semester1, setSemester1)}
          >
            ➕ Add Subtitle
          </button>
        </div>

        {/* Semester 2 */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Semester 2</h3>
          {semester2.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center mb-3">
              <input
                value={sub}
                onChange={(e) => updateSubtitle(semester2, setSemester2, i, e.target.value)}
                placeholder="Enter subtitle"
                className="border rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="px-2 py-1 text-red-500 hover:text-red-700"
                onClick={() => deleteSubtitleLocal(semester2, setSemester2, i)}
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
            onClick={() => addSubtitle(semester2, setSemester2)}
          >
            ➕ Add Subtitle
          </button>
        </div>

        {/* PDF Upload */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Upload PDF</h3>

          {savedData?.pdfUrl ? (
            <div className="flex items-center gap-4">
              <a
                href={savedData.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                📄 View PDF
              </a>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                📥 Download PDF
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={handleDeletePdf}
              >
                🗑️ Delete PDF
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files[0])}
                className="border rounded-md p-2 w-full focus:border-blue-500 focus:outline-none mb-2"
              />
              <p className="text-sm text-gray-600">Only PDF files are allowed (max 20MB)</p>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white rounded-md font-semibold"
          >
            💾 Save Changes
          </button>
        </div>
      </form>

      {/* Saved Data Preview */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">📌 Saved Data</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2 text-gray-700">Semester 1</h4>
            {savedData?.semester1?.map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="text-gray-800">{item.title}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteSubtitle("semester1", i)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2 text-gray-700">Semester 2</h4>
            {savedData?.semester2?.map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="text-gray-800">{item.title}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteSubtitle("semester2", i)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectionDiplomaAdmin
