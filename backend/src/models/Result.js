import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selected: Number,
        correct: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
