import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api/profileAPI";
import { uploadAvatar } from "../api/uploadAPI";
import { logout } from "../api/authAPI";
import { removeAuthData } from "../utils/auth";
import "../profile.css";
import axios from "axios";
import { API_BASE } from "../config/apiBase";


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
  const isAdmin = role?.toLowerCase() === "admin";
  
  console.log("🔍 Profile - Role check:", { role, isAdmin });


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
      let avatarUrl = avatar;

      // Nếu người dùng chọn avatar mới, upload lên Cloudinary trước
      if (avatar instanceof File) {
        console.log("📤 Uploading avatar to Cloudinary...");
        const uploadFormData = new FormData();
        uploadFormData.append("avatar", avatar);
        
        const uploadResponse = await uploadAvatar(uploadFormData);
        avatarUrl = uploadResponse.url; // URL từ Cloudinary
        console.log("✅ Avatar uploaded to Cloudinary:", avatarUrl);
      }

      // Cập nhật profile với avatar URL từ Cloudinary
      const profileFormData = new FormData();
      profileFormData.append("name", name);
      if (avatarUrl) {
        profileFormData.append("avatarUrl", avatarUrl);
      }

      if (currentPassword && newPassword) {
        profileFormData.append("currentPassword", currentPassword);
        profileFormData.append("newPassword", newPassword);
      }

      // Update profile
      await updateProfile(profileFormData);
      console.log("✅ Profile updated with Cloudinary URL");

      // Fetch lại profile để lấy data mới từ server
      const updatedProfile = await getProfile();
      console.log("🔍 Updated profile data:", updatedProfile);
      
      // Set avatar thành URL từ Cloudinary
      const newAvatarUrl = updatedProfile.avatarUrl || avatarUrl;
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
      setMessage(err.response?.data?.message || " Cập nhật thất bại!");
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
      alert("⚠️ Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    // Xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;

    try {
      const res = await axios.delete(`${API_BASE}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert(res.data.message || " Tài khoản đã được xóa!");
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || " Xóa tài khoản thất bại!");
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
                  : `https://thinh-backend.onrender.com${avatar}`
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
      {isAdmin && (
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
      {!isAdmin && (
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