// src/api/userAPI.js
import axios from "axios";
import { API_BASE } from "../config/apiBase";

const BASE = API_BASE;
const API_URL = `${BASE}/api/users`; 


// Tạo axios instance cho user API
const userAPI = axios.create({
  baseURL: API_URL,
});

// Interceptor để tự động thêm accessToken vào header
userAPI.interceptors.request.use(
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
userAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 [User] Token hết hạn, đang refresh...");

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("❌ [User] Không có refreshToken");
          throw new Error("No refresh token");
        }

        console.log("📤 [User] Gọi API refresh token...");
        const response = await axios.post(`${BASE}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log("✅ [User] Refresh thành công! Token mới:", accessToken.substring(0, 30) + "...");
        console.log("📋 [User] Full token mới:", accessToken);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // CẬP NHẬT: Xóa header cũ và set lại header mới
        delete originalRequest.headers.Authorization;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        console.log("🔁 [User] Thử lại request với token mới...");
        console.log("🔍 [User] Request config:", {
          url: originalRequest.url,
          baseURL: originalRequest.baseURL,
          headers: originalRequest.headers
        });
        
        // Tạo config mới đầy đủ
        const retryConfig = {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            'Authorization': `Bearer ${accessToken}`
          }
        };
        
        console.log("🚀 [User] Retry config:", retryConfig);
        
        // Retry với axios chứ không phải userAPI để tránh loop
        return axios(retryConfig);
      } catch (refreshError) {
        console.error("❌ [User] Refresh token thất bại:", refreshError.response?.data || refreshError.message);
        localStorage.clear();
        alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getAllUsers = async () => {
  const res = await userAPI.get("/");
  return res.data;
};

export const createUser = async (userData) => {
  const res = await userAPI.post("/", userData);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await userAPI.put(`/${id}`, userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await userAPI.delete(`/${id}`);
  return res.data;
};
