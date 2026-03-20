import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Bell, Sun, Moon, LogOut, Menu, X } from "lucide-react";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout, user } = useAuth();
  const { dark, setDark } = useTheme();
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

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  // Get user name, handle if it's a student with number
  const getUserDisplayName = () => {
    if (!user?.name) return 'User';
    // If the name contains "student", format it nicely
    if (user.name.toLowerCase().includes('student')) {
      const parts = user.name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1]}`;
      }
    }
    return user.name;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle" 
          onClick={handleToggleSidebar}
          aria-label="Toggle menu"
        >
          {isMobile && isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="welcome-section">
          <h2 className="welcome-text">
            Welcome back, <span className="user-name">{getUserDisplayName()}</span>!
          </h2>
          <p className="welcome-subtitle">Here's what's happening with your dashboard today.</p>
        </div>
      </div>

      <div className="navbar-right">
        <button 
          className="theme-toggle" 
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="notification-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-badge">3</span>
        </button>

        <button className="logout-btn" onClick={logout} aria-label="Logout">
          <LogOut size={18} />
          {!isMobile && <span>Logout</span>}
        </button>
      </div>

      <style>{`
        .navbar {
          height: 70px;
          background: ${dark ? 'rgba(26, 28, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.6)'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .menu-toggle {
          display: none;
          padding: 8px;
          border: 1px solid ${dark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'};
          border-radius: 10px;
          background: ${dark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
          color: ${dark ? 'rgba(255, 255, 255, 0.8)' : '#475569'};
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .menu-toggle:hover {
          background: ${dark ? 'rgba(102, 126, 234, 0.2)' : '#f8fafc'};
          color: #4f46e5;
          border-color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.2);
        }

        .welcome-section {
          display: flex;
          flex-direction: column;
        }

        .welcome-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: ${dark ? 'white' : '#1e293b'};
          margin: 0;
          padding-top: 30px;
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        .user-name {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .welcome-subtitle {
          font-size: 0.85rem;
          color: ${dark ? 'rgba(255, 255, 255, 0.6)' : '#64748b'};
          margin: 0;
          transition: color 0.3s ease;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
            height: 60px;
          }

          .menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
          }

          .welcome-text {
            font-size: 0.9rem;
            white-space: normal;
            word-break: keep-all;
          }

          .welcome-subtitle {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .welcome-text {
            font-size: 0.85rem;
          }
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .navbar-right {
            gap: 8px;
          }
        }

        .theme-toggle,
        .notification-btn {
          width: 40px;
          height: 40px;
          border: 1px solid ${dark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'};
          border-radius: 12px;
          background: ${dark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
          color: ${dark ? 'rgba(255, 255, 255, 0.8)' : '#475569'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        @media (max-width: 480px) {
          .theme-toggle,
          .notification-btn {
            width: 36px;
            height: 36px;
          }
        }

        .theme-toggle:hover,
        .notification-btn:hover {
          background: ${dark ? 'rgba(102, 126, 234, 0.2)' : '#f8fafc'};
          color: #4f46e5;
          border-color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.2);
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
          font-weight: 600;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid ${dark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'};
          border-radius: 12px;
          background: ${dark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
          color: #ef4444;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .logout-btn {
            padding: 8px 12px;
          }
          
          .logout-btn span {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .logout-btn {
            padding: 8px;
          }
        }

        .logout-btn:hover {
          background: ${dark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2'};
          border-color: #ef4444;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(239, 68, 68, 0.2);
        }

        /* Animation for menu button */
        .menu-toggle svg {
          transition: transform 0.3s ease;
        }

        .menu-toggle:hover svg {
          transform: rotate(90deg);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;