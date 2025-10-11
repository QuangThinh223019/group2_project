import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api/profileAPI";
import "../profile.css";

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
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    await updateProfile(formData, token); // data đã là FormData

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

  return (
    <div className="profile-wrapper">
      <form onSubmit={handleUpdate} className="form-container">
        <h2>Thông tin cá nhân</h2>

        {avatar && (
          <img
            src={
              avatar instanceof File
                ? URL.createObjectURL(avatar)
                : avatar.startsWith("http")
                ? avatar
                : `http://localhost:4000${avatar}`
            }
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

      <button type="button" className="logout-btn" onClick={handleLogout}>
        🚪 Đăng xuất
      </button>
    </div>
  );
}

export default Profile;
