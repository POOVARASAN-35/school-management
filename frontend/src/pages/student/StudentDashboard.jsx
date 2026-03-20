import React, { useEffect, useState } from "react";
import { DoughnutChart, BarChart, LineChart } from "../../components/DashboardChart";
import StudentMaterials from "./StudentMaterials";
import api from "../../api/axios";
import { 
  BookOpen, 
  GraduationCap, 
  Calendar,
  Clock,
  Award,
  Star,
  TrendingUp,
  Download,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  ChevronLeft,
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
  Users,
  BarChart3,
  PieChart,
  Activity,
  Watch,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
} from "lucide-react";

const StudentDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState({ temp: 22, condition: 'sunny' });
  const [streak, setStreak] = useState(7);
  const [points, setPoints] = useState(1250);
  const [level, setLevel] = useState(5);
  const [achievements, setAchievements] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [studyTime, setStudyTime] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Mock data for demonstration
  const data = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const weeklyProgress = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Study Hours",
        data: [2.5, 3, 4, 3.5, 5, 2, 1],
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const performanceData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Performance %",
        data: [75, 82, 88, 92],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Fetch subjects for logged-in student
  const fetchSubjects = async () => {
    try {
      console.log("🟢 fetchSubjects() CALLED");
      const res = await api.get("/user/subjects");
      console.log("🟢 API RESPONSE DATA:", res.data);
      setSubjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error("🔴 ERROR FETCHING SUBJECTS:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  // Fetch additional student data
  const fetchStudentData = async () => {
    try {
      // Mock data - replace with actual API calls
      setUpcomingDeadlines([
        { id: 1, title: "Math Assignment", subject: "Mathematics", due: "2024-03-25", priority: "high" },
        { id: 2, title: "Physics Lab Report", subject: "Physics", due: "2024-03-26", priority: "medium" },
        { id: 3, title: "Chemistry Quiz", subject: "Chemistry", due: "2024-03-27", priority: "low" }
      ]);

      setRecentGrades([
        { subject: "Mathematics", grade: "A", score: 92, feedback: "Excellent work!" },
        { subject: "Physics", grade: "B+", score: 87, feedback: "Good progress" },
        { subject: "Chemistry", grade: "A-", score: 89, feedback: "Well done" }
      ]);

      setAchievements([
        { id: 1, title: "Perfect Attendance", icon: <Award size={20} />, date: "2024-03-20" },
        { id: 2, title: "Homework Hero", icon: <Star size={20} />, date: "2024-03-19" },
        { id: 3, title: "Quick Learner", icon: <Zap size={20} />, date: "2024-03-18" }
      ]);
    } catch (error) {
      console.error("Failed to fetch student data");
    }
  };

  useEffect(() => {
    console.log("🟡 StudentDashboard mounted");
    fetchSubjects();
    fetchStudentData();
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getWeatherIcon = () => {
    switch(weather.condition) {
      case 'sunny': return <Sun size={24} />;
      case 'cloudy': return <Cloud size={24} />;
      case 'rainy': return <CloudRain size={24} />;
      case 'snowy': return <CloudSnow size={24} />;
      case 'stormy': return <CloudLightning size={24} />;
      default: return <Sun size={24} />;
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
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
    <div className={`student-dashboard ${focusMode ? 'focus-mode' : ''}`}>
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

      {/* Focus Mode Toggle */}
      <button 
        className={`focus-toggle ${focusMode ? 'active' : ''}`}
        onClick={() => setFocusMode(!focusMode)}
      >
        <Target size={20} />
        <span>{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
      </button>

      {/* Header with Welcome and Stats */}
      <div className="welcome-section">
        <div className="welcome-left">
          <div className="greeting-card">
            <div className="greeting-icon">
              <GraduationCap size={32} />
            </div>
            <div className="greeting-text">
              <h1>{greeting}, Student! 👋</h1>
              <p>Ready to continue your learning journey?</p>
            </div>
          </div>

          <div className="weather-card">
            {getWeatherIcon()}
            <div className="weather-info">
              <span className="temp">{weather.temp}°C</span>
              <span className="condition">{weather.condition}</span>
            </div>
          </div>
        </div>

        <div className="stats-pills">
          <div className="stat-pill streak">
            <Flame size={16} />
            <span>{streak} day streak</span>
          </div>
          <div className="stat-pill points">
            <Star size={16} />
            <span>{points} points</span>
          </div>
          <div className="stat-pill level">
            <Crown size={16} />
            <span>Level {level}</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Progress & Stats */}
        <div className="left-column">
          {/* Progress Overview */}
          <div className="card progress-card">
            <div className="card-header">
              <h2>Overall Progress</h2>
              <span className="badge">65% Complete</span>
            </div>
            <div className="progress-ring">
              <DoughnutChart data={data} />
            </div>
            <div className="progress-stats">
              <div className="stat-item">
                <div className="stat-dot completed"></div>
                <span>Completed: 65%</span>
              </div>
              <div className="stat-item">
                <div className="stat-dot progress"></div>
                <span>In Progress: 20%</span>
              </div>
              <div className="stat-item">
                <div className="stat-dot pending"></div>
                <span>Pending: 15%</span>
              </div>
            </div>
          </div>

          {/* Weekly Study Time */}
          <div className="card study-card">
            <div className="card-header">
              <h2>Weekly Study Time</h2>
              <span className="total-hours">21 hrs</span>
            </div>
            <div className="chart-container small">
              <BarChart data={weeklyProgress} />
            </div>
          </div>

          {/* Achievements */}
          <div className="card achievements-card">
            <div className="card-header">
              <h2>Recent Achievements</h2>
              <button className="view-all">View All</button>
            </div>
            <div className="achievements-list">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-item">
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>
                  <div className="achievement-info">
                    <span className="achievement-title">{achievement.title}</span>
                    <span className="achievement-date">{achievement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Subjects & Materials */}
        <div className="middle-column">
          {/* Subjects Section */}
          <div className="card subjects-card">
            <div className="card-header">
              <h2>My Subjects</h2>
              <span className="count">{subjects.length} Subjects</span>
            </div>

            {subjects.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={48} className="empty-icon" />
                <p>No subjects assigned yet</p>
              </div>
            ) : (
              <div className="subjects-list">
                {subjects.map((s, index) => (
                  <div
                    key={s._id}
                    onClick={() => setSelectedSubject(s)}
                    className={`subject-item ${selectedSubject?._id === s._id ? 'active' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="subject-info">
                      <div className="subject-icon">
                        <BookOpen size={20} />
                      </div>
                      <div className="subject-details">
                        <h3>{s.name}</h3>
                        <p>{s.staff?.name || 'No instructor assigned'}</p>
                      </div>
                    </div>
                    <div className="subject-meta">
                      <span className="progress-indicator">
                        <div className="progress-dot"></div>
                        65%
                      </span>
                      <ChevronRight size={16} className="arrow" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Materials Section */}
          {selectedSubject && (
            <div className="card materials-card">
              <div className="card-header">
                <h2>Materials for {selectedSubject.name}</h2>
                <button className="refresh-btn" onClick={() => showNotification('success', 'Materials refreshed')}>
                  <Sparkles size={16} />
                </button>
              </div>
              <StudentMaterials subjectId={selectedSubject._id} />
            </div>
          )}
        </div>

        {/* Right Column - Deadlines & Grades */}
        <div className="right-column">
          {/* Upcoming Deadlines */}
          <div className="card deadlines-card">
            <div className="card-header">
              <h2>Upcoming Deadlines</h2>
              <Calendar size={16} className="header-icon" />
            </div>
            <div className="deadlines-list">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className={`deadline-item priority-${deadline.priority}`}>
                  <div className="deadline-indicator"></div>
                  <div className="deadline-content">
                    <h4>{deadline.title}</h4>
                    <p>{deadline.subject}</p>
                    <span className="deadline-date">
                      <Clock size={12} />
                      Due {new Date(deadline.due).toLocaleDateString()}
                    </span>
                  </div>
                  <input type="checkbox" className="deadline-checkbox" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="card grades-card">
            <div className="card-header">
              <h2>Recent Grades</h2>
              <TrendingUp size={16} className="header-icon" />
            </div>
            <div className="grades-list">
              {recentGrades.map((grade, index) => (
                <div key={index} className="grade-item">
                  <div className="grade-subject">
                    <span>{grade.subject}</span>
                    <span className="grade-score">{grade.score}%</span>
                  </div>
                  <div className="grade-bar">
                    <div 
                      className="grade-fill"
                      style={{ 
                        width: `${grade.score}%`,
                        backgroundColor: grade.score >= 90 ? '#22c55e' : grade.score >= 80 ? '#3b82f6' : '#f59e0b'
                      }}
                    ></div>
                  </div>
                  <span className="grade-letter">{grade.grade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Trend */}
          <div className="card trend-card">
            <div className="card-header">
              <h2>Performance Trend</h2>
              <Activity size={16} className="header-icon" />
            </div>
            <div className="chart-container small">
              <LineChart data={performanceData} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-action" onClick={() => showNotification('info', 'Study session started!')}>
              <Brain size={16} />
              Study Session
            </button>
            <button className="quick-action" onClick={() => showNotification('success', 'Progress saved!')}>
              <Target size={16} />
              Set Goal
            </button>
            <button className="quick-action" onClick={() => showNotification('info', 'Review mode activated')}>
              <Eye size={16} />
              Review
            </button>
          </div>
        </div>
      </div>

      {/* Motivation Quote */}
      <div className="quote-section">
        <Sparkles size={20} className="quote-icon" />
        <p className="quote-text">"The expert in anything was once a beginner."</p>
        <span className="quote-author">- Helen Hayes</span>
      </div>

      {/* Internal CSS */}
      <style>{`
        .student-dashboard {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
          transition: all 0.3s ease;
        }

        .student-dashboard.focus-mode {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
        }

        .student-dashboard.focus-mode .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .student-dashboard.focus-mode h2,
        .student-dashboard.focus-mode .greeting-text h1,
        .student-dashboard.focus-mode .greeting-text p {
          color: white;
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

        .notification.info {
          border-left-color: #3b82f6;
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

        /* Focus Toggle */
        .focus-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          z-index: 100;
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }

        .focus-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
        }

        .focus-toggle.active {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        /* Welcome Section */
        .welcome-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .welcome-left {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .greeting-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
        }

        .greeting-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .greeting-text h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .greeting-text p {
          margin: 0;
          opacity: 0.9;
        }

        .weather-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          background: white;
          border-radius: 30px;
          border: 1px solid #e2e8f0;
        }

        .weather-card svg {
          color: #f59e0b;
        }

        .weather-info {
          display: flex;
          flex-direction: column;
        }

        .temp {
          font-weight: 600;
          color: #1e293b;
        }

        .condition {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: capitalize;
        }

        .stats-pills {
          display: flex;
          gap: 12px;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border-radius: 30px;
          border: 1px solid #e2e8f0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .stat-pill.streak svg {
          color: #f97316;
        }

        .stat-pill.points svg {
          color: #f59e0b;
        }

        .stat-pill.level svg {
          color: #8b5cf6;
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.2fr 2fr 1.2fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        /* Card Styles */
        .card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .badge {
          padding: 4px 12px;
          background: #f1f5f9;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #475569;
        }

        .count {
          font-size: 0.9rem;
          color: #64748b;
        }

        .header-icon {
          color: #94a3b8;
        }

        .view-all {
          padding: 4px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #475569;
          cursor: pointer;
        }

        .refresh-btn {
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
        }

        .refresh-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        /* Progress Card */
        .progress-card .progress-ring {
          height: 200px;
          margin-bottom: 20px;
        }

        .progress-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #475569;
        }

        .stat-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .stat-dot.completed {
          background: #22c55e;
        }

        .stat-dot.progress {
          background: #3b82f6;
        }

        .stat-dot.pending {
          background: #f59e0b;
        }

        /* Study Card */
        .total-hours {
          font-weight: 600;
          color: #3b82f6;
        }

        .chart-container {
          height: 150px;
        }

        .chart-container.small {
          height: 120px;
        }

        /* Achievements Card */
        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .achievement-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .achievement-info {
          flex: 1;
        }

        .achievement-title {
          display: block;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .achievement-date {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        /* Subjects Card */
        .subjects-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .subject-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
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

        .subject-item:hover {
          transform: translateX(5px);
          border-color: #3b82f6;
        }

        .subject-item.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .subject-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subject-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .subject-details h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .subject-details p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
        }

        .subject-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: #22c55e;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        .arrow {
          color: #94a3b8;
        }

        .subject-item:hover .arrow {
          transform: translateX(5px);
          color: #3b82f6;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
        }

        .empty-icon {
          margin-bottom: 16px;
        }

        /* Materials Card */
        .materials-card {
          margin-top: 24px;
        }

        /* Deadlines Card */
        .deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 3px solid;
        }

        .deadline-item.priority-high {
          border-left-color: #ef4444;
        }

        .deadline-item.priority-medium {
          border-left-color: #f59e0b;
        }

        .deadline-item.priority-low {
          border-left-color: #22c55e;
        }

        .deadline-indicator {
          width: 4px;
          height: 4px;
          border-radius: 2px;
        }

        .deadline-content {
          flex: 1;
        }

        .deadline-content h4 {
          font-size: 0.95rem;
          font-weight: 500;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .deadline-content p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0 0 4px 0;
        }

        .deadline-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .deadline-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        /* Grades Card */
        .grades-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .grade-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .grade-subject {
          width: 100px;
        }

        .grade-subject span {
          display: block;
          font-size: 0.9rem;
          color: #1e293b;
          font-weight: 500;
        }

        .grade-score {
          font-size: 0.7rem;
          color: #64748b;
        }

        .grade-bar {
          flex: 1;
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .grade-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .grade-letter {
          width: 30px;
          font-weight: 600;
          color: #1e293b;
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 24px;
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
          gap: 6px;
          transition: all 0.3s ease;
        }

        .quick-action:hover {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Quote Section */
        .quote-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 20px;
          margin-top: 32px;
        }

        .quote-icon {
          color: #f59e0b;
        }

        .quote-text {
          font-size: 1.1rem;
          color: #1e293b;
          font-style: italic;
          margin: 0;
        }

        .quote-author {
          font-size: 0.9rem;
          color: #64748b;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .welcome-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-pills {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .welcome-left {
            flex-direction: column;
            width: 100%;
          }

          .greeting-card {
            width: 100%;
          }

          .weather-card {
            width: 100%;
            justify-content: center;
          }

          .stats-pills {
            flex-direction: column;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .quote-section {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;