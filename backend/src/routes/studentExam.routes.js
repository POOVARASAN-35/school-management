import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  startExam,
  submitExam,
} from "../controllers/studentExam.controller.js";

const router = express.Router();

// Start exam
router.get(
  "/:examId",
  authMiddleware,
  roleMiddleware("student"),
  startExam
);

// Submit exam
router.post(
  "/submit",
  authMiddleware,
  roleMiddleware("student"),
  submitExam
);

export default router;
