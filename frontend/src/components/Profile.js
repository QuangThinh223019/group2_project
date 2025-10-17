import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api/profileAPI";
import { logout } from "../api/authAPI";
import { removeAuthData } from "../utils/auth";
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
      try {
        const data = await getProfile();
        setName(data.name || "");
        setEmail(data.email || "");
        setAvatar(data.avatarUrl || data.avatar || null);
      } catch (err) {
        console.error("Lấy profile thất bại:", err.response || err);
        // Interceptor sẽ tự động redirect nếu refresh token thất bại
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("name", name);

      if (currentPassword && newPassword) {
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);
      }

      // Nếu người dùng chọn avatar mới
      if (avatar instanceof File) {
        // Upload file trực tiếp, backend Multer sẽ lưu vào uploads/
        formData.append("avatar", avatar);
        console.log("📤 Uploading avatar to local storage...");
      } else if (typeof avatar === "string") {
        // Giữ avatar cũ (URL)
        formData.append("avatarUrl", avatar);
      }

      // Update profile
      await updateProfile(formData);
      console.log("✅ Profile updated");

      // Đợi 500ms để backend lưu file xong
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fetch lại profile để lấy avatarUrl MỚI từ server
      const updatedProfile = await getProfile();
      console.log("🔍 Updated profile data:", updatedProfile);
      
      // Set avatar thành URL mới từ server
      const newAvatarUrl = updatedProfile.avatarUrl || updatedProfile.avatar || null;
      setAvatar(newAvatarUrl);
      setName(updatedProfile.name || name);
      
      // Cập nhật user trong localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...currentUser,
        name: updatedProfile.name,
        avatarUrl: newAvatarUrl
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("✅ Avatar updated:", newAvatarUrl);

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



  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      removeAuthData();
      window.location.href = "/login";
    }
  };

  const handleDeleteAccount = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    console.log("Sending delete request:", { userId, accessToken });

    if (!userId || !accessToken) {
      alert("❌ Không xác định được user hoặc chưa đăng nhập!");
      return;
    }

    // Xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;

    try {
      const res = await axios.delete(`http://localhost:4000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
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
            src={
              avatar instanceof File 
                ? URL.createObjectURL(avatar)
                : avatar.startsWith('http') 
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

      {/* Nút dành cho admin */}
      {role === "admin" && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => window.location.href = '/admin'}
            className="logout-btn"
          >
            ⬅️ Quay lại danh sách
          </button>
          <button 
            type="button" 
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Đăng xuất
          </button>
        </div>
      )}

      {/* Nút dành cho user thường */}
      {role !== "admin" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
          <button
            type="button"
            className="logout-btn"
            onClick={handleDeleteAccount}
          >
            ❌ Xóa tài khoản
          </button>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;