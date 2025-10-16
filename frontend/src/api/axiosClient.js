// src/api/axiosClient.js
import axios from "axios";
import { refreshToken as refreshAPI } from "./authAPI";
import { getToken, getRefreshToken, saveToken, saveRefreshToken, clearAuth } from "../utils/auth";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// 🧩 Thêm interceptor cho tất cả request
axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🧩 Thêm interceptor xử lý khi token hết hạn
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccess = await refreshAPI(getRefreshToken());
        saveToken(newAccess.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccess.data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        clearAuth(); // xoá token, buộc đăng nhập lại
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
