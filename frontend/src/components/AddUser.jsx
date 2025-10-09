import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user"); // default role

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name không được để trống");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Email không hợp lệ");
    if (!password.trim()) return alert("Password không được để trống");

    const token = localStorage.getItem("token");
    if (!token) return alert("Hãy đăng nhập trước khi thêm user");

    try {
      await axios.post(
        "http://localhost:4000/api/users",
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUserAdded();
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      alert("Thêm user thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Thêm User</h2>

      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="form-select"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">➕ Thêm</button>
    </form>
  );
}

export default AddUser;
