import express from "express";
import { getUserProfile, login, register, verifyToken } from "../controllers/authController.js";
import { loginSchema, registerSchema, validateSchema } from "../middlewares/validators.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = express.Router();

// public routes
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify-token",  verifyToken);
// protected routes
router.get("/userProfile", authGuard, getUserProfile);

export default router;
