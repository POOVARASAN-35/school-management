import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Award,
  Target,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Save
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AttendanceReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'pie', 'doughnut'
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'semester', 'year'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    avgPresent: 0,
    avgAbsent: 0,
    bestDay: '',
    worstDay: '',
    trend: 0
  });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    loadGraph();
    loadSubjects();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      calculateStats();
    }
  }, [data]);

  const loadGraph = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        subjectId: selectedSubject !== 'all' ? selectedSubject : ''
      });
      
      const res = await api.get(`/attendance/graph?${params}`);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to load attendance data');
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await api.get("/attendance/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed to load subjects");
    }
  };

  const loadComparison = async () => {
    try {
      const lastPeriodStart = new Date(dateRange.start);
      lastPeriodStart.setDate(lastPeriodStart.getDate() - 30);
      const lastPeriodEnd = new Date(dateRange.end);
      lastPeriodEnd.setDate(lastPeriodEnd.getDate() - 30);

      const params = new URLSearchParams({
        startDate: lastPeriodStart.toISOString().split('T')[0],
        endDate: lastPeriodEnd.toISOString().split('T')[0],
        subjectId: selectedSubject !== 'all' ? selectedSubject : ''
      });

      const res = await api.get(`/attendance/graph?${params}`);
      setComparisonData(res.data);
    } catch (error) {
      console.error("Failed to load comparison data");
    }
  };

  const calculateStats = () => {
    const totalClasses = data.length;
    const avgPresent = data.reduce((acc, d) => acc + d.present, 0) / totalClasses || 0;
    const avgAbsent = data.reduce((acc, d) => acc + d.absent, 0) / totalClasses || 0;
    
    const bestDay = data.reduce((best, current) => 
      (current.present / (current.present + current.absent) > (best.present / (best.present + best.absent) || 0)) ? current : best
    , data[0] || {});
    
    const worstDay = data.reduce((worst, current) => 
      (current.present / (current.present + current.absent) < (worst.present / (worst.present + worst.absent) || 1)) ? current : worst
    , data[0] || {});

    // Calculate trend (comparing first half vs second half)
    const halfIndex = Math.floor(data.length / 2);
    const firstHalfAvg = data.slice(0, halfIndex).reduce((acc, d) => acc + d.present, 0) / halfIndex || 0;
    const secondHalfAvg = data.slice(halfIndex).reduce((acc, d) => acc + d.present, 0) / (data.length - halfIndex) || 0;
    const trend = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100) || 0;

    setStats({
      totalClasses,
      avgPresent: Math.round(avgPresent),
      avgAbsent: Math.round(avgAbsent),
      bestDay: bestDay._id ? new Date(bestDay._id).toLocaleDateString() : 'N/A',
      worstDay: worstDay._id ? new Date(worstDay._id).toLocaleDateString() : 'N/A',
      trend: Math.round(trend * 10) / 10
    });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleExport = (format) => {
    setShowExportMenu(false);
    showNotification('success', `Exporting as ${format.toUpperCase()}...`);
    // Implement actual export logic here
  };

  const chartData = {
    labels: data.map(d => new Date(d._id).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: timeRange === 'week' ? 'short' : undefined
    })),
    datasets: [
      {
        label: "Present",
        data: data.map(d => d.present),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "#22c55e",
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        tension: 0.4,
        fill: chartType === 'line' ? 'origin' : false
      },
      {
        label: "Absent",
        data: data.map(d => d.absent),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "#ef4444",
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        tension: 0.4,
        fill: chartType === 'line' ? 'origin' : false
      }
    ]
  };

  const pieChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [
          data.reduce((acc, d) => acc + d.present, 0),
          data.reduce((acc, d) => acc + d.absent, 0)
        ],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false
        },
        ticks: {
          stepSize: 5,
          color: '#64748b'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading attendance analytics...</p>
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
    <div className="attendance-report">
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
            <BarChart3 size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Attendance Analytics</h1>
            <p className="page-subtitle">Comprehensive insights into student attendance patterns</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={() => {
              loadGraph();
              loadComparison();
            }}
          >
            <RefreshCw size={18} />
          </button>
          <div className="export-dropdown">
            <button 
              className="export-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={18} />
              <span>Export</span>
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={() => handleExport('png')}>PNG Image</button>
                <button onClick={() => handleExport('pdf')}>PDF Report</button>
                <button onClick={() => handleExport('csv')}>CSV Data</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="filter-item">
            <Calendar size={16} className="filter-icon" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="date-input"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="date-input"
            />
          </div>

          <div className="filter-item">
            <Filter size={16} className="filter-icon" />
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <Clock size={16} className="filter-icon" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="filter-select"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="semester">This Semester</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <button className="apply-btn" onClick={loadGraph}>
            Apply Filters
          </button>
        </div>

        <div className="chart-type-toggle">
          <button 
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            <BarChart3 size={16} />
          </button>
          <button 
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
          >
            <LineChart size={16} />
          </button>
          <button 
            className={`chart-type-btn ${chartType === 'pie' ? 'active' : ''}`}
            onClick={() => setChartType('pie')}
          >
            <PieChart size={16} />
          </button>
          <button 
            className={`chart-type-btn ${chartType === 'doughnut' ? 'active' : ''}`}
            onClick={() => setChartType('doughnut')}
          >
            <Activity size={16} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Classes</span>
            <span className="stat-value">{stats.totalClasses}</span>
            <span className="stat-period">In selected period</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <UserCheck size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Avg. Present</span>
            <span className="stat-value">{stats.avgPresent}</span>
            <span className="stat-percentage">
              {((stats.avgPresent / (stats.avgPresent + stats.avgAbsent)) * 100 || 0).toFixed(1)}% of class
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <UserX size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Avg. Absent</span>
            <span className="stat-value">{stats.avgAbsent}</span>
            <span className="stat-percentage">
              {((stats.avgAbsent / (stats.avgPresent + stats.avgAbsent)) * 100 || 0).toFixed(1)}% of class
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className={`stat-icon ${stats.trend >= 0 ? 'green' : 'red'}`}>
            {stats.trend >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div className="stat-details">
            <span className="stat-label">Attendance Trend</span>
            <span className={`stat-value ${stats.trend >= 0 ? 'positive' : 'negative'}`}>
              {stats.trend > 0 ? '+' : ''}{stats.trend}%
            </span>
            <span className="stat-period">Compared to previous period</span>
          </div>
        </div>
      </div>

      {/* Best/Worst Cards */}
      <div className="insight-cards">
        <div className="insight-card best">
          <Award size={20} className="insight-icon" />
          <div className="insight-content">
            <span className="insight-label">Best Attendance Day</span>
            <span className="insight-value">{stats.bestDay}</span>
            {stats.bestDay !== 'N/A' && (
              <span className="insight-detail">
                {data.find(d => new Date(d._id).toLocaleDateString() === stats.bestDay)?.present || 0} students present
              </span>
            )}
          </div>
        </div>

        <div className="insight-card worst">
          <AlertCircle size={20} className="insight-icon" />
          <div className="insight-content">
            <span className="insight-label">Needs Improvement</span>
            <span className="insight-value">{stats.worstDay}</span>
            {stats.worstDay !== 'N/A' && (
              <span className="insight-detail">
                {data.find(d => new Date(d._id).toLocaleDateString() === stats.worstDay)?.absent || 0} students absent
              </span>
            )}
          </div>
        </div>

        <div className="insight-card target">
          <Target size={20} className="insight-icon" />
          <div className="insight-content">
            <span className="insight-label">Target Achievement</span>
            <span className="insight-value">
              {((stats.avgPresent / (stats.avgPresent + stats.avgAbsent)) * 100 || 0).toFixed(1)}%
            </span>
            <span className="insight-detail">of 85% target</span>
          </div>
          <div className="target-progress">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min(((stats.avgPresent / (stats.avgPresent + stats.avgAbsent)) * 100 || 0), 100)}%`,
                backgroundColor: ((stats.avgPresent / (stats.avgPresent + stats.avgAbsent)) * 100 || 0) >= 85 ? '#22c55e' : '#f59e0b'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>Attendance Overview</h3>
          <div className="chart-legend-custom">
            <div className="legend-item">
              <span className="legend-color present"></span>
              <span>Present</span>
            </div>
            <div className="legend-item">
              <span className="legend-color absent"></span>
              <span>Absent</span>
            </div>
          </div>
        </div>
        
        <div className="chart-wrapper">
          {chartType === 'bar' && <Bar data={chartData} options={options} />}
          {chartType === 'line' && <Line data={chartData} options={options} />}
          {(chartType === 'pie' || chartType === 'doughnut') && (
            <div style={{ height: '400px', display: 'flex', justifyContent: 'center' }}>
              {chartType === 'pie' && <Pie data={pieChartData} options={{...options, maintainAspectRatio: false}} />}
              {chartType === 'doughnut' && <Doughnut data={pieChartData} options={{...options, maintainAspectRatio: false}} />}
            </div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      {data.length > 0 && (
        <div className="summary-table-container">
          <div className="table-header">
            <h3>Daily Breakdown</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Total</th>
                <th>Attendance %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 7).map((day) => {
                const total = day.present + day.absent;
                const percentage = ((day.present / total) * 100).toFixed(1);
                const status = percentage >= 85 ? 'Good' : percentage >= 70 ? 'Average' : 'Poor';
                const statusColor = percentage >= 85 ? '#22c55e' : percentage >= 70 ? '#f59e0b' : '#ef4444';
                
                return (
                  <tr key={day._id}>
                    <td>{new Date(day._id).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                    <td className="present-cell">{day.present}</td>
                    <td className="absent-cell">{day.absent}</td>
                    <td>{total}</td>
                    <td>
                      <div className="percentage-cell">
                        <div className="mini-progress">
                          <div 
                            className="progress-fill"
                            style={{ width: `${percentage}%`, backgroundColor: statusColor }}
                          ></div>
                        </div>
                        <span>{percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                          borderColor: statusColor
                        }}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Insights */}
      <div className="quick-insights">
        <div className="insight-card pattern">
          <Sparkles size={18} className="insight-icon" />
          <div className="insight-content">
            <h4>Attendance Pattern</h4>
            <p>
              {stats.trend > 5 ? 'Attendance is improving significantly' :
               stats.trend > 0 ? 'Attendance is slightly improving' :
               stats.trend > -5 ? 'Attendance is stable' :
               'Attendance needs attention'}
            </p>
          </div>
        </div>

        <div className="insight-card recommendation">
          <Zap size={18} className="insight-icon" />
          <div className="insight-content">
            <h4>Recommendation</h4>
            <p>
              {stats.avgAbsent > stats.avgPresent * 0.2 ?
                'Consider implementing attendance incentives' :
                stats.avgAbsent > stats.avgPresent * 0.1 ?
                'Monitor absent students closely' :
                'Great attendance! Keep up the good work'}
            </p>
          </div>
        </div>
      </div>

      {/* Internal CSS */}
      <style>{`
        .attendance-report {
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

        .header-actions {
          display: flex;
          gap: 12px;
          position: relative;
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
          transform: rotate(180deg);
        }

        .export-btn:hover {
          border-color: #10b981;
          color: #10b981;
        }

        .export-dropdown {
          position: relative;
        }

        .export-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          min-width: 140px;
          z-index: 100;
        }

        .export-menu button {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          color: #475569;
        }

        .export-menu button:hover {
          background: #f1f5f9;
          color: #3b82f6;
        }

        /* Filter Bar */
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filter-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .filter-icon {
          color: #94a3b8;
        }

        .date-input {
          padding: 6px 8px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .date-separator {
          color: #64748b;
        }

        .filter-select {
          padding: 6px 24px 6px 8px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
        }

        .apply-btn {
          padding: 6px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .apply-btn:hover {
          background: #2563eb;
        }

        .chart-type-toggle {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #f1f5f9;
          border-radius: 10px;
        }

        .chart-type-btn {
          padding: 8px 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .chart-type-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
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

        .stat-icon.red {
          background: #fee2e2;
          color: #ef4444;
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
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .stat-value.positive {
          color: #22c55e;
        }

        .stat-value.negative {
          color: #ef4444;
        }

        .stat-period {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .stat-percentage {
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Insight Cards */
        .insight-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .insight-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .insight-card.best {
          border-left: 4px solid #22c55e;
        }

        .insight-card.worst {
          border-left: 4px solid #ef4444;
        }

        .insight-card.target {
          border-left: 4px solid #3b82f6;
        }

        .insight-icon {
          color: #64748b;
        }

        .insight-content {
          flex: 1;
        }

        .insight-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .insight-value {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .insight-detail {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .target-progress {
          width: 60px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        /* Chart Container */
        .chart-container {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .chart-legend-custom {
          display: flex;
          gap: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #64748b;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 4px;
        }

        .legend-color.present {
          background: #22c55e;
        }

        .legend-color.absent {
          background: #ef4444;
        }

        .chart-wrapper {
          height: 400px;
        }

        /* Summary Table */
        .summary-table-container {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .table-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .view-all-btn {
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
        }

        .summary-table {
          width: 100%;
          border-collapse: collapse;
        }

        .summary-table th {
          text-align: left;
          padding: 12px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .summary-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .present-cell {
          color: #22c55e;
          font-weight: 600;
        }

        .absent-cell {
          color: #ef4444;
          font-weight: 600;
        }

        .percentage-cell {
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

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid;
        }

        /* Quick Insights */
        .quick-insights {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .insight-card.pattern {
          border-left: 4px solid #8b5cf6;
        }

        .insight-card.recommendation {
          border-left: 4px solid #f59e0b;
        }

        .insight-card h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .insight-card p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid,
          .insight-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-group {
            width: 100%;
          }

          .filter-item {
            width: 100%;
          }

          .date-input,
          .filter-select {
            flex: 1;
          }

          .stats-grid,
          .insight-cards,
          .quick-insights {
            grid-template-columns: 1fr;
          }

          .summary-table {
            font-size: 0.85rem;
          }

          .summary-table th:nth-child(3),
          .summary-table td:nth-child(3),
          .summary-table th:nth-child(5),
          .summary-table td:nth-child(5) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceReport;