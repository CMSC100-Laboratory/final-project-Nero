import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import adminDashboardRoutes from "./routes/adminDashboardRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import { seedAdmin } from "./utils/seedAdmin";

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use("/api/auth", limiter);

// CORS Configuration — only explicitly listed origins are allowed
const allowedOrigins = [
  "http://localhost:5173",
  "https://umamasa.app",
  "https://www.umamasa.app",
  "https://farm-to-table-ruby.vercel.app",
];

// Also allow CLIENT_URL from env (for flexible deployments)
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server or health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF Protection — verify Origin header on state-changing requests
app.use((req: Request, res: Response, next: NextFunction) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin as string | undefined;

  // Requests from browsers will always include an Origin header on cross-origin
  // POST/PUT/DELETE. If present, it must match our allowed list.
  if (origin && !allowedOrigins.includes(origin)) {
    res.status(403).json({ message: "Forbidden: invalid origin" });
    return;
  }

  next();
});

// Health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "API Route not found" });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "An internal server error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27018/farm-to-table";

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Automatically check and create admin user if missing
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

export default app;
