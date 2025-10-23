// src/api/authAPI.js
import axios from "axios";

const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:4000';
const API_URL = `${BASE}/api/auth`; // chỉnh theo backend

// Debug log để kiểm tra
console.log('🔍 [authAPI] REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('🔍 [authAPI] BASE:', BASE);
console.log('🔍 [authAPI] API_URL:', API_URL);

// Tạo axios instance để dễ quản lý
export const authAPI = axios.create({
  baseURL: API_URL,
});

// Interceptor để tự động thêm accessToken vào header
authAPI.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để tự động refresh token khi accessToken hết hạn
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 [Auth] Token hết hạn, đang refresh...");

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("❌ [Auth] Không có refreshToken");
          throw new Error("No refresh token");
        }

        console.log("📤 [Auth] Gọi API refresh token...");
        // Gọi API refresh token
        const response = await axios.post(`${BASE}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log("✅ [Auth] Refresh thành công!");

        // Lưu tokens mới
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // CẬP NHẬT: Xóa header cũ và set lại header mới
        delete originalRequest.headers.Authorization;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        console.log("🔁 [Auth] Thử lại request với token mới...");
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại -> logout
        console.error("❌ [Auth] Refresh token thất bại:", refreshError.response?.data || refreshError.message);
        localStorage.clear();
        alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const signup = async (data) => {
  return authAPI.post("/signup", data);
};

export const login = async (data) => {
  return authAPI.post("/login", data);
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return authAPI.post("/logout", { refreshToken });
};

export const refreshTokenAPI = async (refreshToken) => {
  return axios.post(`${BASE}/api/auth/refresh`, { refreshToken });
};