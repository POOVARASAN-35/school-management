import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BookMarked, 
  UserPlus, 
  UserCheck, 
  FileText, 
  Eye, 
  BarChart3,
  GraduationCap,
  CalendarCheck,
  Upload,
  FileQuestion,
  ClipboardList,
  FolderOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getIcon = (name) => {
    const icons = {
      "Dashboard": <LayoutDashboard size={20} />,
      "Users": <Users size={20} />,
      "Courses": <BookOpen size={20} />,
      "Subjects": <BookMarked size={20} />,
      "Assign Staff": <UserPlus size={20} />,
      "Enroll Students": <UserCheck size={20} />,
      "Create Exam": <FileText size={20} />,
      "View Exams": <Eye size={20} />,
      "Reports": <BarChart3 size={20} />,
      "Students": <GraduationCap size={20} />,
      "Attendance": <CalendarCheck size={20} />,
      "Attendance Report": <CalendarCheck size={20} />,
      "Upload Materials": <Upload size={20} />,
      "Upload Question Paper": <FileQuestion size={20} />,
      "Exams": <ClipboardList size={20} />,
      "My Subjects": <BookMarked size={20} />,
      "Materials": <FolderOpen size={20} />,
      "Results": <Award size={20} />
    };
    return icons[name] || <LayoutDashboard size={20} />;
  };

  const menus = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Users", path: "/admin/users" },
      { name: "Courses", path: "/admin/courses" },
      { name: "Subjects", path: "/admin/subjects" },
      { name: "Assign Staff", path: "/admin/assign-staff" },
      { name: "Enroll Students", path: "/admin/enroll-students" },
      { name: "Create Exam", path: "/admin/create-exam" },
      { name: "View Exams", path: "/admin/exams" },
      { name: "Reports", path: "/admin/reports" },
    ],
    staff: [
      { name: "Dashboard", path: "/staff/dashboard" },
      { name: "Students", path: "/staff/students" },
      { name: "Attendance", path: "/staff/attendance" },
      { name: "Attendance Report", path: "/staff/attendance-report" },
      { name: "Upload Materials", path: "/staff/upload-materials" },
      { name: "Upload Question Paper", path: "/staff/upload-question-paper" },
      { name: "Create Exam", path: "/staff/create-exam" },
    ],
    student: [
      { name: "Dashboard", path: "/student/dashboard" },
      { name: "My Subjects", path: "/student/subjects" },
      { name: "Materials", path: "/student/materials" },
      { name: "Exams", path: "/student/exams" },
      { name: "Results", path: "/student/results" },
    ],
  };

  const closeMobileMenu = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Debug log
  console.log('Sidebar render:', { isMobile, isMobileOpen, collapsed });

  return (
    <>
      {/* Overlay for mobile - show when menu is open */}
      {isMobile && isMobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile ? 'mobile' : ''} ${isMobileOpen ? 'open' : ''} ${collapsed && !isMobile ? 'collapsed' : ''}`}>
        {/* Desktop Collapse Toggle - Only show on desktop */}
        {!isMobile && (
          <button 
            className="collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}

        {/* Logo Section */}
        <div className={`sidebar-header ${collapsed && !isMobile ? 'collapsed' : ''}`}>
          <div className="logo-wrapper">
            <div className="logo-icon">
              <GraduationCap size={collapsed && !isMobile ? 24 : 28} />
            </div>
            {(!collapsed || isMobile) && (
              <div className="logo-text">
                <h1>EduManager</h1>
                <p>Learning Management</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className={`user-info ${collapsed && !isMobile ? 'collapsed' : ''}`}>
          <div className={`user-card role-${user?.role}`}>
            {(!collapsed || isMobile) ? (
              <>
                <p className="user-label">Logged in as</p>
                <p className="user-name">{user?.name || "User Name"}</p>
                <p className="user-email">{user?.email || "user@example.com"}</p>
                <p className={`user-role-badge role-${user?.role}`}>
                  {user?.role}
                </p>
              </>
            ) : (
              <div className="user-avatar">
                <span>{user?.role?.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menus[user?.role]?.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''} ${collapsed && !isMobile ? 'collapsed' : ''}`
              }
              style={{ '--index': index }}
            >
              <span className="nav-icon">{getIcon(item.name)}</span>
              {(!collapsed || isMobile) && <span className="nav-text">{item.name}</span>}
              {collapsed && !isMobile && <span className="nav-tooltip">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button 
            onClick={() => {
              logout();
              closeMobileMenu();
            }}
            className={`logout-btn ${collapsed && !isMobile ? 'collapsed' : ''}`}
          >
            <LogOut size={20} />
            {(!collapsed || isMobile) && <span>Logout</span>}
            {collapsed && !isMobile && <span className="nav-tooltip">Logout</span>}
          </button>
        </div>
      </div>

      <style>{`
        .sidebar {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #1a1c2c 0%, #2d3748 100%);
          color: white;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          transition: width 0.3s ease, left 0.3s ease;
          width: 280px; /* Fixed width for desktop */
        }

        /* Desktop collapsed state */
        .sidebar.collapsed {
          width: 80px;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .sidebar.mobile {
            position: fixed;
            top: 60px;
            left: -280px; /* Hidden by default */
            width: 280px;
            height: calc(100vh - 60px);
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
          }

          .sidebar.mobile.open {
            left: 0; /* Show when open */
          }
        }

        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Collapse Toggle */
        .collapse-toggle {
          position: absolute;
          top: 20px;
          right: -12px;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .collapse-toggle:hover {
          transform: scale(1.1);
        }

        /* Custom Scrollbar */
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }

        /* Header Styles */
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-header.collapsed {
          padding: 20px 0;
          text-align: center;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-header.collapsed .logo-wrapper {
          justify-content: center;
        }

        .logo-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .logo-text {
          overflow: hidden;
        }

        .logo-text h1 {
          font-size: 1.25rem;
          font-weight: bold;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          white-space: nowrap;
        }

        .logo-text p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          white-space: nowrap;
        }

        /* User Info Styles */
        .user-info {
          padding: 20px;
        }

        .user-info.collapsed {
          padding: 20px 0;
          text-align: center;
        }

        .user-card {
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .user-card.role-admin {
          background: linear-gradient(135deg, rgba(128, 90, 213, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%);
        }

        .user-card.role-staff {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%);
        }

        .user-card.role-student {
          background: linear-gradient(135deg, rgba(5, 150, 105, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%);
        }

        .user-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 4px 0;
        }

        .user-name {
          font-weight: 600;
          margin: 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role-badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 0.75rem;
          color: white;
          border-radius: 20px;
          font-weight: 600;
          margin-top: 6px;
          width: fit-content;
        }

        .role-admin {
          background-color: #ff4d4f;
        }

        .role-staff {
          background-color: #1890ff;
        }

        .role-student {
          background-color: #52c41a;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-weight: bold;
          font-size: 1.2rem;
        }

        /* Navigation Styles */
        .sidebar-nav {
          flex: 1;
          padding: 20px 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 4px;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-item:hover::before {
          left: 100%;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateX(5px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .nav-item.collapsed {
          justify-content: center;
          padding: 12px 0;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
        }

        .nav-text {
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-tooltip {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: #2d3748;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          white-space: nowrap;
          margin-left: 10px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }

        .nav-item:hover .nav-tooltip,
        .logout-btn:hover .nav-tooltip {
          opacity: 1;
          visibility: visible;
          left: 100%;
        }

        /* Footer Styles */
        .sidebar-footer {
          padding: 20px 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 99, 132, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .logout-btn:hover::before {
          left: 100%;
        }

        .logout-btn:hover {
          background: rgba(255, 99, 132, 0.1);
          color: #ff6384;
          transform: translateX(5px);
        }

        .logout-btn.collapsed {
          justify-content: center;
          padding: 12px 0;
        }

        /* Animation for menu items */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .nav-item {
          animation: slideIn 0.3s ease forwards;
          animation-delay: calc(var(--index) * 0.05s);
        }
      `}</style>
    </>
  );
};

export default Sidebar;