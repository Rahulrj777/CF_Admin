import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const DirectionDiplomaAdmin = () => {
  const [semester1, setSemester1] = useState([""]);
  const [semester2, setSemester2] = useState([""]);
  const [pdf, setPdf] = useState(null);
  const [savedData, setSavedData] = useState(null);

  // Fetch saved data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/directiondiploma`);
        const data = res.data.direction.diploma[0] || {
          semester1: [],
          semester2: [],
          pdfUrl: "",
        };

        setSavedData(data);
        setSemester1(data.semester1.map((item) => item.title));
        setSemester2(data.semester2.map((item) => item.title));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Add subtitle input
  const addSubtitle = (semester, setSemester) => setSemester([...semester, ""]);

  // Update subtitle
  const updateSubtitle = (semester, setSemester, idx, value) => {
    const updated = [...semester];
    updated[idx] = value;
    setSemester(updated);
  };

  // Delete subtitle (local state)
  const deleteSubtitleLocal = (semester, setSemester, idx) => {
    const updated = [...semester];
    updated.splice(idx, 1);
    setSemester(updated);
  };

  // Submit subtitles and PDF
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update subtitles first
      await axios.post(`${API_BASE}/directiondiploma/text`, {
        semester1,
        semester2,
      });

      // Upload PDF if selected
      if (pdf) {
        const formData = new FormData();
        formData.append("file", pdf); // instead of "pdf"
        await axios.post(`${API_BASE}/directiondiploma/pdf`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Refresh data
      const res = await axios.get(`${API_BASE}/directiondiploma`);
      const data = res.data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      };
      setSavedData(data);
      setPdf(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete PDF
  const handleDeletePdf = async () => {
    try {
      await axios.delete(`${API_BASE}/directiondiploma/pdf`);
      const res = await axios.get(`${API_BASE}/directiondiploma`);
      const data = res.data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      };
      setSavedData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete subtitle from server
  const handleDeleteSubtitle = async (semester, idx) => {
    try {
      await axios.delete(`${API_BASE}/directiondiploma/diploma/subtitle`, {
        data: { semester, index: idx },
      });
      const res = await axios.get(`${API_BASE}/directiondiploma`);
      const data = res.data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      };
      setSavedData(data);
      // Update local state too
      if (semester === "semester1")
        setSemester1(data.semester1.map((item) => item.title));
      if (semester === "semester2")
        setSemester2(data.semester2.map((item) => item.title));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">Direction Diploma Admin</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        {/* Semester 1 */}
        <div>
          <h3>Semester 1</h3>
          {semester1.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                value={sub}
                onChange={(e) =>
                  updateSubtitle(semester1, setSemester1, i, e.target.value)
                }
                placeholder="Enter subtitle"
                className="border p-2 w-full"
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => deleteSubtitleLocal(semester1, setSemester1, i)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 px-2 py-1 text-white"
            onClick={() => addSubtitle(semester1, setSemester1)}
          >
            Add +
          </button>
        </div>

        {/* Semester 2 */}
        <div>
          <h3>Semester 2</h3>
          {semester2.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                value={sub}
                onChange={(e) =>
                  updateSubtitle(semester2, setSemester2, i, e.target.value)
                }
                placeholder="Enter subtitle"
                className="border p-2 w-full"
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => deleteSubtitleLocal(semester2, setSemester2, i)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 px-2 py-1 text-white"
            onClick={() => addSubtitle(semester2, setSemester2)}
          >
            Add +
          </button>
        </div>

        {/* PDF */}
        <div>
          <h3>Upload PDF</h3>
          {savedData?.pdfUrl ? (
            <div className="flex items-center gap-2">
              <a
                href={savedData.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {savedData.pdfUrl.split("/").pop()}
              </a>
              <button
                type="button"
                className="text-red-500"
                onClick={handleDeletePdf}
              >
                Delete PDF
              </button>
            </div>
          ) : (
            <input type="file" onChange={(e) => setPdf(e.target.files[0])} />
          )}
        </div>

        <button type="submit" className="bg-green-500 px-4 py-2 text-white">
          Save
        </button>
      </form>

      {/* Saved Data Preview */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-2">Saved Data</h3>
        <div>
          <h4>Semester 1</h4>
          {savedData?.semester1?.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>{item.title}</span>
              <button
                className="text-red-500"
                onClick={() => handleDeleteSubtitle("semester1", i)}
              >
                x
              </button>
            </div>
          ))}
        </div>
        <div>
          <h4>Semester 2</h4>
          {savedData?.semester2?.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>{item.title}</span>
              <button
                className="text-red-500"
                onClick={() => handleDeleteSubtitle("semester2", i)}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectionDiplomaAdmin;
