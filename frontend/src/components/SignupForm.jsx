import React, { useState } from "react";
import { signup } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import "../App.css"; // import CSS

function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await signup(form);
    setMessage("🎉 Đăng ký thành công!");
    setSuccess(true);
    setForm({ name: "", email: "", password: "" });

    // redirect sau 1.5 giây về login
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
      <input name="name" placeholder="Tên" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
      <button type="submit">Đăng ký</button>
      {/* Thông báo thành công / lỗi đặt ngay dưới button */}
  {message && (
    <p className={success ? "message-success" : "message-error"}>{message}</p>
  )}
    </form>
  );
}

export default SignupForm;
