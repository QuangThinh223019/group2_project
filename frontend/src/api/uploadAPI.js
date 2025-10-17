// src/api/uploadAPI.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/upload";

// Tạo axios instance cho upload API
const uploadAPI = axios.create({
  baseURL: API_URL,
});

// Interceptor để tự động thêm accessToken vào header
uploadAPI.interceptors.request.use(
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
uploadAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 [Upload] Token hết hạn, đang refresh...");

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("❌ [Upload] Không có refreshToken");
          throw new Error("No refresh token");
        }

        console.log("📤 [Upload] Gọi API refresh token...");
        const response = await axios.post("http://localhost:4000/api/auth/refresh", {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log("✅ [Upload] Refresh thành công!");

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // CẬP NHẬT: Xóa header cũ và set lại header mới
        delete originalRequest.headers.Authorization;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        console.log("🔁 [Upload] Thử lại request với token mới...");
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("❌ [Upload] Refresh token thất bại:", refreshError.response?.data || refreshError.message);
        localStorage.clear();
        alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const uploadAvatar = async (formData) => {
  const res = await uploadAPI.post("/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
