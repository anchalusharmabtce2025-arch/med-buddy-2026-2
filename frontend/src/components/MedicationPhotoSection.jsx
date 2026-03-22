import { useState } from "react";
import axios from "axios";

export default function MedicationPhotoSection({ API, onResult, onError, loading, setLoading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file) { onError("Please upload a medication photo."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post(`${API}/api/process/medication-photo`, fd);
      onResult(res.data);
    } catch (e) {
      onError(e.response?.data?.detail || "Photo recognition failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <h2>Identify Medicine from Photo</h2>
      <p className="section-desc">Take or upload a photo of your medicine. MedBuddy will identify it and match it against your prescription history.</p>

      <div
        className={`drop-zone ${preview ? "has-file" : ""}`}
        onClick={() => document.getElementById("photo-input").click()}
      >
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {preview ? (
          <img src={preview} alt="medicine preview" className="med-preview" />
        ) : (
          <div className="drop-hint">
            <span className="upload-icon">📷</span>
            <p>Tap to take photo or upload</p>
            <p className="hint-sub">Works best with clear, well-lit photos</p>
          </div>
        )}
      </div>

      <button className="primary-btn" onClick={handleSubmit} disabled={loading || !file}>
        {loading ? "Identifying..." : "Identify This Medicine"}
      </button>
    </div>
  );
}