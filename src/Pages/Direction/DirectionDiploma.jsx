import { useState, useEffect } from "react"

const DirectionDiplomaAdmin = () => {
  const [semester1, setSemester1] = useState([""])
  const [semester2, setSemester2] = useState([""])
  const [pdf, setPdf] = useState(null)
  const [savedData, setSavedData] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch saved data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/directiondiploma")
        const data = await res.json()
        const diplomaData = data.direction.diploma[0] || {
          semester1: [],
          semester2: [],
          pdfUrl: "",
        }

        setSavedData(diplomaData)
        setSemester1(diplomaData.semester1.map((item) => item.title))
        setSemester2(diplomaData.semester2.map((item) => item.title))
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
    setIsUploading(true)

    try {
      // Update subtitles first
      await fetch("/directiondiploma/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semester1, semester2 }),
      })

      // Upload PDF if selected
      if (pdf) {
        const formData = new FormData()
        formData.append("pdf", pdf)

        const uploadRes = await fetch("/directiondiploma/pdf", {
          method: "POST",
          body: formData,
        })

        const uploadData = await uploadRes.json()
        console.log("PDF Upload Response:", uploadData)
      }

      // Refresh data
      const res = await fetch("/directiondiploma")
      const data = await res.json()
      const diplomaData = data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      }
      setSavedData(diplomaData)
      setPdf(null)

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ""
    } catch (err) {
      console.error(err)
      alert("Error uploading file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Delete subtitle from server
  const handleDeleteSubtitle = async (semester, idx) => {
    try {
      await fetch("/directiondiploma/diploma/subtitle", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semester, index: idx }),
      })

      const res = await fetch("/directiondiploma")
      const data = await res.json()
      const diplomaData = data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      }
      setSavedData(diplomaData)
      // Update local state too
      if (semester === "semester1") setSemester1(diplomaData.semester1.map((item) => item.title))
      if (semester === "semester2") setSemester2(diplomaData.semester2.map((item) => item.title))
    } catch (err) {
      console.error(err)
    }
  }

  // Delete PDF from server
  const handleDeletePdf = async () => {
    try {
      await fetch("/directiondiploma/pdf", {
        method: "DELETE",
      })

      const res = await fetch("/directiondiploma")
      const data = await res.json()
      const diplomaData = data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      }
      setSavedData(diplomaData)
      setPdf(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg text-black">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">🎬 Direction Diploma</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Semester 1 Subjects</h3>
            {semester1.map((subtitle, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => updateSubtitle(semester1, setSemester1, idx, e.target.value)}
                  placeholder="Enter subject name"
                  className="flex-1 border rounded-md p-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => deleteSubtitleLocal(semester1, setSemester1, idx)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSubtitle(semester1, setSemester1)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              + Add Subject
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Semester 2 Subjects</h3>
            {semester2.map((subtitle, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => updateSubtitle(semester2, setSemester2, idx, e.target.value)}
                  placeholder="Enter subject name"
                  className="flex-1 border rounded-md p-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => deleteSubtitleLocal(semester2, setSemester2, idx)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSubtitle(semester2, setSemester2)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              + Add Subject
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isUploading ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Upload PDF</h3>
          {savedData?.pdfUrl ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    📄 {savedData.originalName || savedData.pdfUrl.split("/").pop()}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={savedData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      🔍 View Full
                    </a>
                    <a
                      href={savedData.pdfUrl}
                      download
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      ⬇️ Download
                    </a>
                  </div>
                </div>
                <iframe
                  src={`${savedData.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  className="w-full h-96 border-0"
                  title="PDF Preview"
                />
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={handleDeletePdf}
              >
                🗑️ Delete PDF
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdf(e.target.files?.[0] || null)}
                className="border rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
              />
              <p className="text-sm text-gray-600">Only PDF files are allowed (max 20MB)</p>
            </div>
          )}
        </div>

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
      </form>
    </div>
  )
}

export default DirectionDiplomaAdmin
