import { useEffect, useState } from "react"
import axios from "axios"
import { FileText, Trash2, Plus, X, Upload, GraduationCap, Edit3, Calendar, BookOpen } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_BASE

const EditingDiploma = () => {
  const [months, setMonths] = useState([])
  const [pdf, setPdf] = useState(null)
  const [fileKey, setFileKey] = useState(0)
  const [savedMonths, setSavedMonths] = useState([])
  const [savedPdf, setSavedPdf] = useState("")
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingIndex, setEditingIndex] = useState(-1)

  // -------- Fetch Saved Data --------

  const fetchDiplomaData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/editingdiploma`)
      setSavedMonths(res.data.diploma || [])
      setSavedPdf(res.data.diplomaPdf?.url || "") // ✅ load Cloudinary URL
    } catch (err) {
      console.error("Error fetching diploma data:", err)
    }
  }

  useEffect(() => {
    fetchDiplomaData()
  }, [])

  // -------- Editing --------

  const startEditingMonth = (index) => {
    setEditMode(true)
    setEditingIndex(index)
    setMonths([{ ...savedMonths[index] }])
    setPdf(null)
    setFileKey((k) => k + 1)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditingIndex(-1)
    setMonths([])
    setPdf(null)
    setFileKey((k) => k + 1)
  }

  // -------- Delete Month --------

  const deleteSavedMonth = async (index) => {
    if (!confirm("Are you sure you want to delete this month?")) return
    try {
      const updatedDiploma = savedMonths.filter((_, i) => i !== index)
      const formData = new FormData()
      formData.append("diploma", JSON.stringify(updatedDiploma))
      if (pdf) formData.append("pdf_global", pdf)

      const res = await axios.post(`${API_BASE}/editingdiploma/save`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setSavedMonths(res.data.diploma || [])
      alert("Month deleted successfully ✅")
    } catch (err) {
      console.error("Error deleting month:", err)
      alert("Error deleting month")
    }
  }

  // -------- CRUD Helpers --------

  const addMonth = () => setMonths((prev) => [...prev, { month: "", sections: [] }])
  const updateMonthTitle = (mi, value) =>
    setMonths((prev) => prev.map((m, i) => (i === mi ? { ...m, month: value } : m)))

  const addSection = (mi) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: [...m.sections, { name: "New Section", items: [] }],
            }
          : m,
      ),
    )

  const updateSectionName = (mi, si, value) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: m.sections.map((s, j) => (j === si ? { ...s, name: value } : s)),
            }
          : m,
      ),
    )

  const deleteSection = (mi, si) =>
    setMonths((prev) => prev.map((m, i) => (i === mi ? { ...m, sections: m.sections.filter((_, j) => j !== si) } : m)))

  const addItem = (mi, si) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: m.sections.map((s, j) => (j === si ? { ...s, items: [...s.items, { title: "New Item" }] } : s)),
            }
          : m,
      ),
    )

  const updateItemTitle = (mi, si, ii, value) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: m.sections.map((s, j) =>
                j === si
                  ? {
                      ...s,
                      items: s.items.map((it, k) => (k === ii ? { ...it, title: value } : it)),
                    }
                  : s,
              ),
            }
          : m,
      ),
    )

  const deleteItem = (mi, si, ii) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: m.sections.map((s, j) => (j === si ? { ...s, items: s.items.filter((_, k) => k !== ii) } : s)),
            }
          : m,
      ),
    )

  // -------- Save --------

  const saveData = async () => {
    setSaving(true)
    try {
      let updatedMonths
      if (editMode && editingIndex >= 0) {
        updatedMonths = [...savedMonths]
        updatedMonths[editingIndex] = months[0]
      } else {
        updatedMonths = [...savedMonths, ...months]
      }

      const formData = new FormData()
      formData.append("diploma", JSON.stringify(updatedMonths))
      if (pdf) formData.append("diploma_pdf", pdf)

      const res = await axios.post(`${API_BASE}/editingdiploma/save`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // ✅ refresh from backend instead of trusting local state
      await fetchDiplomaData()

      // ✅ clear draft form
      setMonths([])
      setPdf(null)
      setFileKey((k) => k + 1)
      setEditMode(false)
      setEditingIndex(-1)

      alert(editMode ? "Updated successfully ✅" : "Saved successfully ✅")
    } catch (err) {
      console.error("Error saving diploma data:", err)
    } finally {
      setSaving(false)
    }
  }

  // -------- Delete Global PDF --------

  const deleteSavedPdf = async () => {
    try {
      await axios.delete(`${API_BASE}/editingdiploma/pdf`)
      setSavedPdf("")
      setPdf(null)
      setFileKey((k) => k + 1)
    } catch (err) {
      console.error("Error deleting PDF:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Modern header design matching cinematography */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-900 via-pink-800 to-red-800 bg-clip-text text-transparent">
                Editing Diploma Management
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit3 className="h-6 w-6" />
                <div>
                  <p className="text-xl font-bold">Editing Month: {savedMonths[editingIndex]?.month || "New"}</p>
                  <p className="text-blue-100">Make your changes and save when ready</p>
                </div>
              </div>
              <button
                onClick={cancelEdit}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </button>
            </div>
          </div>
        )}

        {months.map((month, mi) => (
          <div
            key={mi}
            className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <input
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:bg-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 text-xl font-bold flex-1 outline-none transition-all"
                    placeholder="Enter Month (e.g. January 2025)"
                    value={month.month}
                    onChange={(e) => updateMonthTitle(mi, e.target.value)}
                  />
                </div>
                <button
                  onClick={() => addSection(mi)}
                  className="ml-4 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold text-white transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Section
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {month.sections.map((section, si) => (
                <div
                  key={si}
                  className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <BookOpen className="h-5 w-5 text-gray-600" />
                      <input
                        className="bg-white border-2 border-gray-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl px-4 py-3 text-lg font-semibold flex-1 outline-none transition-colors"
                        value={section.name}
                        onChange={(e) => updateSectionName(mi, si, e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => deleteSection(mi, si)}
                      className="ml-3 p-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3 ml-8">
                    {section.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-3 group">
                        <input
                          className="flex-1 border-2 border-slate-200 focus:border-orange-400 focus:ring-orange-200 rounded-xl h-12 text-lg px-4 outline-none transition-colors"
                          placeholder="Item Title"
                          value={item.title || ""}
                          onChange={(e) => updateItemTitle(mi, si, ii, e.target.value)}
                        />
                        <button
                          onClick={() => deleteItem(mi, si, ii)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 rounded-xl p-3"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addItem(mi, si)}
                      className="w-full h-12 border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-orange-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
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
            {pdf && (
              <div className="mb-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Selected PDF: {pdf.name}</p>
                    <p className="text-sm text-green-600">Ready to upload</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPdf(null)
                    setFileKey((k) => k + 1)
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              </div>
            )}

            {!pdf && !savedPdf && (
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

        <div className="flex justify-center gap-4 mb-12">
          {!editMode && (
            <button
              onClick={addMonth}
              className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white flex items-center gap-3"
              disabled={saving}
            >
              <Plus className="h-5 w-5" />
              Add Month
            </button>
          )}
          <button
            onClick={saveData}
            className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            disabled={saving}
          >
            {saving ? "Saving..." : editMode ? "Update Changes" : "Save Changes"}
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-12"></div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              Current Curriculum
            </h2>
            <p className="text-slate-600 text-lg">Review and manage saved months</p>
          </div>

          {savedMonths.length === 0 && (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-500 italic">No saved months yet</p>
              <p className="text-gray-400">Add your first month to get started</p>
            </div>
          )}

          {savedMonths.map((month, mi) => (
            <div
              key={mi}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-white" />
                    <h3 className="text-2xl font-bold text-white">{month.month}</h3>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditingMonth(mi)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold text-white transition-colors flex items-center gap-2"
                      disabled={editMode}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSavedMonth(mi)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-semibold text-white transition-colors flex items-center gap-2"
                      disabled={editMode}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {month.sections.map((section, si) => (
                  <div
                    key={si}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      <h4 className="text-lg font-semibold text-indigo-800">{section.name}</h4>
                    </div>
                    <ul className="ml-7 space-y-1">
                      {section.items.map((item, ii) => (
                        <li key={ii} className="text-indigo-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {(savedPdf || pdf) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Attached PDF Document</h3>
                    <p className="text-green-100">Official diploma document</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <a
                    href={pdf ? URL.createObjectURL(pdf) : savedPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-semibold"
                  >
                    <FileText className="h-4 w-4" />
                    View PDF
                  </a>
                  {savedPdf && (
                    <button
                      onClick={deleteSavedPdf}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditingDiploma
