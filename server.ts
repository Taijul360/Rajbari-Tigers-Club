import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import authRoutes from "./server/routes/auth.routes.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Hardening
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev/vite injection
  }));
  app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());
  
  // Database connection
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
    }
  } else {
    console.warn("⚠️ MONGODB_URI not found in environment variables.");
  }

  // --- API Routes (Version 1) ---
  const apiRouter = express.Router();
  
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", message: "RTC API v1 is running" });
  });

  // Attach modular routes
  apiRouter.use("/auth", authRoutes);
  apiRouter.use("/settings", (await import("./server/routes/settings.routes.js")).default);
  apiRouter.use("/roles", (await import("./server/routes/roles.routes.js")).default);
  apiRouter.use("/super", (await import("./server/routes/super.routes.js")).default);
  apiRouter.use("/public", (await import("./server/routes/public.routes.js")).default);
  apiRouter.use("/applications", (await import("./server/routes/applications.routes.js")).default);
  apiRouter.use("/search", (await import("./server/routes/search.routes.js")).default);

  app.use("/api/v1", apiRouter);
  // ------------------------------

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
