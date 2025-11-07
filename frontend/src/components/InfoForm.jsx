import React, { useState } from "react";

export default function InfoForm({ data, setData, onNext }) {
  const [err, setErr] = useState("");

  function handleFile(e) {
    const f = e.target.files[0];
    setErr("");
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErr("Resume must be a PDF file");
      e.target.value = null;
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErr("Resume exceeds 5 MB");
      e.target.value = null;
      return;
    }
    setData({ ...data, resumeFile: f });
  }

  function handleNext(e) {
    e.preventDefault();
    setErr("");
    const { fname, lname, pos, cur, yrs, resumeFile } = data;
    if (!fname || !lname || !pos || !cur || !yrs) {
      setErr("All fields are required");
      return;
    }
    if (!resumeFile) {
      setErr("Resume is required");
      return;
    }
    onNext();
  }

  return (
    <div className="card p-4">
      <h3>Candidate Information</h3>
      <form onSubmit={handleNext}>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            className="form-control"
            value={data.fname}
            onChange={(e) => setData({ ...data, fname: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            className="form-control"
            value={data.lname}
            onChange={(e) => setData({ ...data, lname: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Position Applied For</label>
          <input
            className="form-control"
            value={data.pos}
            onChange={(e) => setData({ ...data, pos: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Current Position</label>
          <input
            className="form-control"
            value={data.cur}
            onChange={(e) => setData({ ...data, cur: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Experience (years)</label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={data.yrs}
            onChange={(e) => setData({ ...data, yrs: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Resume (PDF, ≤ 5 MB)</label>
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            onChange={handleFile}
          />
          {data.resumeFile && (
            <div className="small mt-1">Selected: {data.resumeFile.name}</div>
          )}
        </div>

        {err && <div className="err mb-2">{err}</div>}

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
