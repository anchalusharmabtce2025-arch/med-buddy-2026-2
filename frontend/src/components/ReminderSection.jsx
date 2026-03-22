import { useState } from "react";
import axios from "axios";

export default function ReminderSection({ API, medications }) {
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [scheduled, setScheduled] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSchedule = async () => {
    if (!phone) { setError("Please enter a phone number for SMS."); return; }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("medications", JSON.stringify(medications));
      fd.append("phone", phone);
      fd.append("whatsapp", whatsapp);
      const res = await axios.post(`${API}/api/schedule-reminders`, fd);
      setScheduled(res.data.scheduled);
    } catch (e) {
      setError(e.response?.data?.detail || "Could not schedule reminders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="result-card reminder-card">
      <h3>Set medication reminders</h3>
      <p className="section-desc">Get notified on your phone when it's time to take each medicine.</p>

      <div className="reminder-inputs">
        <div className="option-group">
          <label>Mobile number (SMS)</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="small-input full-width"
          />
        </div>
        <div className="option-group">
          <label>WhatsApp number (optional)</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="small-input full-width"
          />
        </div>
      </div>

      {error && <p className="inline-error">{error}</p>}

      <button className="primary-btn" onClick={handleSchedule} disabled={loading}>
        {loading ? "Scheduling..." : "Activate Reminders"}
      </button>

      {scheduled && (
        <div className="scheduled-list">
          <p className="scheduled-title">Reminders scheduled:</p>
          {scheduled.map((r, i) => (
            <div key={i} className="scheduled-item">
              <span className="sched-med">{r.medicine}</span>
              <span className="sched-time">{r.hour}</span>
              <span className="sched-dose">{r.dosage}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}