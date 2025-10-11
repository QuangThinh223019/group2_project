import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutButton from "./components/LogoutButton";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🟢 trạng thái chờ load token

  // 🟢 kiểm tra token + role khi load App
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token) setIsLoggedIn(true);
    if (savedRole) setRole(savedRole.toLowerCase());

    // sau khi kiểm tra xong thì tắt loading
    setLoading(false);
  }, []);

  
  return (
    <BrowserRouter>
      <div className="container">
        <h1>🚀 Quản lý User</h1>

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
  path="/profile"
  element={
    loading ? (
      <h2>⏳ Đang tải...</h2>
    ) : isLoggedIn ? (
      <Profile />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
          <Route path="/signup" element={<SignupPage />} />
          <Route
  path="/login"
  element={<LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
/>

          

          <Route
  path="/admin"
  element={
    loading ? (
      <h2>⏳ Đang tải...</h2>
    ) : isLoggedIn ? (
      role === "admin" ? (
        <>
          <AddUser
            editingUser={editingUser}
            onUserAdded={() => setRefresh((r) => r + 1)}
            onCancelEdit={() => setEditingUser(null)}
          />
          <UserList
            refresh={refresh}
            onEditUser={(user) => setEditingUser(user)}
          />
          <div className="admin-buttons">
            <a href="/profile" className="profile-button">
  👤 Xem Profile
</a>
  <LogoutButton setIsLoggedIn={setIsLoggedIn} className="admin-logout-btn"  />
</div>


        </>
      ) : (
        <Navigate to="/profile" replace />
      )
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

        </Routes>

        {!loading && (
  <nav>
    {!isLoggedIn && (
      <>
        <Link to="/signup" className="nav-btn">
          Đăng ký
        </Link>
        <Link to="/login" className="nav-btn">
          Đăng nhập
        </Link>
      </>
    )}
  </nav>
)}
      </div>
    </BrowserRouter>
  );
}

export default App;
