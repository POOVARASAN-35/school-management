import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { createExam, getExamsBySubject } from "../controllers/exam.controller.js";
import { submitExam,  getStudentExams, } from "../controllers/exam.controller.js";
import uploadQuestionPaper from "../middleware/uploadQuestionPaper.js";
import { uploadQuestionPaper as uploadPaper } from "../controllers/exam.controller.js";
import { getExamById } from "../controllers/exam.controller.js";


const router = express.Router();

// Admin
router.post("/", authMiddleware, roleMiddleware("admin"), createExam);

// Staff / Student
router.get(
  "/subject/:subjectId",
  authMiddleware,
  roleMiddleware("staff", "student"),
  getExamsBySubject
);

// 🎓 Student submit exam
router.post(
  "/submit",
  authMiddleware,
  roleMiddleware("student"),
  submitExam
);

router.get(
  "/student",
  authMiddleware,
  roleMiddleware("student"),
  getStudentExams
);

// 🎓 Student – submit exam
router.post(
  "/submit",
  authMiddleware,
  roleMiddleware("student"),
  submitExam
)

router.post(
  "/upload-paper",
  authMiddleware,
  roleMiddleware("staff"),
  uploadQuestionPaper.single("pdf"),
  uploadPaper
);

// 🎓 Student get single exam
router.get(
  "/:examId",
  authMiddleware,
  roleMiddleware("student"),
  getExamById
);

export default router;
