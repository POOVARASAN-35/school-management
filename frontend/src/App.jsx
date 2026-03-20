import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import AdminLogin from "./pages/admin/AdminLogin";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import UploadMaterials from "./pages/staff/UploadMaterials";
import StudentDashboard from "./pages/student/StudentDashboard";

import DashboardLayout from "./layouts/DashboardLayout";
import Users from "./pages/admin/Users";
import Courses from "./pages/admin/Courses";
import Subjects from "./pages/admin/Subjects";
import AssignStaff from "./pages/admin/AssignStaff";
import EnrollStudents from "./pages/admin/EnrollStudents";
import StudentSubjects from "./pages/student/StudentSubjects";
import CreateExam from "./pages/admin/CreateExam";
// import AddQuestion from "./pages/staff/AddQuestion";
import TakeExam from "./pages/student/TakeExam";
import Exams from "./pages/admin/Exams";
import AddQuestions from "./pages/admin/AddQuestions";
import StudentExams from "./pages/student/StudentExams";
import UploadQuestionPaper from "./pages/staff/UploadQuestionPaper";
import ExamResult from "./pages/student/ExamResult";
import StudentMaterials from "./pages/student/StudentMaterials";
import MyStudents from "./pages/staff/MyStudents";
import Attendance from "./pages/staff/Attendance";
import AttendanceReport from "./pages/staff/AttendanceReport";
import AttendanceMonthly from "./pages/staff/AttendanceMonthly";
import CreateStaffExam from "./pages/staff/CreateStaffExam";
// import StudentResults from "./pages/student/StudentResults";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* ✅ Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/courses" element={<Courses />} />
             <Route path="/admin/subjects" element={<Subjects />} />
             <Route path="/admin/assign-staff" element={<AssignStaff />} />
             <Route path="/admin/enroll-students" element={<EnrollStudents />} />
             <Route path="/admin/create-exam" element={<CreateExam />} />
             <Route path="/admin/exams" element={<Exams />} />
             <Route path="/admin/exams/:examId/questions" element={<AddQuestions />} />
          </Route>
        </Route>

        {/* Staff */}
        <Route element={<ProtectedRoute role="staff" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/students" element={<MyStudents />} />
            <Route path="/staff/upload-materials" element={<UploadMaterials />} />
            <Route path="/staff/upload-question-paper" element={<UploadQuestionPaper />} />
            <Route path="/staff/attendance" element={<Attendance />} />
            <Route path="/staff/attendance-report" element={<AttendanceReport />} />
            <Route path="/staff/attendance-monthly" element={<AttendanceMonthly />} />
            <Route path="/staff/create-exam" element={<CreateStaffExam />} />
            {/* <Route path="/staff/add-question" element={<AddQuestion />} /> */}
          </Route>
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/subjects" element={<StudentSubjects />} />
            <Route path="/student/exam/:examId" element={<TakeExam />} />
            <Route path="/student/exams" element={<StudentExams />} />
            <Route path="/student/materials" element={<StudentMaterials />} />
            <Route path="/student/results" element={<ExamResult />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
