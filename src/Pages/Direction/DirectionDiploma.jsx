import { useState, useEffect } from "react"
import axios from "axios"
import { FileText, Download, Trash2, Plus, X, Upload, GraduationCap } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_BASE

const DirectionDiplomaAdmin = () => {
  const [semester1, setSemester1] = useState([""])
  const [semester2, setSemester2] = useState([""])
  const [pdf, setPdf] = useState(null)
  const [savedData, setSavedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
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
      alert("Error saving data!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get(`${API_BASE}/directiondiploma/pdf/download`)
      const { downloadUrl } = response.data

      // Create a temporary link element and trigger download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = "Direction-Diploma.pdf"
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
    if (!confirmDelete) return

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                Direction Diploma Management
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
          <p className="text-slate-600 text-xl font-medium">
            Manage semester curricula and diploma documentation with precision
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white text-emerald-700">
                      1
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Semester 1 Subjects</h3>
                    <p className="text-emerald-100">Add and manage first semester curriculum</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {semester1.map((sub, i) => (
                  <div key={i} className="flex gap-3 items-center group">
                    <input
                      value={sub}
                      onChange={(e) => updateSubtitle(semester1, setSemester1, i, e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1 border-2 border-slate-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl h-12 text-lg px-4 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => deleteSubtitleLocal(semester1, setSemester1, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 rounded-xl p-3 border-none bg-transparent cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSubtitle(semester1, setSemester1)}
                  className="w-full h-12 border-2 border-dashed border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 rounded-xl font-semibold bg-transparent cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Subject
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white text-violet-700">
                      2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Semester 2 Subjects</h3>
                    <p className="text-violet-100">Add and manage second semester curriculum</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {semester2.map((sub, i) => (
                  <div key={i} className="flex gap-3 items-center group">
                    <input
                      value={sub}
                      onChange={(e) => updateSubtitle(semester2, setSemester2, i, e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1 border-2 border-slate-200 focus:border-violet-400 focus:ring-violet-200 rounded-xl h-12 text-lg px-4 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => deleteSubtitleLocal(semester2, setSemester2, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 rounded-xl p-3 border-none bg-transparent cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSubtitle(semester2, setSemester2)}
                  className="w-full h-12 border-2 border-dashed border-violet-300 hover:border-violet-400 hover:bg-violet-50 text-violet-700 rounded-xl font-semibold bg-transparent cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Subject
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Diploma Document</h3>
                  <p className="text-blue-100">Upload or manage the official diploma PDF document</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {savedData?.pdfUrl ? (
                <div className="flex flex-wrap items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">PDF document uploaded successfully</p>
                      <p className="text-sm text-green-600">Ready for download and viewing</p>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={() => window.open(savedData.pdfUrl, "_blank")}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl transition-colors bg-transparent cursor-pointer"
                    >
                      <FileText className="h-4 w-4" />
                      View PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-300 text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors bg-transparent cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={handleDeletePdf}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors cursor-pointer border-none"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-blue-300 rounded-2xl cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-4 bg-blue-100 rounded-2xl mb-4">
                          <Upload className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="mb-2 text-lg font-semibold text-blue-800">Click to upload or drag and drop</p>
                        <p className="text-sm text-blue-600 font-medium">PDF files only (max 20MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setPdf(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {pdf && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Selected: {pdf.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-12"></div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              Current Curriculum
            </h2>
            <p className="text-slate-600 text-lg">Review and manage saved subjects</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white text-emerald-700">
                    1
                  </span>
                  <h3 className="text-xl font-bold text-white">Semester 1 Subjects</h3>
                </div>
              </div>
              <div className="p-6">
                {savedData?.semester1?.length > 0 ? (
                  <div className="space-y-3">
                    {savedData.semester1.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl group hover:shadow-md transition-all"
                      >
                        <span className="font-medium text-emerald-800">{item.title}</span>
                        <button
                          onClick={() => handleDeleteSubtitle("semester1", i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 rounded-lg p-2 border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8 italic">No subjects added yet</p>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white text-violet-700">
                    2
                  </span>
                  <h3 className="text-xl font-bold text-white">Semester 2 Subjects</h3>
                </div>
              </div>
              <div className="p-6">
                {savedData?.semester2?.length > 0 ? (
                  <div className="space-y-3">
                    {savedData.semester2.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl group hover:shadow-md transition-all"
                      >
                        <span className="font-medium text-violet-800">{item.title}</span>
                        <button
                          onClick={() => handleDeleteSubtitle("semester2", i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 rounded-lg p-2 border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8 italic">No subjects added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectionDiplomaAdmin
