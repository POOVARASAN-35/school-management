import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  uploadNote,
  getNotesBySubject,
} from "../controllers/note.controller.js";

const router = express.Router();

// Staff upload
router.post(
  "/",
  authMiddleware,
  roleMiddleware("staff"),
  upload.single("file"),
  uploadNote
);

// Staff & Student view
router.get(
  "/subject/:subjectId",
  authMiddleware,
  getNotesBySubject
);

export default router;
