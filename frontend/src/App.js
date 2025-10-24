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
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';

import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const auth = useSelector(s => s.auth);
  const isLoggedIn = !!auth?.accessToken;
  const role = auth?.user?.role ? auth.user.role.toLowerCase() : '';
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
    
    if (!accessToken) {
      console.log("❌ [App] Không có accessToken -> Chưa đăng nhập");
      setLoading(false);
      return;
    }
    console.log("✅ [App] Có accessToken -> Đã đăng nhập");

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
            element={<LoginPage />} 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="/admin" element={<ProtectedRoute adminOnly><>
            <AddUser editingUser={editingUser} onUserAdded={() => setRefresh(r => r + 1)} onCancelEdit={() => setEditingUser(null)} />
            <UserList refresh={refresh} onEditUser={(user) => setEditingUser(user)} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => window.location.href = '/profile'} className="logout-btn">👤 Xem Profile</button>
              <button onClick={() => window.location.href = '/admin/logs'} className="logout-btn">📋 Xem Logs</button>
              <LogoutButton />
            </div>
          </></ProtectedRoute>} />

          <Route path="/admin/logs" element={<ProtectedRoute adminOnly><AdminLogs /></ProtectedRoute>} />

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