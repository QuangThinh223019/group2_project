import axios from "axios";

const BASE = 'https://thinh-backend.onrender.com';
const API_URL = `${BASE}/api/profile`;

// Tạo axios instance cho profile API với interceptor tự động refresh token
const profileAPI = axios.create({
  baseURL: API_URL,
});

// Interceptor để tự động thêm accessToken vào header
profileAPI.interceptors.request.use(
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
profileAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 [Profile] Token hết hạn, đang refresh...");

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("❌ [Profile] Không có refreshToken");
          throw new Error("No refresh token");
        }

        console.log("📤 [Profile] Gửi API refresh token...");
        // Gửi API refresh token
        const response = await axios.post(`${BASE}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log("✅ [Profile] Refresh thành công! Token mới:", accessToken.substring(0, 30) + "...");
        console.log("📋 [Profile] Full token mới:", accessToken);

        // Lưu tokens mới
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // CẬP NHẬT: Xóa header cũ và set lại header mới
        delete originalRequest.headers.Authorization;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        console.log("🔁 [Profile] Thử lại request với token mới...");
        console.log("🔍 [Profile] Request config:", {
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
        
        console.log("🚀 [Profile] Retry config:", retryConfig);
        
        // Retry với axios chứ không phải profileAPI để tránh loop
        return axios(retryConfig);
      } catch (refreshError) {
        // Refresh token thất bại -> logout
        console.error("❌ [Profile] Refresh token thất bại:", refreshError.response?.data || refreshError.message);
        localStorage.clear();
        alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getProfile = async () => {
  const res = await profileAPI.get("/");
  return res.data;
};

export const updateProfile = async (data) => {
  // data đã là FormData từ Profile.js
  const res = await profileAPI.put("/", data);
  return res.data;
};