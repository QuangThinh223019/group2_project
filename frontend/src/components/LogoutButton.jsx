import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useDispatch } from 'react-redux';
import { logoutThunk } from '../features/auth/authSlice';

function LogoutButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      alert('✅ Đăng xuất thành công!');
      navigate('/login');
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