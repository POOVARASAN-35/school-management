import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  BookMarked, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  BookOpen,
  Layers,
  Clock,
  Users,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Download,
  Grid,
  List
} from "lucide-react";

const Subjects = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");
  const [duration, setDuration] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const subjectsPerPage = 8;

  // Load courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data);
      if (res.data.length > 0 && !courseId) {
        setCourseId(res.data[0]._id);
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch courses');
    }
  };

  // Load subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/subjects");
      setSubjects(res.data);
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to fetch subjects');
      setLoading(false);
    }
  };

  const createSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/subjects", {
        name,
        courseId,
        description,
        credits: parseInt(credits) || 3,
        duration: duration || "16 weeks",
        status: 'active',
        students: 0
      });
      resetForm();
      setShowAddModal(false);
      fetchSubjects();
      showNotification('success', 'Subject created successfully');
    } catch (error) {
      showNotification('error', 'Failed to create subject');
    }
  };

  const updateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/subjects/${editingSubject._id}`, {
        name,
        courseId,
        description,
        credits: parseInt(credits),
        duration
      });
      resetForm();
      setEditingSubject(null);
      setShowAddModal(false);
      fetchSubjects();
      showNotification('success', 'Subject updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update subject');
    }
  };

  const deleteSubject = async () => {
    try {
      await api.delete(`/admin/subjects/${subjectToDelete._id}`);
      setShowDeleteModal(false);
      setSubjectToDelete(null);
      fetchSubjects();
      showNotification('success', 'Subject deleted successfully');
    } catch (error) {
      showNotification('error', 'Failed to delete subject');
    }
  };

  const resetForm = () => {
    setName("");
    setCourseId(courses[0]?._id || "");
    setDescription("");
    setCredits("");
    setDuration("");
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setCourseId(subject.course?._id || subject.courseId);
    setDescription(subject.description || "");
    setCredits(subject.credits?.toString() || "3");
    setDuration(subject.duration || "16 weeks");
    setShowAddModal(true);
  };

  const handleDelete = (subject) => {
    setSubjectToDelete(subject);
    setShowDeleteModal(true);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  // Filter subjects based on search and course
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCourse = filterCourse === 'all' || subject.course?._id === filterCourse || subject.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  // Pagination
  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(indexOfFirstSubject, indexOfLastSubject);
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

  // Statistics
  const totalSubjects = subjects.length;
  const totalCourses = courses.length;
  const totalCredits = subjects.reduce((acc, s) => acc + (s.credits || 3), 0);
  const avgCredits = totalSubjects > 0 ? (totalCredits / totalSubjects).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading subjects...</p>
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
    <div className="subjects-page">
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

      {/* Header Section */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <BookMarked size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Subject Management</h1>
            <p className="page-subtitle">Organize and manage subjects across courses</p>
          </div>
        </div>
        
        <button className="add-subject-btn" onClick={() => {
          resetForm();
          setEditingSubject(null);
          setShowAddModal(true);
        }}>
          <Plus size={20} />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-indigo-50">
            <BookMarked className="stat-icon text-indigo-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Subjects</p>
            <h3 className="stat-value">{totalSubjects}</h3>
            <span className="stat-trend positive">+8 this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple-50">
            <BookOpen className="stat-icon text-purple-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Active Courses</p>
            <h3 className="stat-value">{totalCourses}</h3>
            <span className="stat-trend positive">{courses.filter(c => c.status === 'active').length} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-amber-50">
            <Layers className="stat-icon text-amber-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Credits</p>
            <h3 className="stat-value">{totalCredits}</h3>
            <span className="stat-trend">Avg {avgCredits} per subject</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-emerald-50">
            <Users className="stat-icon text-emerald-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Enrolled Students</p>
            <h3 className="stat-value">2,456</h3>
            <span className="stat-trend positive">+124 this week</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search subjects by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-wrapper">
            <Filter size={18} className="filter-icon" />
            <select 
              value={filterCourse} 
              onChange={(e) => setFilterCourse(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>

          <button className="export-btn">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid/List View */}
      {currentSubjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="subjects-grid">
            {currentSubjects.map((subject) => {
              const course = courses.find(c => c._id === (subject.course?._id || subject.courseId));
              return (
                <div key={subject._id} className="subject-card">
                  <div className="subject-header">
                    <div className="subject-icon-wrapper">
                      <BookMarked size={24} className="subject-icon" />
                    </div>
                    <div className="subject-status">
                      <span className={`status-badge ${subject.status || 'active'}`}>
                        {subject.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="subject-content">
                    <h3 className="subject-title">{subject.name}</h3>
                    
                    <div className="subject-course">
                      <BookOpen size={14} />
                      <span>{course?.name || 'Unknown Course'}</span>
                    </div>

                    {subject.description && (
                      <p className="subject-description">{subject.description}</p>
                    )}
                    
                    <div className="subject-meta">
                      <div className="meta-item">
                        <Layers size={14} />
                        <span>{subject.credits || 3} Credits</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{subject.duration || '16 weeks'}</span>
                      </div>
                      <div className="meta-item">
                        <Users size={14} />
                        <span>{subject.students || 0} Students</span>
                      </div>
                    </div>

                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '65%' }}></div>
                    </div>

                    <div className="subject-footer">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(subject)}
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(subject)}
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="subjects-list">
            <table className="subjects-table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Course</th>
                  <th>Credits</th>
                  <th>Duration</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSubjects.map((subject) => {
                  const course = courses.find(c => c._id === (subject.course?._id || subject.courseId));
                  return (
                    <tr key={subject._id}>
                      <td>
                        <div className="subject-cell">
                          <div className="subject-icon-small">
                            <BookMarked size={16} />
                          </div>
                          <div>
                            <div className="subject-name">{subject.name}</div>
                            {subject.description && (
                              <div className="subject-desc">{subject.description.substring(0, 50)}...</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="course-badge">{course?.name || 'Unknown'}</span>
                      </td>
                      <td>
                        <span className="credit-badge">{subject.credits || 3}</span>
                      </td>
                      <td>{subject.duration || '16 weeks'}</td>
                      <td>
                        <span className="student-count">{subject.students || 0}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${subject.status || 'active'}`}>
                          {subject.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="table-action edit" onClick={() => handleEdit(subject)}>
                            <Edit size={16} />
                          </button>
                          <button className="table-action delete" onClick={() => handleDelete(subject)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="empty-state">
          <BookMarked size={64} className="empty-icon" />
          <h3>No Subjects Found</h3>
          <p>Get started by adding your first subject</p>
          <button className="empty-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Subject
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredSubjects.length > subjectsPerPage && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingSubject ? updateSubject : createSubject}>
              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Advanced Mathematics"
                  required
                />
              </div>

              <div className="form-group">
                <label>Course *</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the subject"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Credits</label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    placeholder="3"
                    min="1"
                    max="6"
                  />
                </div>

                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 16 weeks"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingSubject ? 'Update Subject' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Subject</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="delete-content">
              <AlertCircle size={48} className="delete-icon" />
              <p>Are you sure you want to delete <strong>"{subjectToDelete?.name}"</strong>?</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={deleteSubject}>
                Delete Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .subjects-page {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Notification Styles */
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
          z-index: 1000;
          animation: slideIn 0.3s ease;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #10b981;
        }

        .notification.error {
          border-left-color: #ef4444;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification.success .notification-content svg {
          color: #10b981;
        }

        .notification.error .notification-content svg {
          color: #ef4444;
        }

        .notification-close {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .notification-close:hover {
          background: #f1f5f9;
          color: #475569;
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

        /* Header Styles */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
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

        .add-subject-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        .add-subject-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 4px 0;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }

        .stat-trend {
          font-size: 0.8rem;
          color: #64748b;
        }

        .stat-trend.positive {
          color: #10b981;
        }

        /* Search and Filter */
        .search-filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .filter-group {
          display: flex;
          gap: 12px;
        }

        .filter-wrapper {
          position: relative;
          min-width: 180px;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .filter-select {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
          appearance: none;
        }

        .filter-select:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
        }

        .view-btn {
          padding: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn.active {
          background: white;
          color: #8b5cf6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .export-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        /* Subjects Grid */
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .subject-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .subject-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .subject-icon-wrapper {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .subject-content {
          padding: 20px;
        }

        .subject-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .subject-course {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8b5cf6;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .subject-description {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .subject-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #475569;
          font-size: 0.85rem;
          background: #f8fafc;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #c084fc);
          border-radius: 3px;
          transition: width 1s ease;
        }

        .subject-footer {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          background: #f5f3ff;
        }

        .delete-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: #fef2f2;
        }

        /* List View */
        .subjects-list {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 32px;
        }

        .subjects-table {
          width: 100%;
          border-collapse: collapse;
        }

        .subjects-table th {
          text-align: left;
          padding: 16px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .subjects-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .subjects-table tr:last-child td {
          border-bottom: none;
        }

        .subjects-table tr:hover td {
          background: #f8fafc;
        }

        .subject-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subject-icon-small {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
        }

        .subject-name {
          font-weight: 500;
          color: #1e293b;
        }

        .subject-desc {
          font-size: 0.8rem;
          color: #64748b;
        }

        .course-badge {
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #475569;
        }

        .credit-badge {
          background: #8b5cf6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.85rem;
        }

        .student-count {
          font-weight: 500;
          color: #1e293b;
        }

        .table-actions {
          display: flex;
          gap: 8px;
        }

        .table-action {
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .table-action.edit:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .table-action.delete:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
          border: 2px dashed #e2e8f0;
        }

        .empty-icon {
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          color: #1e293b;
          font-size: 1.3rem;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: #64748b;
          margin: 0 0 20px 0;
        }

        .empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .empty-btn:hover {
          background: #7c3aed;
          transform: translateY(-2px);
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 32px;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
          color: #8b5cf6;
          border-color: #8b5cf6;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #64748b;
          font-size: 0.95rem;
        }

        /* Modal Styles */
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
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .delete-modal {
          max-width: 400px;
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
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .cancel-btn {
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .submit-btn {
          padding: 10px 24px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #7c3aed;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
        }

        .delete-confirm-btn {
          padding: 10px 24px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .delete-confirm-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
        }

        .delete-content {
          padding: 32px 24px;
          text-align: center;
        }

        .delete-icon {
          color: #ef4444;
          margin-bottom: 16px;
        }

        .delete-content p {
          color: #475569;
          margin: 8px 0;
        }

        .delete-warning {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .subjects-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .add-subject-btn {
            width: 100%;
          }

          .filter-group {
            width: 100%;
            flex-wrap: wrap;
          }

          .filter-wrapper {
            flex: 1;
          }

          .subjects-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .subjects-table {
            font-size: 0.9rem;
          }

          .subjects-table th:nth-child(2),
          .subjects-table td:nth-child(2),
          .subjects-table th:nth-child(4),
          .subjects-table td:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Subjects;