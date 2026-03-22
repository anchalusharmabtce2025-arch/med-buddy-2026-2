import { useState, useRef } from "react";
import axios from "axios";

export default function AudioSection({ API, onResult, onError, loading, setLoading }) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("English");
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.current.start();
      setRecording(true);
    } catch {
      onError("Microphone access denied. Please allow microphone permission.");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  const handleSubmit = async () => {
    const source = uploadedFile || audioBlob;
    if (!source) { onError("Please record or upload an audio file."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", uploadedFile || new File([audioBlob], "recording.webm", { type: "audio/webm" }));
      fd.append("patient_age", age);
      fd.append("language", language);
      const res = await axios.post(`${API}/api/process/audio`, fd);
      onResult(res.data);
    } catch (e) {
      onError(e.response?.data?.detail || "Audio processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <h2>Doctor Consultation Audio</h2>
      <p className="section-desc">Record your session with the doctor or upload an existing audio file. MedBuddy will extract the prescription from it.</p>

      <div className="audio-controls">
        {!recording ? (
          <button className="record-btn" onClick={startRecording} disabled={loading}>
            🎙 Start Recording
          </button>
        ) : (
          <button className="record-btn recording" onClick={stopRecording}>
            ⏹ Stop Recording
          </button>
        )}

        <span className="or-divider">or</span>

        <label className="upload-audio-btn">
          📁 Upload Audio File
          <input
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setUploadedFile(e.target.files[0]);
              setAudioBlob(null);
              setAudioUrl("");
            }}
          />
        </label>
      </div>

      {uploadedFile && <p className="file-name-label">Uploaded: {uploadedFile.name}</p>}
      {audioUrl && (
        <div className="audio-preview">
          <p>Recording ready:</p>
          <audio controls src={audioUrl} />
        </div>
      )}

      <div className="options-row">
        <div className="option-group">
          <label>Patient age (optional)</label>
          <input type="number" placeholder="e.g. 45" value={age} onChange={(e) => setAge(e.target.value)} className="small-input" />
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
        disabled={loading || (!audioBlob && !uploadedFile)}
      >
        {loading ? "Processing audio..." : "Extract Prescription from Audio"}
      </button>
    </div>
  );
}