import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function LogoutButton({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("✅ Đăng xuất thành công!");
    setIsLoggedIn(false);
    navigate("/login"); // đưa về màn hình login
  };

  return (
    <button type="button" className="form-container-btn" onClick={handleLogout}>
      🚪 Đăng xuất
    </button>
  );
}

export default LogoutButton;
