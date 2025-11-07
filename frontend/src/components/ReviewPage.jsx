import React, { useState } from "react";
import { submitAll, resumeUrl, videoUrl } from "../api";

export default function ReviewPage({ data, setData, onBack }) {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [uploaded, setUploaded] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    setErr("");
    setMsg("");
    if (!data.resumeFile || !data.videoBlob) {
      setErr("Missing resume or video");
      return;
    }
    if (data.videoDuration > 90) {
      setErr("Video too long (>90s)");
      return;
    }
    setLoading(true);

    try {
      const form = new FormData();
      form.append("fname", data.fname);
      form.append("lname", data.lname);
      form.append("pos", data.pos);
      form.append("cur", data.cur);
      form.append("yrs", data.yrs);
      form.append("videoDuration", data.videoDuration);

      form.append("resume", data.resumeFile, data.resumeFile.name);

      // convert blob to File so multer sees filename
      const videoFile = new File([data.videoBlob], "candidate_video.webm", {
        type: data.videoBlob.type,
      });
      form.append("video", videoFile);

      const res = await submitAll(form);

      if (res && res.ok) {
        setMsg("Uploaded successfully. ID: " + res.id);
        setUploaded(res.id);
        setData({ ...data, uploadedIds: res.id });
      } else {
        setErr(res.error || "Upload failed");
      }
    } catch (e) {
      console.error(e);
      setErr("Upload error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4">
      <h3>Review & Submit</h3>
      <div className="mb-3">
        <strong>First Name:</strong> {data.fname}
      </div>
      <div className="mb-3">
        <strong>Last Name:</strong> {data.lname}
      </div>
      <div className="mb-3">
        <strong>Position:</strong> {data.pos}
      </div>
      <div className="mb-3">
        <strong>Current Position:</strong> {data.cur}
      </div>
      <div className="mb-3">
        <strong>Experience (yrs):</strong> {data.yrs}
      </div>

      <div className="mb-3">
        <strong>Resume:</strong>
        <div>{data.resumeFile ? data.resumeFile.name : "No file"}</div>
      </div>

      <div className="mb-3">
        <strong>Video Preview:</strong>
        {data.videoBlob ? (
          <video
            controls
            src={URL.createObjectURL(data.videoBlob)}
            className="video-preview"
          />
        ) : (
          <div>No video</div>
        )}
      </div>

      {err && <div className="err mb-2">{err}</div>}
      {msg && <div className="mb-2 text-success">{msg}</div>}

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload to Server"}
          </button>
        </div>
      </div>

      {uploaded && (
        <div className="mt-3">
          <div>Uploaded. Candidate doc id: {uploaded}</div>
          <div className="mt-2">
            <small className="small">
              To access resume/video you can use backend endpoints (see README).
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
