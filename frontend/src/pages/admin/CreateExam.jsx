import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Bell,
  ArrowRight,
  Sparkles,
  Rocket,
  Zap,
  Star,
  Globe,
  Send,
  CheckCircle,
  X
} from "lucide-react";

const CreateExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state || {};
  
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 32,
    seconds: 45
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const socialLinks = [
    { icon: <Github size={20} />, url: "https://github.com", label: "GitHub" },
    { icon: <Twitter size={20} />, url: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin size={20} />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Instagram size={20} />, url: "https://instagram.com", label: "Instagram" }
  ];

  return (
    <div className="coming-soon-container">
      {/* Animated Background */}
      <div className="background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          />
        ))}

        {/* Grid Lines */}
        <div className="grid-lines">
          <div className="grid-line horizontal"></div>
          <div className="grid-line horizontal"></div>
          <div className="grid-line horizontal"></div>
          <div className="grid-line vertical"></div>
          <div className="grid-line vertical"></div>
          <div className="grid-line vertical"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Logo/Illustration */}
        <div className="logo-container">
          <div className="logo-ring">
            <div className="logo-icon">
              <Rocket size={40} />
            </div>
          </div>
          <div className="logo-glow"></div>
        </div>

        {/* Coming Soon Badge */}
        <div className="coming-soon-badge">
          <Sparkles size={16} />
          <span>Coming Soon</span>
          <Sparkles size={16} />
        </div>

        {/* Main Heading */}
        <h1 className="main-heading">
          Something Amazing is 
          <span className="gradient-text"> Coming Soon</span>
          <span className="rocket-emoji">🚀</span>
        </h1>

        {/* Tagline */}
        <p className="tagline">
          We're working hard to bring you a better experience.
        </p>

        {/* Countdown Timer */}
        <div className="countdown-container">
          <div className="countdown-grid">
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        </div>

        {/* Email Subscription */}
        <div className="subscription-card">
          <div className="card-glow"></div>
          <form onSubmit={handleSubscribe} className="subscription-form">
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
              />
            </div>
            <button type="submit" className="subscribe-btn">
              <span>Notify Me</span>
              <Send size={16} className="btn-icon" />
              <div className="btn-glow"></div>
              <div className="btn-ripple"></div>
            </button>
          </form>
          {subscribed && (
            <div className="success-message">
              <CheckCircle size={16} />
              <span>Thanks! We'll notify you when we launch.</span>
            </div>
          )}
        </div>

        {/* Social Media Icons */}
        <div className="social-section">
          <p className="social-label">Follow us for updates</p>
          <div className="social-icons">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={social.label}
              >
                {social.icon}
                <span className="icon-tooltip">{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Temporary Score Display (if exists) */}
        {score && (
          <div className="temp-score">
            <Star size={16} className="score-star" />
            <span>Your temporary score: </span>
            <strong className="score-value">{score}%</strong>
          </div>
        )}

        {/* Dashboard Link */}
        <button 
          className="dashboard-link"
          onClick={() => navigate("/student/dashboard")}
        >
          <span>Return to Dashboard</span>
          <ArrowRight size={16} className="link-arrow" />
        </button>

        {/* Footer Note */}
        <div className="footer-note">
          <Zap size={14} />
          <span>Experience the future of learning</span>
          <Zap size={14} />
        </div>
      </div>

      <style>{`
        .coming-soon-container {
          min-height: 100vh;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Animated Background */
        .background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          top: -300px;
          right: -100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          bottom: -250px;
          left: -100px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          animation-delay: -5s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          top: 20%;
          right: 30%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          animation-delay: -10s;
        }

        .orb-4 {
          width: 300px;
          height: 300px;
          bottom: 30%;
          left: 20%;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          animation-delay: -15s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(50px, 50px) scale(1.1);
          }
          50% {
            transform: translate(0, 100px) scale(1);
          }
          75% {
            transform: translate(-50px, 50px) scale(0.9);
          }
        }

        /* Particles */
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 0.5;
          }
          to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Grid Lines */
        .grid-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
        }

        .grid-line {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
        }

        .grid-line.horizontal {
          width: 100%;
          height: 1px;
          left: 0;
        }

        .grid-line.horizontal:nth-child(1) { top: 25%; }
        .grid-line.horizontal:nth-child(2) { top: 50%; }
        .grid-line.horizontal:nth-child(3) { top: 75%; }

        .grid-line.vertical {
          width: 1px;
          height: 100%;
          top: 0;
        }

        .grid-line.vertical:nth-child(4) { left: 25%; }
        .grid-line.vertical:nth-child(5) { left: 50%; }
        .grid-line.vertical:nth-child(6) { left: 75%; }

        /* Content Wrapper */
        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 900px;
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 40px;
          padding: 60px 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Logo */
        .logo-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 32px;
        }

        .logo-ring {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 50px rgba(102, 126, 234, 0.8);
          }
        }

        .logo-icon {
          color: white;
        }

        .logo-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0.5;
          animation: glow 3s infinite;
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Coming Soon Badge */
        .coming-soon-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .coming-soon-badge svg {
          animation: sparkle 1.5s infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        /* Main Heading */
        .main-heading {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin: 0 0 16px 0;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          margin-left: 10px;
        }

        .rocket-emoji {
          display: inline-block;
          margin-left: 10px;
          animation: rocketFloat 2s infinite;
        }

        @keyframes rocketFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(5deg);
          }
        }

        /* Tagline */
        .tagline {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 48px 0;
          line-height: 1.6;
        }

        /* Countdown Timer */
        .countdown-container {
          margin-bottom: 48px;
        }

        .countdown-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .countdown-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 20px;
          min-width: 100px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .countdown-item:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .countdown-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          line-height: 1;
          margin-bottom: 8px;
          text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
        }

        .countdown-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .countdown-separator {
          font-size: 2rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          animation: pulse 2s infinite;
        }

        /* Subscription Card */
        .subscription-card {
          position: relative;
          max-width: 500px;
          margin: 0 auto 32px;
          padding: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 60px;
          animation: borderGlow 3s infinite;
        }

        @keyframes borderGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(102, 126, 234, 0.8);
          }
        }

        .subscription-form {
          display: flex;
          gap: 8px;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 58px;
          padding: 8px;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
        }

        .email-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
        }

        .email-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .email-input:focus {
          outline: none;
        }

        .subscribe-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .subscribe-btn:hover {
          transform: scale(1.05);
        }

        .subscribe-btn:hover .btn-icon {
          transform: translateX(5px);
        }

        .btn-icon {
          transition: transform 0.3s ease;
        }

        .btn-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50px;
          filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .subscribe-btn:hover .btn-glow {
          opacity: 0.5;
        }

        .btn-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .subscribe-btn:active .btn-ripple {
          width: 300px;
          height: 300px;
        }

        .success-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          color: #22c55e;
          font-size: 0.9rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Social Section */
        .social-section {
          margin-bottom: 32px;
        }

        .social-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .social-icons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .social-icon {
          position: relative;
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .social-icon:hover {
          transform: translateY(-5px) scale(1.1);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .icon-tooltip {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.9);
          color: #1e293b;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .social-icon:hover .icon-tooltip {
          opacity: 1;
          visibility: visible;
          top: -50px;
        }

        /* Temporary Score */
        .temp-score {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .score-star {
          color: #f59e0b;
        }

        .score-value {
          color: #f59e0b;
          font-size: 1.1rem;
        }

        /* Dashboard Link */
        .dashboard-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          color: white;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 32px;
        }

        .dashboard-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .dashboard-link:hover .link-arrow {
          transform: translateX(5px);
        }

        .link-arrow {
          transition: transform 0.3s ease;
        }

        /* Footer Note */
        .footer-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .footer-note svg {
          animation: zap 2s infinite;
        }

        @keyframes zap {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 40px 24px;
          }

          .main-heading {
            font-size: 2.5rem;
          }

          .countdown-grid {
            flex-wrap: wrap;
          }

          .countdown-item {
            min-width: 70px;
            padding: 15px;
          }

          .countdown-value {
            font-size: 2rem;
          }

          .subscription-form {
            flex-direction: column;
          }

          .subscribe-btn {
            width: 100%;
            justify-content: center;
          }

          .social-icons {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .main-heading {
            font-size: 2rem;
          }

          .tagline {
            font-size: 1rem;
          }

          .countdown-item {
            min-width: 60px;
            padding: 12px;
          }

          .countdown-value {
            font-size: 1.5rem;
          }

          .countdown-label {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateExam;