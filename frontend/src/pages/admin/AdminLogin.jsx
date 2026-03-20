import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Shield,
  GraduationCap,
  Users,
  BookOpen
} from "lucide-react";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Animation states
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/admin/login", {
        email,
        password,
      });

      // Show success animation
      setLoginSuccess(true);
      
      // Update auth context
      login(res.data.user);

      // Small delay for success animation
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${mounted ? 'mounted' : ''}`}>
      {/* Animated Background */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      {/* Main Content */}
      <div className="login-wrapper">
        {/* Left Side - Branding */}
        <div className="brand-side">
          <div className="brand-content">
            <div className="logo-container">
              <div className="logo-icon">
                <GraduationCap size={48} />
              </div>
              <h1 className="brand-title">EduManager</h1>
              <p className="brand-subtitle">Admin Portal</p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={20} />
                </div>
                <div className="feature-text">
                  <h3>Secure Access</h3>
                  <p>Enterprise-grade security</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Users size={20} />
                </div>
                <div className="feature-text">
                  <h3>User Management</h3>
                  <p>Control user access & roles</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <BookOpen size={20} />
                </div>
                <div className="feature-text">
                  <h3>Course Management</h3>
                  <p>Manage courses & subjects</p>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <p>"Secure, fast, and intuitive admin interface"</p>
              <div className="testimonial-author">
                <span>— System Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-side">
          <div className="form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Please enter your credentials to access the admin panel</p>
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
                      placeholder="admin@example.com"
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
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In to Admin Panel</span>
                    </>
                  )}
                </button>

                <div className="security-note">
                  <Shield size={14} />
                  <span>Protected by enterprise security</span>
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
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
          border-radius: 50%;
          filter: blur(60px);
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 600px;
          height: 600px;
          top: -300px;
          right: -100px;
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

        .shape-5 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 15%;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%);
          animation-delay: -20s;
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
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
        }

        /* Left Side - Branding */
        .brand-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
          position: relative;
          overflow: hidden;
        }

        .brand-side::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtMjAgMjAgMjAgMjAgMCAwIDEtMjAtMjAgMjAgMjAgMCAwIDEgMjAtMjB6IiBmaWxsPSIjM0I4MkY2IiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=');
          opacity: 0.5;
          animation: patternMove 20s linear infinite;
        }

        @keyframes patternMove {
          from { transform: translate(0, 0); }
          to { transform: translate(30px, 30px); }
        }

        .brand-content {
          max-width: 400px;
          animation: slideInLeft 0.8s ease;
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

        .logo-container {
          text-align: center;
          margin-bottom: 48px;
        }

        .logo-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 30px 50px rgba(59, 130, 246, 0.4);
          }
        }

        .brand-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin: 0;
        }

        /* Features List */
        .features-list {
          margin: 48px 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: white;
          border-radius: 16px;
          margin-bottom: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease;
          animation-fill-mode: both;
        }

        .feature-item:nth-child(1) { animation-delay: 0.1s; }
        .feature-item:nth-child(2) { animation-delay: 0.2s; }
        .feature-item:nth-child(3) { animation-delay: 0.3s; }

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

        .feature-item:hover {
          transform: translateX(10px);
          border-color: #3b82f6;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .feature-text h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .feature-text p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        /* Testimonial */
        .testimonial {
          margin-top: 48px;
          padding: 24px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.6);
          position: relative;
          animation: fadeIn 0.8s ease 0.4s both;
        }

        .testimonial::before {
          content: '"';
          position: absolute;
          top: -20px;
          left: 20px;
          font-size: 4rem;
          color: #3b82f6;
          opacity: 0.2;
          font-family: serif;
        }

        .testimonial p {
          font-size: 0.95rem;
          color: #475569;
          font-style: italic;
          margin: 0 0 12px 0;
          line-height: 1.6;
        }

        .testimonial-author {
          display: flex;
          justify-content: flex-end;
        }

        .testimonial-author span {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        /* Right Side - Form */
        .form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: white;
          position: relative;
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
          background: white;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .input-wrapper input.filled {
          border-color: #3b82f6;
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
          color: #3b82f6;
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
          accent-color: #3b82f6;
        }

        .remember-me span {
          color: #475569;
          font-size: 0.9rem;
        }

        .forgot-password {
          color: #3b82f6;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .forgot-password:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        /* Login Button */
        .login-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button.loading {
          cursor: wait;
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
          color: #3b82f6;
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
          color: #3b82f6;
        }

        .footer-links span {
          color: #cbd5e1;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .login-wrapper {
            flex-direction: column;
          }

          .brand-side {
            padding: 32px;
          }

          .brand-content {
            max-width: 500px;
          }

          .features-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .feature-item {
            flex-direction: column;
            text-align: center;
            padding: 24px 16px;
          }

          .testimonial {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .features-list {
            grid-template-columns: 1fr;
          }

          .brand-side {
            padding: 24px;
          }

          .form-side {
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
        }

        @media (max-width: 480px) {
          .logo-icon {
            width: 80px;
            height: 80px;
          }

          .brand-title {
            font-size: 2rem;
          }

          .form-header h2 {
            font-size: 1.5rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .login-wrapper {
            background: rgba(15, 23, 42, 0.9);
          }

          .brand-side {
            background: rgba(30, 41, 59, 0.5);
          }

          .form-side {
            background: #1e293b;
          }

          .feature-item,
          .testimonial,
          .input-wrapper input {
            background: #334155;
            border-color: #475569;
          }

          .feature-text h3,
          .form-header h2,
          .brand-title {
            color: #f1f5f9;
          }

          .feature-text p,
          .form-header p,
          .input-group label,
          .remember-me span {
            color: #cbd5e1;
          }

          .testimonial p {
            color: #e2e8f0;
          }

          .input-wrapper input {
            color: white;
          }

          .input-wrapper input::placeholder {
            color: #94a3b8;
          }

          .form-footer {
            border-top-color: #334155;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;