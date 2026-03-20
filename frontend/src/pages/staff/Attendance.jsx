import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  TrendingUp,
  Save,
  RefreshCw,
  X,
  Check,
  UserCheck,
  UserX,
  MinusCircle,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Activity,
  Zap,
  Sparkles
} from "lucide-react";

const Attendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [bulkAction, setBulkAction] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const itemsPerPage = 12;

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadSubjects();
    loadAttendanceHistory();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      calculateStats();
    }
  }, [students]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/subjects");
      setSubjects(res.data);
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to load subjects');
      setLoading(false);
    }
  };

  const loadStudents = async (subjectId, courseId) => {
    try {
      setLoading(true);
      setSelectedSubject(subjectId);
      const res = await api.get(`/attendance/students/${courseId}`);
      
      const data = res.data.map(s => ({
        studentId: s.student._id,
        name: s.student.name,
        email: s.student.email,
        rollNumber: s.student.rollNumber || `STU${Math.floor(Math.random() * 1000)}`,
        avatar: s.student.name.charAt(0).toUpperCase(),
        status: "Present",
        previousAttendance: Math.floor(Math.random() * 30 + 70), // Mock data
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }));

      setStudents(data);
      setSelectedStudents([]);
      setCurrentPage(1);
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to load students');
      setLoading(false);
    }
  };

  const loadAttendanceHistory = async () => {
    try {
      const res = await api.get("/attendance/history");
      setAttendanceHistory(res.data.slice(0, 5));
    } catch (error) {
      console.error("Failed to load history");
    }
  };

  const calculateStats = () => {
    const stats = students.reduce((acc, student) => {
      acc[student.status.toLowerCase()] = (acc[student.status.toLowerCase()] || 0) + 1;
      acc.total += 1;
      return acc;
    }, { present: 0, absent: 0, late: 0, excused: 0, total: 0 });

    setAttendanceStats(stats);
  };

  const updateStatus = (index, value) => {
    const updated = [...students];
    updated[index].status = value;
    setStudents(updated);
    calculateStats();
  };

  const updateBulkStatus = (status) => {
    const updated = students.map(student => ({
      ...student,
      status: selectedStudents.includes(student.studentId) ? status : student.status
    }));
    setStudents(updated);
    setSelectedStudents([]);
    setBulkAction(false);
    showNotification('success', `Updated ${selectedStudents.length} students`);
  };

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
      setSelectedStudents(currentStudents.map(s => s.studentId));
    }
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const subject = subjects.find(s => s._id === selectedSubject);

      await api.post("/attendance/mark", {
        subjectId: subject._id,
        courseId: subject.course._id,
        date: selectedDate,
        attendance: students.map(s => ({
          studentId: s.studentId,
          status: s.status
        }))
      });

      showNotification('success', 'Attendance saved successfully');
      loadAttendanceHistory();
      setSaving(false);
    } catch (error) {
      showNotification('error', 'Failed to save attendance');
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <CheckCircle size={16} className="status-icon present" />;
      case 'Absent': return <XCircle size={16} className="status-icon absent" />;
      case 'Late': return <Clock size={16} className="status-icon late" />;
      case 'Excused': return <AlertCircle size={16} className="status-icon excused" />;
      default: return <MinusCircle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return '#22c55e';
      case 'Absent': return '#ef4444';
      case 'Late': return '#f59e0b';
      case 'Excused': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Present': return '#dcfce7';
      case 'Absent': return '#fee2e2';
      case 'Late': return '#fef3c7';
      case 'Excused': return '#ede9fe';
      default: return '#f1f5f9';
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  if (loading && students.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading attendance data...</p>
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
            border-top: 3px solid #3b82f6;
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
    <div className="attendance-page">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </div>
          <button className="notification-close" onClick={() => setNotification({ show: false })}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <Calendar size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Attendance Management</h1>
            <p className="page-subtitle">Mark and track student attendance across your subjects</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className={`history-btn ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(!showHistory)}
          >
            <Clock size={18} />
            <span>History</span>
          </button>
          <button className="refresh-btn" onClick={loadSubjects}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="date-selector">
        <div className="date-wrapper">
          <Calendar size={18} className="date-icon" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
            max={today}
          />
        </div>
        <div className="date-info">
          <Clock size={16} />
          <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="subjects-section">
        <h2>Your Subjects</h2>
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <button
              key={subject._id}
              className={`subject-btn ${selectedSubject === subject._id ? 'active' : ''}`}
              onClick={() => loadStudents(subject._id, subject.course._id)}
            >
              <div className="subject-icon">
                <BookOpen size={20} />
              </div>
              <div className="subject-info">
                <span className="subject-name">{subject.name}</span>
                <span className="course-name">{subject.course.name}</span>
              </div>
              {selectedSubject === subject._id && (
                <Sparkles size={16} className="active-sparkle" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Section */}
      {students.length > 0 && (
        <div className="attendance-section">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card present">
              <div className="stat-icon">
                <UserCheck size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Present</span>
                <span className="stat-value">{attendanceStats.present}</span>
                <span className="stat-percent">
                  {((attendanceStats.present / attendanceStats.total) * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div 
                className="stat-progress"
                style={{ width: `${(attendanceStats.present / attendanceStats.total) * 100}%` }}
              ></div>
            </div>

            <div className="stat-card absent">
              <div className="stat-icon">
                <UserX size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Absent</span>
                <span className="stat-value">{attendanceStats.absent}</span>
                <span className="stat-percent">
                  {((attendanceStats.absent / attendanceStats.total) * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div 
                className="stat-progress"
                style={{ width: `${(attendanceStats.absent / attendanceStats.total) * 100}%` }}
              ></div>
            </div>

            <div className="stat-card late">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Late</span>
                <span className="stat-value">{attendanceStats.late || 0}</span>
                <span className="stat-percent">
                  {((attendanceStats.late / attendanceStats.total) * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div 
                className="stat-progress"
                style={{ width: `${(attendanceStats.late / attendanceStats.total) * 100}%` }}
              ></div>
            </div>

            <div className="stat-card excused">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Excused</span>
                <span className="stat-value">{attendanceStats.excused || 0}</span>
                <span className="stat-percent">
                  {((attendanceStats.excused / attendanceStats.total) * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div 
                className="stat-progress"
                style={{ width: `${(attendanceStats.excused / attendanceStats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="attendance-controls">
            <div className="search-filter">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-wrapper">
                <Filter size={16} className="filter-icon" />
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </div>

              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <div className="grid-icon"></div>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <div className="list-icon"></div>
                </button>
              </div>

              <button 
                className="bulk-btn"
                onClick={() => setBulkAction(!bulkAction)}
              >
                <Users size={16} />
                <span>Bulk</span>
              </button>
            </div>

            {/* Bulk Actions */}
            {bulkAction && (
              <div className="bulk-actions">
                <div className="bulk-select">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === currentStudents.length}
                    onChange={selectAllStudents}
                  />
                  <span>Select All ({currentStudents.length})</span>
                </div>
                <div className="bulk-buttons">
                  <button 
                    className="bulk-action-btn present"
                    onClick={() => updateBulkStatus('Present')}
                    disabled={selectedStudents.length === 0}
                  >
                    <CheckCircle size={14} />
                    Mark Present
                  </button>
                  <button 
                    className="bulk-action-btn absent"
                    onClick={() => updateBulkStatus('Absent')}
                    disabled={selectedStudents.length === 0}
                  >
                    <XCircle size={14} />
                    Mark Absent
                  </button>
                  <button 
                    className="bulk-action-btn late"
                    onClick={() => updateBulkStatus('Late')}
                    disabled={selectedStudents.length === 0}
                  >
                    <Clock size={14} />
                    Mark Late
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Students Display */}
          {viewMode === 'grid' ? (
            <div className="students-grid">
              {currentStudents.map((student, index) => (
                <div key={student.studentId} className="student-card">
                  {bulkAction && (
                    <input
                      type="checkbox"
                      className="student-checkbox"
                      checked={selectedStudents.includes(student.studentId)}
                      onChange={() => toggleStudentSelection(student.studentId)}
                    />
                  )}
                  <div className="student-avatar">
                    {student.avatar}
                  </div>
                  <h3 className="student-name">{student.name}</h3>
                  <p className="student-roll">{student.rollNumber}</p>
                  
                  <div className="student-stats">
                    <div className="stat">
                      <span className="stat-label">Previous</span>
                      <span className="stat-value">{student.previousAttendance}%</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Overall</span>
                      <span className="stat-value">{Math.floor((student.previousAttendance + (student.status === 'Present' ? 100 : 0)) / 2)}%</span>
                    </div>
                  </div>

                  <div className="status-selector">
                    <select
                      value={student.status}
                      onChange={(e) => updateStatus(indexOfFirstItem + index, e.target.value)}
                      className="status-select"
                      style={{
                        backgroundColor: getStatusBg(student.status),
                        color: getStatusColor(student.status),
                        borderColor: getStatusColor(student.status)
                      }}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Excused">Excused</option>
                    </select>
                  </div>

                  <div className="student-footer">
                    <span className="last-active">
                      <Clock size={12} />
                      {new Date(student.lastActive).toLocaleDateString()}
                    </span>
                    <button className="more-btn">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    {bulkAction && <th><input type="checkbox" onChange={selectAllStudents} /></th>}
                    <th>Roll No</th>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Previous %</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student, index) => (
                    <tr key={student.studentId}>
                      {bulkAction && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.studentId)}
                            onChange={() => toggleStudentSelection(student.studentId)}
                          />
                        </td>
                      )}
                      <td>{student.rollNumber}</td>
                      <td>
                        <div className="student-cell">
                          <div className="cell-avatar">{student.avatar}</div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <span 
                          className="percentage-badge"
                          style={{ color: student.previousAttendance >= 75 ? '#22c55e' : '#ef4444' }}
                        >
                          {student.previousAttendance}%
                        </span>
                      </td>
                      <td>
                        <select
                          value={student.status}
                          onChange={(e) => updateStatus(indexOfFirstItem + index, e.target.value)}
                          className="status-select-small"
                          style={{
                            backgroundColor: getStatusBg(student.status),
                            color: getStatusColor(student.status),
                            borderColor: getStatusColor(student.status)
                          }}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Excused">Excused</option>
                        </select>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="table-action">
                            <Eye size={14} />
                          </button>
                          <button className="table-action">
                            <Mail size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                Page {currentPage} of {totalPages}
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

          {/* Save Button */}
          <div className="save-section">
            <button 
              className="save-btn"
              onClick={saveAttendance}
              disabled={saving}
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="spinning" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Attendance</span>
                </>
              )}
            </button>
            <p className="save-note">
              <AlertCircle size={14} />
              Attendance for {new Date(selectedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Attendance History Sidebar */}
      {showHistory && (
        <div className="history-sidebar">
          <div className="history-header">
            <h3>Recent Attendance</h3>
            <button className="close-history" onClick={() => setShowHistory(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="history-list">
            {attendanceHistory.map((record, index) => (
              <div key={index} className="history-item">
                <div className="history-date">
                  <Calendar size={14} />
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div className="history-subject">{record.subject}</div>
                <div className="history-stats">
                  <span className="present">{record.present} Present</span>
                  <span className="absent">{record.absent} Absent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .attendance-page {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        /* Notification */
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
          z-index: 1100;
          animation: slideIn 0.3s ease;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #22c55e;
        }

        .notification.error {
          border-left-color: #ef4444;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
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

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
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

        .history-btn, .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .history-btn:hover, .history-btn.active {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #eff6ff;
        }

        .refresh-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: rotate(180deg);
        }

        /* Date Selector */
        .date-selector {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          padding: 16px 20px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .date-wrapper {
          position: relative;
        }

        .date-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .date-input {
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
        }

        .date-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
        }

        /* Subjects Section */
        .subjects-section {
          margin-bottom: 32px;
        }

        .subjects-section h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .subject-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .subject-btn:hover {
          transform: translateY(-2px);
          border-color: #3b82f6;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.1);
        }

        .subject-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .subject-icon {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .subject-info {
          flex: 1;
          text-align: left;
        }

        .subject-name {
          display: block;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .course-name {
          display: block;
          font-size: 0.7rem;
          color: #64748b;
        }

        .active-sparkle {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #3b82f6;
          animation: sparkle 1s infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Attendance Section */
        .attendance-section {
          background: white;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          padding: 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .stat-card.present {
          background: linear-gradient(135deg, #22c55e20, #22c55e10);
          border: 1px solid #22c55e30;
        }

        .stat-card.absent {
          background: linear-gradient(135deg, #ef444420, #ef444410);
          border: 1px solid #ef444430;
        }

        .stat-card.late {
          background: linear-gradient(135deg, #f59e0b20, #f59e0b10);
          border: 1px solid #f59e0b30;
        }

        .stat-card.excused {
          background: linear-gradient(135deg, #8b5cf620, #8b5cf610);
          border: 1px solid #8b5cf630;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card.present .stat-icon {
          background: #22c55e20;
          color: #22c55e;
        }

        .stat-card.absent .stat-icon {
          background: #ef444420;
          color: #ef4444;
        }

        .stat-card.late .stat-icon {
          background: #f59e0b20;
          color: #f59e0b;
        }

        .stat-card.excused .stat-icon {
          background: #8b5cf620;
          color: #8b5cf6;
        }

        .stat-details {
          flex: 1;
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
        }

        .stat-percent {
          font-size: 0.75rem;
          color: #64748b;
        }

        .stat-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          transition: width 0.3s ease;
        }

        .stat-card.present .stat-progress {
          background: #22c55e;
        }

        .stat-card.absent .stat-progress {
          background: #ef4444;
        }

        .stat-card.late .stat-progress {
          background: #f59e0b;
        }

        .stat-card.excused .stat-progress {
          background: #8b5cf6;
        }

        /* Controls */
        .attendance-controls {
          margin-bottom: 24px;
        }

        .search-filter {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .search-wrapper {
          flex: 1;
          min-width: 250px;
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
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .filter-wrapper {
          position: relative;
          min-width: 150px;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .filter-select {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
          appearance: none;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 10px;
        }

        .view-btn {
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
        }

        .view-btn.active {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .grid-icon {
          width: 16px;
          height: 16px;
          background: currentColor;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Crect x='3' y='3' width='7' height='7'%3E%3C/rect%3E%3Crect x='14' y='3' width='7' height='7'%3E%3C/rect%3E%3Crect x='3' y='14' width='7' height='7'%3E%3C/rect%3E%3Crect x='14' y='14' width='7' height='7'%3E%3C/rect%3E%3C/svg%3E");
        }

        .list-icon {
          width: 16px;
          height: 16px;
          background: currentColor;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cline x1='8' y1='6' x2='21' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='12' x2='21' y2='12'%3E%3C/line%3E%3Cline x1='8' y1='18' x2='21' y2='18'%3E%3C/line%3E%3Cline x1='3' y1='6' x2='3.01' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='12' x2='3.01' y2='12'%3E%3C/line%3E%3Cline x1='3' y1='18' x2='3.01' y2='18'%3E%3C/line%3E%3C/svg%3E");
        }

        .bulk-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          color: #475569;
          cursor: pointer;
        }

        .bulk-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Bulk Actions */
        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          margin-top: 12px;
          animation: slideDown 0.3s ease;
        }

        .bulk-select {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .bulk-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .bulk-action-btn.present:hover {
          border-color: #22c55e;
          color: #22c55e;
          background: #f0fdf4;
        }

        .bulk-action-btn.absent:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: #fef2f2;
        }

        .bulk-action-btn.late:hover {
          border-color: #f59e0b;
          color: #f59e0b;
          background: #fef3c7;
        }

        .bulk-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Students Grid */
        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .student-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
        }

        .student-card:hover {
          transform: translateY(-5px);
          border-color: #3b82f6;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.1);
        }

        .student-checkbox {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .student-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 auto 12px;
        }

        .student-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          text-align: center;
          margin: 0 0 4px 0;
        }

        .student-roll {
          font-size: 0.75rem;
          color: #64748b;
          text-align: center;
          margin: 0 0 16px 0;
        }

        .student-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 16px;
          padding: 12px 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat {
          text-align: center;
        }

        .student-stats .stat-label {
          font-size: 0.65rem;
        }

        .student-stats .stat-value {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .status-selector {
          margin-bottom: 12px;
        }

        .status-select {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
        }

        .student-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-active {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          color: #94a3b8;
        }

        .more-btn {
          padding: 4px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
        }

        /* Table View */
        .students-table-container {
          overflow-x: auto;
          margin-bottom: 24px;
        }

        .students-table {
          width: 100%;
          border-collapse: collapse;
        }

        .students-table th {
          text-align: left;
          padding: 12px 16px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .students-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .students-table tr:hover td {
          background: #f8fafc;
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cell-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .percentage-badge {
          font-weight: 600;
        }

        .status-select-small {
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .table-actions {
          display: flex;
          gap: 4px;
        }

        .table-action {
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          color: #64748b;
          cursor: pointer;
        }

        .table-action:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #475569;
          cursor: pointer;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #64748b;
        }

        /* Save Section */
        .save-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        .save-note {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.85rem;
        }

        /* History Sidebar */
        .history-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100vh;
          background: white;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
          padding: 24px;
          z-index: 1000;
          animation: slideLeft 0.3s ease;
          overflow-y: auto;
        }

        @keyframes slideLeft {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .history-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .close-history {
          padding: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-item {
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .history-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 8px;
        }

        .history-subject {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .history-stats {
          display: flex;
          gap: 16px;
        }

        .history-stats .present {
          color: #22c55e;
        }

        .history-stats .absent {
          color: #ef4444;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .date-selector {
            flex-direction: column;
            align-items: flex-start;
          }

          .subjects-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .search-filter {
            flex-direction: column;
          }

          .filter-wrapper {
            width: 100%;
          }

          .bulk-actions {
            flex-direction: column;
            align-items: flex-start;
          }

          .bulk-buttons {
            width: 100%;
          }

          .bulk-action-btn {
            flex: 1;
          }

          .save-section {
            flex-direction: column;
            gap: 16px;
          }

          .history-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Attendance;