import { useState } from "react";
import axios from "axios";
import UploadSection from "./components/UploadSection";
import AudioSection from "./components/AudioSection";
import MedicationPhotoSection from "./components/MedicationPhotoSection";
import ResultsSection from "./components/ResultsSection";
import ReminderSection from "./components/ReminderSection";
import "./App.css";

const API = "http://localhost:8000";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upload");

  const handleResult = (data) => {
    setResult(data);
    setError("");
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleError = (msg) => {
    setError(msg);
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">+</span>
            <span className="logo-text">MedBuddy</span>
          </div>
          <p className="tagline">Your prescription, explained simply.</p>
        </div>
      </header>

      <main className="app-main">
        <div className="tabs">
          {[
            { id: "upload", label: "Upload Prescription" },
            { id: "audio", label: "Audio Recording" },
            { id: "photo", label: "Medicine Photo" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "upload" && (
            <UploadSection
              API={API}
              onResult={handleResult}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {activeTab === "audio" && (
            <AudioSection
              API={API}
              onResult={handleResult}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {activeTab === "photo" && (
            <MedicationPhotoSection
              API={API}
              onResult={handleResult}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading && (
          <div className="loading-card">
            <div className="spinner" />
            <p>MedBuddy is reading your prescription...</p>
          </div>
        )}

        {result && !loading && (
          <div id="results">
            <ResultsSection result={result} />
            {result.medications && result.medications.length > 0 && (
              <ReminderSection API={API} medications={result.medications} />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>MedBuddy only simplifies what your doctor wrote. It does not give medical advice.</p>
      </footer>
    </div>
  );
}