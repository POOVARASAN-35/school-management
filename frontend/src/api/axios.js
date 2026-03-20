import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // 🔥 BACKEND URL
  withCredentials: true,                // 🔥 SEND COOKIE
});

export default api;
