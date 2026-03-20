import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import Enrollment from "../models/Enrollment.js";

/* ------------------ COURSES ------------------ */

// Create course
export const createCourse = async (req, res) => {
  const { name, description } = req.body;

  const exists = await Course.findOne({ name });
  if (exists) {
    return res.status(400).json({ message: "Course already exists" });
  }

  const course = await Course.create({ name, description });
  res.status(201).json(course);
};

// Get all courses
export const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

/* ------------------ SUBJECTS ------------------ */

// Create subject
export const createSubject = async (req, res) => {
  const { name, courseId } = req.body;

  const subject = await Subject.create({
    name,
    course: courseId,
  });

  res.status(201).json(subject);
};

// Assign staff to subject
export const assignStaff = async (req, res) => {
  const { subjectId, staffId } = req.body;

  const subject = await Subject.findByIdAndUpdate(
    subjectId,
    { staff: staffId },
    { new: true }
  ).populate("staff", "name email");

  res.json(subject);
};

/* ------------------ ENROLLMENT ------------------ */

// Enroll student
export const enrollStudent = async (req, res) => {
  const { studentId, courseId } = req.body;

  const exists = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (exists) {
    return res.status(400).json({ message: "Already enrolled" });
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
  });

  res.status(201).json(enrollment);
};

// Get all subjects
export const getSubjects = async (req, res) => {
  const subjects = await Subject.find()
    .populate("course", "name")
    .populate("staff", "name email");

  res.json(subjects);
};

// Get enrolled students by course
export const getEnrolledStudents = async (req, res) => {
  const { courseId } = req.params;

  const enrollments = await Enrollment.find({ course: courseId })
    .populate("student", "name email");

  res.json(enrollments.map(e => e.student));
};


