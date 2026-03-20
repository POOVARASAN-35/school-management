import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  TrendingUp,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageCircle,
  UserPlus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  MoreVertical,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Target,
  Brain,
  Zap
} from "lucide-react";

const MyStudents = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [filterAttendance, setFilterAttendance] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    avgAttendance: 0,
    topPerformers: 0
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/staff/my-students");
      console.log("API DATA:", res.data);
      
      // Process data to add mock student details
      const processedData = res.data.map(subject => ({
        ...subject,
        students: subject.students.map(student => ({
          ...student,
          attendance: Math.floor(Math.random() * 30 + 70), // Random attendance 70-100%
          grade: ['A', 'A-', 'B+', 'B', 'B-'][Math.floor(Math.random() * 5)],
          performance: Math.floor(Math.random() * 30 + 70), // Random performance 70-100%
          lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
          assignments: Math.floor(Math.random() * 10 + 5),
          completedAssignments: Math.floor(Math.random() * 10 + 3)
        }))
      }));

      setSubjects(processedData);
      
      // Calculate stats
      const totalStudents = processedData.reduce((acc, subj) => acc + subj.students.length, 0);
      const avgAttendance = processedData.reduce((acc, subj) => {
        const subjAvg = subj.students.reduce((sum, s) => sum + s.attendance, 0) / subj.students.length;
        return acc + subjAvg;
      }, 0) / processedData.length;
      
      setStats({
        totalStudents,
        totalSubjects: processedData.length,
        avgAttendance: Math.round(avgAttendance),
        topPerformers: processedData.reduce((acc, subj) => 
          acc + subj.students.filter(s => s.performance > 85).length, 0
        )
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      showNotification('error', 'Failed to load students');
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return '#22c55e';
    if (performance >= 80) return '#3b82f6';
    if (performance >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return '#22c55e';
    if (attendance >= 80) return '#3b82f6';
    if (attendance >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': '#22c55e',
      'A-': '#3b82f6',
      'B+': '#f59e0b',
      'B': '#f97316',
      'B-': '#ef4444'
    };
    return colors[grade] || '#64748b';
  };

  const filteredSubjects = subjects.map(subject => ({
    ...subject,
    students: subject.students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAttendance = filterAttendance === 'all' || 
        (filterAttendance === 'high' && student.attendance >= 90) ||
        (filterAttendance === 'medium' && student.attendance >= 75 && student.attendance < 90) ||
        (filterAttendance === 'low' && student.attendance < 75);
      return matchesSearch && matchesAttendance;
    })
  })).filter(subject => subject.students.length > 0);

  const sortStudents = (students) => {
    return [...students].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'attendance') return b.attendance - a.attendance;
      if (sortBy === 'performance') return b.performance - a.performance;
      return 0;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your students...</p>
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
    <div className="my-students-page">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
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
            <Users size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">My Students</h1>
            <p className="page-subtitle">Manage and track student progress across your subjects</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchStudents}>
            <RefreshCw size={18} />
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
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Students</p>
            <h3 className="stat-value">{stats.totalStudents}</h3>
            <span className="stat-trend positive">Across {stats.totalSubjects} subjects</span>
          </div>
          <div className="stat-progress" style={{ width: '100%' }}></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Subjects</p>
            <h3 className="stat-value">{stats.totalSubjects}</h3>
            <span className="stat-trend">Active this semester</span>
          </div>
          <div className="stat-progress" style={{ width: '80%' }}></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg. Attendance</p>
            <h3 className="stat-value">{stats.avgAttendance}%</h3>
            <span className="stat-trend positive">+5% vs last month</span>
          </div>
          <div className="stat-progress" style={{ width: `${stats.avgAttendance}%` }}></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Top Performers</p>
            <h3 className="stat-value">{stats.topPerformers}</h3>
            <span className="stat-trend">Above 85%</span>
          </div>
          <div className="stat-progress" style={{ width: `${(stats.topPerformers / stats.totalStudents) * 100}%` }}></div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
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

        <div className="filter-group">
          <div className="filter-wrapper">
            <Filter size={18} className="filter-icon" />
            <select 
              value={filterAttendance} 
              onChange={(e) => setFilterAttendance(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Attendance</option>
              <option value="high">High (90%+)</option>
              <option value="medium">Medium (75-89%)</option>
              <option value="low">Low (&lt;75%)</option>
            </select>
          </div>

          <div className="filter-wrapper">
            <TrendingUp size={18} className="filter-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="attendance">Sort by Attendance</option>
              <option value="performance">Sort by Performance</option>
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
        </div>
      </div>

      {/* Subjects and Students */}
      {filteredSubjects.length === 0 ? (
        <div className="empty-state">
          <Users size={64} className="empty-icon" />
          <h3>No Students Found</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'You haven\'t been assigned any subjects yet'}</p>
        </div>
      ) : (
        <div className="subjects-container">
          {filteredSubjects.map((subject) => (
            <div key={subject.subjectId} className="subject-card">
              {/* Subject Header */}
              <div 
                className="subject-header"
                onClick={() => toggleSubject(subject.subjectId)}
              >
                <div className="subject-info">
                  <div className="subject-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="subject-details">
                    <h3>{subject.subjectName}</h3>
                    <p>{subject.courseName}</p>
                  </div>
                </div>
                
                <div className="subject-stats">
                  <div className="stat-badge">
                    <Users size={14} />
                    <span>{subject.students.length} Students</span>
                  </div>
                  <div className="stat-badge">
                    <Activity size={14} />
                    <span>{Math.round(subject.students.reduce((acc, s) => acc + s.attendance, 0) / subject.students.length)}% Avg</span>
                  </div>
                  {expandedSubject === subject.subjectId ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Students List */}
              {expandedSubject === subject.subjectId && (
                <div className="students-section">
                  {viewMode === 'grid' ? (
                    <div className="students-grid">
                      {sortStudents(subject.students).map((student) => (
                        <div 
                          key={student._id} 
                          className="student-card"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowStudentModal(true);
                          }}
                        >
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <h4 className="student-name">{student.name}</h4>
                          <p className="student-email">{student.email}</p>
                          
                          <div className="student-badges">
                            <div 
                              className="badge attendance"
                              style={{ backgroundColor: `${getAttendanceColor(student.attendance)}20`, color: getAttendanceColor(student.attendance) }}
                            >
                              <Clock size={12} />
                              {student.attendance}%
                            </div>
                            <div 
                              className="badge grade"
                              style={{ backgroundColor: `${getGradeColor(student.grade)}20`, color: getGradeColor(student.grade) }}
                            >
                              <Star size={12} />
                              {student.grade}
                            </div>
                          </div>

                          <div className="student-progress">
                            <div className="progress-label">
                              <span>Performance</span>
                              <span>{student.performance}%</span>
                            </div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ 
                                  width: `${student.performance}%`,
                                  backgroundColor: getPerformanceColor(student.performance)
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="student-footer">
                            <span className="last-active">
                              Active {new Date(student.lastActive).toLocaleDateString()}
                            </span>
                            <button className="view-profile">
                              <Eye size={14} />
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
                            <th>Student</th>
                            <th>Contact</th>
                            <th>Attendance</th>
                            <th>Grade</th>
                            <th>Performance</th>
                            <th>Location</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortStudents(subject.students).map((student) => (
                            <tr key={student._id}>
                              <td>
                                <div className="student-cell">
                                  <div className="cell-avatar">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="cell-name">{student.name}</div>
                                    <div className="cell-email">{student.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="contact-info">
                                  <div><Mail size={12} /> {student.email}</div>
                                  <div><Phone size={12} /> {student.phone}</div>
                                </div>
                              </td>
                              <td>
                                <span 
                                  className="attendance-badge"
                                  style={{ color: getAttendanceColor(student.attendance) }}
                                >
                                  {student.attendance}%
                                </span>
                              </td>
                              <td>
                                <span 
                                  className="grade-badge"
                                  style={{ backgroundColor: getGradeColor(student.grade) }}
                                >
                                  {student.grade}
                                </span>
                              </td>
                              <td>
                                <div className="performance-cell">
                                  <div className="mini-progress">
                                    <div 
                                      className="mini-fill"
                                      style={{ 
                                        width: `${student.performance}%`,
                                        backgroundColor: getPerformanceColor(student.performance)
                                      }}
                                    ></div>
                                  </div>
                                  <span>{student.performance}%</span>
                                </div>
                              </td>
                              <td>
                                <span className="location">
                                  <MapPin size={12} />
                                  {student.city}
                                </span>
                              </td>
                              <td>
                                <div className="table-actions">
                                  <button 
                                    className="table-action"
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowStudentModal(true);
                                    }}
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button className="table-action">
                                    <MessageCircle size={14} />
                                  </button>
                                  <button className="table-action">
                                    <FileText size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Student Profile Modal */}
      {showStudentModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowStudentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Profile</h2>
              <button className="close-btn" onClick={() => setShowStudentModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-header">
                <div className="profile-avatar large">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-title">
                  <h3>{selectedStudent.name}</h3>
                  <p>{selectedStudent.email}</p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-label">Attendance</span>
                  <span 
                    className="stat-value"
                    style={{ color: getAttendanceColor(selectedStudent.attendance) }}
                  >
                    {selectedStudent.attendance}%
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Grade</span>
                  <span 
                    className="stat-value"
                    style={{ color: getGradeColor(selectedStudent.grade) }}
                  >
                    {selectedStudent.grade}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Performance</span>
                  <span 
                    className="stat-value"
                    style={{ color: getPerformanceColor(selectedStudent.performance) }}
                  >
                    {selectedStudent.performance}%
                  </span>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{selectedStudent.phone}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{selectedStudent.city}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Joined {new Date(selectedStudent.lastActive).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="academic-progress">
                <h4>Academic Progress</h4>
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Assignments Completed</span>
                    <span>{selectedStudent.completedAssignments}/{selectedStudent.assignments}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(selectedStudent.completedAssignments / selectedStudent.assignments) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Attendance</span>
                    <span>{selectedStudent.attendance}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${selectedStudent.attendance}%`, backgroundColor: getAttendanceColor(selectedStudent.attendance) }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Overall Performance</span>
                    <span>{selectedStudent.performance}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${selectedStudent.performance}%`, backgroundColor: getPerformanceColor(selectedStudent.performance) }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="profile-action primary">
                  <MessageCircle size={16} />
                  Send Message
                </button>
                <button className="profile-action">
                  <FileText size={16} />
                  View Grades
                </button>
                <button className="profile-action">
                  <Calendar size={16} />
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .my-students-page {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
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
          z-index: 1000;
          animation: slideIn 0.3s ease;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #10b981;
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

        /* Header */
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

        .refresh-btn, .export-btn {
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

        .refresh-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .export-btn:hover {
          border-color: #10b981;
          color: #10b981;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(59, 130, 246, 0.1);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper.blue {
          background: #dbeafe;
          color: #3b82f6;
        }

        .stat-icon-wrapper.green {
          background: #dcfce7;
          color: #10b981;
        }

        .stat-icon-wrapper.orange {
          background: #fed7aa;
          color: #f97316;
        }

        .stat-icon-wrapper.purple {
          background: #ede9fe;
          color: #8b5cf6;
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
        }

        .stat-trend {
          font-size: 0.85rem;
        }

        .stat-trend.positive {
          color: #10b981;
        }

        .stat-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 0.3s ease;
        }

        /* Search and Filter */
        .search-filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          flex: 1;
          min-width: 300px;
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
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
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
          padding: 12px 16px 12px 40px;
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
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
          border: 2px dashed #e2e8f0;
        }

        .empty-icon {
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          color: #1e293b;
          font-size: 1.3rem;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: #64748b;
          margin: 0;
        }

        /* Subjects Container */
        .subjects-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .subject-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .subject-card:hover {
          box-shadow: 0 20px 30px rgba(59, 130, 246, 0.1);
        }

        .subject-header {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          transition: all 0.3s ease;
        }

        .subject-header:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        }

        .subject-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .subject-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .subject-details h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .subject-details p {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .subject-stats {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: white;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        /* Students Grid */
        .students-section {
          padding: 24px;
          border-top: 1px solid #e2e8f0;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .student-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .student-card:hover {
          transform: translateY(-5px);
          border-color: #3b82f6;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.1);
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

        .student-email {
          font-size: 0.75rem;
          color: #64748b;
          text-align: center;
          margin: 0 0 12px 0;
        }

        .student-badges {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .student-progress {
          margin-bottom: 12px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .progress-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .student-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-active {
          font-size: 0.65rem;
          color: #94a3b8;
        }

        .view-profile {
          padding: 4px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 4px;
          color: #64748b;
          cursor: pointer;
        }

        .view-profile:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Table View */
        .students-table-container {
          overflow-x: auto;
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
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .cell-name {
          font-weight: 600;
          color: #1e293b;
        }

        .cell-email {
          font-size: 0.75rem;
          color: #64748b;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .contact-info div {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .attendance-badge {
          font-weight: 600;
        }

        .grade-badge {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .performance-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mini-progress {
          width: 60px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .mini-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
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

        /* Modal */
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
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
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
        }

        .modal-body {
          padding: 24px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .profile-avatar.large {
          width: 80px;
          height: 80px;
          font-size: 2rem;
        }

        .profile-title h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .profile-title p {
          color: #64748b;
          margin: 0;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat {
          text-align: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .stat-label {
          display: block;
          font-size: 0.7rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .profile-details {
          margin-bottom: 24px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .academic-progress {
          margin-bottom: 24px;
        }

        .academic-progress h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .progress-item {
          margin-bottom: 16px;
        }

        .profile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .profile-action {
          padding: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          font-size: 0.85rem;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .profile-action.primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .profile-action.primary:hover {
          background: #2563eb;
        }

        .profile-action:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .subject-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .subject-stats {
            width: 100%;
            justify-content: space-between;
          }

          .students-grid {
            grid-template-columns: 1fr;
          }

          .students-table th:nth-child(2),
          .students-table td:nth-child(2),
          .students-table th:nth-child(6),
          .students-table td:nth-child(6) {
            display: none;
          }

          .profile-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MyStudents;