import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutButton from "./components/LogoutButton";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // user đang sửa

  // kiểm tra token khi load App
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        <h1>🚀 Quản lý User</h1>
        

        <Routes>
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
  <Route
    path="/"
    element={
      isLoggedIn ? (
        <>
          {/* 🟢 Truyền editingUser và onCancelEdit vào AddUser */}
          <AddUser
            editingUser={editingUser}
            onUserAdded={() => setRefresh(r => r + 1)}
            onCancelEdit={() => setEditingUser(null)}
          />
          <UserList
            refresh={refresh}
            onEditUser={(user) => setEditingUser(user)} // khi nhấn Sửa
          />
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
