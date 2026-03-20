import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getMe,
  getStudentSubjects,
} from "../controllers/user.controller.js";

console.log("✅ user.routes.js loaded");

const router = express.Router();

// 👤 Get logged-in user
router.get("/me", authMiddleware, getMe);

// 🎓 Student subjects
router.get(
  "/subjects",
  authMiddleware,
  roleMiddleware("student"),
  getStudentSubjects
);

// 📊 Dashboard (staff & student)
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("staff", "student"),
  (req, res) => {
    res.json({
      message: "Welcome User",
      user: req.user,
    });
  }
);

export default router;
