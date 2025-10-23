import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const base = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:4000';
      await axios.post(`${base}/api/users`, { name, email }, {
        headers: localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {},
      });
      onUserAdded(); // reload danh sách
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
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
    </form>
  );
}

export default AddUser;
