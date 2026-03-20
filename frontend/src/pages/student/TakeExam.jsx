import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  /* =========================
     LOAD EXAM DETAILS
  ========================= */
  useEffect(() => {
    const loadExam = async () => {
      try {
        const res = await api.get(`/exams/${examId}`);
        setExam(res.data);
        setTimeLeft(res.data.duration * 60); // convert minutes to seconds
      } catch (err) {
        console.error("❌ Exam load error:", err.response?.data);
      }
    };

    loadExam();
  }, [examId]);

  /* =========================
     LOAD QUESTIONS
  ========================= */
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await api.get(`/questions/${examId}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("❌ Question load error:", err.response?.data);
      }
    };

    loadQuestions();
  }, [examId]);

  /* =========================
     TIMER LOGIC
  ========================= */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* =========================
     AUTO SUBMIT WHEN TIME = 0
  ========================= */
  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  /* =========================
     SELECT ANSWER
  ========================= */
  const handleSelect = (questionId, optionIndex) => {
    const updated = answers.filter((a) => a.question !== questionId);

    updated.push({
      question: questionId,
      selectedAnswer: optionIndex,
    });

    setAnswers(updated);
  };

  /* =========================
     SUBMIT EXAM
  ========================= */
  const handleSubmit = async () => {
    try {
      const res = await api.post("/student-exams/submit", {
        examId,
        answers,
      });

      alert("Your Score: " + res.data.score);

      navigate("/student/dashboard");
    } catch (err) {
      console.error("❌ Submit error:", err.response?.data);
    }
  };

  /* =========================
     FORMAT TIME (MM:SS)
  ========================= */
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Calculate progress
  const progress = (answers.length / questions.length) * 100 || 0;
  const timePercentage = (timeLeft / (exam?.duration * 60 || 1)) * 100;

  // Get timer color based on time left
  const getTimerColor = () => {
    if (timePercentage > 50) return '#22c55e';
    if (timePercentage > 25) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="exam-container">
      {/* Header with Exam Info */}
      <div className="exam-header">
        <div className="header-content">
          <h1 className="exam-title">{exam ? exam.title : "Loading Exam..."}</h1>
          <div className="exam-meta">
            <span className="meta-item">
              <span className="meta-icon">📝</span>
              {questions.length} Questions
            </span>
            <span className="meta-item">
              <span className="meta-icon">⏱️</span>
              {exam?.duration} Minutes
            </span>
          </div>
        </div>
      </div>

      {/* Timer and Progress Section */}
      <div className="stats-section">
        <div className="timer-card" style={{ borderColor: getTimerColor() }}>
          <div className="timer-icon">⏰</div>
          <div className="timer-info">
            <span className="timer-label">Time Remaining</span>
            <span className="timer-value" style={{ color: getTimerColor() }}>
              {minutes}:{seconds}
            </span>
          </div>
          <div className="timer-progress">
            <div 
              className="progress-fill"
              style={{ 
                width: `${timePercentage}%`,
                backgroundColor: getTimerColor()
              }}
            ></div>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-header">
            <span className="progress-label">Progress</span>
            <span className="progress-count">{answers.length}/{questions.length}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-container">
        {questions.map((q, index) => {
          const isAnswered = answers.some(a => a.question === q._id);
          
          return (
            <div 
              key={q._id} 
              className={`question-card ${isAnswered ? 'answered' : ''}`}
            >
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                {isAnswered && (
                  <span className="answered-badge">
                    <span className="check-icon">✓</span>
                    Answered
                  </span>
                )}
              </div>

              <h3 className="question-text">{q.question}</h3>

              <div className="options-grid">
                {q.options.map((opt, i) => {
                  const isSelected = answers.some(
                    a => a.question === q._id && a.selectedAnswer === i
                  );

                  return (
                    <div
                      key={i}
                      className={`option-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(q._id, i)}
                    >
                      <div className="option-marker">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="option-text">{opt}</span>
                      {isSelected && (
                        <span className="selected-check">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="submit-section">
        <div className="submit-info">
          <span className="info-icon">📊</span>
          <span>{answers.length} of {questions.length} questions answered</span>
        </div>
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={questions.length === 0}
        >
          <span className="submit-icon">📤</span>
          Submit Exam
        </button>
      </div>

      <style>{`
        .exam-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Header Styles */
        .exam-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .exam-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .exam-meta {
          display: flex;
          gap: 24px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.95rem;
          background: #f8fafc;
          padding: 8px 16px;
          border-radius: 30px;
        }

        .meta-icon {
          font-size: 1.1rem;
        }

        /* Stats Section */
        .stats-section {
          max-width: 1200px;
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .timer-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          border-left: 4px solid;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .timer-icon {
          font-size: 2rem;
        }

        .timer-info {
          flex: 1;
        }

        .timer-label {
          display: block;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .timer-value {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .timer-progress {
          width: 80px;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .progress-label {
          color: #64748b;
          font-size: 0.9rem;
        }

        .progress-count {
          font-weight: 600;
          color: #667eea;
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

        /* Questions Container */
        .questions-container {
          max-width: 1200px;
          margin: 0 auto 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .question-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .question-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .question-card.answered {
          border-left: 4px solid #22c55e;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .question-number {
          font-size: 0.9rem;
          font-weight: 600;
          color: #667eea;
          background: #f0f4ff;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .answered-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #22c55e;
          font-size: 0.85rem;
          background: #f0fdf4;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .check-icon {
          font-size: 1rem;
        }

        .question-text {
          font-size: 1.1rem;
          color: #1e293b;
          margin: 0 0 20px 0;
          line-height: 1.6;
        }

        /* Options Grid */
        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .option-item:hover {
          background: #f1f5f9;
          border-color: #667eea;
          transform: translateX(5px);
        }

        .option-item.selected {
          background: #f0f4ff;
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .option-marker {
          width: 32px;
          height: 32px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .option-item.selected .option-marker {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .option-text {
          flex: 1;
          color: #475569;
          font-size: 0.95rem;
        }

        .selected-check {
          color: #667eea;
          font-size: 1.2rem;
          font-weight: bold;
        }

        /* Submit Section */
        .submit-section {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .submit-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.95rem;
        }

        .info-icon {
          font-size: 1.2rem;
        }

        .submit-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-icon {
          font-size: 1.2rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .stats-section {
            grid-template-columns: 1fr;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .submit-section {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .exam-title {
            font-size: 1.5rem;
          }

          .exam-meta {
            flex-wrap: wrap;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .exam-container {
            padding: 16px;
          }

          .timer-value {
            font-size: 1.5rem;
          }

          .question-text {
            font-size: 1rem;
          }

          .option-item {
            padding: 12px;
          }
        }

        /* Loading State */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .exam-title:empty::before {
          content: "Loading Exam...";
          color: #94a3b8;
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Scrollbar Styling */
        .questions-container::-webkit-scrollbar {
          width: 8px;
        }

        .questions-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .questions-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        .questions-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
    </div>
  );
};

export default TakeExam; 