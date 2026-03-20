import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";

/* -------------------------------- */
/* 🔹 CREATE EXAM (ADMIN) */
/* -------------------------------- */
export const createExam = async (req, res) => {
  try {
    const { title, subjectId, duration } = req.body;

    if (!title || !subjectId || !duration) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exam = await Exam.create({
      title,
      subject: subjectId,
      duration: Number(duration),
      createdBy: req.user._id,
    });

    res.status(201).json(exam);
  } catch (err) {
    console.error("❌ CREATE EXAM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------- */
/* 🔹 GET ALL EXAMS (ADMIN) */
/* -------------------------------- */
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("subject", "name");
    res.json(exams);
  } catch (err) {
    console.error("❌ GET EXAMS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------- */
/* 🔹 GET EXAM BY ID */
/* -------------------------------- */
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    console.error("❌ GET EXAM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------- */
/* 🔹 GET EXAMS BY SUBJECT */
/* -------------------------------- */
export const getExamsBySubject = async (req, res) => {
  try {
    const exams = await Exam.find({
      subject: req.params.subjectId,
    });

    res.json(exams);
  } catch (err) {
    console.error("❌ GET EXAMS BY SUBJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------- */
/* 🔹 UPLOAD QUESTION PAPER (PDF) */
/* -------------------------------- */
export const uploadQuestionPaper = async (req, res) => {
  try {
    const { examId } = req.body;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "PDF required" });
    }

    console.log("📂 File uploaded:", req.file.path);

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text;

    console.log("📄 Extracted Text:", text);

    const blocks = text.split("\n\n");

    let savedCount = 0;

    for (let block of blocks) {
      if (
        block.includes("A)") &&
        block.includes("B)") &&
        block.includes("C)") &&
        block.includes("D)")
      ) {
        const lines = block.split("\n").filter(Boolean);

        const questionText = lines[0];

        const options = lines
          .slice(1, 5)
          .map((opt) => opt.replace(/[A-D]\)/, "").trim());

        await Question.create({
          exam: examId,
          question: questionText,
          options,
          correctAnswer: 0,
          marks: 1,
        });

        savedCount++;
      }
    }

    res.json({
      message: "PDF processed successfully",
      questionsCreated: savedCount,
    });
  } catch (err) {
    console.error("❌ PDF PROCESS ERROR:", err);
    res.status(500).json({ message: "PDF processing failed" });
  }
};

/* -------------------------------- */
/* 🔹 SUBMIT EXAM */
/* -------------------------------- */
export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    if (!examId || !answers) {
      return res.status(400).json({ message: "Invalid submission" });
    }

    const questions = await Question.find({ exam: examId });

    let score = 0;
    let totalMarks = 0;

    const evaluatedAnswers = questions.map((q) => {
      const selected = answers[q._id] ?? -1;
      const isCorrect = selected === q.correctAnswer;

      totalMarks += q.marks;
      if (isCorrect) score += q.marks;

      return {
        questionId: q._id,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const result = await Result.create({
      exam: examId,
      student: req.user._id,
      score,
      totalMarks,
      answers: evaluatedAnswers,
    });

    res.json({
      message: "Exam submitted successfully",
      score,
      totalMarks,
      result,
    });
  } catch (err) {
    console.error("❌ SUBMIT EXAM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------- */
/* 🔹 GET STUDENT EXAMS */
/* -------------------------------- */
export const getStudentExams = async (req, res) => {
  try {
    const exams = await Exam.find().select("title subject duration");
    res.json(exams);
  } catch (err) {
    console.error("❌ GET STUDENT EXAMS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
