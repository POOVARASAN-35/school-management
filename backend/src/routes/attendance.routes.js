import express from "express";
import {
  getStudentsForAttendance,
  markAttendance,
  getAttendance,
  attendancePercentage,
  monthlyReport,
  attendanceGraph,
  getStaffSubjects
} from "../controllers/attendance.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/* GET STAFF SUBJECTS */
router.get(
  "/subjects",
  authMiddleware,
  roleMiddleware("staff"),
  getStaffSubjects
);

/* Get students */
router.get(
  "/students/:courseId",
  authMiddleware,
  roleMiddleware("staff"),
  getStudentsForAttendance
);

/* Mark attendance */
router.post(
  "/mark",
  authMiddleware,
  roleMiddleware("staff"),
  markAttendance
);

/* Attendance percentage */
router.get("/percentage/:studentId", attendancePercentage);

/* Monthly report */
router.get("/monthly/:month", monthlyReport);

/* Graph data */
router.get("/graph", attendanceGraph);

/* Attendance report */
router.get(
  "/report",
  authMiddleware,
  roleMiddleware("staff"),
  getAttendance
);

export default router;