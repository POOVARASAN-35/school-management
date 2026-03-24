import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  FileArchive, 
  Video, 
  Music,
  Download,
  Eye,
  Calendar,
  Clock,
  User,
  BookOpen,
  ChevronRight,
  Grid,
  List,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Copy,
  Star,
  Award,
  Sparkles,
  Zap,
  Layers
} from "lucide-react";
const BASE_URL = "https://school-management-ac64.onrender.com";
const StudentMaterials = ({ subjectId }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState("all");
  const [notification, setNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    if (!subjectId) return;

    const fetchMaterials = async () => {
      try {
        console.log("🟢 Fetching materials for:", subjectId);
        setLoading(true);
        const res = await api.get(`/materials/${subjectId}`);
        
        // Add mock data for demonstration
        const enhancedMaterials = res.data.map((material, index) => ({
          ...material,
          type: getFileType(material.fileUrl),
          size: Math.floor(Math.random() * 5000 + 500), // Random size in KB
          uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          downloads: Math.floor(Math.random() * 100),
          author: "Dr. Smith",
          description: "Comprehensive study material covering key concepts and practice exercises.",
          tags: ["important", "exam", "revision"],
          views: Math.floor(Math.random() * 500)
        }));

        setMaterials(enhancedMaterials);
        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [subjectId]);

  const getFileType = (url) => {
    const extension = url?.split('.').pop()?.toLowerCase();
    const types = {
      pdf: 'pdf',
      doc: 'document',
      docx: 'document',
      xls: 'spreadsheet',
      xlsx: 'spreadsheet',
      ppt: 'presentation',
      pptx: 'presentation',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      mp4: 'video',
      mp3: 'audio',
      zip: 'archive',
      rar: 'archive'
    };
    return types[extension] || 'file';
  };

  const getFileIcon = (type) => {
    const icons = {
      pdf: <FileText size={24} />,
      document: <FileText size={24} />,
      spreadsheet: <FileSpreadsheet size={24} />,
      presentation: <FileText size={24} />,
      image: <FileImage size={24} />,
      video: <Video size={24} />,
      audio: <Music size={24} />,
      archive: <FileArchive size={24} />,
      file: <FileText size={24} />
    };
    return icons[type] || icons.file;
  };

  const getFileColor = (type) => {
    const colors = {
      pdf: '#ef4444',
      document: '#3b82f6',
      spreadsheet: '#22c55e',
      presentation: '#f97316',
      image: '#a855f7',
      video: '#ec4899',
      audio: '#06b6d4',
      archive: '#6b7280',
      file: '#64748b'
    };
    return colors[type] || colors.file;
  };

  const getTypeIcon = (type) => {
    const icons = {
      pdf: '📄',
      document: '📝',
      spreadsheet: '📊',
      presentation: '📽️',
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      archive: '📦',
      file: '📁'
    };
    return icons[type] || icons.file;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = (url, title) => {
    showNotification(`Downloading: ${title}`);
    window.open(`${BASE_URL}${url}`, '_blank');
  };

  const handlePreview = (url) => {
    window.open(`${BASE_URL}${url}`, '_blank');
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(`${BASE_URL}${url}`);
    showNotification('Link copied to clipboard!');
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 2000);
  };

  const getFileTypes = () => {
    const types = materials.map(m => m.type);
    return ['all', ...new Set(types)];
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || material.type === selectedType;
    return matchesSearch && matchesType;
  });

  // if (loading) {
  //   return (
  //     <div className="materials-loading">
  //       <div className="loading-spinner"></div>
  //       <p>Loading materials...</p>
  //       <style>{`
  //         .materials-loading {
  //           display: flex;
  //           flex-direction: column;
  //           align-items: center;
  //           justify-content: center;
  //           padding: 40px;
  //           background: white;
  //           border-radius: 16px;
  //           border: 1px solid #e2e8f0;
  //         }
  //         .loading-spinner {
  //           width: 40px;
  //           height: 40px;
  //           border: 3px solid #f3f3f3;
  //           border-top: 3px solid #3b82f6;
  //           border-radius: 50%;
  //           animation: spin 1s linear infinite;
  //           margin-bottom: 16px;
  //         }
  //         @keyframes spin {
  //           0% { transform: rotate(0deg); }
  //           100% { transform: rotate(360deg); }
  //         }
  //       `}</style>
  //     </div>
  //   );
  // }

  return (
    <div className="materials-container">
      {/* Notification */}
      {notification.show && (
        <div className="notification">
          <Check size={16} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="materials-header">
        <div className="header-title">
          <Layers size={20} className="title-icon" />
          <h3>Study Materials</h3>
          <span className="material-count">{filteredMaterials.length} items</span>
        </div>

        {/* Search and Filters */}
        <div className="materials-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-wrapper">
            <Filter size={16} className="filter-icon" />
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              {getFileTypes().map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : `${getTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}s`}
                </option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid size={16} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Materials Display */}
      {filteredMaterials.length === 0 ? (
        <div className="empty-materials">
          <div className="empty-icon">
            <FileText size={48} />
          </div>
          <h4>No Materials Found</h4>
          <p>{searchTerm ? 'Try adjusting your search' : 'No study materials have been uploaded yet'}</p>
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="materials-grid">
            {filteredMaterials.map((material, index) => (
              <div 
                key={material._id} 
                className="material-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="card-header" style={{ borderColor: getFileColor(material.type) }}>
                  <div className="file-icon" style={{ color: getFileColor(material.type) }}>
                    {getFileIcon(material.type)}
                  </div>
                  <div className="file-badge" style={{ backgroundColor: getFileColor(material.type) }}>
                    {material.type.toUpperCase()}
                  </div>
                  <span className="file-size">{formatFileSize(material.size * 1024)}</span>
                </div>

                <div className="card-body">
                  <h4 className="material-title">{material.title}</h4>
                  
                  {material.description && (
                    <p className="material-description">{material.description}</p>
                  )}

                  <div className="material-meta">
                    <div className="meta-item">
                      <User size={12} />
                      <span>{material.author}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={12} />
                      <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <Download size={12} />
                      <span>{material.downloads} downloads</span>
                    </div>
                    <div className="meta-item">
                      <Eye size={12} />
                      <span>{material.views} views</span>
                    </div>
                  </div>

                  {material.tags && material.tags.length > 0 && (
                    <div className="material-tags">
                      {material.tags.map((tag, i) => (
                        <span key={i} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button 
                    className="action-btn primary"
                    onClick={() => handlePreview(material.fileUrl)}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleDownload(material.fileUrl, material.title)}
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleCopyLink(material.fileUrl)}
                    title="Copy link"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="materials-list">
            {filteredMaterials.map((material) => (
              <div key={material._id} className="list-item">
                <div className="item-icon" style={{ color: getFileColor(material.type) }}>
                  {getFileIcon(material.type)}
                </div>
                
                <div className="item-content">
                  <div className="item-header">
                    <h4>{material.title}</h4>
                    <span className="item-type" style={{ backgroundColor: getFileColor(material.type) + '20', color: getFileColor(material.type) }}>
                      {getTypeIcon(material.type)} {material.type}
                    </span>
                  </div>
                  
                  {material.description && (
                    <p className="item-description">{material.description}</p>
                  )}
                  
                  <div className="item-footer">
                    <span className="item-meta">
                      <User size={12} />
                      {material.author}
                    </span>
                    <span className="item-meta">
                      <Calendar size={12} />
                      {new Date(material.uploadDate).toLocaleDateString()}
                    </span>
                    <span className="item-meta">
                      <Download size={12} />
                      {material.downloads}
                    </span>
                    <span className="item-meta">
                      <Eye size={12} />
                      {material.views}
                    </span>
                    <span className="item-meta">
                      <FileText size={12} />
                      {formatFileSize(material.size * 1024)}
                    </span>
                  </div>
                </div>

                <div className="item-actions">
                  <button 
                    className="list-action preview"
                    onClick={() => handlePreview(material.fileUrl)}
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="list-action download"
                    onClick={() => handleDownload(material.fileUrl, material.title)}
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    className="list-action copy"
                    onClick={() => handleCopyLink(material.fileUrl)}
                    title="Copy link"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    className="list-action external"
                    onClick={() => window.open(`${BASE_URL}${material.fileUrl}`, '_blank')}
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Stats Footer */}
      {filteredMaterials.length > 0 && (
        <div className="materials-footer">
          <div className="footer-stat">
            <Award size={14} />
            <span>{filteredMaterials.length} materials available</span>
          </div>
          <div className="footer-stat">
            <Sparkles size={14} />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="footer-stat">
            <Zap size={14} />
            <span>Total size: {formatFileSize(filteredMaterials.reduce((acc, m) => acc + (m.size * 1024), 0))}</span>
          </div>
        </div>
      )}

      <style>{`
        .materials-container {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          position: relative;
        }

        /* Notification */
        .notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #1e293b;
          color: white;
          padding: 12px 20px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
          z-index: 1000;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Header */
        .materials-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-icon {
          color: #3b82f6;
        }

        .header-title h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .material-count {
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          color: #475569;
        }

        .materials-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 8px 32px 8px 36px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.9rem;
          background: #f8fafc;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
        }

        .clear-search:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .filter-wrapper {
          position: relative;
          min-width: 140px;
        }

        .filter-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .filter-select {
          width: 100%;
          padding: 8px 24px 8px 36px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.9rem;
          background: #f8fafc;
          cursor: pointer;
          appearance: none;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          padding: 2px;
          background: #f1f5f9;
          border-radius: 20px;
        }

        .view-btn {
          padding: 6px 10px;
          border: none;
          background: transparent;
          border-radius: 18px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.3s ease;
        }

        .view-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Grid View */
        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .material-card {
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .material-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .card-header {
          padding: 16px;
          border-bottom: 3px solid;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .file-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .file-size {
          margin-left: auto;
          font-size: 0.75rem;
          color: #64748b;
          background: white;
          padding: 2px 8px;
          border-radius: 12px;
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
          line-height: 1.4;
        }

        .material-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #64748b;
        }

        .material-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag {
          font-size: 0.65rem;
          color: #3b82f6;
          background: #eff6ff;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .card-footer {
          display: flex;
          border-top: 1px solid #e2e8f0;
          padding: 12px;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .action-btn.primary:hover {
          background: #2563eb;
        }

        .action-btn:hover:not(.primary) {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* List View */
        .materials-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .list-item:hover {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .item-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-content {
          flex: 1;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .item-header h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .item-type {
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .item-description {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 8px 0;
        }

        .item-footer {
          display: flex;
          gap: 16px;
        }

        .item-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #64748b;
        }

        .item-actions {
          display: flex;
          gap: 8px;
        }

        .list-action {
          padding: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .list-action.preview:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .list-action.download:hover {
          border-color: #22c55e;
          color: #22c55e;
        }

        .list-action.copy:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .list-action.external:hover {
          border-color: #f97316;
          color: #f97316;
        }

        /* Empty State */
        .empty-materials {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .empty-materials h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .empty-materials p {
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .clear-search-btn {
          padding: 8px 20px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          color: #475569;
          cursor: pointer;
        }

        .clear-search-btn:hover {
          background: #e2e8f0;
        }

        /* Footer */
        .materials-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          font-size: 0.8rem;
          color: #64748b;
        }

        .footer-stat {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .materials-header {
            flex-direction: column;
            align-items: stretch;
          }

          .materials-controls {
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .filter-wrapper {
            width: 100%;
          }

          .list-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .item-header {
            flex-wrap: wrap;
          }

          .item-footer {
            flex-wrap: wrap;
          }

          .item-actions {
            width: 100%;
            justify-content: space-around;
          }

          .materials-footer {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentMaterials;