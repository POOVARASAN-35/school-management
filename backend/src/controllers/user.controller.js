import Enrollment from "../models/Enrollment.js";
import Subject from "../models/Subject.js";

// Get my courses
export const getMyCourses = async (req, res) => {
  const enrollments = await Enrollment.find({
    student: req.user._id,
  }).populate("course", "name description");

  res.json(enrollments.map((e) => e.course));
};

// Get subjects of my course
export const getSubjectsByCourse = async (req, res) => {
  const { courseId } = req.params;

  const subjects = await Subject.find({
    course: courseId,
  }).populate("staff", "name email");

  res.json(subjects);
};

export const getMe = async (req, res) => {
  res.json(req.user);
};


export const getStudentSubjects = async (req, res) => {
  console.log("🟢 getStudentSubjects HIT");
  console.log("🟢 req.user:", req.user);

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
  });

  console.log("🟡 enrollment found:", enrollment);

  if (!enrollment) {
    console.log("❌ NO ENROLLMENT FOR THIS USER");
    return res.json([]);
  }

  const subjects = await Subject.find({
    course: enrollment.course,
  }).populate("staff", "name email");

  console.log("🟢 subjects found:", subjects);

  res.json(subjects);
};
