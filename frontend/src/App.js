import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutButton from "./components/LogoutButton";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminLogs from "./components/AdminLogs";

import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // kiểm tra token khi load App
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const oldToken = localStorage.getItem("token");
    
    console.log("🔍 [App] Checking auth on load:", { 
      hasAccessToken: !!accessToken, 
      hasOldToken: !!oldToken 
    });
    
    // Xóa token cũ (từ version trước) nếu tồn tại, nhưng GIỮ accessToken
    if (oldToken) {
      localStorage.removeItem("token");
      console.log("🗑️ Đã xóa token cũ");
    }
    
    // Nếu KHÔNG có accessToken -> chưa đăng nhập
    if (!accessToken) {
      console.log("❌ [App] Không có accessToken -> Chưa đăng nhập");
      setIsLoggedIn(false);
      setRole("");
      setLoading(false);
      return;
    }

    // Có accessToken -> đã đăng nhập
    const savedRole = localStorage.getItem("role");
    console.log("✅ [App] Có accessToken -> Đã đăng nhập, role:", savedRole);
    if (savedRole) setRole(savedRole.toLowerCase());
    setIsLoggedIn(true);

    // sau khi kiểm tra xong thì tắt loading
    setLoading(false);
  }, []);

  
  // Đợi check auth xong mới render routes
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="container">
        <h1>🚀 Quản lý User</h1>
        
        
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/login" 
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          <Route
            path="/admin"
            element={
              isLoggedIn && role === "admin" ? (
                <>
                  <AddUser
                    editingUser={editingUser}
                    onUserAdded={() => setRefresh(r => r + 1)}
                    onCancelEdit={() => setEditingUser(null)}
                  />
                  <UserList
                    refresh={refresh}
                    onEditUser={(user) => setEditingUser(user)}
                  />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                    <button 
                      onClick={() => window.location.href = '/profile'}
                      className="logout-btn"
                    >
                      👤 Xem Profile
                    </button>
                    <button 
                      onClick={() => window.location.href = '/admin/logs'}
                      className="logout-btn"
                    >
                      📋 Xem Logs
                    </button>
                    <LogoutButton setIsLoggedIn={setIsLoggedIn} />
                  </div>
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/logs"
            element={
              isLoggedIn && role === "admin" ? (
                <AdminLogs />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              isLoggedIn ? (
                role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/profile" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        <nav>
          {!isLoggedIn && (
            <>
              <Link to="/signup" className="nav-btn">Đăng ký</Link>
              <Link to="/login" className="nav-btn">Đăng nhập</Link>
            </>
          )}
          
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;