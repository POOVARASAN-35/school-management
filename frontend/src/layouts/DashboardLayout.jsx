import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Animated Background Elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Sidebar - Fixed position */}
      <div className="sidebar-wrapper">
        <Sidebar 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
      </div>

      {/* Main Content Area */}
      <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isMobileSidebarOpen}
        />
        
        <main className="content-area" onClick={closeMobileSidebar}>
          <div className="content-container">
        
            {/* Dynamic Content */}
            <div className="outlet-container">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <p>© 2024 EduManager. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#help">Help Center</a>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          position: relative;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }

        /* Animated Background Shapes */
        .background-shapes {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 50%;
          filter: blur(60px);
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 500px;
          height: 500px;
          top: -250px;
          right: -100px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          bottom: -200px;
          left: -100px;
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          animation-delay: -5s;
        }

        .shape-3 {
          width: 300px;
          height: 300px;
          top: 30%;
          left: 40%;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
          animation-delay: -10s;
        }

        .shape-4 {
          width: 600px;
          height: 600px;
          bottom: -300px;
          right: -200px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
          animation-delay: -15s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(50px, 50px) rotate(90deg); }
          50% { transform: translate(0, 100px) rotate(180deg); }
          75% { transform: translate(-50px, 50px) rotate(270deg); }
        }

        /* Sidebar Wrapper */
        .sidebar-wrapper {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 280px;
          z-index: 100;
          transition: width 0.3s ease;
        }

        .sidebar-wrapper :global(.sidebar.collapsed) {
          width: 80px;
        }

        /* Main Wrapper */
        .main-wrapper {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
          z-index: 10;
          width: calc(100% - 280px);
        }

        .main-wrapper.collapsed {
          margin-left: 80px;
          width: calc(100% - 80px);
        }

        /* Content Area */
        .content-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .content-container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.7);
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(102, 126, 234, 0.1);
        }

        .page-title h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-title p {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        .page-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          border-color: #4f46e5;
          color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.2);
        }

        .action-btn svg {
          transition: transform 0.3s ease;
        }

        .action-btn:hover svg {
          transform: rotate(180deg);
        }

        /* Outlet Container */
        .outlet-container {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Footer */
        .dashboard-footer {
          padding: 16px 24px;
          background: transparent;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #64748b;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-links a {
          color: #64748b;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .footer-links a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .footer-links a:hover {
          color: #4f46e5;
        }

        .footer-links a:hover::after {
          width: 100%;
        }

        /* Scrollbar Styling */
        .content-area::-webkit-scrollbar {
          width: 8px;
        }

        .content-area::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .content-area::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .main-wrapper {
            margin-left: 80px;
            width: calc(100% - 80px);
          }
        }

        @media (max-width: 768px) {
          .sidebar-wrapper {
            width: 0;
          }

          .main-wrapper {
            margin-left: 0 !important;
            width: 100% !important;
          }

          .content-area {
            padding: 16px;
          }

          .content-container {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .page-title h1 {
            font-size: 1.5rem;
          }

          .page-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .footer-content {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .footer-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .page-actions {
            flex-wrap: wrap;
          }

          .action-btn {
            flex: 1;
            justify-content: center;
          }
        }

        /* Card Styles for Content */
        :global(.dashboard-card) {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
          height: 100%;
        }

        :global(.dashboard-card:hover) {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(79, 70, 229, 0.1);
          border-color: rgba(79, 70, 229, 0.3);
        }

        /* Grid Layout */
        :global(.dashboard-grid) {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          :global(.dashboard-grid) {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;