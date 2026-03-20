import React, { useEffect, useState, useRef } from "react";
import { fetchMySubjects, fetchStudentsBySubject } from "../../api/staff.api";
import { BarChart, DoughnutChart, LineChart } from "../../components/DashboardChart";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Download,
  RefreshCw,
  ChevronRight,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Star,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Edit,
  MoreVertical,
  UserPlus,
  MessageCircle,
  Bell,
  Settings,
  PieChart,
  BarChart3,
  Activity,
  UserCheck,
  UserX,
  BookMarked,
  Brain,
  Target,
  Zap,
  Sparkles
} from "lucide-react";

const StaffDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showStats, setShowStats] = useState(false);
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeToday: 0,
    avgAttendance: 0,
    performance: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const chartRef = useRef(null);
  const [chartAnimation, setChartAnimation] = useState(false);

  useEffect(() => {
    loadSubjects();
    loadRecentActivities();
    loadUpcomingTasks();
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      setChartAnimation(true);
    }
  }, [subjects]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await fetchMySubjects();
      setSubjects(res.data);
      
      // Calculate stats
      const totalStudents = res.data.reduce((acc, s) => acc + (s.studentCount || 0), 0);
      setStats(prev => ({
        ...prev,
        totalStudents,
        avgAttendance: Math.floor(Math.random() * 20 + 75), // Demo data
        performance: Math.floor(Math.random() * 15 + 80) // Demo data
      }));
      
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to load subjects');
      setLoading(false);
    }
  };

  const loadStudents = async (subject) => {
    try {
      setSelectedSubject(subject);
      const res = await fetchStudentsBySubject(subject._id);
      setStudents(res.data);
      setStats(prev => ({ ...prev, totalStudents: res.data.length }));
      
      // Add to recent activities
      addActivity('viewed', `Viewed students in ${subject.name}`);
      
      // Show notification
      showNotification('success', `Loaded ${res.data.length} students`);
    } catch (error) {
      showNotification('error', 'Failed to load students');
    }
  };

  const loadRecentActivities = () => {
    setRecentActivities([
      { id: 1, action: 'Updated grades', subject: 'Mathematics', time: '5 min ago', icon: <FileText size={14} /> },
      { id: 2, action: 'Added attendance', subject: 'Physics', time: '1 hour ago', icon: <CheckCircle size={14} /> },
      { id: 3, action: 'Uploaded material', subject: 'Chemistry', time: '3 hours ago', icon: <BookOpen size={14} /> },
      { id: 4, action: 'Created exam', subject: 'Biology', time: 'yesterday', icon: <FileText size={14} /> }
    ]);
  };

  const loadUpcomingTasks = () => {
    setUpcomingTasks([
      { id: 1, task: 'Grade assignments', subject: 'Mathematics', due: 'Today', priority: 'high' },
      { id: 2, task: 'Prepare lecture', subject: 'Physics', due: 'Tomorrow', priority: 'medium' },
      { id: 3, task: 'Submit reports', subject: 'Chemistry', due: 'In 3 days', priority: 'low' }
    ]);
  };

  const addActivity = (action, details) => {
    const newActivity = {
      id: Date.now(),
      action: details,
      time: 'Just now',
      icon: action === 'viewed' ? <Eye size={14} /> : <Activity size={14} />
    };
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chart data
  const barChartData = {
    labels: subjects.map(s => s.name),
    datasets: [
      {
        label: "Enrolled Students",
        data: subjects.map(s => s.studentCount || Math.floor(Math.random() * 30 + 10)),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Present", "Absent", "Late", "Excused"],
    datasets: [
      {
        data: [65, 15, 12, 8],
        backgroundColor: [
          "rgba(34, 197, 94, 0.9)",
          "rgba(239, 68, 68, 0.9)",
          "rgba(245, 158, 11, 0.9)",
          "rgba(156, 163, 175, 0.9)",
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Attendance Trend",
        data: [78, 82, 85, 80, 88, 75],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
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
    <div className="staff-dashboard">
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
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <GraduationCap size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Welcome back, Professor! 👋</h1>
            <p className="page-subtitle">Here's what's happening with your classes today.</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="action-btn refresh" onClick={loadSubjects}>
            <RefreshCw size={18} />
          </button>
          <button className="action-btn download">
            <Download size={18} />
          </button>
          <button className="action-btn settings">
            <Settings size={18} />
          </button>
          <button className="primary-btn" onClick={() => setShowStats(!showStats)}>
            <Zap size={18} />
            <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setShowStats(true)}>
          <div className="stat-icon-wrapper blue">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">My Subjects</p>
            <h3 className="stat-value">{subjects.length}</h3>
            <span className="stat-trend positive">+2 this semester</span>
          </div>
          <div className="stat-progress" style={{ width: '75%' }}></div>
        </div>

        <div className="stat-card" onClick={() => setShowStats(true)}>
          <div className="stat-icon-wrapper green">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Students</p>
            <h3 className="stat-value">{stats.totalStudents}</h3>
            <span className="stat-trend positive">+12% attendance</span>
          </div>
          <div className="stat-progress" style={{ width: '60%' }}></div>
        </div>

        <div className="stat-card" onClick={() => setShowStats(true)}>
          <div className="stat-icon-wrapper orange">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg. Attendance</p>
            <h3 className="stat-value">{stats.avgAttendance}%</h3>
            <span className="stat-trend">Last 30 days</span>
          </div>
          <div className="stat-progress" style={{ width: `${stats.avgAttendance}%` }}></div>
        </div>

        <div className="stat-card" onClick={() => setShowStats(true)}>
          <div className="stat-icon-wrapper purple">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Performance</p>
            <h3 className="stat-value">{stats.performance}%</h3>
            <span className="stat-trend positive">Above average</span>
          </div>
          <div className="stat-progress" style={{ width: `${stats.performance}%` }}></div>
        </div>
      </div>

      {/* Charts Section */}
      {showStats && (
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Student Distribution by Subject</h3>
              <button className="more-btn">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="chart-container">
              <BarChart data={barChartData} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Attendance Overview</h3>
              <button className="more-btn">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="chart-container small">
              <DoughnutChart data={doughnutData} />
            </div>
            <div className="chart-legend">
              {doughnutData.labels.map((label, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}></span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Weekly Attendance Trend</h3>
              <button className="more-btn">
                                <MoreVertical size={16} />
              </button>
            </div>
            <div className="chart-container">
              <LineChart data={lineChartData} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column - Subjects */}
        <div className="subjects-section">
          <div className="section-header">
            <h2>My Subjects</h2>
            <span className="section-badge">{subjects.length} Active</span>
          </div>

          <div className="subjects-list">
            {subjects.map((subject, index) => (
              <div
                key={subject._id}
                className={`subject-card ${selectedSubject?._id === subject._id ? 'active' : ''}`}
                onClick={() => loadStudents(subject)}
                onMouseEnter={() => setHoveredSubject(subject._id)}
                onMouseLeave={() => setHoveredSubject(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="subject-icon">
                  <BookOpen size={24} />
                </div>
                <div className="subject-info">
                  <h3>{subject.name}</h3>
                  <p>{subject.course?.name}</p>
                  <div className="subject-meta">
                    <span className="meta-item">
                      <Users size={14} />
                      {subject.studentCount || 24} Students
                    </span>
                    <span className="meta-item">
                      <Clock size={14} />
                      {subject.schedule || 'Mon, Wed 10AM'}
                    </span>
                  </div>
                </div>
                <div className="subject-progress">
                  <div className="progress-circle">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path
                        className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="circle"
                        strokeDasharray={`${subject.progress || 75}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="percentage">{subject.progress || 75}%</span>
                  </div>
                </div>
                {hoveredSubject === subject._id && (
                  <div className="subject-hover">
                    <button className="hover-action">
                      <Eye size={14} />
                      View
                    </button>
                    <button className="hover-action">
                      <Edit size={14} />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Students */}
        <div className="students-section">
          <div className="section-header">
            <h2>{selectedSubject ? selectedSubject.name : 'Select a Subject'}</h2>
            <div className="header-actions">
              <div className="search-box">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <div className="grid-icon"></div>
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <div className="list-icon"></div>
                </button>
              </div>
            </div>
          </div>

          {selectedSubject ? (
            filteredStudents.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="students-grid">
                  {filteredStudents.map((student) => (
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
                      <h3 className="student-name">{student.name}</h3>
                      <p className="student-email">{student.email}</p>
                      <div className="student-badges">
                        <span className="badge attendance">
                          <CheckCircle size={12} />
                          85%
                        </span>
                        <span className="badge grade">
                          <Star size={12} />
                          A-
                        </span>
                      </div>
                      <div className="student-actions">
                        <button className="action-icon" title="Message">
                          <MessageCircle size={14} />
                        </button>
                        <button className="action-icon" title="View Profile">
                          <Eye size={14} />
                        </button>
                        <button className="action-icon" title="More">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="students-list">
                  {filteredStudents.map((student) => (
                    <div key={student._id} className="list-item">
                      <div className="item-info">
                        <div className="item-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="item-details">
                          <h4>{student.name}</h4>
                          <p>{student.email}</p>
                        </div>
                      </div>
                      <div className="item-stats">
                        <span className="stat attendance">85%</span>
                        <span className="stat grade">A-</span>
                      </div>
                      <div className="item-actions">
                        <button className="item-action">
                          <MessageCircle size={14} />
                        </button>
                        <button className="item-action">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="empty-state">
                <Users size={48} />
                <p>No students found</p>
              </div>
            )
          ) : (
            <div className="select-prompt">
              <BookOpen size={48} />
              <p>Select a subject to view enrolled students</p>
            </div>
          )}

          {selectedSubject && (
            <button className="add-student-btn">
              <UserPlus size={16} />
              Add Student
            </button>
          )}
        </div>

        {/* Right Column - Activity & Tasks */}
        <div className="activity-section">
          {/* Recent Activity */}
          <div className="activity-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-details">
                    <p>{activity.action}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="tasks-card">
            <div className="card-header">
              <h3>Upcoming Tasks</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="tasks-list">
              {upcomingTasks.map((task) => (
                <div key={task.id} className={`task-item priority-${task.priority}`}>
                  <div className="task-indicator"></div>
                  <div className="task-details">
                    <p>{task.task}</p>
                    <span>{task.subject} • Due {task.due}</span>
                  </div>
                  <input type="checkbox" className="task-checkbox" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-action">
              <FileText size={16} />
              Create Exam
            </button>
            <button className="quick-action">
              <Calendar size={16} />
              Schedule Class
            </button>
            <button className="quick-action">
              <BookMarked size={16} />
              Upload Material
            </button>
            <button className="quick-action">
              <Award size={16} />
              Give Grades
            </button>
          </div>

          {/* Performance Insights */}
          <div className="insights-card">
            <h3>Performance Insights</h3>
            <div className="insight-item">
              <div className="insight-label">
                <Brain size={14} />
                <span>Top Performing Subject</span>
              </div>
              <span className="insight-value">Mathematics (92%)</span>
            </div>
            <div className="insight-item">
              <div className="insight-label">
                <Target size={14} />
                <span>Needs Improvement</span>
              </div>
              <span className="insight-value">Physics (67%)</span>
            </div>
            <div className="insight-item">
              <div className="insight-label">
                <Users size={14} />
                <span>Most Active Class</span>
              </div>
              <span className="insight-value">Grade 10A</span>
            </div>
          </div>
        </div>
      </div>

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
                <div className="profile-stat">
                  <span className="stat-label">Attendance</span>
                  <span className="stat-value">85%</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-label">Grade</span>
                  <span className="stat-value">A-</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-label">Rank</span>
                  <span className="stat-value">#12</span>
                </div>
              </div>

              <div className="profile-info">
                <div className="info-row">
                  <Mail size={16} />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="info-row">
                  <Phone size={16} />
                  <span>+1 234 567 890</span>
                </div>
                <div className="info-row">
                  <MapPin size={16} />
                  <span>New York, NY</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="profile-action primary">
                  <MessageCircle size={16} />
                  Message
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
        .staff-dashboard {
          padding: 24px;
          max-width: 1600px;
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
        .dashboard-header {
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

        .action-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
        }

        .primary-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 20px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
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
          cursor: pointer;
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
          line-height: 1.2;
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

        /* Charts Section */
        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
          animation: slideDown 0.5s ease;
        }

        .chart-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .more-btn {
          padding: 4px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 4px;
        }

        .more-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .chart-container {
          height: 250px;
        }

        .chart-container.small {
          height: 180px;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #64748b;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 4px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 24px;
        }

        /* Subjects Section */
        .subjects-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
        }

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
        }

        .section-badge {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #475569;
        }

        .subjects-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .subject-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .subject-card:hover {
          transform: translateX(5px);
          border-color: #3b82f6;
          background: white;
        }

        .subject-card.active {
          border-color: #3b82f6;
          background: #eff6ff;
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

        .subject-info {
          flex: 1;
        }

        .subject-info h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .subject-info p {
          color: #64748b;
          font-size: 0.85rem;
          margin: 0 0 8px 0;
        }

        .subject-meta {
          display: flex;
          gap: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.75rem;
        }

        .subject-progress {
          position: relative;
        }

        .progress-circle {
          width: 50px;
          height: 50px;
          position: relative;
        }

        .circular-chart {
          width: 50px;
          height: 50px;
        }

        .circle-bg {
          stroke: #e2e8f0;
          stroke-width: 3;
          fill: none;
        }

        .circle {
          stroke: #3b82f6;
          stroke-width: 3;
          fill: none;
          stroke-linecap: round;
          transition: stroke-dasharray 0.3s ease;
        }

        .percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.7rem;
          font-weight: 600;
          color: #1e293b;
        }

        .subject-hover {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 4px;
          background: white;
          padding: 4px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease;
        }

        .hover-action {
          padding: 4px 8px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 4px;
          font-size: 0.7rem;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .hover-action:hover {
          background: #f1f5f9;
          color: #3b82f6;
        }

        /* Students Section */
        .students-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-box input {
          padding: 6px 12px 6px 30px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.85rem;
          width: 200px;
        }

        .search-box input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 2px;
          border-radius: 8px;
        }

        .toggle-btn {
          padding: 4px 8px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
        }

        .toggle-btn.active {
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

        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          max-height: 400px;
          overflow-y: auto;
          padding: 4px;
        }

        .student-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          text-align: center;
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
          margin: 0 0 4px 0;
        }

        .student-email {
          font-size: 0.75rem;
          color: #64748b;
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
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
        }

        .badge.attendance {
          background: #dbeafe;
          color: #3b82f6;
        }

        .badge.grade {
          background: #fef3c7;
          color: #f59e0b;
        }

        .student-actions {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .action-icon {
          padding: 4px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 4px;
          color: #64748b;
          cursor: pointer;
        }

        .action-icon:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .students-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .item-avatar {
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

        .item-details h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .item-details p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        .item-stats {
          display: flex;
          gap: 12px;
        }

        .stat {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .stat.attendance {
          color: #3b82f6;
        }

        .stat.grade {
          color: #f59e0b;
        }

        .item-actions {
          display: flex;
          gap: 4px;
        }

        .item-action {
          padding: 4px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 4px;
          color: #64748b;
          cursor: pointer;
        }

        .select-prompt, .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
        }

        .add-student-btn {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          background: #f8fafc;
          border: 1px dashed #e2e8f0;
          border-radius: 12px;
          color: #3b82f6;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .add-student-btn:hover {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        /* Activity Section */
        .activity-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .activity-card, .tasks-card, .insights-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .view-all {
          padding: 4px 8px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          font-size: 0.7rem;
          color: #64748b;
          cursor: pointer;
        }

        .view-all:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .activity-icon {
          width: 28px;
          height: 28px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .activity-details {
          flex: 1;
        }

        .activity-details p {
          font-size: 0.85rem;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .activity-details span {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid;
        }

        .task-item.priority-high {
          border-left-color: #ef4444;
        }

        .task-item.priority-medium {
          border-left-color: #f59e0b;
        }

        .task-item.priority-low {
          border-left-color: #10b981;
        }

        .task-indicator {
          width: 4px;
          height: 4px;
          border-radius: 2px;
        }

        .task-details {
          flex: 1;
        }

        .task-details p {
          font-size: 0.85rem;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .task-details span {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .task-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .quick-action {
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #475569;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .quick-action:hover {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .insights-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .insight-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .insight-item:last-child {
          border-bottom: none;
        }

        .insight-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.85rem;
        }

        .insight-value {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
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
          gap: 16px;
          margin-bottom: 24px;
        }

        .profile-stat {
          text-align: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .profile-stat .stat-label {
          display: block;
          color: #64748b;
          font-size: 0.75rem;
          margin-bottom: 4px;
        }

        .profile-stat .stat-value {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }

        .profile-info {
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-row svg {
          color: #94a3b8;
        }

        .profile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .profile-action {
          padding: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .profile-action.primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .profile-action.primary:hover {
          background: #2563eb;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .students-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .profile-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffDashboard;