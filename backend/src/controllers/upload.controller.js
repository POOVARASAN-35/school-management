import fs from "fs-extra";
import path from "path";
// import pdfPoppler from "pdf-poppler";
import ExamPaper from "../models/ExamPaper.js";
import { convertPdfToImages } from "../utils/pdfToImages.js";
import QuestionPaper from "../models/QuestionPaper.js";

export const uploadQuestionPaper = async (req, res) => {
  try {
    console.log("📄 PDF RECEIVED:", req.file);

    const { examId } = req.body;
    if (!req.file || !examId) {
      return res.status(400).json({ message: "PDF & examId required" });
    }

    const pdfPath = req.file.path;
    const imageDir = `uploads/images/exams/${examId}`;

    const pages = await convertPdfToImages(pdfPath, imageDir);

    const paper = await QuestionPaper.create({
      exam: examId,
      pdfPath,
      pages,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Question paper processed",
      pages: pages.length,
    });
  } catch (err) {
    console.error("❌ PDF PROCESS ERROR:", err);
    res.status(500).json({ message: "PDF processing failed" });
  }
};
