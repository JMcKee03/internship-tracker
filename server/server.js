import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();

/* ========================
   Middleware
======================== */
app.use(cors());
app.use(express.json());

/* ========================
   Health Check Route
======================== */
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

/* ========================
   API Routes
======================== */
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

/* ========================
   Database Connection
======================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });