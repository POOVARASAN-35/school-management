import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { 
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Award,
  Star,
  MoreVertical,
  RefreshCw,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  File,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Video,
  Music,
  Zap,
  Sparkles,
  Target,
  Brain,
  Share2,
  Edit,
  Copy,
  Printer,
  Mail
} from "lucide-react";

const UploadQuestionPaper = () => {
  const [exams, setExams] = useState([]);
  const [papers, setPapers] = useState([]);
  const [examId, setExamId] = useState("");
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPaper, setPreviewPaper] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalExams: 0,
    recentUploads: 0,
    avgSize: 0
  });

  const itemsPerPage = 12;

  // Load exams
  useEffect(() => {
    const loadExams = async () => {
      try {
        const res = await api.get("/admin/exams");
        console.log("🟢 Exams loaded:", res.data);
        setExams(res.data);
        setStats(prev => ({ ...prev, totalExams: res.data.length }));
      } catch (err) {
        console.error("❌ Error loading exams:", err.response?.data);
        showNotification('error', 'Failed to load exams');
      }
    };
    loadExams();
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/staff/papers");
      setPapers(res.data);
      
      // Calculate stats
      const totalPapers = res.data.length;
      const totalSize = res.data.reduce((acc, p) => acc + (p.fileSize || 0), 0);
      const avgSize = totalPapers > 0 ? totalSize / totalPapers : 0;
      const recentUploads = res.data.filter(p => {
        const uploadDate = new Date(p.uploadDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return uploadDate > weekAgo;
      }).length;

      setStats({
        totalPapers,
        totalExams: exams.length,
        recentUploads,
        avgSize
      });
      
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to load question papers');
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Check file type
    if (file.type !== 'application/pdf') {
      showNotification('error', 'Only PDF files are allowed');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', 'File size must be less than 10MB');
      return;
    }

    setFile(file);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!examId || !file) {
      showNotification('error', 'Please select an exam and a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append("examId", examId);
    formData.append("file", file);

    try {
      setLoading(true);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const res = await api.post("/staff/upload-paper", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
        showNotification('success', 'Question paper uploaded successfully');
        setExamId("");
        setFile(null);
        setUploadProgress(0);
        loadPapers();
        setLoading(false);
      }, 500);

      console.log("✅ Upload success:", res.data);
    } catch (err) {
      showNotification('error', err.response?.data?.message || "Upload failed");
      setUploadProgress(0);
      setLoading(false);
    }
  };

  const handleDownload = async (paperId, fileName) => {
    try {
      const response = await api.get(`/staff/download-paper/${paperId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotification('success', 'Download started');
    } catch (error) {
      showNotification('error', 'Failed to download paper');
    }
  };

  const handleDelete = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this question paper?')) return;
    
    try {
      await api.delete(`/staff/paper/${paperId}`);
      showNotification('success', 'Question paper deleted successfully');
      loadPapers();
    } catch (error) {
      showNotification('error', 'Failed to delete paper');
    }
  };

  const handlePreview = (paper) => {
    setPreviewPaper(paper);
    setShowPreview(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getYearFromDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  // Get unique years for filter
  const years = ['all', ...new Set(papers.map(p => getYearFromDate(p.uploadDate)))];

  // Filter papers
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.examTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || paper.examId === selectedExam;
    const matchesYear = selectedYear === 'all' || getYearFromDate(paper.uploadDate) === parseInt(selectedYear);
    return matchesSearch && matchesExam && matchesYear;
  });

  // Pagination
  const paginatedPapers = filteredPapers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);

  if (loading && papers.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading question papers...</p>
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
            border-top: 3px solid #8b5cf6;
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
    <div className="papers-page">
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
            <FileText size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Question Paper Library</h1>
            <p className="page-subtitle">Upload and manage exam question papers</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="refresh-btn" onClick={loadPapers}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <FileText size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Papers</span>
            <span className="stat-value">{stats.totalPapers}</span>
            <span className="stat-trend">Across all exams</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <BookOpen size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Exams</span>
            <span className="stat-value">{stats.totalExams}</span>
            <span className="stat-trend">Available exams</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Upload size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Recent Uploads</span>
            <span className="stat-value">{stats.recentUploads}</span>
            <span className="stat-trend positive">Last 7 days</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Download size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Avg Size</span>
            <span className="stat-value">{formatFileSize(stats.avgSize)}</span>
            <span className="stat-trend">Per paper</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column - Upload Form */}
        <div className="upload-section">
          <h2>Upload Question Paper</h2>
          
          <form onSubmit={submit} className="upload-form">
            {/* Exam Select */}
            <div className="form-group">
              <label>Select Exam *</label>
              <select
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                required
              >
                <option value="">Choose an exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title} - {exam.subject?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Area */}
            <div 
              className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('paper-input').click()}
            >
              <input
                id="paper-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {!file ? (
                <>
                  <Upload size={32} className="drop-icon" />
                  <p className="drop-text">Drag & drop your PDF here</p>
                  <p className="drop-hint">or click to browse</p>
                  <p className="drop-info">Maximum file size: 10MB</p>
                </>
              ) : (
                <div className="file-preview">
                  <FileText size={32} className="file-icon" />
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                  <button 
                    type="button" 
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress}% uploaded</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !examId || !file}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spinning" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Upload Question Paper</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Tips */}
          <div className="quick-tips">
            <h3>Quick Tips</h3>
            <ul>
              <li>📄 Only PDF files are accepted</li>
              <li>📏 Maximum file size: 10MB</li>
              <li>📝 Use clear file names</li>
              <li>🔍 Include exam details in filename</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Paper Library */}
        <div className="library-section">
          <div className="library-header">
            <h2>Paper Library</h2>
            
            <div className="library-controls">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filters">
                <select 
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Exams</option>
                  {exams.map(exam => (
                    <option key={exam._id} value={exam._id}>{exam.title}</option>
                  ))}
                </select>

                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="filter-select"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Papers Display */}
          {filteredPapers.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="papers-grid">
                {paginatedPapers.map((paper) => (
                  <div key={paper._id} className="paper-card">
                    <div className="card-header">
                      <div className="paper-icon">
                        <FileText size={24} />
                      </div>
                      <div className="paper-badge">PDF</div>
                      <button className="card-menu">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="card-body">
                      <h3 className="paper-title">{paper.examTitle}</h3>
                      <p className="paper-subject">{paper.subjectName}</p>
                      
                      <div className="paper-meta">
                        <span className="meta-item">
                          <Calendar size={12} />
                          {new Date(paper.uploadDate).toLocaleDateString()}
                        </span>
                        <span className="meta-item">
                          <Download size={12} />
                          {paper.downloads || 0} downloads
                        </span>
                        <span className="meta-item">
                          <FileText size={12} />
                          {formatFileSize(paper.fileSize)}
                        </span>
                      </div>

                      {paper.description && (
                        <p className="paper-description">{paper.description}</p>
                      )}
                    </div>

                    <div className="card-footer">
                      <button 
                        className="action-btn preview"
                        onClick={() => handlePreview(paper)}
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                      <button 
                        className="action-btn download"
                        onClick={() => handleDownload(paper._id, paper.fileName)}
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(paper._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="papers-list">
                <table className="papers-table">
                  <thead>
                    <tr>
                      <th>Paper</th>
                      <th>Exam</th>
                      <th>Subject</th>
                      <th>Size</th>
                      <th>Uploaded</th>
                      <th>Downloads</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPapers.map((paper) => (
                      <tr key={paper._id}>
                        <td>
                          <div className="paper-cell">
                            <FileText size={16} className="cell-icon" />
                            <span className="cell-title">{paper.fileName}</span>
                          </div>
                        </td>
                        <td>{paper.examTitle}</td>
                        <td>{paper.subjectName}</td>
                        <td>{formatFileSize(paper.fileSize)}</td>
                        <td>{new Date(paper.uploadDate).toLocaleDateString()}</td>
                        <td>{paper.downloads || 0}</td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="table-action"
                              onClick={() => handlePreview(paper)}
                              title="Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="table-action"
                              onClick={() => handleDownload(paper._id, paper.fileName)}
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                            <button 
                              className="table-action delete"
                              onClick={() => handleDelete(paper._id)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="empty-library">
              <FileText size={64} className="empty-icon" />
              <h3>No Question Papers Found</h3>
              <p>Upload your first question paper to get started</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewPaper && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Paper Preview</h2>
              <button className="close-btn" onClick={() => setShowPreview(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body preview-body">
              <div className="preview-info">
                <div className="preview-icon">
                  <FileText size={48} />
                </div>
                <div className="preview-details">
                  <h3>{previewPaper.examTitle}</h3>
                  <p>{previewPaper.subjectName}</p>
                  <div className="preview-meta">
                    <span><Calendar size={14} /> {new Date(previewPaper.uploadDate).toLocaleDateString()}</span>
                    <span><FileText size={14} /> {formatFileSize(previewPaper.fileSize)}</span>
                  </div>
                </div>
              </div>
              
              <div className="preview-actions">
                <button 
                  className="preview-action"
                  onClick={() => handleDownload(previewPaper._id, previewPaper.fileName)}
                >
                  <Download size={16} />
                  Download
                </button>
                <button className="preview-action">
                  <Share2 size={16} />
                  Share
                </button>
                <button className="preview-action">
                  <Printer size={16} />
                  Print
                </button>
              </div>

              <div className="preview-note">
                <AlertCircle size={14} />
                <span>Preview functionality requires PDF viewer. Download to view full content.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .papers-page {
          padding: 24px;
          max-width: 1600px;
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
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
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

        .refresh-btn {
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          color: #475569;
          cursor: pointer;
        }

        .refresh-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
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

        .stat-icon.purple {
          background: #ede9fe;
          color: #8b5cf6;
        }

        .stat-icon.blue {
          background: #dbeafe;
          color: #3b82f6;
        }

        .stat-icon.green {
          background: #dcfce7;
          color: #22c55e;
        }

        .stat-icon.orange {
          background: #fed7aa;
          color: #f97316;
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
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .stat-trend {
          font-size: 0.75rem;
          color: #64748b;
        }

        .stat-trend.positive {
          color: #22c55e;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
        }

        /* Upload Section */
        .upload-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .upload-section h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .form-group select:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .drop-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .drop-zone.dragging {
          border-color: #8b5cf6;
          background: #f5f3ff;
        }

        .drop-zone.has-file {
          border-color: #22c55e;
          background: #f0fdf4;
        }

        .drop-icon {
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .drop-text {
          color: #1e293b;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .drop-hint {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .drop-info {
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .file-preview {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .file-icon {
          color: #8b5cf6;
        }

        .file-details {
          flex: 1;
          text-align: left;
        }

        .file-name {
          display: block;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .file-size {
          font-size: 0.8rem;
          color: #64748b;
        }

        .remove-file {
          padding: 4px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 4px;
          color: #ef4444;
          cursor: pointer;
        }

        /* Upload Progress */
        .upload-progress {
          margin-bottom: 20px;
        }

        .progress-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #c084fc);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        /* Quick Tips */
        .quick-tips {
          margin-top: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .quick-tips h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .quick-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .quick-tips li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          color: #475569;
          font-size: 0.9rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .quick-tips li:last-child {
          border-bottom: none;
        }

        /* Library Section */
        .library-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .library-header {
          margin-bottom: 20px;
        }

        .library-header h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .library-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          padding: 10px 16px 10px 36px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .filters {
          display: flex;
          gap: 8px;
        }

        .filter-select {
          padding: 10px 32px 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #f1f5f9;
          border-radius: 8px;
        }

        .view-btn {
          padding: 6px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          color: #64748b;
        }

        .view-btn.active {
          background: white;
          color: #8b5cf6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Papers Grid */
        .papers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
          max-height: 600px;
          overflow-y: auto;
          padding: 4px;
        }

        .paper-card {
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .paper-card:hover {
          transform: translateY(-5px);
          border-color: #8b5cf6;
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.1);
        }

        .card-header {
          padding: 16px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .paper-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
        }

        .paper-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: #ef4444;
          background: white;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .card-menu {
          margin-left: auto;
          padding: 4px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          color: #64748b;
          cursor: pointer;
        }

        .card-body {
          padding: 16px;
        }

        .paper-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .paper-subject {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .paper-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #64748b;
          background: white;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .paper-description {
          font-size: 0.85rem;
          color: #475569;
          margin: 0;
        }

        .card-footer {
          display: flex;
          border-top: 1px solid #e2e8f0;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
        }

        .action-btn.preview:hover {
          color: #8b5cf6;
          background: #f5f3ff;
        }

        .action-btn.download:hover {
          color: #22c55e;
          background: #f0fdf4;
        }

        .action-btn.delete:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        /* Table View */
        .papers-list {
          overflow-x: auto;
          margin-bottom: 24px;
        }

        .papers-table {
          width: 100%;
          border-collapse: collapse;
        }

        .papers-table th {
          text-align: left;
          padding: 12px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .papers-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .paper-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cell-icon {
          color: #8b5cf6;
        }

        .cell-title {
          font-weight: 500;
          color: #1e293b;
        }

        .table-actions {
          display: flex;
          gap: 4px;
        }

        .table-action {
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          color: #64748b;
          cursor: pointer;
        }

        .table-action:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .table-action.delete:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Empty State */
        .empty-library {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .empty-library h3 {
          color: #1e293b;
          font-size: 1.2rem;
          margin: 0 0 8px 0;
        }

        .empty-library p {
          color: #64748b;
          margin: 0;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #475569;
          cursor: pointer;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #64748b;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .preview-body {
          padding: 24px;
        }

        .preview-info {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }

        .preview-icon {
          width: 80px;
          height: 80px;
          background: #f5f3ff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
        }

        .preview-details {
          flex: 1;
        }

        .preview-details h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .preview-details p {
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .preview-meta {
          display: flex;
          gap: 16px;
        }

        .preview-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.85rem;
        }

        .preview-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .preview-action {
          flex: 1;
          padding: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .preview-action:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .preview-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #fef3c7;
          border-radius: 8px;
          color: #92400e;
          font-size: 0.9rem;
        }

        /* Animations */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .library-controls {
            flex-direction: column;
          }

          .filters {
            width: 100%;
          }

          .filter-select {
            flex: 1;
          }

          .papers-table th:nth-child(3),
          .papers-table td:nth-child(3),
          .papers-table th:nth-child(4),
          .papers-table td:nth-child(4) {
            display: none;
          }

          .preview-info {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .preview-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadQuestionPaper;