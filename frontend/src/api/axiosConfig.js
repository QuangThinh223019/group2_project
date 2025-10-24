// src/api/axiosConfig.js
// File này chứa logic chung để tạo axios instance với auto-refresh token

import axios from "axios";
import { API_BASE } from "../config/apiBase";

export const createAuthenticatedAPI = (baseURL) => {
  const api = axios.create({ baseURL });

  // Request interceptor - thêm accessToken vào mọi request
  api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - tự động refresh token khi gặp lỗi 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Nếu lỗi 401 (Unauthorized) và chưa retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Gọi API refresh token
          const response = await axios.post(`${API_BASE}/api/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Lưu tokens mới
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Thử lại request ban đầu với accessToken mới
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token thất bại -> logout và redirect
          console.error("Token refresh failed:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
