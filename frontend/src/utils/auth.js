import axios from "axios";
// src/utils/auth.js
const API_URL = "http://localhost:4000/api/auth"; // backend đúng
export const saveToken = (token) => {
localStorage.setItem("token", token);
};

export const getToken = () => {
return localStorage.getItem("token");
};

export const removeToken = () => {
localStorage.removeItem("token");
};

// 🟢 Lưu Refresh Token
export const saveRefreshToken = (refreshToken) => {
  localStorage.setItem("refreshToken", refreshToken);
};

// 🟢 Lấy Refresh Token
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// 🟢 Xoá Refresh Token
export const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};

// 🧩 Xoá toàn bộ thông tin khi logout hoặc token hết hạn
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

// 🟢 Gọi API để xin Access Token mới
export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
    return response.data; // trả về accessToken mới
  } catch (error) {
    console.error("Lỗi khi refresh token:", error);
    throw error;
  }
};