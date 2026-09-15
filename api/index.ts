import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "../server/routes/auth.routes.js";
import settingsRoutes from "../server/routes/settings.routes.js";
import rolesRoutes from "../server/routes/roles.routes.js";
import superRoutes from "../server/routes/super.routes.js";
import publicRoutes from "../server/routes/public.routes.js";
import applicationsRoutes from "../server/routes/applications.routes.js";
import searchRoutes from "../server/routes/search.routes.js";

dotenv.config();

const app = express();

// Hardening
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.APP_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Database connection (Cached for Serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
    }
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- API Routes (Version 1) ---
const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", message: "RTC API v1 is running on Vercel Serverless" });
});

// Attach modular routes
apiRouter.use("/auth", authRoutes);
apiRouter.use("/settings", settingsRoutes);
apiRouter.use("/roles", rolesRoutes);
apiRouter.use("/super", superRoutes);
apiRouter.use("/public", publicRoutes);
apiRouter.use("/applications", applicationsRoutes);
apiRouter.use("/search", searchRoutes);

app.use("/api/v1", apiRouter);

export default app;
