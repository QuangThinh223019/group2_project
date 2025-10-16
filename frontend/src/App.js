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
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true); // trạng thái chờ load token

  // kiểm tra token khi load App
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token) setIsLoggedIn(true);
    if (savedRole) setRole(savedRole.toLowerCase());

    // sau khi kiểm tra xong thì tắt loading
    setLoading(false);
  }, []);

  if (loading) return <p>Đang tải...</p>; // tránh hiển thị sớm khi chưa kiểm tra token

  return (
    <BrowserRouter>
      <div className="container">
        <h1>🚀 Quản lý User</h1>

        <Routes>
          <Route path="/signup" element={<SignupPage />} />
<Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />

          <Route
            path="/"
            element={
              isLoggedIn ? (
                <>
                  {role === "admin" && (
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
                    </>
                  )}

                  {role !== "admin" && (
                    <p>Chào bạn, bạn không có quyền xem danh sách user.</p>
                  )}

                  <LogoutButton setIsLoggedIn={setIsLoggedIn} />
                </>
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
