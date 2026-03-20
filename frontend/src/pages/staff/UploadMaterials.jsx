import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { 
  Upload,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Video,
  Music,
  BookOpen,
  X,
  Check,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Edit,
  Share2,
  MoreVertical,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  Star,
  Tag,
  FolderOpen,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
  Award,
  Brain,
  Target
} from "lucide-react";

const UploadMaterials = () => {
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [fileType, setFileType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [recentUploads, setRecentUploads] = useState([]);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalSize: 0,
    byType: {},
    recentActivity: []
  });

  const itemsPerPage = 12;

  useEffect(() => {
    loadSubjects();
    loadMaterials();
    loadRecentUploads();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await api.get("/staff/subjects");
      setSubjects(res.data);
    } catch (error) {
      showNotification('error', 'Failed to load subjects');
    }
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/materials");
      setMaterials(res.data);
      
      // Calculate stats
      const totalSize = res.data.reduce((acc, m) => acc + (m.fileSize || 0), 0);
      const byType = res.data.reduce((acc, m) => {
        const ext = m.fileName?.split('.').pop() || 'unknown';
        acc[ext] = (acc[ext] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        totalMaterials: res.data.length,
        totalSize,
        byType,
        recentActivity: res.data.slice(0, 5)
      });
      
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to load materials');
      setLoading(false);
    }
  };

  const loadRecentUploads = async () => {
    try {
      const res = await api.get("/materials/recent");
      setRecentUploads(res.data);
    } catch (error) {
      console.error("Failed to load recent uploads");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-generate title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.split('.')[0].replace(/[-_]/g, ' '));
      }
    }
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
    if (droppedFile) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.split('.')[0].replace(/[-_]/g, ' '));
      }
    }
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      showNotification('error', 'Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subjectId", subjectId);
    formData.append("description", description);
    formData.append("tags", tags);
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

      await api.post("/materials/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        showNotification('success', 'Material uploaded successfully');
        resetForm();
        loadMaterials();
        loadRecentUploads();
        setUploadProgress(0);
        setLoading(false);
      }, 500);
    } catch (error) {
      showNotification('error', 'Failed to upload material');
      setUploadProgress(0);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubjectId("");
    setDescription("");
    setTags("");
    setFile(null);
  };

  const handleDelete = async (id) => {
    try {
      console.log("🗑 Deleting:", id);

      await api.delete(`/materials/${id}`);

      showNotification("success", "Material deleted successfully");

      // ✅ Update UI instantly
      setMaterials(prev => prev.filter(m => m._id !== id));

    } catch (error) {
      console.error("❌ Delete error:", error.response || error);

      showNotification(
        "error",
        error.response?.data?.message || "Failed to delete material"
      );
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const response = await api.get(`/materials/download/${id}`, {
        responseType: "blob",
      });

      // ✅ Create file URL
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // ✅ Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "file";
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification("success", "Download started");

    } catch (error) {
      console.error("❌ Download error:", error.response || error);
      showNotification(
        "error",
        error.response?.data?.message || "Download failed"
      );
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return <FileImage size={24} />;
    if (['pdf'].includes(ext)) return <FileText size={24} />;
    if (['doc', 'docx'].includes(ext)) return <FileText size={24} />;
    if (['xls', 'xlsx'].includes(ext)) return <FileSpreadsheet size={24} />;
    if (['ppt', 'pptx'].includes(ext)) return <FileText size={24} />;
    if (['zip', 'rar', '7z'].includes(ext)) return <FileArchive size={24} />;
    if (['mp4', 'avi', 'mov'].includes(ext)) return <Video size={24} />;
    if (['mp3', 'wav'].includes(ext)) return <Music size={24} />;
    return <File size={24} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || material.subjectId === selectedSubject;
    const matchesType = fileType === 'all' || material.fileType === fileType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  if (loading && materials.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading materials...</p>
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
    <div className="materials-page">
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
            <BookOpen size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Material Library</h1>
            <p className="page-subtitle">Upload, organize, and share study materials</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="refresh-btn" onClick={loadMaterials}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FileText size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Materials</span>
            <span className="stat-value">{stats.totalMaterials}</span>
            <span className="stat-trend">+12 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Download size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Size</span>
            <span className="stat-value">{formatFileSize(stats.totalSize)}</span>
            <span className="stat-trend">Across all files</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Downloads</span>
            <span className="stat-value">1,234</span>
            <span className="stat-trend positive">+18% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Award size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Most Used</span>
            <span className="stat-value">PDF</span>
            <span className="stat-trend">{stats.byType['pdf'] || 0} files</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column - Upload Form */}
        <div className="upload-section">
          <h2>Upload New Material</h2>
          
          <form onSubmit={handleSubmit} className="upload-form">
            {/* Drag & Drop Area */}
            <div 
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Upload size={32} className="drop-icon" />
              <p className="drop-text">
                {file ? file.name : 'Drag & drop or click to upload'}
              </p>
              {file && (
                <div className="file-info">
                  <span className="file-size">{formatFileSize(file.size)}</span>
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

            {/* Form Fields */}
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                placeholder="e.g., Chapter 1: Introduction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Brief description of the material..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g., mathematics, algebra, beginner"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spinning" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Upload Material</span>
                </>
              )}
            </button>
          </form>

          {/* Recent Uploads */}
          <div className="recent-uploads">
            <h3>Recent Uploads</h3>
            <div className="recent-list">
              {recentUploads.slice(0, 5).map((item) => (
                <div key={item._id} className="recent-item">
                  {getFileIcon(item.fileName)}
                  <div className="recent-details">
                    <span className="recent-title">{item.title}</span>
                    <span className="recent-time">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Material Library */}
        <div className="library-section">
          <div className="library-header">
            <h2>Material Library</h2>
            
            <div className="library-controls">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filters">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>

                <select 
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="doc">Documents</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
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

          {/* Materials Display */}
          {filteredMaterials.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="materials-grid">
                {paginatedMaterials.map((material) => (
                  <div key={material._id} className="material-card">
                    <div className="card-header">
                      <div className="file-icon">
                        {getFileIcon(material.fileName)}
                      </div>
                      <div className="file-type">
                        {material.fileName?.split('.').pop()?.toUpperCase()}
                      </div>
                      <button className="card-menu">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="card-body">
                      <h3 className="material-title">{material.title}</h3>
                      {material.description && (
                        <p className="material-description">{material.description}</p>
                      )}
                      
                      <div className="material-meta">
                        <span className="meta-item">
                          <BookOpen size={12} />
                          {material.subjectName || 'General'}
                        </span>
                        <span className="meta-item">
                          <Calendar size={12} />
                          {new Date(material.createdAt).toLocaleDateString()}
                        </span>
                        <span className="meta-item">
                          <Download size={12} />
                          {material.downloads || 0}
                        </span>
                      </div>

                      {material.tags && (
                        <div className="material-tags">
                          {material.tags.split(',').map((tag, i) => (
                            <span key={i} className="tag">#{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="card-footer">
                      <button 
                        className="action-btn download"
                        onClick={() => handleDownload(material._id, material.fileName)}
                      >
                        <Download size={16} />
                        Download
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(material._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="materials-list">
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Size</th>
                      <th>Uploaded</th>
                      <th>Downloads</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMaterials.map((material) => (
                      <tr key={material._id}>
                        <td className="file-icon-cell">
                          {getFileIcon(material.fileName)}
                        </td>
                        <td>
                          <div className="title-cell">
                            <span className="title">{material.title}</span>
                            {material.description && (
                              <span className="description">{material.description}</span>
                            )}
                          </div>
                        </td>
                        <td>{material.subjectName || 'General'}</td>
                        <td>{formatFileSize(material.fileSize)}</td>
                        <td>{new Date(material.createdAt).toLocaleDateString()}</td>
                        <td>{material.downloads || 0}</td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="table-action"
                              onClick={() => handleDownload(material._id, material.fileName)}
                            >
                              <Download size={14} />
                            </button>
                            <button className="table-action">
                              <Eye size={14} />
                            </button>
                            <button 
                              className="table-action delete"
                              onClick={() => handleDelete(material._id)}
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
              <BookOpen size={64} className="empty-icon" />
              <h3>No Materials Found</h3>
              <p>Upload your first material to get started</p>
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

      {/* Internal CSS */}
      <style>{`
        .materials-page {
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

        .refresh-btn {
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          color: #475569;
          cursor: pointer;
        }

        .refresh-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
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

        .stat-icon.purple {
          background: #ede9fe;
          color: #8b5cf6;
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
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .drop-icon {
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .drop-text {
          color: #64748b;
          font-size: 0.9rem;
        }

        .file-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }

        .file-size {
          font-size: 0.8rem;
          color: #3b82f6;
          background: #eff6ff;
          padding: 4px 8px;
          border-radius: 12px;
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
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* Form */
        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        /* Recent Uploads */
        .recent-uploads {
          margin-top: 24px;
        }

        .recent-uploads h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .recent-item svg {
          color: #3b82f6;
        }

        .recent-details {
          flex: 1;
        }

        .recent-title {
          display: block;
          font-size: 0.9rem;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .recent-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #94a3b8;
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
          padding: 8px 16px 8px 36px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .filters {
          display: flex;
          gap: 8px;
        }

        .filter-select {
          padding: 8px 24px 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
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
          color: #3b82f6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Materials Grid */
        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
          max-height: 600px;
          overflow-y: auto;
          padding: 4px;
        }

        .material-card {
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .material-card:hover {
          transform: translateY(-5px);
          border-color: #3b82f6;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.1);
        }

        .card-header {
          padding: 16px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .file-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .file-type {
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
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

        .material-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .material-description {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .material-meta {
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

        .material-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .tag {
          font-size: 0.65rem;
          color: #3b82f6;
          background: #eff6ff;
          padding: 2px 6px;
          border-radius: 4px;
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

        .action-btn.download:hover {
          color: #3b82f6;
          background: #eff6ff;
        }

        .action-btn.delete:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        /* Table View */
        .materials-list {
          overflow-x: auto;
          margin-bottom: 24px;
        }

        .materials-table {
          width: 100%;
          border-collapse: collapse;
        }

        .materials-table th {
          text-align: left;
          padding: 12px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .materials-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .file-icon-cell svg {
          color: #3b82f6;
        }

        .title-cell {
          display: flex;
          flex-direction: column;
        }

        .title-cell .title {
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .title-cell .description {
          font-size: 0.75rem;
          color: #64748b;
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
          border-color: #3b82f6;
          color: #3b82f6;
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
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #64748b;
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

          .materials-table th:nth-child(3),
          .materials-table td:nth-child(3),
          .materials-table th:nth-child(4),
          .materials-table td:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadMaterials;