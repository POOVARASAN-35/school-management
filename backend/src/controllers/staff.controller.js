import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import Enrollment from "../models/Enrollment.js";

/* -------- STAFF DASHBOARD -------- */

// Get subjects assigned to logged-in staff
export const getMyStudents = async (req, res) => {
  try {
    const staffId = new mongoose.Types.ObjectId(req.user._id);

    console.log("Logged in staff:", staffId);

    const subjects = await Subject.find({ staff: staffId })
      .populate("course", "name");

    console.log("Subjects found:", subjects);

    if (!subjects.length) {
      return res.json([]);
    }

    const courseIds = subjects.map(s => s.course._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds }
    })
      .populate("student", "name email")
      .populate("course", "name");

    console.log("Enrollments found:", enrollments);

    const result = subjects.map(subject => {
      const students = enrollments
        .filter(e => e.course._id.toString() === subject.course._id.toString())
        .map(e => e.student);

      return {
        subjectId: subject._id,
        subjectName: subject.name,
        courseName: subject.course.name,
        students
      };
    });

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMySubjects = async (req, res) => {
  try {
    const staffId = req.user._id;

    const subjects = await Subject.find({ staff: staffId })
      .populate("course", "name");

    if (!subjects.length) {
      return res.json({ message: "No subjects assigned to this staff" });
    }

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get students for a course
export const getStudentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  const enrollments = await Enrollment.find({ course: courseId })
    .populate("student", "name email");

  res.json(enrollments);
};

export const getAllStudents = async (req, res) => {
  try {
    console.log("API HIT: /api/staff/all-students");

    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "name");

    console.log("Enrollments from DB:", enrollments);

    res.json(enrollments);

  } catch (error) {
    console.log("Error fetching students:", error);
    res.status(500).json({ message: error.message });
  }
};
