import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { getAllStudents } from "../controllers/staff.controller.js";

import { uploadQuestionPaper } from "../controllers/upload.controller.js";
import {
  getMySubjects,
  getStudentsByCourse,
  getMyStudents
} from "../controllers/staff.controller.js";

const router = express.Router();

// ✅ Staff dashboard - subjects
router.get(
  "/subjects",
  authMiddleware,
  roleMiddleware("staff"),
  getMySubjects
);

// ✅ Staff dashboard - students by course
router.get(
  "/students/:courseId",
  authMiddleware,
  roleMiddleware("staff"),
  getStudentsByCourse
);

// ✅ Staff upload question paper (PDF)
router.post(
  "/upload-paper",
  authMiddleware,
  roleMiddleware("staff"),
  upload.single("file"),
  uploadQuestionPaper
);

// router.get(
//   "/all-students",
//   authMiddleware,
//   roleMiddleware("staff"),
//   getAllStudents
// );
router.get("/all-students", getAllStudents);

router.get(
  "/my-students",
  authMiddleware,
  roleMiddleware("staff"),
  getMyStudents
);
export default router;
