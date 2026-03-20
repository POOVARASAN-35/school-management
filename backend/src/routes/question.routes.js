import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  addQuestion,
  getQuestionsByExam,
} from "../controllers/question.controller.js";

const router = express.Router();

/* ---------------- ADD QUESTION ---------------- */
/* Admin + Staff can add questions */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  addQuestion
);
/* ---------------- GET ALL PAPERS ---------------- */
router.get("/papers", authMiddleware, roleMiddleware("admin","staff"), (req,res)=>{
  console.log("🟢 PAPERS API HIT");
  res.json([]);
});
/* ---------------- GET QUESTIONS BY EXAM ---------------- */
/* Admin + Staff + Student can read questions */
router.get(
  "/:examId",
  authMiddleware,
  roleMiddleware("admin", "staff", "student"),
  (req, res, next) => {
    // 🔍 DEBUG LOGS (VERY IMPORTANT)
    console.log("🟢 QUESTIONS ROUTE HIT");
    console.log("🟢 Exam ID:", req.params.examId);
    console.log("🟢 User Role:", req.user.role);
    next();
  },
  getQuestionsByExam
);

export default router;
