// API helper
const BASE = import.meta.env.VITE_API_URL;

export async function submitAll(formData) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000); // 90 sec max

  try {
    const res = await fetch(`${BASE}/submit`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.json();
  } catch (err) {
    throw new Error("Upload failed or timed out");
  }
}

export function resumeUrl(id) {
  return `${BASE.replace("/api", "")}/api/resume/${id}`;
}

export function videoUrl(id) {
  return `${BASE.replace("/api", "")}/api/video/${id}`;
}
