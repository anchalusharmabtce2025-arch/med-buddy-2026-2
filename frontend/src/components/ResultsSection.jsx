export default function ResultsSection({ result }) {
  if (result?.error) {
    return <div className="error-card">Could not process document. Please try again with a clearer image.</div>;
  }

  if (result?.identified_medicines) {
    return (
      <div className="results-wrapper">
        <div className="summary-banner">
          <strong>Medicines identified in photo:</strong> {result.identified_medicines.join(", ")}
        </div>
        {result.matched_from_history?.length > 0 && (
          <div className="result-card">
            <h3>Matched from your prescription history</h3>
            <table className="med-table">
              <thead><tr><th>Medicine</th><th>Dosage</th><th>Timing</th><th>Duration</th></tr></thead>
              <tbody>
                {result.matched_from_history.map((m, i) => (
                  <tr key={i}><td>{m.medicine}</td><td>{m.dosage}</td><td>{m.timing}</td><td>{m.duration}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {result.not_in_history?.length > 0 && (
          <div className="result-card warning-card">
            <h3>Not found in your prescription history</h3>
            <ul>{result.not_in_history.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="results-wrapper">
      {result.one_line_summary && (
        <div className="summary-banner">
          <strong>In short:</strong> {result.one_line_summary}
        </div>
      )}

      {result.diagnosis && (
        <div className="result-card">
          <h3>What you have</h3>
          <p className="condition-name">{result.diagnosis.condition}</p>
          <p className="plain-text">{result.diagnosis.plain_explanation}</p>
        </div>
      )}

      {result.medications?.length > 0 && (
        <div className="result-card">
          <h3>Your medication schedule</h3>
          <table className="med-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>When to take</th>
                <th>For how long</th>
                <th>With food?</th>
              </tr>
            </thead>
            <tbody>
              {result.medications.map((m, i) => (
                <tr key={i}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.dosage}</td>
                  <td>{m.timing}</td>
                  <td>{m.duration}</td>
                  <td>{m.with_food}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.side_effects?.length > 0 && (
        <div className="result-card">
          <h3>Side effects to watch for</h3>
          {result.side_effects.map((s, i) => (
            <div key={i} className="side-effect-item">
              <p className="med-name">{s.medicine}</p>
              <ul>{s.watch_for?.map((w, j) => <li key={j}>{w}</li>)}</ul>
              {s.call_doctor_if && (
                <div className="call-doctor-alert">
                  Call your doctor immediately if: {s.call_doctor_if}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result.followup_checklist && (
        <div className="result-card">
          <h3>Follow-up checklist</h3>
          {result.followup_checklist.tests_ordered?.length > 0 && (
            <div className="checklist-group">
              <p className="checklist-label">Tests ordered</p>
              {result.followup_checklist.tests_ordered.map((t, i) => (
                <label key={i} className="checklist-item">
                  <input type="checkbox" /> {t}
                </label>
              ))}
            </div>
          )}
          {result.followup_checklist.diet_restrictions?.length > 0 && (
            <div className="checklist-group">
              <p className="checklist-label">Diet restrictions</p>
              {result.followup_checklist.diet_restrictions.map((d, i) => (
                <label key={i} className="checklist-item">
                  <input type="checkbox" /> {d}
                </label>
              ))}
            </div>
          )}
          {result.followup_checklist.activity_limits?.length > 0 && (
            <div className="checklist-group">
              <p className="checklist-label">Activity limits</p>
              {result.followup_checklist.activity_limits.map((a, i) => (
                <label key={i} className="checklist-item">
                  <input type="checkbox" /> {a}
                </label>
              ))}
            </div>
          )}
          {result.followup_checklist.next_appointment && (
            <p className="next-appt">Next appointment: {result.followup_checklist.next_appointment}</p>
          )}
        </div>
      )}
    </div>
  );
}