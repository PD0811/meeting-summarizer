import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Select audio file");
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);

    try {
      const res = await fetch(`${API_BASE}/api/meetings/upload`, {
        method: "POST",
        body: fd
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }
      const j = await res.json();
      setResult(j);
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Meeting Summarizer</h1>
      <form onSubmit={handleUpload}>
        <div>
          <label>Title (optional)</label><br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button style={{ marginTop: 12 }} type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload & Summarize"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Result</h2>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>Title:</strong> {result.title}</p>
          <h3>Summary</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result.summary}</pre>
          <h3>Action Items</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result.action_items}</pre>
          <h3>Transcript (long)</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result.transcript}</pre>
        </div>
      )}
    </div>
  );
}
