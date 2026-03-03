const express = require("express");
const router = express.Router();
const Internship = require("../models/Internship");

// CREATE internship
router.post("/", async (req, res) => {
  try {
    const internship = new Internship(req.body);
    const saved = await internship.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all internships
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;