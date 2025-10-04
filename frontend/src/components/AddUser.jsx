import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validation cơ bản
    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users", { name, email });
      onUserAdded(); // báo App refresh danh sách
      setName("");
      setEmail("");
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
        placeholder="Nhập tên..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Nhập email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">➕ Thêm</button>
      <p style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
        * Name không được để trống, Email phải hợp lệ
      </p>
    </form>
  );
}

export default AddUser;
