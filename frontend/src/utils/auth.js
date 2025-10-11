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
