import { useState, useEffect } from "react";
import axios from "axios";

const DirectionDiplomaAdmin = () => {
  const [semester1, setSemester1] = useState([""]);
  const [semester2, setSemester2] = useState([""]);
  const [pdf, setPdf] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [data, setData] = useState([]);

  // Fetch saved data on load
  useEffect(() => {
    axios
      .get("http://localhost:5000/directiondiploma")
      .then((res) => {
        const diplomaData = Array.isArray(res.data) ? res.data : [res.data];
        const first = diplomaData[0];

        setData(diplomaData);

        if (first) {
          setSavedData({
            ...first,
            // Normalize pdf: always array
            pdf: first?.pdf
              ? Array.isArray(first.pdf)
                ? first.pdf
                : [first.pdf]
              : [],
          });
        }

        // Always reset inputs for new data
        setSemester1([""]);
        setSemester2([""]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddSemester1 = () => setSemester1([...semester1, ""]);
  const handleAddSemester2 = () => setSemester2([...semester2, ""]);

  const handleChangeSemester1 = (index, value) => {
    const updated = [...semester1];
    updated[index] = value;
    setSemester1(updated);
  };

  const handleChangeSemester2 = (index, value) => {
    const updated = [...semester2];
    updated[index] = value;
    setSemester2(updated);
  };

  const handleDeleteSemester1 = (index) => {
    const temp = [...savedData.semester1];
    temp.splice(index, 1);
    const newData = { ...savedData, semester1: temp };
    fsWriteData(newData);
  };

  const handleDeleteSemester2 = (index) => {
    const temp = [...savedData.semester2];
    temp.splice(index, 1);
    const newData = { ...savedData, semester2: temp };
    fsWriteData(newData);
  };

  // Helper: write JSON data update
  const fsWriteData = async (data) => {
    try {
      await axios.post("http://localhost:5000/directiondiploma/update", data);
      setSavedData(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Save new data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Only add non-empty values
    semester1.filter((s) => s.trim() !== "").forEach((s) => formData.append("semester1", s));
    semester2.filter((s) => s.trim() !== "").forEach((s) => formData.append("semester2", s));

    if (pdf) formData.append("pdf", pdf);

    try {
      const res = await axios.post("http://localhost:5000/directiondiploma", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Normalize saved pdf
      const updated = {
        ...res.data.data,
        pdf: res.data.data?.pdf
          ? Array.isArray(res.data.data.pdf)
            ? res.data.data.pdf
            : [res.data.data.pdf]
          : [],
      };

      setSavedData(updated);

      // Reset form
      setSemester1([""]);
      setSemester2([""]);
      setPdf(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePdf = async (file) => {
    try {
      const res = await axios.delete("http://localhost:5000/directiondiploma/pdf", {
        data: { file },
      });

      const updated = {
        ...res.data.data,
        pdf: res.data.data?.pdf
          ? Array.isArray(res.data.data.pdf)
            ? res.data.data.pdf
            : [res.data.data.pdf]
          : [],
      };

      setSavedData(updated);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Direction Diploma Admin</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 text-black">
        {/* Semester 1 */}
        <div>
          <h3>Semester 1</h3>
          {semester1.map((s, i) => (
            <input
              key={i}
              value={s}
              onChange={(e) => handleChangeSemester1(i, e.target.value)}
              className="border p-2 w-full my-1 text-black"
              placeholder="Enter subject"
            />
          ))}
          <button
            type="button"
            onClick={handleAddSemester1}
            className="bg-blue-500 px-2 py-1 mt-1 text-white"
          >
            Add +
          </button>
        </div>

        {/* Semester 2 */}
        <div>
          <h3>Semester 2</h3>
          {semester2.map((s, i) => (
            <input
              key={i}
              value={s}
              onChange={(e) => handleChangeSemester2(i, e.target.value)}
              className="border p-2 w-full my-1 text-black"
              placeholder="Enter subject"
            />
          ))}
          <button
            type="button"
            onClick={handleAddSemester2}
            className="bg-blue-500 px-2 py-1 mt-1 text-white"
          >
            Add +
          </button>
        </div>

        {/* PDF */}
        <div>
          <h3>Upload PDF</h3>
          {savedData?.pdf?.length > 0 ? (
            <p className="text-red-500">
              A PDF is already uploaded. Delete it before uploading a new one.
            </p>
          ) : (
            <input type="file" onChange={(e) => setPdf(e.target.files[0])} />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-500 px-4 py-2 mt-2 text-white"
        >
          Save
        </button>
      </form>

      {/* Saved data */}
      {savedData && (
        <div className="mt-10 text-black">
          <h3>Saved Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Semester 1 */}
            <div>
              <h4>Semester 1</h4>
              {savedData?.semester1?.map((s, i) => (
                <div key={i} className="flex items-center gap-x-2">
                  <span>{s}</span>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => handleDeleteSemester1(i)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            {/* Semester 2 */}
            <div>
              <h4>Semester 2</h4>
              {savedData?.semester2?.map((s, i) => (
                <div key={i} className="flex items-center gap-x-2">
                  <span>{s}</span>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => handleDeleteSemester2(i)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            {/* PDFs */}
            <div>
              <h4>PDFs</h4>
              {savedData?.pdf?.map((file, i) => (
                <div key={i} className="flex items-center gap-x-2">
                  <a
                    href={`http://localhost:5000${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.split("/").pop()}
                  </a>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => handleDeletePdf(file)}
                  >
                    x
                  </button>
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
