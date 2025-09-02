import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const DirectionDiplomaAdmin = () => {
  const [semester1, setSemester1] = useState([""]); // subtitles
  const [semester2, setSemester2] = useState([""]);
  const [pdf, setPdf] = useState(null);
  const [savedData, setSavedData] = useState(null);

  // Fetch saved data
  useEffect(() => {
    axios
      .get(`${API_BASE}/directiondiploma`)
      .then((res) => {
        const data = res.data || { semester1: [], semester2: [] };
        setSavedData(data);

        setSemester1(data.semester1.length ? data.semester1.map(d => d.subtitle || "") : [""]);
        setSemester2(data.semester2.length ? data.semester2.map(d => d.subtitle || "") : [""]);
      })
      .catch(console.error);
  }, []);

  // Add subtitle input
  const addSubtitle = (semester, setSemester) => setSemester([...semester, ""]);

  // Update subtitle
  const updateSubtitle = (semester, setSemester, idx, value) => {
    const updated = [...semester];
    updated[idx] = value;
    setSemester(updated);
  };

  // Delete subtitle
  const deleteSubtitle = (semester, setSemester, idx) => {
    const updated = [...semester];
    updated.splice(idx, 1);
    setSemester(updated);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    semester1.forEach(sub => sub.trim() && formData.append("semester1", sub));
    semester2.forEach(sub => sub.trim() && formData.append("semester2", sub));
    if (pdf) formData.append("pdf", pdf);

    try {
      const res = await axios.post(`${API_BASE}/directiondiploma`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSavedData(res.data.data);
      setSemester1([""]);
      setSemester2([""]);
      setPdf(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete PDF
  const handleDeletePdf = async (file) => {
    try {
      const res = await axios.delete(`${API_BASE}/directiondiploma/pdf`, { data: { file } });
      setSavedData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Direction Diploma Admin</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 text-black">
        {/* Semester 1 */}
        <div>
          <h3>Semester 1</h3>
          {semester1.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                value={sub}
                onChange={(e) => updateSubtitle(semester1, setSemester1, i, e.target.value)}
                placeholder="Enter subtitle"
                className="border p-2 w-full"
              />
              <button type="button" className="text-red-500" onClick={() => deleteSubtitle(semester1, setSemester1, i)}>x</button>
            </div>
          ))}
          <button type="button" className="bg-blue-500 px-2 py-1 text-white" onClick={() => addSubtitle(semester1, setSemester1)}>Add +</button>
        </div>

        {/* Semester 2 */}
        <div>
          <h3>Semester 2</h3>
          {semester2.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                value={sub}
                onChange={(e) => updateSubtitle(semester2, setSemester2, i, e.target.value)}
                placeholder="Enter subtitle"
                className="border p-2 w-full"
              />
              <button type="button" className="text-red-500" onClick={() => deleteSubtitle(semester2, setSemester2, i)}>x</button>
            </div>
          ))}
          <button type="button" className="bg-blue-500 px-2 py-1 text-white" onClick={() => addSubtitle(semester2, setSemester2)}>Add +</button>
        </div>

        {/* PDF */}
        <div>
          <h3>Upload PDF</h3>
          {savedData?.pdf?.length > 0 ? (
            <p className="text-red-500">PDF uploaded. Delete before adding new.</p>
          ) : (
            <input type="file" onChange={(e) => setPdf(e.target.files[0])} />
          )}
        </div>

        <button type="submit" className="bg-green-500 px-4 py-2 text-white">Save</button>
      </form>

      {/* Saved data */}
      {savedData && (
        <div className="mt-10 text-black">
          <h3>Saved Data</h3>
          <div className="gap-4 mt-4">
            <div>
              <h4>Semester 1</h4>
              {savedData.semester1?.map((item, i) => (
                <div key={i} className="flex items-center gap-x-2">
                  <span>{item.subtitle}</span>
                  <button className="text-red-500" onClick={() => deleteSubtitle(semester1, setSemester1, i)}>x</button>
                </div>
              ))}
            </div>

            <div>
              <h4>Semester 2</h4>
              {savedData.semester2?.map((item, i) => (
                <div key={i} className="flex items-center gap-x-2">
                  <span>{item.subtitle}</span>
                  <button className="text-red-500" onClick={() => deleteSubtitle(semester2, setSemester2, i)}>x</button>
                </div>
              ))}
            </div>

            <div>
              <h4>PDFs</h4>
              {savedData.pdf?.map((file, i) => (
                <div key={i} className="flex items-center gap-x-2">
                  <a href={`${API_BASE}${file}`} target="_blank" rel="noopener noreferrer">{file.split("/").pop()}</a>
                  <button className="text-red-500" onClick={() => handleDeletePdf(file)}>x</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectionDiplomaAdmin;
