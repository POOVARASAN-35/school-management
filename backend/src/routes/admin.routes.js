import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  getUsers,
  createUser,
  updateUserStatus,
} from "../controllers/admin.controller.js";

import {
  createCourse,
  getCourses,
  getSubjects,
  createSubject,
  assignStaff,
  enrollStudent,
  getEnrolledStudents,
} from "../controllers/course.controller.js";

import {
  createExam,
  getExams,
} from "../controllers/exam.controller.js";

import {
  addQuestion,
  getQuestionsByExam,
} from "../controllers/question.controller.js";

import Exam from "../models/Exam.js";

const router = express.Router();

/* -------- USER MANAGEMENT -------- */
router.get("/users", authMiddleware, roleMiddleware("admin"), getUsers);
router.post("/users", authMiddleware, roleMiddleware("admin"), createUser);
router.put(
  "/users/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserStatus
);

/* -------- COURSES -------- */
router.post("/courses", authMiddleware, roleMiddleware("admin"), createCourse);
router.get("/courses", authMiddleware, roleMiddleware("admin"), getCourses);

/* -------- SUBJECTS -------- */
router.post("/subjects", authMiddleware, roleMiddleware("admin"), createSubject);
router.get("/subjects", authMiddleware, roleMiddleware("admin"), getSubjects);
router.post(
  "/subjects/assign",
  authMiddleware,
  roleMiddleware("admin"),
  assignStaff
);

/* -------- ENROLLMENT -------- */
router.post("/enroll", authMiddleware, roleMiddleware("admin"), enrollStudent);
router.get(
  "/enroll/:courseId",
  authMiddleware,
  roleMiddleware("admin"),
  getEnrolledStudents
);

/* -------- EXAMS (🔥 MISSING PART) -------- */
router.post(
  "/exams",
  authMiddleware,
  roleMiddleware("admin"),
  createExam
);

router.get(
  "/exams",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  getExams
);

/* -------- QUESTIONS -------- */
router.post(
  "/questions",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  addQuestion
);

router.get(
  "/questions/:examId",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  getQuestionsByExam
);

export default router;
