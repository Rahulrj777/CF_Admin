import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AdminDiploma = () => {
  const [months, setMonths] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [savedMonths, setSavedMonths] = useState([]);
  const [savedPdf, setSavedPdf] = useState("");
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // -------- Fetch Saved Data --------
  const fetchDiplomaData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/editingdiploma`);
      setSavedMonths(res.data.editing?.diploma || []);
    } catch (err) {
      console.error("Error fetching diploma data:", err);
    }
  };

  useEffect(() => {
    fetchDiplomaData();
  }, []);

  // -------- Editing --------
  const startEditingMonth = (index) => {
    setEditMode(true);
    setEditingIndex(index);
    setMonths([{ ...savedMonths[index] }]);
    setPdf(null);
    setFileKey((k) => k + 1);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditingIndex(-1);
    setMonths([]);
    setPdf(null);
    setFileKey((k) => k + 1);
  };

  // -------- Delete Month --------
  const deleteSavedMonth = async (index) => {
    if (!confirm("Are you sure you want to delete this month?")) return;
    try {
      const updatedDiploma = savedMonths.filter((_, i) => i !== index);
      const formData = new FormData();
      formData.append("months", JSON.stringify(updatedMonths)); // ✅ correct
      if (pdf) formData.append("pdf_global", pdf);

      const res = await axios.post(
        `${API_BASE}/editingdiploma/save`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSavedMonths(res.data.data.months || []);
      alert("Month deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting month:", err);
      alert("Error deleting month");
    }
  };

  // -------- CRUD Helpers --------
  const addMonth = () =>
    setMonths((prev) => [...prev, { month: "", sections: [] }]);
  const updateMonthTitle = (mi, value) =>
    setMonths((prev) =>
      prev.map((m, i) => (i === mi ? { ...m, month: value } : m))
    );

  const addSection = (mi) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: [...m.sections, { name: "New Section", items: [] }],
            }
          : m
      )
    );

  const updateSectionName = (mi, si, value) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: m.sections.map((s, j) =>
                j === si ? { ...s, name: value } : s
              ),
            }
          : m
      )
    );

  const deleteSection = (mi, si) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi ? { ...m, sections: m.sections.filter((_, j) => j !== si) } : m
      )
    );

  const addItem = (mi, si) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: m.sections.map((s, j) =>
                j === si
                  ? { ...s, items: [...s.items, { title: "New Item" }] }
                  : s
              ),
            }
          : m
      )
    );

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
                      items: s.items.map((it, k) =>
                        k === ii ? { ...it, title: value } : it
                      ),
                    }
                  : s
              ),
            }
          : m
      )
    );

  const deleteItem = (mi, si, ii) =>
    setMonths((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              sections: m.sections.map((s, j) =>
                j === si
                  ? { ...s, items: s.items.filter((_, k) => k !== ii) }
                  : s
              ),
            }
          : m
      )
    );

  // -------- Save --------
  const saveData = async () => {
    setSaving(true);
    try {
      let updatedMonths;
      if (editMode && editingIndex >= 0) {
        updatedMonths = [...savedMonths];
        updatedMonths[editingIndex] = months[0];
      } else {
        updatedMonths = [...savedMonths, ...months];
      }

      const formData = new FormData();
      formData.append("months", JSON.stringify(updatedMonths)); // ✅ match backend
      if (pdf) formData.append("pdf_global", pdf);

      const res = await axios.post(
        `${API_BASE}/editingdiploma/save`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSavedMonths(res.data.data.months || []);
      setSavedPdf(res.data.data.pdf || "");
      setMonths([]);
      setPdf(null);
      setFileKey((k) => k + 1);
      setEditMode(false);
      setEditingIndex(-1);

      alert(editMode ? "Updated successfully ✅" : "Saved successfully ✅");
    } catch (err) {
      console.error("Error saving diploma data:", err);
    } finally {
      setSaving(false);
    }
  };

  // -------- Delete Global PDF --------
  const deleteSavedPdf = async () => {
    try {
      await axios.delete(`${API_BASE}/editingdiploma/pdf`);
      setSavedPdf("");
      setPdf(null);
      setFileKey((k) => k + 1);
    } catch (err) {
      console.error("Error deleting PDF:", err);
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Diploma Admin</h2>

      {/* Editing Banner */}
      {editMode && (
        <div className="mb-4 p-3 bg-blue-800 rounded-md">
          <p className="font-semibold">
            Editing Month: {savedMonths[editingIndex]?.month || "New"}
          </p>
          <button
            onClick={cancelEdit}
            className="mt-2 px-3 py-1 bg-gray-600 rounded"
          >
            Cancel Edit
          </button>
        </div>
      )}

      {/* Draft Months */}
      {months.map((month, mi) => (
        <div key={mi} className="border p-4 mb-6 rounded-md bg-gray-800">
          <div className="flex justify-between items-center mb-2">
            <input
              className="bg-gray-700 px-2 py-1 rounded text-xl font-bold flex-1"
              placeholder="Enter Month (e.g. January 2025)"
              value={month.month}
              onChange={(e) => updateMonthTitle(mi, e.target.value)}
            />
            <button
              onClick={() => addSection(mi)}
              className="ml-2 px-2 py-1 bg-blue-500 rounded"
            >
              + Add Section
            </button>
          </div>

          {month.sections.map((section, si) => (
            <div key={si} className="ml-4 mb-4 border-l pl-4 border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <input
                  className="bg-gray-700 px-2 py-1 rounded flex-1"
                  value={section.name}
                  onChange={(e) => updateSectionName(mi, si, e.target.value)}
                />
                <button
                  onClick={() => deleteSection(mi, si)}
                  className="ml-2 px-2 py-1 bg-red-500 rounded"
                >
                  🗑️
                </button>
              </div>

              {section.items.map((item, ii) => (
                <div key={ii} className="flex items-center mb-2 ml-6 gap-2">
                  <input
                    className="bg-gray-700 px-2 py-1 rounded flex-1"
                    placeholder="Item Title"
                    value={item.title || ""}
                    onChange={(e) =>
                      updateItemTitle(mi, si, ii, e.target.value)
                    }
                  />
                  <button
                    onClick={() => deleteItem(mi, si, ii)}
                    className="px-2 py-1 bg-red-500 rounded"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              <button
                onClick={() => addItem(mi, si)}
                className="ml-6 px-2 py-1 bg-green-500 rounded"
              >
                + Add Item
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* File Upload */}
      {pdf && (
        <div className="mb-4 p-3 bg-gray-800 rounded flex justify-between items-center">
          <p>Selected PDF: {pdf.name}</p>
          <button
            onClick={() => {
              setPdf(null);
              setFileKey((k) => k + 1);
            }}
            className="px-3 py-1 bg-red-600 rounded"
          >
            ❌ Remove
          </button>
        </div>
      )}

      {!pdf && !savedPdf && (
        <input
          key={fileKey}
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files?.[0] || null)}
          className="bg-gray-700 px-2 py-1 rounded w-full mb-4"
        />
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        {!editMode && (
          <button
            onClick={addMonth}
            className="px-4 py-2 bg-purple-600 rounded"
            disabled={saving}
          >
            + Add Month
          </button>
        )}
        <button
          onClick={saveData}
          className="px-4 py-2 bg-green-600 rounded"
          disabled={saving}
        >
          {saving ? "Saving..." : editMode ? "Update" : "Save"}
        </button>
      </div>

      {/* Preview Section */}
      <div className="mt-12 border-t border-gray-700 pt-6">
        <h2 className="text-2xl font-bold mb-4">📌 Saved Data</h2>
        {savedMonths.length === 0 && (
          <p className="text-gray-400">No saved months yet.</p>
        )}

        {savedMonths.map((month, mi) => (
          <div
            key={mi}
            className="mb-6 p-4 border rounded-md bg-gray-800 shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{month.month}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditingMonth(mi)}
                  className="px-3 py-1 bg-blue-600 rounded"
                  disabled={editMode}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteSavedMonth(mi)}
                  className="px-3 py-1 bg-red-600 rounded"
                  disabled={editMode}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            {month.sections.map((section, si) => (
              <div key={si} className="ml-4 mb-4 p-3 border-l border-gray-600">
                <h4 className="text-lg font-semibold">{section.name}</h4>
                <ul className="ml-6 list-disc text-gray-300">
                  {section.items.map((item, ii) => (
                    <li key={ii}>{item.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        {(savedPdf || pdf) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Attached PDF</h3>
            <div className="flex items-center gap-4 mt-2">
              <a
                href={pdf ? URL.createObjectURL(pdf) : savedPdf}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                View PDF
              </a>
              {savedPdf && (
                <button
                  onClick={deleteSavedPdf}
                  className="px-3 py-1 bg-red-600 rounded"
                >
                  Delete PDF
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDiploma;
