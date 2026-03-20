import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getMyCourses,
  getSubjectsByCourse,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get(
  "/courses",
  authMiddleware,
  roleMiddleware("student"),
  getMyCourses
);

router.get(
  "/courses/:courseId/subjects",
  authMiddleware,
  roleMiddleware("student"),
  getSubjectsByCourse
);

export default router;
