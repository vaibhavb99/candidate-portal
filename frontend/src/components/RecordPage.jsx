import React, { useEffect, useRef, useState } from "react";

export default function RecordPage({ data, setData, onNext, onBack }) {
  const vidRef = useRef(null);
  const mediaRef = useRef(null);
  const recRef = useRef(null);
  const [recState, setRecState] = useState("idle"); // idle, rec, done
  const [timer, setTimer] = useState(0);
  const [err, setErr] = useState("");
  const maxSec = 90;

  useEffect(() => {
    async function startStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaRef.current = stream;
        if (vidRef.current) {
          vidRef.current.srcObject = stream;
        }
      } catch (e) {
        setErr("Camera/microphone access is required: " + e.message);
      }
    }
    startStream();
    return () => {
      if (mediaRef.current) {
        mediaRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    let t;
    if (recState === "rec") {
      t = setInterval(
        () =>
          setTimer((s) => {
            if (s + 1 >= maxSec) {
              stopRec();
              return maxSec;
            }
            return s + 1;
          }),
        1000
      );
    } else {
      clearInterval(t);
    }
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [recState]);

  function startRec() {
    setErr("");
    if (!mediaRef.current) {
      setErr("No media stream");
      return;
    }
    const options = { mimeType: "video/webm;codecs=vp8,opus" };
    const mr = new MediaRecorder(mediaRef.current, options);
    recRef.current = mr;
    const parts = [];
    mr.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) parts.push(ev.data);
    };
    mr.onstop = () => {
      const blob = new Blob(parts, { type: "video/webm" });
      setData({ ...data, videoBlob: blob, videoDuration: timer });
      setRecState("done");
    };
    mr.start();
    setTimer(0);
    setRecState("rec");
  }

  function stopRec() {
    setErr("");
    if (recRef.current && recRef.current.state === "recording") {
      recRef.current.stop();
    }
    setRecState("done");
  }

  function handleSubmit() {
    if (!data.videoBlob) {
      setErr("Please record a video before submit");
      return;
    }
    if (data.videoDuration > maxSec) {
      setErr("Video exceeds 90 seconds");
      return;
    }
    onNext();
  }

  return (
    <div className="card p-4">
      <h3>Video Recording Instructions</h3>
      <ol>
        <li>Introduce yourself briefly.</li>
        <li>Why are you interested in this position?</li>
        <li>Highlight relevant experience.</li>
        <li>State long-term career goals.</li>
      </ol>

      <div className="mb-3">
        <video
          ref={vidRef}
          className="video-preview"
          autoPlay
          muted
          playsInline
        ></video>
      </div>

      <div className="mb-3">
        <div className="d-flex align-items-center gap-2">
          {recState !== "rec" && (
            <button className="btn btn-success" onClick={startRec}>
              Start Recording
            </button>
          )}
          {recState === "rec" && (
            <button className="btn btn-danger" onClick={stopRec}>
              Stop Recording
            </button>
          )}
          <div className="small">
            Timer: {timer}s / {maxSec}s
          </div>
          <button className="btn btn-secondary ms-auto" onClick={onBack}>
            Back
          </button>
        </div>
      </div>

      {recState === "done" && data.videoBlob && (
        <div className="mb-3">
          <h5>Preview recording</h5>
          <video
            controls
            src={URL.createObjectURL(data.videoBlob)}
            className="video-preview"
          />
          <div className="small">Duration (approx): {data.videoDuration}s</div>
        </div>
      )}

      {err && <div className="err mb-2">{err}</div>}

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit & Review
        </button>
      </div>
    </div>
  );
}
