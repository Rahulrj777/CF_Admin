import { useEffect, useState } from "react"
import axios from "axios"
import { FileText, Trash2, Plus, X, Upload, GraduationCap, Edit3, Calendar, BookOpen, Save } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_BASE

const EditingDiploma = () => {
  const [months, setMonths] = useState([])
  const [pdf, setPdf] = useState(null)
  const [fileKey, setFileKey] = useState(0)
  const [savedMonths, setSavedMonths] = useState([])
  const [savedPdf, setSavedPdf] = useState("")
  const [saving, setSaving] = useState(false)
  const [savingPdf, setSavingPdf] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingIndex, setEditingIndex] = useState(-1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchDiplomaData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/editingdiploma`)
      setSavedMonths(res.data.diploma || [])
      setSavedPdf(res.data.diplomaPdf?.url || "")
    } catch (err) {
      console.error("Error fetching diploma data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiplomaData()
  }, [])

  const startEditingMonth = (index) => {
    setEditMode(true)
    setEditingIndex(index)
    setMonths([{ ...savedMonths[index] }])
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditingIndex(-1)
    setMonths([])
    setShowAddForm(false)
  }

  const deleteSavedMonth = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this month? This action cannot be undone.")
    if (!confirmDelete) return

    try {
      const updatedDiploma = savedMonths.filter((_, i) => i !== index)
      const formData = new FormData()
      formData.append("diploma", JSON.stringify(updatedDiploma))

      await axios.post(`${API_BASE}/editingdiploma/save`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setSavedMonths(updatedDiploma)
      alert("Month deleted successfully ✅")
    } catch (err) {
      console.error("Error deleting month:", err)
      alert("Error deleting month")
    }
  }

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

  const saveTextContent = async () => {
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

      const res = await axios.post(`${API_BASE}/editingdiploma/save`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setSavedMonths(res.data.diploma || updatedMonths)
      setMonths([])
      setEditMode(false)
      setEditingIndex(-1)
      setShowAddForm(false)

      alert(editMode ? "Month updated successfully ✅" : "Month saved successfully ✅")
    } catch (err) {
      console.error("Error saving diploma data:", err)
      alert("Error saving data")
    } finally {
      setSaving(false)
    }
  }

  const savePdf = async () => {
    if (!pdf) return

    setSavingPdf(true)
    try {
      const formData = new FormData()
      formData.append("diploma", JSON.stringify(savedMonths))
      formData.append("diploma_pdf", pdf)

      const res = await axios.post(`${API_BASE}/editingdiploma/save`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setSavedPdf(res.data.diplomaPdf?.url || "")
      setPdf(null)
      setFileKey((k) => k + 1)
      alert("PDF uploaded successfully ✅")
    } catch (err) {
      console.error("Error saving PDF:", err)
      alert("Error saving PDF")
    } finally {
      setSavingPdf(false)
    }
  }

  const deleteSavedPdf = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this PDF? This action cannot be undone.")
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE}/editingdiploma/pdf`)
      setSavedPdf("")
      alert("PDF deleted successfully ✅")
    } catch (err) {
      console.error("Error deleting PDF:", err)
      alert("Error deleting PDF")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-600">Loading diploma data...</p>
        </div>
      </div>
    )
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
                Editing Diploma Management
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Text Content Management</h3>
                  <p className="text-orange-100">Manage curriculum months and sections</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {editMode && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Edit3 className="h-5 w-5" />
                      <span className="font-semibold">Editing: {savedMonths[editingIndex]?.month || "New"}</span>
                    </div>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showAddForm || editMode ? (
                <div className="space-y-6">
                  {months.map((month, mi) => (
                    <div key={mi} className="space-y-4">
                      <input
                        className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-lg font-semibold outline-none transition-colors"
                        placeholder="Enter Month (e.g. January 2025)"
                        value={month.month}
                        onChange={(e) => updateMonthTitle(mi, e.target.value)}
                      />

                      {month.sections.map((section, si) => (
                        <div key={si} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <input
                              className="flex-1 bg-white border border-gray-200 focus:border-orange-400 rounded-lg px-3 py-2 font-semibold outline-none transition-colors"
                              value={section.name}
                              onChange={(e) => updateSectionName(mi, si, e.target.value)}
                            />
                            <button
                              onClick={() => deleteSection(mi, si)}
                              className="ml-3 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-2 ml-4">
                            {section.items.map((item, ii) => (
                              <div key={ii} className="flex items-center gap-2 group">
                                <input
                                  className="flex-1 border border-gray-200 focus:border-orange-400 rounded-lg px-3 py-2 outline-none transition-colors"
                                  placeholder="Item Title"
                                  value={item.title || ""}
                                  onChange={(e) => updateItemTitle(mi, si, ii, e.target.value)}
                                />
                                <button
                                  onClick={() => deleteItem(mi, si, ii)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 rounded-lg p-2"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addItem(mi, si)}
                              className="w-full py-2 border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-orange-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Item
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => addSection(mi)}
                        className="w-full py-3 border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-orange-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Section
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    {!editMode && (
                      <button
                        onClick={addMonth}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                        disabled={saving}
                      >
                        <Plus className="h-4 w-4" />
                        Add Month
                      </button>
                    )}
                    <button
                      onClick={saveTextContent}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : editMode ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add New Month
                </button>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">PDF Document</h3>
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
                        <p className="font-bold text-green-800 text-lg">PDF Document Available</p>
                        <p className="text-sm text-green-600">Your diploma PDF is ready to view</p>
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
                        onClick={deleteSavedPdf}
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
                          <p className="font-semibold text-blue-800">{pdf.name}</p>
                          <p className="text-sm text-blue-600">Ready to upload</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPdf(null)
                          setFileKey((k) => k + 1)
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={savePdf}
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
                      <p className="mb-2 text-lg font-semibold text-blue-800">Click to upload PDF</p>
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
        </div>
      </div>
    </div>
  )
}

export default EditingDiploma
