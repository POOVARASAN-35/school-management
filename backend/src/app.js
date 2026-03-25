import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import studentRoutes from "./routes/student.routes.js";
import noteRoutes from "./routes/note.routes.js";
import path from "path";
import userRoutes from "./routes/user.routes.js";
import materialRoutes from "./routes/material.routes.js";
import examRoutes from "./routes/exam.routes.js";
import questionRoutes from "./routes/question.routes.js";
import studentExamRoutes from "./routes/studentExam.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

const app = express();

// ✅ CORS FIRST
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://school-management-five-brown.vercel.app"
  ],
  credentials: true,
}));

// ✅ Body & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Root Routes 
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/student", studentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/materials", materialRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/student-exams", studentExamRoutes);
app.use("/api/attendance", attendanceRoutes);

// ✅ Error handler
app.use(errorHandler);

export default app;
