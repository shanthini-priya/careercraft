import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import portfolioRoutes from "./routes/portfolio.js";
import scoreRoutes from "./routes/score.js";
import generateRoutes from "./routes/generate.js";
import settingsRoutes from "./routes/settings.js";
import onboardRoutes from "./routes/onboard.js";
import aiRoutes from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// Global rate limiting: help stop bots / brute-force on public endpoints.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests", message: "Please try again later." },
});
app.use("/api", limiter);

// Stricter limit for authentication endpoints (brute-force protection).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts", message: "Please try again later." },
});
app.use("/api/auth", authLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/onboard", onboardRoutes);
app.use("/api/ai", aiRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;
