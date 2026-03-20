import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  BookMarked,
  GraduationCap
} from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [instructor, setInstructor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const coursesPerPage = 6;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/courses");
      setCourses(res.data);
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to fetch courses');
      setLoading(false);
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/courses", { 
        name, 
        description, 
        duration, 
        category, 
        instructor,
        students: 0,
        status: 'active'
      });
      resetForm();
      setShowAddModal(false);
      fetchCourses();
      showNotification('success', 'Course created successfully');
    } catch (error) {
      showNotification('error', 'Failed to create course');
    }
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/courses/${editingCourse._id}`, {
        name,
        description,
        duration,
        category,
        instructor
      });
      resetForm();
      setEditingCourse(null);
      fetchCourses();
      showNotification('success', 'Course updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update course');
    }
  };

  const deleteCourse = async () => {
    try {
      await api.delete(`/admin/courses/${courseToDelete._id}`);
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
      showNotification('success', 'Course deleted successfully');
    } catch (error) {
      showNotification('error', 'Failed to delete course');
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDuration("");
    setCategory("");
    setInstructor("");
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setName(course.name);
    setDescription(course.description || "");
    setDuration(course.duration || "");
    setCategory(course.category || "");
    setInstructor(course.instructor || "");
    setShowAddModal(true);
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);
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
  }, []);

  // Filter courses based on search and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Get unique categories for filter
  const categories = ['all', ...new Set(courses.map(c => c.category).filter(Boolean))];

  // Statistics
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.students || 0), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
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
    <div className="courses-page">
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
            <BookOpen size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Course Management</h1>
            <p className="page-subtitle">Manage and organize your educational courses</p>
          </div>
        </div>
        
        <button className="add-course-btn" onClick={() => {
          resetForm();
          setEditingCourse(null);
          setShowAddModal(true);
        }}>
          <Plus size={20} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-blue-50">
            <BookOpen className="stat-icon text-blue-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Courses</p>
            <h3 className="stat-value">{totalCourses}</h3>
            <span className="stat-trend positive">+12% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-green-50">
            <GraduationCap className="stat-icon text-green-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Active Courses</p>
            <h3 className="stat-value">{activeCourses}</h3>
            <span className="stat-trend positive">+5 new</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple-50">
            <Users className="stat-icon text-purple-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Students</p>
            <h3 className="stat-value">{totalStudents}</h3>
            <span className="stat-trend positive">+124 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-amber-50">
            <BookMarked className="stat-icon text-amber-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Categories</p>
            <h3 className="stat-value">{categories.length - 1}</h3>
            <span className="stat-trend">Across all courses</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search courses by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-wrapper">
          <Filter size={18} className="filter-icon" />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {currentCourses.length > 0 ? (
        <div className="courses-grid">
          {currentCourses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <div className="course-icon-wrapper">
                  <BookOpen size={24} className="course-icon" />
                </div>
                <div className="course-status">
                  <span className={`status-badge ${course.status || 'active'}`}>
                    {course.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="course-content">
                <h3 className="course-title">{course.name}</h3>
                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}
                
                <div className="course-meta">
                  {course.category && (
                    <div className="meta-item">
                      <span className="meta-label">Category:</span>
                      <span className="meta-value">{course.category}</span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  {course.instructor && (
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>Started: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-number">{course.students || 0}</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">75%</span>
                    <span className="stat-label">Completion</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">4.5</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="course-footer">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(course)}
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(course)}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOpen size={64} className="empty-icon" />
          <h3>No Courses Found</h3>
          <p>Get started by creating your first course</p>
          <button className="empty-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Create Course
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredCourses.length > coursesPerPage && (
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

      {/* Add/Edit Course Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingCourse ? updateCourse : createCourse}>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Introduction to React"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the course"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 12 weeks"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Programming"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Instructor</label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g., Dr. John Smith"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCourse ? 'Update Course' : 'Create Course'}
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
              <h2>Delete Course</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="delete-content">
              <AlertCircle size={48} className="delete-icon" />
              <p>Are you sure you want to delete <strong>"{courseToDelete?.name}"</strong>?</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={deleteCourse}>
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .courses-page {
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

        .add-course-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .add-course-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
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
          box-shadow: 0 20px 30px rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-wrapper {
          position: relative;
          min-width: 200px;
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Courses Grid */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .course-card {
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

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .course-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .course-icon-wrapper {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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

        .course-content {
          padding: 20px;
        }

        .course-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .course-description {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .course-meta {
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

        .course-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
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
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 3px;
          transition: width 1s ease;
        }

        .course-footer {
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
          background: white;
          color: #64748b;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:first-child {
          border-right: 1px solid #e2e8f0;
        }

        .action-btn:hover {
          background: #f8fafc;
        }

        .edit-btn:hover {
          color: #3b82f6;
        }

        .delete-btn:hover {
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
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .empty-btn:hover {
          background: #2563eb;
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
          color: #3b82f6;
          border-color: #3b82f6;
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
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
          .courses-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .add-course-btn {
            width: 100%;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Courses;