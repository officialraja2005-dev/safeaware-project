import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import campaignRoutes from "./routes/campaigns";
import resourceRoutes from "./routes/resources";
import legalRoutes from "./routes/legal";
import emergencyRoutes from "./routes/emergency";
import surveyRoutes from "./routes/survey";
import reportRoutes from "./routes/reports";
import { authenticate } from "./middleware/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/safeaware";

app.use(cors());
app.use(express.json());
app.use(authenticate);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

/**
 * Fast-fail guard: when MongoDB is not connected, respond immediately with 503
 * instead of letting Mongoose buffer queries for ~10s before they time out.
 * The frontend detects the non-2xx response and falls back to demo/local data,
 * so the app stays fully usable while the API is running without a database.
 */
app.use("/api", (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database unavailable: MongoDB is not connected.",
    });
  }
  return next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/legal-resources", legalRoutes);
app.use("/api/emergency-contacts", emergencyRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/reports", reportRoutes);

async function startServer() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^:@]{1,})@/, ":****@")}...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✓ Connected to MongoDB successfully.");
  } catch (err: any) {
    console.warn("⚠ MongoDB connection warning:", err.message);
    console.warn("⚠ The server will continue running; API calls requiring DB will return 500 until MongoDB is connected.");
  }

  app.listen(PORT, () => {
    console.log(`✓ SafeAware API Server running on http://localhost:${PORT}`);
  });
}

startServer();

