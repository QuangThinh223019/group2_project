import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function LogoutButton({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    alert("✅ Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <button type="button" className="form-container-btn" onClick={handleLogout}>
      🚪 Đăng xuất
    </button>
  );
}

export default LogoutButton;
