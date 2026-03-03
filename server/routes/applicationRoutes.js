import express from "express";
import Application from "../models/Application.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   CREATE Application
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user._id, // <-- important change
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* =========================
   GET All User Applications
========================= */
router.get("/", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   UPDATE Application
========================= */
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Application not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* =========================
   DELETE Application
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;