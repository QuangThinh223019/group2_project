// src/utils/auth.js

// Lưu tokens và thông tin user
export const saveAuthData = (accessToken, refreshToken, user) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", user.role.toLowerCase());
  localStorage.setItem("userId", user.id);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const removeAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};