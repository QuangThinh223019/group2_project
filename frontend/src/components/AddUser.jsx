import React, { useState, useEffect } from "react";
import { createUser, updateUser } from "../api/userAPI";
import "../App.css";

function AddUser({ onUserAdded, editingUser, onCancelEdit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState(""); // ✅ state cho thông báo
  const [success, setSuccess] = useState(true); // xác định loại thông báo

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || "");
      setEmail(editingUser.email || "");
      setPassword(editingUser.password || "");
      setRole(editingUser.role || "user");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setMessage("Name không được để trống");
    if (!/\S+@\S+\.\S+/.test(email)) return setMessage("Email không hợp lệ");
    if (!password.trim()) return setMessage("Password không được để trống");

    try {
      if (editingUser) {
        await updateUser(editingUser._id, { name, email, password, role });
        setMessage("Cập nhật user thành công! 😎");
        setSuccess(true);
      } else {
        await createUser({ name, email, password, role });
        setMessage("Thêm user thành công!");
        setSuccess(true);
      }

      onUserAdded();
      if (editingUser) onCancelEdit();

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");

      // Xóa thông báo sau vài giây
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm/cập nhật user:", err);
      setMessage(editingUser ? "Cập nhật thất bại" : "Thêm user thất bại");
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{editingUser ? "Cập nhật User" : "Thêm User"}</h2>

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
      <button type="submit">{editingUser ? "💾 Cập nhật" : "➕ Thêm"}</button>
      {editingUser && (
        <button type="button" onClick={onCancelEdit} >
          ❌ Hủy
        </button>
      )}
      

      {message && (
        <p className={success ? "message-success" : "message-error"} style={{ marginTop: "10px" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default AddUser;
