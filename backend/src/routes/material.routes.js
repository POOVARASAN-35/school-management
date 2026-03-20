import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  uploadMaterial,
  getMaterialsBySubject,
  getAllMaterials,
  downloadMaterial,
  deleteMaterial
} from "../controllers/material.controller.js";

const router = express.Router();

// Staff upload
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("staff"),
  upload.single("file"),
  uploadMaterial
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("staff"),
  getAllMaterials
);

router.get(
  "/download/:id",
  authMiddleware,
  downloadMaterial
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("staff"),
  deleteMaterial
);

// ✅ Student fetch (FIXED ROUTE)
router.get(
  "/:subjectId",
  authMiddleware,
  roleMiddleware("student"),
  getMaterialsBySubject
);
export default router;
