import express from "express";
import { register, login, logout, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateResource";
import { registerSchema, loginSchema } from "../schemas/authSchema";

const router = express.Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me
router.get("/me", protect, getMe);

export default router;
