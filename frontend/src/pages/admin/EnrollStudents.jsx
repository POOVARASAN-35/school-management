import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  UserPlus, 
  Users, 
  BookOpen, 
  GraduationCap,
  Search,
  Filter,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  Download,
  UserCheck,
  UserX,
  Clock,
  Award
} from "lucide-react";

const EnrollStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [enrolled, setEnrolled] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  const itemsPerPage = 8;

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/users");
      const onlyStudents = res.data.filter(u => u.role === "student");
      setStudents(onlyStudents);
      if (onlyStudents.length > 0 && !studentId) setStudentId(onlyStudents[0]._id);
    } catch (error) {
      showNotification('error', 'Failed to fetch students');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data);
      if (res.data.length > 0 && !courseId) setCourseId(res.data[0]._id);
    } catch (error) {
      showNotification('error', 'Failed to fetch courses');
    }
  };

  const fetchEnrolled = async (cid) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/enroll/${cid}`);
      setEnrolled(res.data);
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to fetch enrolled students');
      setLoading(false);
    }
  };

  const enroll = async (e, studentIds = [studentId]) => {
    if (e) e.preventDefault();

    try {
      const enrollments = studentIds.map(sid => 
        api.post("/admin/enroll", { studentId: sid, courseId })
      );
      
      await Promise.all(enrollments);

      // Add to enrollment history
      const course = courses.find(c => c._id === courseId);
      const studentsList = students.filter(s => studentIds.includes(s._id));
      
      studentsList.forEach(student => {
        const newEnrollment = {
          id: Date.now() + Math.random(),
          student: student.name,
          course: course.name,
          date: new Date().toISOString(),
          status: 'success'
        };
        setEnrollmentHistory(prev => [newEnrollment, ...prev].slice(0, 10));
      });

      showNotification('success', `${studentIds.length} student(s) enrolled successfully`);
      setShowEnrollModal(false);
      setSelectedStudents([]);
      fetchEnrolled(courseId);
    } catch (err) {
      showNotification('error', err.response?.data?.message || "Enrollment failed");
    }
  };

  const unenrollStudent = async (studentId) => {
    try {
      await api.post("/admin/unenroll", { studentId, courseId });
      
      const student = students.find(s => s._id === studentId);
      const course = courses.find(c => c._id === courseId);
      
      showNotification('info', `${student.name} unenrolled from ${course.name}`);
      fetchEnrolled(courseId);
    } catch (error) {
      showNotification('error', 'Failed to unenroll student');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchCourses()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (courseId) fetchEnrolled(courseId);
  }, [courseId]);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const isEnrolled = enrolled.some(e => e._id === student._id);
    return matchesSearch && !isEnrolled; // Only show non-enrolled students
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Statistics
  const totalStudents = students.length;
  const enrolledCount = enrolled.length;
  const availableCount = totalStudents - enrolledCount;
  const totalCourses = courses.length;

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === currentStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(currentStudents.map(s => s._id));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading enrollment data...</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #22c55e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="enroll-page">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? <Check size={20} /> : 
             notification.type === 'error' ? <AlertCircle size={20} /> :
             <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </div>
          <button className="notification-close" onClick={() => setNotification({ show: false })}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <UserPlus size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Student Enrollment</h1>
            <p className="page-subtitle">Enroll students in courses and manage enrollment</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="refresh-btn" onClick={() => {
            fetchStudents();
            fetchEnrolled(courseId);
          }}>
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
          <button className="export-btn">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-blue-50">
            <Users className="stat-icon text-blue-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Students</p>
            <h3 className="stat-value">{totalStudents}</h3>
            <span className="stat-trend">Registered users</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-green-50">
            <UserCheck className="stat-icon text-green-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Enrolled</p>
            <h3 className="stat-value">{enrolledCount}</h3>
            <span className="stat-trend positive">In current course</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-amber-50">
            <UserX className="stat-icon text-amber-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Available</p>
            <h3 className="stat-value">{availableCount}</h3>
            <span className="stat-trend">Ready to enroll</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple-50">
            <BookOpen className="stat-icon text-purple-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Courses</p>
            <h3 className="stat-value">{totalCourses}</h3>
            <span className="stat-trend">Available for enrollment</span>
          </div>
        </div>
      </div>

      {/* Course Selector */}
      <div className="course-selector">
        <label htmlFor="course-select">Select Course:</label>
        <select
          id="course-select"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="course-select"
        >
          {courses.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column - Available Students */}
        <div className="available-students-section">
          <div className="section-header">
            <div>
              <h2>Available Students</h2>
              <p className="section-subtitle">{filteredStudents.length} students ready for enrollment</p>
            </div>
            <button 
              className="bulk-enroll-btn"
              onClick={() => setBulkMode(!bulkMode)}
            >
              <Users size={18} />
              <span>{bulkMode ? 'Cancel Bulk' : 'Bulk Enroll'}</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="search-filter">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Students Grid */}
          {currentStudents.length > 0 ? (
            <div className="students-grid">
              {bulkMode && (
                <div className="bulk-select-header">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === currentStudents.length}
                      onChange={selectAllStudents}
                    />
                    <span>Select All</span>
                  </label>
                  {selectedStudents.length > 0 && (
                    <button 
                      className="bulk-enroll-action"
                      onClick={() => {
                        setShowEnrollModal(true);
                      }}
                    >
                      <UserPlus size={16} />
                      Enroll Selected ({selectedStudents.length})
                    </button>
                  )}
                </div>
              )}

              {currentStudents.map((student) => (
                <div key={student._id} className="student-card">
                  {bulkMode && (
                    <input
                      type="checkbox"
                      className="student-checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => toggleStudentSelection(student._id)}
                    />
                  )}
                  <div className="student-avatar">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="student-info">
                    <h3 className="student-name">{student.name}</h3>
                    <p className="student-email">
                      <Mail size={12} />
                      {student.email}
                    </p>
                    <div className="student-meta">
                      <span className="student-status active">Active</span>
                      <span className="student-joined">
                        <Calendar size={12} />
                        Joined 2024
                      </span>
                    </div>
                  </div>
                  <button 
                    className="enroll-single-btn"
                    onClick={() => {
                      setStudentId(student._id);
                      enroll(null, [student._id]);
                    }}
                  >
                    <UserPlus size={16} />
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-students">
              <Users size={64} className="empty-icon" />
              <h3>No Available Students</h3>
              <p>All students are already enrolled in this course</p>
            </div>
          )}

          {/* Pagination */}
          {filteredStudents.length > itemsPerPage && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="pagination-info">
                {currentPage} / {totalPages}
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Enrolled Students */}
        <div className="enrolled-students-section">
          <div className="section-header">
            <h2>Enrolled Students</h2>
            <span className="enrolled-count">{enrolled.length} students</span>
          </div>

          <div className="course-info-card">
            <BookOpen size={20} />
            <div>
              <h3>{courses.find(c => c._id === courseId)?.name}</h3>
              <p>Course enrollment details</p>
            </div>
          </div>

          {enrolled.length > 0 ? (
            <div className="enrolled-list">
              {enrolled.map((student) => (
                <div key={student._id} className="enrolled-item">
                  <div className="enrolled-avatar">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="enrolled-info">
                    <h4>{student.name}</h4>
                    <p>{student.email}</p>
                    <div className="enrolled-meta">
                      <span className="enrolled-date">
                        <Clock size={12} />
                        Enrolled today
                      </span>
                    </div>
                  </div>
                  <button 
                    className="unenroll-btn"
                    onClick={() => unenrollStudent(student._id)}
                    title="Unenroll student"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-enrolled">
              <GraduationCap size={48} className="empty-icon" />
              <p>No students enrolled yet</p>
              <p className="empty-hint">Use the form to enroll students</p>
            </div>
          )}

          {/* Recent Enrollment History */}
          {enrollmentHistory.length > 0 && (
            <div className="enrollment-history">
              <h3>Recent Enrollments</h3>
              <div className="history-list">
                {enrollmentHistory.map((enrollment) => (
                  <div key={enrollment.id} className="history-item">
                    <div className="history-icon">
                      <CheckCircle size={14} />
                    </div>
                    <div className="history-details">
                      <p>
                        <strong>{enrollment.student}</strong> enrolled in <strong>{enrollment.course}</strong>
                      </p>
                      <span className="history-time">
                        {new Date(enrollment.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Enrollment Modal */}
      {showEnrollModal && bulkMode && (
        <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Bulk Enrollment</h2>
              <button className="close-btn" onClick={() => setShowEnrollModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="bulk-summary">
                <Users size={24} />
                <div>
                  <h3>Selected Students: {selectedStudents.length}</h3>
                  <p>Course: {courses.find(c => c._id === courseId)?.name}</p>
                </div>
              </div>

              <div className="selected-students-list">
                <h4>Students to enroll:</h4>
                {students
                  .filter(s => selectedStudents.includes(s._id))
                  .map(student => (
                    <div key={student._id} className="selected-student-item">
                      <div className="student-avatar-small">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{student.name}</span>
                      <span className="student-email-small">{student.email}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEnrollModal(false)}>
                Cancel
              </button>
              <button 
                className="confirm-bulk-btn"
                onClick={() => enroll(null, selectedStudents)}
              >
                <UserPlus size={18} />
                Enroll All ({selectedStudents.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .enroll-page {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Notification Styles */
        .notification {
          position: fixed;
          top: 24px;
          right: 24px;
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #22c55e;
        }

        .notification.error {
          border-left-color: #ef4444;
        }

        .notification.info {
          border-left-color: #3b82f6;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification.success .notification-content svg {
          color: #22c55e;
        }

        .notification.error .notification-content svg {
          color: #ef4444;
        }

        .notification.info .notification-content svg {
          color: #3b82f6;
        }

        .notification-close {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .notification-close:hover {
          background: #f1f5f9;
          color: #475569;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Header Styles */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon-wrapper {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
        }

        .header-icon {
          color: white;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .page-subtitle {
          color: #64748b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .refresh-btn, .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          border-color: #22c55e;
          color: #22c55e;
        }

        .export-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 4px 0;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }

        .stat-trend {
          font-size: 0.8rem;
          color: #64748b;
        }

        .stat-trend.positive {
          color: #22c55e;
        }

        /* Course Selector */
        .course-selector {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .course-selector label {
          color: #475569;
          font-weight: 500;
        }

        .course-select {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          color: #1e293b;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .course-select:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* Section Headers */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-subtitle {
          color: #64748b;
          font-size: 0.85rem;
          margin: 0;
        }

        .bulk-enroll-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bulk-enroll-btn:hover {
          border-color: #22c55e;
          color: #22c55e;
        }

        .enrolled-count {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #475569;
        }

        /* Available Students Section */
        .available-students-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .search-filter {
          margin-bottom: 20px;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .students-grid::-webkit-scrollbar {
          width: 6px;
        }

        .students-grid::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .students-grid::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }

        .bulk-select-header {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          cursor: pointer;
        }

        .bulk-enroll-action {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bulk-enroll-action:hover {
          background: #16a34a;
        }

        .student-card {
          position: relative;
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .student-card:hover {
          transform: translateY(-5px);
          border-color: #22c55e;
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.1);
        }

        .student-checkbox {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .student-avatar {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .student-info {
          width: 100%;
          margin-bottom: 16px;
        }

        .student-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .student-email {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.85rem;
          margin: 4px 0;
        }

        .student-meta {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .student-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .student-status.active {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .student-joined {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #64748b;
          font-size: 0.75rem;
        }

        .enroll-single-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }

        .enroll-single-btn:hover {
          background: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(34, 197, 94, 0.3);
        }

        /* Enrolled Students Section */
        .enrolled-students-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .course-info-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .course-info-card svg {
          color: #22c55e;
        }

        .course-info-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #166534;
          margin: 0 0 2px 0;
        }

        .course-info-card p {
          font-size: 0.85rem;
          color: #166534;
          opacity: 0.8;
          margin: 0;
        }

        .enrolled-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .enrolled-list::-webkit-scrollbar {
          width: 6px;
        }

        .enrolled-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .enrolled-list::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }

        .enrolled-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .enrolled-item:hover {
          transform: translateX(5px);
          border-color: #22c55e;
        }

        .enrolled-avatar {
          width: 40px;
          height: 40px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .enrolled-info {
          flex: 1;
        }

        .enrolled-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .enrolled-info p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0 0 4px 0;
        }

        .enrolled-meta {
          display: flex;
          gap: 8px;
        }

        .enrolled-date {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #64748b;
          font-size: 0.7rem;
        }

        .unenroll-btn {
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #ef4444;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .unenroll-btn:hover {
          background: #fef2f2;
          border-color: #ef4444;
        }

        /* Empty States */
        .empty-students, .empty-enrolled {
          text-align: center;
          padding: 40px 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px dashed #e2e8f0;
        }

        .empty-icon {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .empty-students h3, .empty-enrolled h3 {
          color: #1e293b;
          font-size: 1.1rem;
          margin: 0 0 8px 0;
        }

        .empty-students p, .empty-enrolled p {
          color: #64748b;
          margin: 4px 0;
        }

        .empty-hint {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
        }

        .pagination-btn {
          padding: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
          color: #22c55e;
          border-color: #22c55e;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #64748b;
          font-size: 0.95rem;
        }

        /* Enrollment History */
        .enrollment-history {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .enrollment-history h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
          animation: slideIn 0.3s ease;
        }

        .history-icon {
          color: #22c55e;
        }

        .history-details {
          flex: 1;
        }

        .history-details p {
          margin: 0 0 2px 0;
          font-size: 0.9rem;
          color: #475569;
        }

        .history-time {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .modal-body {
          padding: 24px;
        }

        .bulk-summary {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .bulk-summary svg {
          color: #22c55e;
        }

        .bulk-summary h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #166534;
          margin: 0 0 4px 0;
        }

        .bulk-summary p {
          color: #166534;
          margin: 0;
        }

        .selected-students-list {
          max-height: 300px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .selected-students-list h4 {
          font-size: 0.95rem;
          color: #475569;
          margin: 0 0 12px 0;
        }

        .selected-students-list::-webkit-scrollbar {
          width: 6px;
        }

        .selected-students-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .selected-students-list::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }

        .selected-student-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .student-avatar-small {
          width: 32px;
          height: 32px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .student-email-small {
          margin-left: auto;
          font-size: 0.8rem;
          color: #64748b;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
        }

        .cancel-btn {
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .confirm-bulk-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .confirm-bulk-btn:hover {
          background: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(34, 197, 94, 0.3);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .enroll-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .refresh-btn, .export-btn {
            flex: 1;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .students-grid {
            grid-template-columns: 1fr;
          }

          .bulk-select-header {
            flex-direction: column;
            gap: 12px;
          }

          .bulk-enroll-action {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .course-selector {
            flex-direction: column;
            align-items: flex-start;
          }

          .course-select {
            width: 100%;
          }

          .selected-student-item {
            flex-wrap: wrap;
          }

          .student-email-small {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default EnrollStudents;