import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api/profileAPI";
import "../profile.css";
import axios from "axios";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const data = await getProfile(token);
        setName(data.name || "");
        setEmail(data.email || "");
        setAvatar(data.avatarUrl || data.avatar || null);
      } catch (err) {
        console.error("Lấy profile thất bại:", err.response || err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);

    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    // Nếu người dùng chọn avatar mới
    // Nếu người dùng chọn avatar mới
if (avatar instanceof File) {
  const avatarForm = new FormData();
  avatarForm.append("avatar", avatar);

  try {
    const uploadRes = await axios.post(
      "http://localhost:4000/api/upload/avatar",
      avatarForm,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    formData.append("avatarUrl", uploadRes.data.url);
    setAvatar(uploadRes.data.url); // update state với URL mới
  } catch (err) {
    console.error("Upload avatar thất bại:", err.response?.data || err);
    setMessage("❌ Upload avatar thất bại!");
    setSuccess(false);
    setLoading(false);
    return; // dừng handleUpdate nếu upload fail
  }
} else if (typeof avatar === "string") {
  // giữ avatar cũ
  formData.append("avatarUrl", avatar);
}



    // Update profile
    await updateProfile(formData, token);

    setMessage("🎉 Cập nhật thành công!");
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "❌ Cập nhật thất bại!");
    setSuccess(false);
  } finally {
    setLoading(false);
  }
};



  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log("Sending delete request:", { userId, token });


  if (!userId || !token) {
    alert("❌ Không xác định được user hoặc chưa đăng nhập!");
    return;
  }

  // Xác nhận trước khi xóa
  if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;

  try {
    const res = await axios.delete(`http://localhost:4000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert(res.data.message || "🎉 Tài khoản đã được xóa!");
    localStorage.clear();
    window.location.href = "/login";
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "❌ Xóa tài khoản thất bại!");
  }
};



  return (
    <div className="profile-wrapper">
      <form onSubmit={handleUpdate} className="form-container">
        <h2>Thông tin cá nhân</h2>

        {avatar && (
          <img
  src={avatar instanceof File ? URL.createObjectURL(avatar) : avatar}
  alt="Avatar"
  className="avatar-img"
/>

        )}

        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input type="email" value={email} disabled placeholder="Email" />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            placeholder="Mật khẩu cũ"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            placeholder="Mật khẩu mới"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>

        {message && <p className={success ? "message success" : "message"}>{message}</p>}
      </form>

      {localStorage.getItem("role") === "admin" && (
        <a href="/admin" className="back-button">
          ⬅️ Quay lại danh sách
        </a>
      )}
      {role !== "admin" && (
        <button
          type="button"
          className="logout-btn"
          onClick={handleDeleteAccount}
        >
          ❌ Xóa tài khoản
        </button>
      )}
      <button type="button" className="logout-btn" onClick={handleLogout}>
        🚪 Đăng xuất
      </button>
    </div>
  );
}

export default Profile;
