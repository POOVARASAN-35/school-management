import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StudentMaterials from "./StudentMaterials";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  Star, 
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  AlertCircle,
  Download,
  Eye,
  FileText,
  Video,
  Headphones,
  Link as LinkIcon,
  Grid,
  List,
  Search,
  Filter,
  Sparkles,
  Zap,
  Target,
  Brain,
  Trophy,
  Medal,
  Rocket,
  Flame,
  Coffee,
  Smile,
  Heart,
  ThumbsUp,
  PartyPopper,
  Gift,
  Crown,
  GraduationCap,
  BookMarked,
  BookOpenCheck,
  Library,
  PenTool,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  Music,
  Palette,
  Code,
  Cpu
} from "lucide-react";

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  const [filterStaff, setFilterStaff] = useState("all");
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalMaterials: 0,
    completedTopics: 0,
    averageProgress: 0
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Subject icons mapping for visual variety
  const subjectIcons = {
    'Mathematics': <Calculator size={24} />,
    'Physics': <Cpu size={24} />,
    'Chemistry': <FlaskConical size={24} />,
    'Biology': <FlaskConical size={24} />,
    'English': <Languages size={24} />,
    'History': <BookOpen size={24} />,
    'Geography': <Globe size={24} />,
    'Art': <Palette size={24} />,
    'Music': <Music size={24} />,
    'Computer Science': <Code size={24} />,
    'default': <BookOpen size={24} />
  };

  const staffAvatars = {
    'Dr. Smith': '👨‍🔬',
    'Prof. Johnson': '👩‍🏫',
    'Mr. Williams': '👨‍🏫',
    'Ms. Brown': '👩‍🎓',
    'Dr. Davis': '👨‍⚕️',
    'default': '👨‍🏫'
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/subjects");
      
      // Add mock data for demonstration
      const enhancedSubjects = res.data.map((subject, index) => ({
        ...subject,
        icon: subjectIcons[subject.name] || subjectIcons.default,
        progress: Math.floor(Math.random() * 40 + 60), // Random progress 60-100%
        materialsCount: Math.floor(Math.random() * 20 + 10),
        upcomingDeadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        staffAvatar: staffAvatars[subject.staff?.name] || staffAvatars.default,
        topics: [
          { name: 'Introduction', completed: true },
          { name: 'Basic Concepts', completed: true },
          { name: 'Advanced Topics', completed: Math.random() > 0.5 },
          { name: 'Practical Applications', completed: Math.random() > 0.7 }
        ],
        grades: [
          { assignment: 'Quiz 1', score: Math.floor(Math.random() * 20 + 80), maxScore: 100 },
          { assignment: 'Assignment 1', score: Math.floor(Math.random() * 15 + 85), maxScore: 100 },
          { assignment: 'Mid Term', score: Math.floor(Math.random() * 25 + 75), maxScore: 100 }
        ]
      }));

      setSubjects(enhancedSubjects);
      
      // Calculate stats
      const totalMaterials = enhancedSubjects.reduce((acc, s) => acc + s.materialsCount, 0);
      const avgProgress = Math.round(enhancedSubjects.reduce((acc, s) => acc + s.progress, 0) / enhancedSubjects.length);
      
      setStats({
        totalSubjects: enhancedSubjects.length,
        totalMaterials,
        completedTopics: enhancedSubjects.reduce((acc, s) => acc + s.topics.filter(t => t.completed).length, 0),
        averageProgress: avgProgress
      });

      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to load subjects');
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const getSubjectIcon = (subjectName) => {
    return subjectIcons[subjectName] || subjectIcons.default;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return '#22c55e';
    if (progress >= 75) return '#3b82f6';
    if (progress >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getTimeRemaining = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days left`;
  };

  const getStaffList = () => {
    const staff = subjects.map(s => s.staff?.name).filter(Boolean);
    return ['all', ...new Set(staff)];
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.staff?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStaff = filterStaff === 'all' || subject.staff?.name === filterStaff;
    return matchesSearch && matchesStaff;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your subjects...</p>
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
    <div className="subjects-page">
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
            <BookOpen size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">My Learning Journey</h1>
            <p className="page-subtitle">Track your progress across all subjects</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchSubjects}>
            <Sparkles size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BookOpen size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Subjects</span>
            <span className="stat-value">{stats.totalSubjects}</span>
            <span className="stat-trend">Enrolled this semester</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FileText size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Materials</span>
            <span className="stat-value">{stats.totalMaterials}</span>
            <span className="stat-trend positive">Available to study</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Target size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Topics Completed</span>
            <span className="stat-value">{stats.completedTopics}</span>
            <span className="stat-trend">Across all subjects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Avg Progress</span>
            <span className="stat-value">{stats.averageProgress}%</span>
            <span className="stat-trend positive">On track</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search subjects or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-wrapper">
            <Filter size={18} className="filter-icon" />
            <select 
              value={filterStaff} 
              onChange={(e) => setFilterStaff(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Instructors</option>
              {getStaffList().filter(s => s !== 'all').map(staff => (
                <option key={staff} value={staff}>{staff}</option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Display */}
      {filteredSubjects.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={64} className="empty-icon" />
          <h3>No Subjects Found</h3>
          <p>{searchTerm ? 'Try adjusting your search' : 'You haven\'t been assigned any subjects yet'}</p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="subjects-grid">
            {filteredSubjects.map((subject, index) => (
              <div
                key={subject._id}
                className={`subject-card ${selected?._id === subject._id ? 'active' : ''}`}
                onClick={() => setSelected(subject)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <div className="subject-icon">
                    {getSubjectIcon(subject.name)}
                  </div>
                  <div className="subject-badge">
                    {subject.progress}%
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="subject-title">{subject.name}</h3>
                  <div className="staff-info">
                    <span className="staff-avatar">{subject.staffAvatar}</span>
                    <span className="staff-name">{subject.staff?.name || 'TBA'}</span>
                  </div>

                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${subject.progress}%`,
                          backgroundColor: getProgressColor(subject.progress)
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="subject-meta">
                    <div className="meta-item">
                      <FileText size={14} />
                      <span>{subject.materialsCount} materials</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{getTimeRemaining(subject.upcomingDeadline)}</span>
                    </div>
                  </div>

                  <div className="topics-preview">
                    {subject.topics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="topic-item">
                        {topic.completed ? (
                          <Check size={12} className="topic-check" />
                        ) : (
                          <div className="topic-pending"></div>
                        )}
                        <span className={`topic-name ${topic.completed ? 'completed' : ''}`}>
                          {topic.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-footer">
                  <button className="view-details">
                    View Details
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="subjects-list-view">
            <table className="subjects-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Instructor</th>
                  <th>Progress</th>
                  <th>Materials</th>
                  <th>Next Deadline</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject) => (
                  <tr 
                    key={subject._id}
                    className={selected?._id === subject._id ? 'active' : ''}
                    onClick={() => setSelected(subject)}
                  >
                    <td>
                      <div className="subject-cell">
                        <div className="cell-icon">
                          {getSubjectIcon(subject.name)}
                        </div>
                        <span>{subject.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="staff-cell">
                        <span className="staff-avatar-small">{subject.staffAvatar}</span>
                        {subject.staff?.name || 'TBA'}
                      </div>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar-small">
                          <div 
                            className="progress-fill-small"
                            style={{ 
                              width: `${subject.progress}%`,
                              backgroundColor: getProgressColor(subject.progress)
                            }}
                          ></div>
                        </div>
                        <span className="progress-value">{subject.progress}%</span>
                      </div>
                    </td>
                    <td>{subject.materialsCount}</td>
                    <td>
                      <span className={`deadline-badge ${getTimeRemaining(subject.upcomingDeadline).includes('Overdue') ? 'overdue' : ''}`}>
                        {getTimeRemaining(subject.upcomingDeadline)}
                      </span>
                    </td>
                    <td>{new Date(subject.lastActivity).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action" title="View materials">
                          <FileText size={14} />
                        </button>
                        <button className="table-action" title="View grades">
                          <Award size={14} />
                        </button>
                        <button className="table-action" title="More details">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Subject Details Modal/Expanded View */}
      {selected && (
        <div className="subject-details">
          <div className="details-header">
            <div className="details-title">
              <h2>{selected.name}</h2>
              <p>with {selected.staff?.name || 'Staff TBA'}</p>
            </div>
            <button className="close-details" onClick={() => setSelected(null)}>
              <X size={20} />
            </button>
          </div>

          <div className="details-content">
            <div className="details-grid">
              {/* Progress Overview */}
              <div className="detail-card progress-overview">
                <h3>Progress Overview</h3>
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
                      strokeDasharray={`${selected.progress}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">{selected.progress}%</text>
                  </svg>
                </div>
                <div className="progress-stats">
                  <div className="stat">
                    <span className="stat-value">{selected.topics.filter(t => t.completed).length}</span>
                    <span className="stat-label">Topics Done</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{selected.materialsCount}</span>
                    <span className="stat-label">Materials</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{selected.grades?.length || 0}</span>
                    <span className="stat-label">Assignments</span>
                  </div>
                </div>
              </div>

              {/* Grades Preview */}
              <div className="detail-card grades-preview">
                <h3>Recent Grades</h3>
                {selected.grades?.map((grade, index) => (
                  <div key={index} className="grade-item">
                    <span className="grade-name">{grade.assignment}</span>
                    <div className="grade-bar">
                      <div 
                        className="grade-fill"
                        style={{ 
                          width: `${(grade.score / grade.maxScore) * 100}%`,
                          backgroundColor: grade.score >= 90 ? '#22c55e' : grade.score >= 80 ? '#3b82f6' : '#f59e0b'
                        }}
                      ></div>
                    </div>
                    <span className="grade-score">{grade.score}%</span>
                  </div>
                ))}
              </div>

              {/* Upcoming Deadlines */}
              <div className="detail-card deadlines">
                <h3>Upcoming</h3>
                <div className="deadline-item">
                  <Calendar size={16} />
                  <span>Assignment Due: {new Date(selected.upcomingDeadline).toLocaleDateString()}</span>
                </div>
                <div className="deadline-item">
                  <Clock size={16} />
                  <span>Last Activity: {new Date(selected.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="detail-card quick-actions">
                <button className="action-btn primary" onClick={() => showNotification('info', 'Opening materials...')}>
                  <FileText size={16} />
                  View Materials
                </button>
                <button className="action-btn" onClick={() => showNotification('info', 'Loading grades...')}>
                  <Award size={16} />
                  Check Grades
                </button>
                <button className="action-btn" onClick={() => showNotification('success', 'Message sent to instructor')}>
                  <Users size={16} />
                  Contact Staff
                </button>
              </div>
            </div>

            {/* StudentMaterials Component */}
            <StudentMaterials subjectId={selected._id} />
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .subjects-page {
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

        .refresh-btn {
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          color: #475569;
          cursor: pointer;
        }

        .refresh-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue {
          background: #dbeafe;
          color: #3b82f6;
        }

        .stat-icon.green {
          background: #dcfce7;
          color: #22c55e;
        }

        .stat-icon.orange {
          background: #fed7aa;
          color: #f97316;
        }

        .stat-icon.purple {
          background: #ede9fe;
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
          margin-bottom: 4px;
        }

        .stat-trend {
          font-size: 0.75rem;
          color: #64748b;
        }

        .stat-trend.positive {
          color: #22c55e;
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
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
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
          padding: 12px 32px 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #f1f5f9;
          border-radius: 8px;
        }

        .view-btn {
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          color: #64748b;
        }

        .view-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Subjects Grid */
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .subject-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .subject-card.active {
          border: 2px solid #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .card-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subject-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .subject-badge {
          padding: 4px 12px;
          background: white;
          border-radius: 20px;
          font-weight: 600;
          color: #3b82f6;
        }

        .card-body {
          padding: 20px;
        }

        .subject-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .staff-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .staff-avatar {
          font-size: 1.2rem;
        }

        .staff-name {
          color: #64748b;
          font-size: 0.9rem;
        }

        .progress-container {
          margin-bottom: 16px;
        }

        .progress-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .subject-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: #64748b;
        }

        .topics-preview {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .topic-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .topic-check {
          color: #22c55e;
        }

        .topic-pending {
          width: 12px;
          height: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 50%;
        }

        .topic-name {
          font-size: 0.85rem;
          color: #475569;
        }

        .topic-name.completed {
          color: #22c55e;
          text-decoration: line-through;
          opacity: 0.7;
        }

        .card-footer {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
        }

        .view-details {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #475569;
          cursor: pointer;
        }

        .view-details:hover {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Table View */
        .subjects-list-view {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          margin-bottom: 32px;
        }

        .subjects-table {
          width: 100%;
          border-collapse: collapse;
        }

        .subjects-table th {
          text-align: left;
          padding: 16px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .subjects-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .subjects-table tr:hover td {
          background: #f8fafc;
        }

        .subjects-table tr.active td {
          background: #eff6ff;
        }

        .subject-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cell-icon {
          width: 32px;
          height: 32px;
          background: #eff6ff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .staff-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .staff-avatar-small {
          font-size: 1rem;
        }

        .progress-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .progress-bar-small {
          width: 80px;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill-small {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-value {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .deadline-badge {
          padding: 4px 8px;
          background: #f1f5f9;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #475569;
        }

        .deadline-badge.overdue {
          background: #fee2e2;
          color: #ef4444;
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

        /* Subject Details */
        .subject-details {
          margin-top: 32px;
          padding: 24px;
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .details-title h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .details-title p {
          color: #64748b;
          margin: 0;
        }

        .close-details {
          padding: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
        }

        .close-details:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .detail-card {
          padding: 20px;
          background: #f8fafc;
          border-radius: 16px;
        }

        .detail-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        /* Progress Circle */
        .progress-circle {
          width: 120px;
          height: 120px;
          margin: 0 auto 16px;
        }

        .circular-chart {
          width: 120px;
          height: 120px;
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
          fill: #1e293b;
          font-size: 6px;
          text-anchor: middle;
          font-weight: bold;
        }

        .progress-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 16px;
        }

        .progress-stats .stat {
          text-align: center;
        }

        .progress-stats .stat-value {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }

        .progress-stats .stat-label {
          font-size: 0.7rem;
          color: #64748b;
        }

        /* Grades Preview */
        .grade-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .grade-name {
          width: 100px;
          font-size: 0.85rem;
          color: #475569;
        }

        .grade-bar {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .grade-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .grade-score {
          width: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #1e293b;
        }

        /* Deadlines */
        .deadline-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          color: #475569;
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .action-btn {
          padding: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .action-btn.primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .action-btn.primary:hover {
          background: #2563eb;
        }

        .action-btn:hover:not(.primary) {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .details-grid {
            grid-template-columns: 1fr;
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

          .filter-group {
            width: 100%;
          }

          .filter-wrapper {
            flex: 1;
          }

          .subjects-grid {
            grid-template-columns: 1fr;
          }

          .subjects-table th:nth-child(3),
          .subjects-table td:nth-child(3),
          .subjects-table th:nth-child(5),
          .subjects-table td:nth-child(5) {
            display: none;
          }

          .details-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentSubjects;