import express from "express";
import {
  loginUser,
  adminLogin,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// staff & student login
router.post("/login", loginUser);

// admin login
router.post("/admin/login", adminLogin);

// get logged-in user
router.get("/me", authMiddleware, getMe);

// logout
router.post("/logout", authMiddleware, logout);

export default router;
