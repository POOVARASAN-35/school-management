import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  createUser,
  updateUserStatus,
} from "../../api/admin.api";
import { 
  Users as UsersIcon, 
  UserPlus, 
  Search, 
  Filter,
  Mail,
  Shield,
  UserCog,
  GraduationCap,
  Briefcase,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserCheck,
  UserX
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    students: 0,
    staff: 0,
    admins: 0
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    phone: "",
    address: ""
  });

  const itemsPerPage = 5;

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();
      setUsers(res.data);
      
      // Calculate stats
      const total = res.data.length;
      const active = res.data.filter(u => u.status === 'active').length;
      const suspended = res.data.filter(u => u.status === 'suspended').length;
      const students = res.data.filter(u => u.role === 'student').length;
      const staff = res.data.filter(u => u.role === 'staff').length;
      const admins = res.data.filter(u => u.role === 'admin').length;
      
      setStats({ total, active, suspended, students, staff, admins });
    } catch (err) {
      showNotification('error', err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Create user
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(form);
      setOpen(false);
      setForm({ 
        name: "", 
        email: "", 
        password: "", 
        role: "student",
        department: "",
        phone: "",
        address: ""
      });
      loadUsers();
      showNotification('success', 'User created successfully');
    } catch (err) {
      showNotification('error', err.response?.data?.message || "Failed to create user");
    }
  };

  // Suspend / Activate
  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      await updateUserStatus(user._id, newStatus);
      loadUsers();
      showNotification('success', `User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (err) {
      showNotification('error', "Failed to update user status");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield size={16} />;
      case 'staff': return <Briefcase size={16} />;
      case 'student': return <GraduationCap size={16} />;
      default: return <UserCog size={16} />;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'staff': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'student': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle size={14} />;
      case 'suspended': return <Ban size={14} />;
      case 'pending': return <AlertCircle size={14} />;
      default: return <XCircle size={14} />;
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(u => u._id));
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
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
    <div className="users-page">
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

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <UsersIcon size={32} className="header-icon" />
          </div>
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Manage users, roles, and permissions</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button
            onClick={() => setOpen(true)}
            className="create-btn"
          >
            <UserPlus size={20} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-blue-50">
            <UsersIcon className="stat-icon text-blue-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">{stats.total}</h3>
            <span className="stat-trend">Registered users</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-green-50">
            <UserCheck className="stat-icon text-green-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Active</p>
            <h3 className="stat-value">{stats.active}</h3>
            <span className="stat-trend positive">{((stats.active/stats.total)*100 || 0).toFixed(1)}% active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-red-50">
            <UserX className="stat-icon text-red-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Suspended</p>
            <h3 className="stat-value">{stats.suspended}</h3>
            <span className="stat-trend negative">Need attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple-50">
            <GraduationCap className="stat-icon text-purple-600" size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Students</p>
            <h3 className="stat-value">{stats.students}</h3>
            <span className="stat-trend">{stats.staff} staff</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-wrapper">
            <Filter size={18} className="filter-icon" />
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="filter-wrapper">
            <Filter size={18} className="filter-icon" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" strokeWidth="2"/>
                <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/>
                <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2"/>
                <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2"/>
                <line x1="15" y1="3" x2="15" y2="21" strokeWidth="2"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          <button className="refresh-btn" onClick={loadUsers} title="Refresh">
            <RefreshCw size={18} />
          </button>

          <button className="export-btn" title="Export users">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">{selectedUsers.length} selected</span>
          <div className="bulk-buttons">
            <button className="bulk-btn" onClick={() => {
              selectedUsers.forEach(id => {
                const user = users.find(u => u._id === id);
                if (user.status !== 'active') toggleStatus(user);
              });
              setSelectedUsers([]);
            }}>
              <Unlock size={16} />
              Activate
            </button>
            <button className="bulk-btn" onClick={() => {
              selectedUsers.forEach(id => {
                const user = users.find(u => u._id === id);
                if (user.status !== 'suspended') toggleStatus(user);
              });
              setSelectedUsers([]);
            }}>
              <Lock size={16} />
              Suspend
            </button>
            <button className="bulk-btn delete" onClick={() => {
              setShowDeleteModal(true);
            }}>
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Users Display */}
      {filteredUsers.length > 0 ? (
        viewMode === 'table' ? (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === currentUsers.length}
                      onChange={selectAllUsers}
                    />
                  </th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                      />
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">ID: {user._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="email-cell">
                        <Mail size={14} />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <span className="last-active">
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="table-action view"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="table-action edit"
                          onClick={() => {
                            setForm(user);
                            setOpen(true);
                          }}
                          title="Edit user"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className={`table-action ${user.status === 'active' ? 'suspend' : 'activate'}`}
                          onClick={() => toggleStatus(user)}
                          title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                        >
                          {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="users-grid">
            {currentUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-card-header">
                  <input
                    type="checkbox"
                    className="user-select"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                  />
                  <div className="user-avatar-large">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-status">
                    <span className={`status-badge ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      {user.status || 'active'}
                    </span>
                  </div>
                </div>

                <div className="user-card-body">
                  <h3 className="user-name-large">{user.name}</h3>
                  <p className="user-email">
                    <Mail size={14} />
                    {user.email}
                  </p>
                  
                  <div className="user-meta">
                    <span className={`role-badge ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                    {user.department && (
                      <span className="department">{user.department}</span>
                    )}
                  </div>

                  {user.phone && (
                    <p className="user-phone">{user.phone}</p>
                  )}

                  <div className="user-id-card">
                    <span>User ID</span>
                    <span>{user._id}</span>
                  </div>
                </div>

                <div className="user-card-footer">
                  <button 
                    className="card-action view"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowViewModal(true);
                    }}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button 
                    className="card-action edit"
                    onClick={() => {
                      setForm(user);
                      setOpen(true);
                    }}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button 
                    className={`card-action ${user.status === 'active' ? 'suspend' : 'activate'}`}
                    onClick={() => toggleStatus(user)}
                  >
                    {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="empty-state">
          <UsersIcon size={64} className="empty-icon" />
          <h3>No Users Found</h3>
          <p>{searchTerm ? 'No users match your search criteria' : 'Get started by adding your first user'}</p>
          {!searchTerm && (
            <button 
              className="create-first-btn"
              onClick={() => setOpen(true)}
            >
              <UserPlus size={18} />
              Add First User
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
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

      {/* Add/Edit User Modal */}
      <div className={`modal-overlay ${open ? 'active' : ''}`} onClick={() => setOpen(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{form._id ? 'Edit User' : 'Add New User'}</h2>
            <button className="close-btn" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreate}>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {!form._id && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  placeholder="Enter address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows="2"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {form._id ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay active" onClick={() => setShowViewModal(false)}>
          <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="user-profile-header">
                <div className="profile-avatar">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                </div>
              </div>

              <div className="user-details-grid">
                <div className="detail-item">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">{selectedUser._id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Role</span>
                  <span className={`role-badge ${getRoleColor(selectedUser.role)}`}>
                    {getRoleIcon(selectedUser.role)}
                    {selectedUser.role}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`status-badge ${getStatusColor(selectedUser.status)}`}>
                    {getStatusIcon(selectedUser.status)}
                    {selectedUser.status || 'active'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span>{selectedUser.department || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span>{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Joined</span>
                  <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Active</span>
                  <span>{selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleDateString() : 'Never'}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Address</span>
                  <span>{selectedUser.address || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button 
                className="edit-btn"
                onClick={() => {
                  setShowViewModal(false);
                  setForm(selectedUser);
                  setOpen(true);
                }}
              >
                <Edit size={16} />
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay active" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Users</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="delete-content">
              <AlertCircle size={48} className="delete-icon" />
              <p>Are you sure you want to delete 
                <strong> {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}</strong>?
              </p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-confirm-btn">
                Delete {selectedUsers.length > 1 ? 'Users' : 'User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .users-page {
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

        .notification.success .notification-content svg {
          color: #22c55e;
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

        .create-btn {
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

        .create-btn:hover {
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
          color: #22c55e;
        }

        .stat-trend.negative {
          color: #ef4444;
        }

        /* Search and Filter */
        .search-filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
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

        .filter-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-wrapper {
          position: relative;
          min-width: 140px;
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
          border-radius: 10px;
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

        .view-toggle {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 10px;
        }

        .view-btn {
          padding: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .refresh-btn, .export-btn {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .export-btn:hover {
          border-color: #22c55e;
          color: #22c55e;
        }

        /* Bulk Actions */
        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: #3b82f6;
          border-radius: 12px;
          margin-bottom: 20px;
          color: white;
          animation: slideDown 0.3s ease;
        }

        .selected-count {
          font-weight: 500;
        }

        .bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .bulk-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bulk-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .bulk-btn.delete:hover {
          background: #ef4444;
          border-color: #ef4444;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Table View */
        .table-container {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
          margin-bottom: 32px;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          text-align: left;
          padding: 16px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .users-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .users-table tr:last-child td {
          border-bottom: none;
        }

        .users-table tr:hover td {
          background: #f8fafc;
        }

        .checkbox-col {
          width: 40px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .user-name {
          font-weight: 500;
          color: #1e293b;
        }

        .user-id {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .email-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid;
        }

        .last-active {
          color: #64748b;
          font-size: 0.85rem;
        }

        .table-actions {
          display: flex;
          gap: 4px;
        }

        .table-action {
          padding: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .table-action.view:hover {
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .table-action.edit:hover {
          color: #22c55e;
          border-color: #22c55e;
        }

        .table-action.suspend:hover {
          color: #ef4444;
          border-color: #ef4444;
        }

        .table-action.activate:hover {
          color: #22c55e;
          border-color: #22c55e;
        }

        /* Grid View */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .user-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
          position: relative;
        }

        .user-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .user-card-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #e2e8f0;
          position: relative;
        }

        .user-select {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .user-avatar-large {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .user-status {
          margin-left: auto;
        }

        .user-card-body {
          padding: 20px;
        }

        .user-name-large {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .user-email {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .user-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .department {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #475569;
        }

        .user-phone {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 12px 0;
        }

        .user-id-card {
          background: #f8fafc;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .user-id-card span:first-child {
          color: #64748b;
        }

        .user-id-card span:last-child {
          color: #1e293b;
          font-weight: 500;
        }

        .user-card-footer {
          display: flex;
          border-top: 1px solid #e2e8f0;
        }

        .card-action {
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

        .card-action:not(:last-child) {
          border-right: 1px solid #e2e8f0;
        }

        .card-action.view:hover {
          color: #3b82f6;
          background: #f0f9ff;
        }

        .card-action.edit:hover {
          color: #22c55e;
          background: #f0fdf4;
        }

        .card-action.suspend:hover {
          color: #ef4444;
          background: #fef2f2;
        }

        .card-action.activate:hover {
          color: #22c55e;
          background: #f0fdf4;
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

        .create-first-btn {
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

        .create-first-btn:hover {
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
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          animation: fadeIn 0.3s ease;
        }

        .modal-overlay.active {
          display: flex;
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

        .view-modal {
          max-width: 600px;
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

        .modal-body {
          padding: 24px;
        }

        /* Form Styles */
        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #475569;
          font-weight: 500;
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
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* User Profile */
        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
          font-weight: bold;
        }

        .profile-info h3 {
          font-size: 1.3rem;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .profile-info p {
          color: #64748b;
          margin: 0;
        }

        .user-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .detail-item {
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          display: block;
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .detail-value {
          color: #1e293b;
          font-weight: 500;
        }

        /* Modal Footer */
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

        .submit-btn, .edit-btn {
          padding: 10px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .submit-btn:hover, .edit-btn:hover {
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
          .users-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .users-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .create-btn {
            width: 100%;
          }

          .filter-group {
            width: 100%;
          }

          .filter-wrapper {
            flex: 1;
          }

          .bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .bulk-buttons {
            width: 100%;
          }

          .bulk-btn {
            flex: 1;
            justify-content: center;
          }

          .users-table th:nth-child(3),
          .users-table td:nth-child(3),
          .users-table th:nth-child(6),
          .users-table td:nth-child(6) {
            display: none;
          }

          .user-details-grid {
            grid-template-columns: 1fr;
          }

          .user-profile-header {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .filter-group {
            flex-direction: column;
          }

          .view-toggle {
            width: 100%;
          }

          .view-btn {
            flex: 1;
            display: flex;
            justify-content: center;
          }

          .users-table th:nth-child(4),
          .users-table td:nth-child(4),
          .users-table th:nth-child(5),
          .users-table td:nth-child(5) {
            display: none;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Users;