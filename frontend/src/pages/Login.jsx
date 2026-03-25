import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  Award,
  Shield,
  ChevronRight
} from "lucide-react";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userType, setUserType] = useState("student"); // 'student' or 'staff'
  const [mounted, setMounted] = useState(false);

  // Auto redirect after login / refresh
  useEffect(() => {
    if (user?.role === "staff") {
      navigate("/staff/dashboard", { replace: true });
    }
    if (user?.role === "student") {
      navigate("/student/dashboard", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/admin-login",{
        email,
        password,
      });

      setLoginSuccess(true);
      login(res.data.user);

      // Small delay for success animation
      setTimeout(() => {
        // Navigation will be handled by the useEffect above
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  const features = [
    {
      icon: userType === 'student' ? <GraduationCap size={20} /> : <Users size={20} />,
      title: userType === 'student' ? 'Track Progress' : 'Manage Classes',
      description: userType === 'student' ? 'Monitor your academic performance' : 'Efficiently manage your classes'
    },
    {
      icon: <BookOpen size={20} />,
      title: 'Access Materials',
      description: 'View course materials and resources'
    },
    {
      icon: <Clock size={20} />,
      title: 'Schedule',
      description: 'Check your timetable and deadlines'
    },
    {
      icon: <Award size={20} />,
      title: 'Achievements',
      description: 'Track your certificates and awards'
    }
  ];

  return (
    <div className={`login-container ${mounted ? 'mounted' : ''}`}>
      {/* Animated Background */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Main Content */}
      <div className="login-wrapper">
        {/* Left Side - Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-icon">
                {userType === 'student' ? <GraduationCap size={48} /> : <Users size={48} />}
              </div>
              <h1 className="brand-title">EduManager</h1>
              <p className="brand-subtitle">
                {userType === 'student' ? 'Student Portal' : 'Staff Portal'}
              </p>
            </div>

            {/* User Type Selector */}
            <div className="user-type-selector">
              <button
                className={`type-btn ${userType === 'student' ? 'active' : ''}`}
                onClick={() => setUserType('student')}
              >
                <GraduationCap size={20} />
                <span>Student</span>
              </button>
              <button
                className={`type-btn ${userType === 'staff' ? 'active' : ''}`}
                onClick={() => setUserType('staff')}
              >
                <Users size={20} />
                <span>Staff</span>
              </button>
            </div>

            {/* Welcome Message */}
            <div className="welcome-message">
              <h2>
                Welcome back!
                <span className="wave-emoji">👋</span>
              </h2>
              <p>
                {userType === 'student' 
                  ? 'Continue your learning journey with us' 
                  : 'Access your teaching dashboard and manage your classes'}
              </p>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">50+</span>
                <span className="stat-label">Staff</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100+</span>
                <span className="stat-label">Courses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="form-container">
            {/* Form Header */}
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {/* Success Animation */}
            {loginSuccess && (
              <div className="success-animation">
                <CheckCircle size={48} />
                <p>Login successful! Redirecting...</p>
              </div>
            )}

            {/* Error Message */}
            {error && !loginSuccess && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
                <button className="close-error" onClick={() => setError("")}>×</button>
              </div>
            )}

            {/* Login Form */}
            {!loginSuccess && (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <label htmlFor="email">
                    <Mail size={18} />
                    <span>Email Address</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className={email ? 'filled' : ''}
                    />
                    {email && <CheckCircle size={16} className="input-valid" />}
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="password">
                    <Lock size={18} />
                    <span>Password</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className={password ? 'filled' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="/forgot-password" className="forgot-password">
                    Forgot password?
                  </a>
                </div>

                <button 
                  type="submit" 
                  className={`login-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In</span>
                      <ChevronRight size={18} className="arrow-icon" />
                    </>
                  )}
                </button>

                {/* Demo Credentials */}
                <div className="demo-credentials">
                  <p className="demo-title">Demo Credentials</p>
                  <div className="credentials-list">
                    <div className="credential-item">
                      <span className="role-badge student">Student</span>
                      <code>student@example.com</code>
                      <span className="password-hint">/ password123</span>
                    </div>
                    <div className="credential-item">
                      <span className="role-badge staff">Staff</span>
                      <code>staff@example.com</code>
                      <span className="password-hint">/ password123</span>
                    </div>
                  </div>
                </div>

                <div className="security-note">
                  <Shield size={14} />
                  <span>Secure login powered by enterprise encryption</span>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="form-footer">
              <p>© 2024 EduManager. All rights reserved.</p>
              <div className="footer-links">
                <a href="/privacy">Privacy</a>
                <span>•</span>
                <a href="/terms">Terms</a>
                <span>•</span>
                <a href="/help">Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS */}
      <style>{`
        .login-container {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .login-container.mounted {
          opacity: 1;
        }

        /* Animated Background */
        .background-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 600px;
          height: 600px;
          top: -300px;
          right: -100px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
          animation-delay: 0s;
        }

        .shape-2 {
          width: 500px;
          height: 500px;
          bottom: -250px;
          left: -100px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
          animation-delay: -5s;
        }

        .shape-3 {
          width: 400px;
          height: 400px;
          top: 20%;
          right: 30%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
          animation-delay: -10s;
        }

        .shape-4 {
          width: 300px;
          height: 300px;
          bottom: 20%;
          left: 20%;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
          animation-delay: -15s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(50px, 50px) rotate(90deg);
          }
          50% {
            transform: translate(0, 100px) rotate(180deg);
          }
          75% {
            transform: translate(-50px, 50px) rotate(270deg);
          }
        }

        /* Main Wrapper */
        .login-wrapper {
          position: relative;
          z-index: 10;
          display: flex;
          min-height: 100vh;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
        }

        /* Hero Section */
        .hero-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtMjAgMjAgMjAgMjAgMCAwIDEtMjAtMjAgMjAgMjAgMCAwIDEgMjAtMjB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==');
          opacity: 0.3;
          animation: patternMove 20s linear infinite;
        }

        @keyframes patternMove {
          from { transform: translate(0, 0); }
          to { transform: translate(30px, 30px); }
        }

        .hero-content {
          max-width: 500px;
          color: white;
          animation: slideInLeft 0.8s ease;
          position: relative;
          z-index: 2;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Logo */
        .logo-container {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
          }
        }

        .brand-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .brand-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        /* User Type Selector */
        .user-type-selector {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .type-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .type-btn.active {
          background: white;
          color: #667eea;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        /* Welcome Message */
        .welcome-message {
          margin-bottom: 32px;
        }

        .welcome-message h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wave-emoji {
          animation: wave 2s infinite;
          display: inline-block;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }

        .welcome-message p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.2);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-text h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .feature-text p {
          font-size: 0.8rem;
          opacity: 0.8;
          margin: 0;
        }

        /* Stats Container */
        .stats-container {
          display: flex;
          justify-content: space-around;
          padding: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        /* Form Section */
        .form-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: white;
        }

        .form-container {
          max-width: 400px;
          width: 100%;
          animation: slideInRight 0.8s ease;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .form-header p {
          color: #64748b;
          margin: 0;
        }

        /* Success Animation */
        .success-animation {
          text-align: center;
          padding: 48px 0;
          animation: scaleIn 0.5s ease;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .success-animation svg {
          color: #22c55e;
          margin-bottom: 16px;
          animation: bounce 0.5s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .success-animation p {
          color: #1e293b;
          font-size: 1.1rem;
        }

        /* Error Message */
        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 12px;
          margin-bottom: 24px;
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .error-message svg {
          color: #ef4444;
          flex-shrink: 0;
        }

        .error-message span {
          color: #991b1b;
          font-size: 0.9rem;
          flex: 1;
        }

        .close-error {
          background: none;
          border: none;
          color: #991b1b;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 4px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .close-error:hover {
          opacity: 1;
        }

        /* Login Form */
        .login-form {
          margin-top: 24px;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .input-wrapper input.filled {
          border-color: #667eea;
        }

        .input-wrapper input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
        }

        .input-valid {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #22c55e;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        /* Form Options */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .remember-me input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .remember-me span {
          color: #475569;
          font-size: 0.9rem;
        }

        .forgot-password {
          color: #667eea;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .forgot-password:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        /* Login Button */
        .login-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .login-button:hover::before {
          left: 100%;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button.loading {
          cursor: wait;
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }

        .login-button:hover .arrow-icon {
          transform: translateX(5px);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Demo Credentials */
        .demo-credentials {
          margin-top: 24px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .demo-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin: 0 0 12px 0;
          text-align: center;
        }

        .credentials-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .credential-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: white;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .role-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .role-badge.student {
          background: #e0f2fe;
          color: #0369a1;
        }

        .role-badge.staff {
          background: #fef3c7;
          color: #92400e;
        }

        .credential-item code {
          color: #1e293b;
          font-family: monospace;
        }

        .password-hint {
          color: #94a3b8;
        }

        /* Security Note */
        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .security-note svg {
          color: #667eea;
        }

        /* Form Footer */
        .form-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }

        .form-footer p {
          color: #94a3b8;
          font-size: 0.85rem;
          margin: 0 0 12px 0;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .footer-links a {
          color: #64748b;
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #667eea;
        }

        .footer-links span {
          color: #cbd5e1;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .login-wrapper {
            flex-direction: column;
          }

          .hero-section {
            padding: 32px;
          }

          .hero-content {
            max-width: 100%;
          }

          .features-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-container {
            flex-wrap: wrap;
            gap: 16px;
          }

          .form-section {
            padding: 32px 24px;
          }

          .form-header h2 {
            font-size: 1.8rem;
          }

          .form-options {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .credential-item {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .logo-icon {
            width: 80px;
            height: 80px;
          }

          .brand-title {
            font-size: 2rem;
          }

          .user-type-selector {
            flex-direction: column;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-container {
            flex-direction: column;
            gap: 16px;
          }

          .form-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;