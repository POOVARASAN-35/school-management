import Attendance from "../models/Attendance.js";
import Enrollment from "../models/Enrollment.js";
import Subject from "../models/Subject.js";

/* GET STAFF SUBJECTS */

export const getStaffSubjects = async (req, res) => {

  try {

    const staffId = req.user._id;

    const subjects = await Subject.find({ staff: staffId })
      .populate("course", "name");

    res.json(subjects);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* Get students for attendance */

export const getStudentsForAttendance = async (req, res) => {

  try {

    const { courseId } = req.params;

    const students = await Enrollment.find({ course: courseId })
      .populate("student", "name email");

    res.json(students);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* Mark attendance */

export const markAttendance = async (req, res) => {

  try {

    const { subjectId, courseId, date, attendance } = req.body;

    const records = attendance.map(item => ({
      student: item.studentId,
      subject: subjectId,
      course: courseId,
      date,
      status: item.status
    }));

    await Attendance.insertMany(records);

    res.json({ message: "Attendance saved successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* Attendance report */

export const getAttendance = async (req, res) => {

  try {

    const attendance = await Attendance.find()
      .populate("student", "name")
      .populate("subject", "name");

    res.json(attendance);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* Attendance percentage */

export const attendancePercentage = async (req, res) => {

  try {

    const { studentId } = req.params;

    const total = await Attendance.countDocuments({ student: studentId });

    const present = await Attendance.countDocuments({
      student: studentId,
      status: "Present"
    });

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.json({
      total,
      present,
      percentage
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* Monthly report */

export const monthlyReport = async (req, res) => {

  try {

    const { month } = req.params;

    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const report = await Attendance.find({
      date: { $gte: start, $lt: end }
    })
      .populate("student", "name")
      .populate("subject", "name");

    res.json(report);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* Graph data */

export const attendanceGraph = async (req, res) => {

  try {

    const result = await Attendance.aggregate([
      {
        $group: {
          _id: "$date",

          present: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
          },

          absent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
          },

          late: {
            $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] }
          },

          excused: {
            $sum: { $cond: [{ $eq: ["$status", "Excused"] }, 1, 0] }
          }

        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};