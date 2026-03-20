import Question from "../models/Question.js";

/* ➕ ADD QUESTION (STAFF) */
export const addQuestion = async (req, res) => {
  try {
    const { examId, question, options, correctAnswer, marks } = req.body;

    if (!examId || !question || !options || correctAnswer === undefined) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res
        .status(400)
        .json({ message: "Exactly 4 options required" });
    }

    const newQuestion = await Question.create({
      exam: examId,
      question,
      options,
      correctAnswer,
      marks: marks || 1,
      createdBy: req.user._id,
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("❌ ADD QUESTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* 📋 GET QUESTIONS BY EXAM */
export const getQuestionsByExam = async (req, res) => {
  try {
    const questions = await Question.find({
      exam: req.params.examId,
    });

    res.json(questions);
  } catch (err) {
    console.error("❌ GET QUESTIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
