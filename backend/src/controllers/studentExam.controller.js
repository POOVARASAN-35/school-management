import Question from "../models/Question.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import StudentExam from "../models/StudentExam.js";

// 🎓 Student starts exam
export const startExam = async (req, res) => {
  try {
    const examId = req.params.examId;

    const existing = await StudentExam.findOne({
      student: req.user._id,
      exam: examId,
    });

    // ❌ If already completed → block reattempt
    if (existing && existing.status === "completed") {
      return res.status(400).json({
        message: "You have already completed this exam.",
      });
    }

    // If already started → return existing session
    if (existing) {
      return res.json(existing);
    }

    const newExam = await StudentExam.create({
      student: req.user._id,
      exam: examId,
      status: "in-progress",
    });

    res.status(201).json(newExam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* 🟢 Submit Exam */
export const submitExam = async (req, res) => {
  const { examId, answers } = req.body;

  const questions = await Question.find({ exam: examId });

  let score = 0;

  questions.forEach((q) => {
    const answer = answers.find(
      (a) => a.question === q._id.toString()
    );

    if (answer && answer.selectedAnswer === q.correctAnswer) {
      score += q.marks;
    }
  });

  const studentExam = await StudentExam.findOneAndUpdate(
    { student: req.user._id, exam: examId },
    {
      answers,
      score,
      status: "completed",
    },
    { new: true }
  );

  res.json({ message: "Exam submitted", score, studentExam });
};
