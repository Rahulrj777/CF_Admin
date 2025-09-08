import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Direction Diploma Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage semester curricula and diploma documentation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Semester 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">1</Badge>
                  Semester 1 Subjects
                </CardTitle>
                <CardDescription>Add and manage subjects for the first semester</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {semester1.map((sub, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={sub}
                      onChange={(e) => updateSubtitle(semester1, setSemester1, i, e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSubtitleLocal(semester1, setSemester1, i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSubtitle(semester1, setSemester1)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </CardContent>
            </Card>

            {/* Semester 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">2</Badge>
                  Semester 2 Subjects
                </CardTitle>
                <CardDescription>Add and manage subjects for the second semester</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {semester2.map((sub, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={sub}
                      onChange={(e) => updateSubtitle(semester2, setSemester2, i, e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSubtitleLocal(semester2, setSemester2, i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSubtitle(semester2, setSemester2)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* PDF Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Diploma Document
              </CardTitle>
              <CardDescription>Upload or manage the official diploma PDF document</CardDescription>
            </CardHeader>
            <CardContent>
              {savedData?.pdfUrl ? (
                <div className="flex flex-wrap items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>PDF document uploaded</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(savedData.pdfUrl, "_blank")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleDownloadPdf}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={handleDeletePdf}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF files only (max 20MB)</p>
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Selected: {pdf.name}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={isLoading} className="px-8">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        <Separator className="my-8" />

        {/* Saved Data Preview */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Current Curriculum</h2>
            <p className="text-muted-foreground">Review and manage saved subjects</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">1</Badge>
                  Semester 1 Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedData?.semester1?.length > 0 ? (
                  <div className="space-y-2">
                    {savedData.semester1.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{item.title}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSubtitle("semester1", i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No subjects added yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">2</Badge>
                  Semester 2 Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedData?.semester2?.length > 0 ? (
                  <div className="space-y-2">
                    {savedData.semester2.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{item.title}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSubtitle("semester2", i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No subjects added yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectionDiplomaAdmin
