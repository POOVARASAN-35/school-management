import Enrollment from "../models/Enrollment.js";
import Subject from "../models/Subject.js";

/* -------- STUDENT DASHBOARD -------- */

// Get enrolled courses
export const getMyCourses = async (req, res) => {
  const studentId = req.user._id;

  const enrollments = await Enrollment.find({ student: studentId })
    .populate("course", "name");

  res.json(enrollments);
};

// Get subjects for a course
export const getSubjectsByCourse = async (req, res) => {
  const { courseId } = req.params;

  const subjects = await Subject.find({ course: courseId })
    .populate("staff", "name email");

  res.json(subjects);
};
