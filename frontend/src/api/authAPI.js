// src/api/authAPI.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth"; // chỉnh theo backend

export const signup = async (data) => {
return axios.post(`${API_URL}/signup`, data);
};

export const login = async (data) => {
return axios.post(`${API_URL}/login`, data);
};

// 🟢 Thêm API mới để xin access token mới
export const refreshToken = async (refreshToken) =>
  axios.post(`${API_URL}/refresh`, { refreshToken });

export const logout = async () => {
  // Có thể chỉ cần xóa token phía client, hoặc gọi API nếu backend hỗ trợ
return axios.post(`${API_URL}/logout`);
};
