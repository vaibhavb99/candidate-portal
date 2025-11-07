const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Cand = require("../models/cand");

// test route
router.get("/testdb", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    res.json({ ok: true, collections });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// make sure uploads dir exists
const uploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// store files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "")),
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(
  "/submit",
  upload.fields([{ name: "resume" }, { name: "video" }]),
  async (req, res) => {
    console.log("📥 Request received at /api/submit");

    try {
      const { fname, lname, pos, cur, yrs } = req.body;
      if (!fname || !lname || !pos || !cur || !yrs)
        return res.status(400).json({ error: "All fields required" });

      const resume = req.files["resume"]?.[0];
      const video = req.files["video"]?.[0];
      if (!resume || !video)
        return res.status(400).json({ error: "Files required" });

      console.log("💾 Files saved locally:", resume.filename, video.filename);

      const cand = new Cand({
        fname,
        lname,
        pos,
        cur,
        yrs,
        resumeId: resume.filename, // now just file name
        videoId: video.filename,
      });

      await cand.save();
      console.log("✅ Candidate data saved successfully!");
      res.json({ ok: true, id: cand._id });
    } catch (err) {
      console.error("❌ Error in /submit:", err);
      res.status(500).json({ error: "Server error", detail: err.message });
    }
  }
);

module.exports = router;
