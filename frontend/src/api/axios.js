import axios from "axios";

const api = axios.create({
  baseURL: "https://school-management-ac64.onrender.com/api", // 🔥 Live URL
  withCredentials: true,                // 🔥 SEND COOKIE
});

export default api;
