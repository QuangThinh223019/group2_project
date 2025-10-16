import React, { useState } from "react";
import { signup } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import "../App.css"; // import CSS

function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Kiểm tra mật khẩu trùng khớp
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Mật khẩu nhập lại không khớp!");
      setSuccess(false);
      return;
    }

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setMessage("🎉 Đăng ký thành công!");
      setSuccess(true);
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      // ⏳ Chờ 1.5s rồi chuyển sang trang đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage("❌ Lỗi: Email đã tồn tại hoặc server lỗi.");
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Đăng ký</h2>
      <input
        name="name"
        placeholder="Tên"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Mật khẩu"
        value={form.password}
        onChange={handleChange}
        required
      />
      {/* 🆕 Thêm ô nhập lại mật khẩu */}
      <input
        name="confirmPassword"
        type="password"
        placeholder="Nhập lại mật khẩu"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <button type="submit">Đăng ký</button>

      {/* Thông báo thành công / lỗi */}
      {message && (
        <p className={success ? "message-success" : "message-error"}>
          {message}
        </p>
      )}
    </form>
  );
}

export default SignupForm;
