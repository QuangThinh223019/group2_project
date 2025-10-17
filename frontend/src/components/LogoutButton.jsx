import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authAPI";
import { removeAuthData } from "../utils/auth";
import "../App.css";

function LogoutButton({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Gọi API logout để xóa refresh token ở backend
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xóa tất cả dữ liệu auth khỏi localStorage
      removeAuthData();
      setIsLoggedIn(false);
      alert("✅ Đăng xuất thành công!");
      navigate("/login");
    }
  };

  return (
    <button 
      type="button" 
      className="logout-btn" 
      onClick={handleLogout}
    >
      🚪 Đăng xuất
    </button>
  );
}

export default LogoutButton;