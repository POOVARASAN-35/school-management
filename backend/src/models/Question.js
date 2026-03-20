import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      validate: v => v.length === 4,
      required: true,
    },
    correctAnswer: {
      type: Number, // 0,1,2,3
      required: true,
    },
    marks: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
