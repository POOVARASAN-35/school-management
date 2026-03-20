import api from "../api/axios";

// Get all users
export const fetchUsers = () => api.get("/admin/users");

// Create staff/student
export const createUser = (data) =>
  api.post("/admin/users", data);

// Update user status
export const updateUserStatus = (id, status) =>
  api.put(`/admin/users/${id}/status`, { status });
