import { useState } from "react";
import axios from "axios";

export default function UploadSection({ API, onResult, onError, loading, setLoading }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("file");
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("English");
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === "file" && file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("patient_age", age);
        fd.append("language", language);
        res = await axios.post(`${API}/api/process/file`, fd);
      } else if (mode === "text" && text.trim()) {
        const fd = new FormData();
        fd.append("text", text);
        fd.append("patient_age", age);
        fd.append("language", language);
        res = await axios.post(`${API}/api/process/text`, fd);
      } else {
        onError("Please provide a file or paste text.");
        return;
      }
      onResult(res.data);
    } catch (e) {
      onError(e.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <h2>Upload Your Prescription</h2>
      <p className="section-desc">Upload a PDF, photo, or handwritten prescription — or paste the text directly.</p>

      <div className="mode-toggle">
        <button className={mode === "file" ? "active" : ""} onClick={() => setMode("file")}>Upload File</button>
        <button className={mode === "text" ? "active" : ""} onClick={() => setMode("text")}>Paste Text</button>
      </div>

      {mode === "file" ? (
        <div
          className={`drop-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("file-input").click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,image/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? (
            <div className="file-chosen">
              <span className="file-icon">📄</span>
              <span>{file.name}</span>
              <button className="remove-file" onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
            </div>
          ) : (
            <div className="drop-hint">
              <span className="upload-icon">⬆</span>
              <p>Drag & drop or click to upload</p>
              <p className="hint-sub">PDF, JPG, PNG — including handwritten</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          className="text-input"
          rows={8}
          placeholder="Paste your prescription or discharge summary text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      <div className="options-row">
        <div className="option-group">
          <label>Patient age (optional)</label>
          <input
            type="number"
            placeholder="e.g. 45"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="small-input"
          />
        </div>
        <div className="option-group">
          <label>Output language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="small-input">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      <button
        className="primary-btn"
        onClick={handleSubmit}
        disabled={loading || (mode === "file" ? !file : !text.trim())}
      >
        {loading ? "Processing..." : "Simplify My Prescription"}
      </button>
    </div>
  );
}