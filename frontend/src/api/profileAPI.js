import axios from "axios";

const API_URL = "http://localhost:4000/api/profile";

export const getProfile = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (data, token) => {
  // data đã là FormData từ Profile.js
  const res = await axios.put(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      // ⚠️ Không cần set Content-Type, để Axios tự set multipart/form-data
    },
  });
  return res.data;
};
