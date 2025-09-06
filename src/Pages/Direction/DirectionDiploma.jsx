import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const DirectionDiplomaAdmin = () => {
  const [semester1, setSemester1] = useState([""]);
  const [semester2, setSemester2] = useState([""]);
  const [semester1Input, setSemester1Input] = useState([""]);
  const [semester2Input, setSemester2Input] = useState([""]);
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
        formData.append("pdf", pdf);

        const uploadRes = await axios.post(
          `${API_BASE}/directiondiploma/pdf`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("PDF Upload Response:", uploadRes.data); // 👈 add this
      }

      // Refresh data
      const res = await axios.get(`${API_BASE}/directiondiploma`);
      const data = res.data.direction.diploma[0] || {
        semester1: [],
        semester2: [],
        pdfUrl: "",
      };
      console.log("Fetched diploma data:", res.data); // 👈 add this
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
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-600">
        🎬 Direction Diploma Admin
      </h2>

      {/* 1️⃣ Form View */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Semester 1 */}
        <div className="bg-white shadow p-5 rounded-xl border border-indigo-100">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            Semester 1
          </h3>
          {semester1Input.map((sub, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={sub}
                onChange={(e) =>
                  updateSubtitle(
                    semester1Input,
                    setSemester1Input,
                    i,
                    e.target.value
                  )
                }
                placeholder="Enter subtitle"
                className="border rounded-md p-2 w-full"
              />
              <button
                type="button"
                onClick={() =>
                  deleteSubtitleLocal(semester1Input, setSemester1Input, i)
                }
                className="text-red-500"
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addSubtitle(semester1Input, setSemester1Input)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
          >
            ➕ Add Subtitle
          </button>
        </div>

        {/* Semester 2 */}
        <div className="bg-white shadow p-5 rounded-xl border border-indigo-100">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            Semester 2
          </h3>
          {semester2Input.map((sub, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={sub}
                onChange={(e) =>
                  updateSubtitle(
                    semester2Input,
                    setSemester2Input,
                    i,
                    e.target.value
                  )
                }
                placeholder="Enter subtitle"
                className="border rounded-md p-2 w-full"
              />
              <button
                type="button"
                onClick={() =>
                  deleteSubtitleLocal(semester2Input, setSemester2Input, i)
                }
                className="text-red-500"
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addSubtitle(semester2Input, setSemester2Input)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
          >
            ➕ Add Subtitle
          </button>
        </div>
      </form>

      {/* PDF Upload */}
      <div className="bg-white shadow p-5 rounded-xl border border-indigo-100">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">
          Upload PDF
        </h3>
        {savedData?.pdfUrl ? (
          <div className="flex items-center gap-4">
            <a
              href={savedData.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {savedData.pdfUrl.split("/").pop()}
            </a>
            <button
              type="button"
              onClick={handleDeletePdf}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Delete PDF
            </button>
          </div>
        ) : (
          <input
            type="file"
            onChange={(e) => setPdf(e.target.files[0])}
            className="border rounded-md p-2 w-full"
          />
        )}
      </div>

      {/* Save */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white rounded-md font-semibold"
        >
          💾 Save Changes
        </button>
      </div>

      {/* 3️⃣ Saved Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-2 text-indigo-700">Semester 1</h4>
          {savedData?.semester1?.map((item, i) => (
            <div key={i} className="flex justify-between items-center mb-1">
              <span className="text-gray-800">{item.title}</span>
              <button
                className="text-red-500"
                onClick={() => handleDeleteSubtitle("semester1", i)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-2 text-indigo-700">Semester 2</h4>
          {savedData?.semester2?.map((item, i) => (
            <div key={i} className="flex justify-between items-center mb-1">
              <span className="text-gray-800">{item.title}</span>
              <button
                className="text-red-500"
                onClick={() => handleDeleteSubtitle("semester2", i)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectionDiplomaAdmin;
