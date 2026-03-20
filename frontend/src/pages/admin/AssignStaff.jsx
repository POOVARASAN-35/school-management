import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  UserPlus, 
  Users, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
  GraduationCap
} from "lucide-react";

const AssignStaff = () => {
  const [subjects, setSubjects] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [assignmentHistory, setAssignmentHistory] = useState([]);

  const itemsPerPage = 6;

  // Load subjects
  const fetchSubjects = async () => {
    try {
      const res = await api.get("/admin/subjects");
      setSubjects(res.data);
      if (res.data.length > 0 && !subjectId) setSubjectId(res.data[0]._id);
    } catch (error) {
      showNotification('error', 'Failed to fetch subjects');
    }
  };

  // Load staff users
  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      const onlyStaff = res.data.filter(u => u.role === "staff");
      setStaffs(onlyStaff);
      if (onlyStaff.length > 0 && !staffId) setStaffId(onlyStaff[0]._id);
      setLoading(false);
    } catch (error) {
      showNotification('error', 'Failed to fetch staff');
      setLoading(false);
    }
  };

  const assign = async (e, subject, staff) => {
    e.preventDefault();

    try {
      await api.post("/admin/subjects/assign", {
        subjectId: subject._id,
        staffId: staff._id,
      });

      // Add to assignment history
      const newAssignment = {
        id: Date.now(),
        subject: subject.name,
        staff: staff.name,
        date: new Date().toISOString(),
        status: 'success'
      };
      setAssignmentHistory([newAssignment, ...assignmentHistory].slice(0, 10));

      showNotification('success', `${staff.name} assigned to ${subject.name} successfully`);
      setShowAssignModal(false);
      fetchSubjects(); // refresh list
    } catch (error) {
      showNotification('error', 'Failed to assign staff');
    }
  };

  const unassignStaff = async (subject) => {
    try {
      await api.post("/admin/subjects/unassign", {
        subjectId: subject._id,
      });

      showNotification('info', `Staff unassigned from ${subject.name}`);
      fetchSubjects();
    } catch (error) {
      showNotification('error', 'Failed to unassign staff');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchSubjects();
    fetchStaffs();
  }, []);

  // Filter staff based on search and department
  const filteredStaff = staffs.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Pagination for staff list
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  // Get unique departments
  const departments = ['all', ...new Set(staffs.map(s => s.department).filter(Boolean))];

  // Statistics
  const totalSubjects = subjects.length;
  const assignedSubjects = subjects.filter(s => s.staff).length;
  const unassignedSubjects = subjects.filter(s => !s.staff).length;
  const totalStaff = staffs.length;
  const activeStaff = staffs.filter(s => s.status === 'active').length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading assignment data...</p>
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
            border-top: 3px solid #f97316;
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
    <div className="assign-staff-page">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? <Check size={20} /> : 
             notification.type === 'error' ? <AlertCircle size={20} /> :
             <AlertCircle size={20} />}
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
            <UserPlus size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">Staff Assignment</h1>
            <p className="page-subtitle">Assign and manage staff members to subjects</p>
          </div>
        </div>
        
        <button className="refresh-btn" onClick={() => {
          fetchSubjects();
          fetchStaffs();
        }}>
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-blue-50">
            <BookOpen className="stat-icon text-blue-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Subjects</p>
            <h3 className="stat-value">{totalSubjects}</h3>
            <span className="stat-trend">Across all courses</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-green-50">
            <UserCheck className="stat-icon text-green-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Assigned</p>
            <h3 className="stat-value">{assignedSubjects}</h3>
            <span className="stat-trend positive">{((assignedSubjects/totalSubjects)*100).toFixed(1)}% coverage</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-red-50">
            <UserX className="stat-icon text-red-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Unassigned</p>
            <h3 className="stat-value">{unassignedSubjects}</h3>
            <span className="stat-trend negative">Need attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple-50">
            <Users className="stat-icon text-purple-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Available Staff</p>
            <h3 className="stat-value">{activeStaff}</h3>
            <span className="stat-trend">{totalStaff} total</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column - Subjects List */}
        <div className="subjects-section">
          <div className="section-header">
            <h2>Subjects Requiring Staff</h2>
            <span className="section-count">{subjects.length} subjects</span>
          </div>

          <div className="subjects-list">
            {subjects.map((subject) => {
              const isAssigned = !!subject.staff;
              return (
                <div key={subject._id} className={`subject-item ${isAssigned ? 'assigned' : 'unassigned'}`}>
                  <div className="subject-info">
                    <div className="subject-icon">
                      <BookOpen size={20} />
                    </div>
                    <div className="subject-details">
                      <h3 className="subject-name">{subject.name}</h3>
                      <p className="subject-meta">
                        <span className="course-name">{subject.course?.name}</span>
                        <span className="credits">{subject.credits || 3} credits</span>
                      </p>
                    </div>
                  </div>

                  <div className="assignment-info">
                    {isAssigned ? (
                      <div className="assigned-staff">
                        <div className="staff-badge">
                          <GraduationCap size={14} />
                          <span>{subject.staff.name}</span>
                        </div>
                        <button 
                          className="unassign-btn"
                          onClick={() => unassignStaff(subject)}
                          title="Unassign staff"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="assign-btn"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setShowAssignModal(true);
                        }}
                      >
                        <UserPlus size={16} />
                        <span>Assign Staff</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Staff List & Recent Assignments */}
        <div className="staff-section">
          {/* Staff Search and Filter */}
          <div className="staff-search">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-wrapper">
              <Filter size={18} className="filter-icon" />
              <select 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Departments</option>
                {departments.filter(d => d !== 'all').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Staff Grid */}
          <div className="staff-grid">
            {currentStaff.length > 0 ? (
              currentStaff.map((staff) => (
                <div key={staff._id} className="staff-card">
                  <div className="staff-avatar">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="staff-details">
                    <h3 className="staff-name">{staff.name}</h3>
                    <p className="staff-email">
                      <Mail size={12} />
                      {staff.email}
                    </p>
                    {staff.department && (
                      <p className="staff-department">
                        <Award size={12} />
                        {staff.department}
                      </p>
                    )}
                    <div className="staff-status">
                      <span className={`status-dot ${staff.status || 'active'}`}></span>
                      <span>{staff.status || 'Active'}</span>
                    </div>
                  </div>
                  <div className="staff-assignments">
                    <span className="assignment-count">
                      {subjects.filter(s => s.staff?._id === staff._id).length} subjects
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-staff-message">
                <Users size={48} />
                <p>No staff members found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredStaff.length > itemsPerPage && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="pagination-info">
                {currentPage} / {totalPages}
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

          {/* Recent Assignment History */}
          {assignmentHistory.length > 0 && (
            <div className="assignment-history">
              <h3>Recent Assignments</h3>
              <div className="history-list">
                {assignmentHistory.map((assignment) => (
                  <div key={assignment.id} className="history-item">
                    <div className="history-icon">
                      <CheckCircle size={14} />
                    </div>
                    <div className="history-details">
                      <p>
                        <strong>{assignment.staff}</strong> assigned to <strong>{assignment.subject}</strong>
                      </p>
                      <span className="history-time">
                        {new Date(assignment.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Staff Modal */}
      {showAssignModal && selectedSubject && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Staff to Subject</h2>
              <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="subject-info-card">
                <BookOpen size={20} />
                <div>
                  <h3>{selectedSubject.name}</h3>
                  <p>{selectedSubject.course?.name} • {selectedSubject.credits || 3} credits</p>
                </div>
              </div>

              <h3 className="staff-selection-title">Select Staff Member</h3>

              <div className="staff-selection-grid">
                {staffs
                  .filter(staff => staff.status !== 'inactive')
                  .map((staff) => (
                    <button
                      key={staff._id}
                      className={`staff-option ${staffId === staff._id ? 'selected' : ''}`}
                      onClick={() => setStaffId(staff._id)}
                    >
                      <div className="staff-option-avatar">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="staff-option-details">
                        <h4>{staff.name}</h4>
                        <p>{staff.email}</p>
                        {staff.department && (
                          <span className="staff-option-dept">{staff.department}</span>
                        )}
                      </div>
                      {staffId === staff._id && (
                        <Check className="selected-check" size={18} />
                      )}
                    </button>
                  ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button 
                className="assign-submit-btn"
                onClick={(e) => {
                  const selectedStaff = staffs.find(s => s._id === staffId);
                  assign(e, selectedSubject, selectedStaff);
                }}
                disabled={!staffId}
              >
                <UserPlus size={18} />
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .assign-staff-page {
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

        .notification.info {
          border-left-color: #3b82f6;
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

        .notification.info .notification-content svg {
          color: #3b82f6;
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
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
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
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          border-color: #f97316;
          color: #f97316;
          transform: rotate(180deg);
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
          box-shadow: 0 20px 30px rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.3);
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

        .stat-trend.negative {
          color: #ef4444;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* Subjects Section */
        .subjects-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .section-count {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #475569;
        }

        .subjects-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .subjects-list::-webkit-scrollbar {
          width: 6px;
        }

        .subjects-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .subjects-list::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }

        .subject-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .subject-item:hover {
          transform: translateX(5px);
          border-color: #f97316;
        }

        .subject-item.assigned {
          border-left: 4px solid #10b981;
        }

        .subject-item.unassigned {
          border-left: 4px solid #ef4444;
        }

        .subject-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subject-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f97316;
        }

        .subject-details h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .subject-meta {
          display: flex;
          gap: 8px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .course-name {
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .assignment-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .assigned-staff {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .staff-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .unassign-btn {
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #ef4444;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .unassign-btn:hover {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .assign-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .assign-btn:hover {
          background: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(249, 115, 22, 0.3);
        }

        /* Staff Section */
        .staff-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .staff-search {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-wrapper {
          flex: 1;
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
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .filter-wrapper {
          position: relative;
          min-width: 150px;
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
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
          appearance: none;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .staff-grid::-webkit-scrollbar {
          width: 6px;
        }

        .staff-grid::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .staff-grid::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }

        .staff-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .staff-card:hover {
          transform: translateY(-5px);
          border-color: #f97316;
          box-shadow: 0 10px 20px rgba(249, 115, 22, 0.1);
        }

        .staff-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .staff-details {
          width: 100%;
        }

        .staff-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .staff-email,
        .staff-department {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.8rem;
          margin: 2px 0;
        }

        .staff-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-top: 8px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.active {
          background: #10b981;
        }

        .staff-assignments {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          width: 100%;
        }

        .assignment-count {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #475569;
        }

        .no-staff-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #94a3b8;
        }

        .no-staff-message svg {
          margin-bottom: 16px;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin: 20px 0;
        }

        .pagination-btn {
          padding: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
          color: #f97316;
          border-color: #f97316;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #64748b;
          font-size: 0.95rem;
        }

        /* Assignment History */
        .assignment-history {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .assignment-history h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          animation: slideIn 0.3s ease;
        }

        .history-icon {
          color: #10b981;
        }

        .history-details {
          flex: 1;
        }

        .history-details p {
          margin: 0 0 4px 0;
          font-size: 0.9rem;
          color: #475569;
        }

        .history-time {
          font-size: 0.75rem;
          color: #94a3b8;
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
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
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

        .modal-body {
          padding: 24px;
        }

        .subject-info-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .subject-info-card svg {
          color: #f97316;
        }

        .subject-info-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .subject-info-card p {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .staff-selection-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .staff-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .staff-selection-grid::-webkit-scrollbar {
          width: 6px;
        }

        .staff-selection-grid::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .staff-selection-grid::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }

        .staff-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          width: 100%;
        }

        .staff-option:hover {
          border-color: #f97316;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(249, 115, 22, 0.1);
        }

        .staff-option.selected {
          border-color: #f97316;
          background: #fff7ed;
        }

        .staff-option-avatar {
          width: 40px;
          height: 40px;
          background: #f97316;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .staff-option-details {
          flex: 1;
          text-align: left;
        }

        .staff-option-details h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .staff-option-details p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
        }

        .staff-option-dept {
          font-size: 0.7rem;
          color: #f97316;
          background: #fff7ed;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
          margin-top: 4px;
        }

        .selected-check {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #f97316;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
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

        .assign-submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .assign-submit-btn:hover:not(:disabled) {
          background: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(249, 115, 22, 0.3);
        }

        .assign-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .assign-staff-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .staff-search {
            flex-direction: column;
          }

          .filter-wrapper {
            width: 100%;
          }

          .staff-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .subject-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .assignment-info {
            width: 100%;
          }

          .assign-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AssignStaff;