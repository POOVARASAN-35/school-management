import React, { useState, useEffect } from "react";
import { BarChart, DoughnutChart } from "../../components/DashboardChart";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardList,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  MoreVertical,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const barData = {
    labels: ["Mathematics", "Science", "English", "Computer Science", "History", "Physics"],
    datasets: [
      {
        label: "Students Enrolled",
        data: [120, 90, 75, 60, 45, 55],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(6, 182, 212, 0.8)",
        ],
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Students", "Teachers", "Courses", "Exams"],
    datasets: [
      {
        data: [1250, 85, 45, 28],
        backgroundColor: [
          "rgba(59, 130, 246, 0.9)",
          "rgba(16, 185, 129, 0.9)",
          "rgba(245, 158, 11, 0.9)",
          "rgba(139, 92, 246, 0.9)",
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const stats = [
    {
      title: "Total Students",
      value: "1,250",
      change: "+12.5%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Staff",
      value: "85",
      change: "+4.3%",
      icon: GraduationCap,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Active Courses",
      value: "45",
      change: "+8.1%",
      icon: BookOpen,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Upcoming Exams",
      value: "28",
      change: "+2.4%",
      icon: ClipboardList,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const recentActivities = [
    { id: 1, action: "New student enrolled", user: "John Doe", time: "5 minutes ago", status: "success" },
    { id: 2, action: "Exam schedule updated", user: "Admin", time: "1 hour ago", status: "info" },
    { id: 3, action: "Course material uploaded", user: "Dr. Smith", time: "3 hours ago", status: "warning" },
    { id: 4, action: "Attendance recorded", user: "Class 10A", time: "5 hours ago", status: "success" },
    { id: 5, action: "Result published", user: "Class 12", time: "1 day ago", status: "info" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Mathematics Exam", date: "2024-03-25", time: "10:00 AM", students: 120 },
    { id: 2, title: "Science Practical", date: "2024-03-26", time: "2:00 PM", students: 85 },
    { id: 3, title: "Staff Meeting", date: "2024-03-27", time: "11:00 AM", participants: 45 },
    { id: 4, title: "Parent-Teacher Meeting", date: "2024-03-28", time: "3:00 PM", participants: 200 },
  ];

  const getStatusColor = (status) => {
    const colors = {
      success: "bg-emerald-500",
      info: "bg-blue-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
    };
    return colors[status] || colors.info;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
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
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your institution today.</p>
        </div>
        
        <div className="header-right">
          <div className="time-range-selector">
            <button 
              className={`time-btn ${timeRange === 'day' ? 'active' : ''}`}
              onClick={() => setTimeRange('day')}
            >
              Day
            </button>
            <button 
              className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
          
          <button className="action-btn">
            <Download size={18} />
            <span>Export</span>
          </button>
          
          <button className="action-btn refresh-btn">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-content">
                <div className={`stat-icon-wrapper ${stat.bgColor}`}>
                  <Icon className={`stat-icon ${stat.iconColor}`} size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`stat-progress bg-gradient-to-r ${stat.color}`} style={{ width: '75%' }}></div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card main-chart">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Course Enrollment Overview</h3>
              <p>Number of students enrolled per course</p>
            </div>
            <button className="more-btn">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="chart-container">
            <BarChart data={barData} />
          </div>
        </div>

        <div className="chart-card doughnut-chart">
          <div className="chart-header">
            <div className="chart-title">
              <h3>System Distribution</h3>
              <p>Overall institution statistics</p>
            </div>
            <button className="more-btn">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="chart-container">
            <DoughnutChart data={doughnutData} />
          </div>
          <div className="chart-legend">
            {doughnutData.labels.map((label, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }}></span>
                <span className="legend-label">{label}</span>
                <span className="legend-value">{doughnutData.datasets[0].data[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="activity-section">
        {/* Recent Activities */}
        <div className="activity-card">
          <div className="card-header">
            <div className="header-title">
              <TrendingUp size={20} className="header-icon" />
              <h3>Recent Activities</h3>
            </div>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-status ${getStatusColor(activity.status)}`}></div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-meta">
                    <span className="activity-user">{activity.user}</span>
                    <span className="activity-time">{activity.time}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="events-card">
          <div className="card-header">
            <div className="header-title">
              <Calendar size={20} className="header-icon" />
              <h3>Upcoming Events</h3>
            </div>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-date">
                  <span className="event-day">{new Date(event.date).getDate()}</span>
                  <span className="event-month">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="event-details">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-time">
                    <Clock size={14} />
                    {event.time}
                  </p>
                  <p className="event-participants">
                    {event.students ? `${event.students} Students` : `${event.participants} Participants`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-card">
          <div className="card-header">
            <div className="header-title">
              <Award size={20} className="header-icon" />
              <h3>Quick Stats</h3>
            </div>
          </div>
          
          <div className="quick-stats-list">
            <div className="quick-stat-item">
              <div className="quick-stat-label">
                <span>Attendance Rate</span>
                <span className="quick-stat-percent">94%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '94%' }}></div>
              </div>
            </div>
            
            <div className="quick-stat-item">
              <div className="quick-stat-label">
                <span>Pass Rate</span>
                <span className="quick-stat-percent">87%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '87%' }}></div>
              </div>
            </div>
            
            <div className="quick-stat-item">
              <div className="quick-stat-label">
                <span>Course Completion</span>
                <span className="quick-stat-percent">78%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div className="quick-stat-item">
              <div className="quick-stat-label">
                <span>Teacher Satisfaction</span>
                <span className="quick-stat-percent">92%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>

          <div className="quick-stats-footer">
            <div className="footer-stat">
              <span className="footer-stat-label">Active Users</span>
              <span className="footer-stat-value">1,245</span>
            </div>
            <div className="footer-stat">
              <span className="footer-stat-label">New This Week</span>
              <span className="footer-stat-value">+48</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS */}
      <style>{`
        .admin-dashboard {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* Header Styles */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .time-range-selector {
          display: flex;
          gap: 8px;
          background: #f8fafc;
          padding: 4px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .time-btn {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .time-btn:hover {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }

        .time-btn.active {
          background: #3b82f6;
          color: white;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
        }

        .refresh-btn {
          padding: 8px;
        }

        .refresh-btn:hover svg {
          animation: spin 1s linear;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: slideUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon {
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1);
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

        .stat-change {
          font-size: 0.85rem;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 20px;
          background: #f1f5f9;
        }

        .stat-change.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .stat-change.negative {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .stat-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          border-radius: 0 0 0 20px;
          transition: width 1s ease;
        }

        /* Charts Section */
        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          box-shadow: 0 20px 30px rgba(59, 130, 246, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .chart-title h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .chart-title p {
          color: #64748b;
          font-size: 0.85rem;
          margin: 0;
        }

        .more-btn {
          padding: 8px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .more-btn:hover {
          background: #f1f5f9;
          color: #3b82f6;
        }

        .chart-container {
          height: 300px;
          margin-bottom: 16px;
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
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 4px;
        }

        .legend-label {
          color: #475569;
          font-size: 0.9rem;
        }

        .legend-value {
          color: #1e293b;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Activity Section */
        .activity-section {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }

        .activity-card,
        .events-card,
        .quick-stats-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-icon {
          color: #3b82f6;
        }

        .header-title h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .view-all-btn {
          padding: 6px 12px;
          border: none;
          background: #f1f5f9;
          color: #3b82f6;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background: #3b82f6;
          color: white;
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: #f8fafc;
        }

        .activity-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
        }

        .activity-content {
          flex: 1;
        }

        .activity-action {
          color: #1e293b;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .activity-meta {
          display: flex;
          gap: 12px;
          color: #64748b;
          font-size: 0.85rem;
        }

        /* Events List */
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .event-item {
          display: flex;
          gap: 16px;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .event-item:hover {
          background: #f8fafc;
          transform: translateX(5px);
        }

        .event-date {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .event-day {
          font-size: 1.2rem;
          font-weight: 700;
          color: #3b82f6;
          line-height: 1;
        }

        .event-month {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .event-details {
          flex: 1;
        }

        .event-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .event-time,
        .event-participants {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.85rem;
          margin: 2px 0;
        }

        /* Quick Stats */
        .quick-stats-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .quick-stat-item {
          width: 100%;
        }

        .quick-stat-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          color: #475569;
          font-size: 0.9rem;
        }

        .quick-stat-percent {
          font-weight: 600;
          color: #3b82f6;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 4px;
          transition: width 1s ease;
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .quick-stats-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .footer-stat {
          text-align: center;
        }

        .footer-stat-label {
          display: block;
          color: #64748b;
          font-size: 0.8rem;
          margin-bottom: 4px;
        }

        .footer-stat-value {
          display: block;
          color: #1e293b;
          font-weight: 600;
          font-size: 1.1rem;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .activity-section {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-right {
            width: 100%;
            flex-wrap: wrap;
          }
          
          .activity-section {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .admin-dashboard {
            padding: 16px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;