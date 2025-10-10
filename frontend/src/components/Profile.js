import React, { useState, useEffect } from "react";
import { updateProfile } from "../api/profileAPI"; // tạm thời dùng update
import "../profile.css";


function Profile() {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lấy email từ token tạm thời
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser((prev) => ({ ...prev, email: "user@example.com" }));
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", user.name);
      if (password) formData.append("password", password);
      if (user.avatar instanceof File) formData.append("avatar", user.avatar);

      // Gọi API tạm
      await updateProfile(formData, token);

      setMessage("🎉 Cập nhật thành công!");
      setSuccess(true);
      setPassword("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Cập nhật thất bại!");
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

        {user.avatar && (
          <img
            src={
              typeof user.avatar === "string"
                ? user.avatar
                : URL.createObjectURL(user.avatar)
            }
            alt="Avatar"
            className="avatar-img"
          />
        )}

        <input
          type="text"
          value={user.name}
          placeholder="Name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />

        <input type="email" value={user.email} disabled placeholder="Email" />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Mật khẩu mới"
            onChange={(e) => setPassword(e.target.value)}
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
          onChange={(e) => setUser({ ...user, avatar: e.target.files[0] })}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>

        {message && (
          <p className={success ? "message success" : "message"}>{message}</p>
        )}
      </form>

      <button
  type="button"
  className="logout-btn"
  onClick={handleLogout}
>
  Đăng xuất
</button>

    </div>
      
  );
}

export default Profile;
