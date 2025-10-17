import React, { useState } from "react";
import { signup } from "../api/authAPI";
import { saveAuthData } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../App.css"; // import CSS

function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu trùng khớp
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Mật khẩu không khớp!");
      setSuccess(false);
      return;
    }
    
    try {
      // Chỉ gửi name, email, password (không gửi confirmPassword)
      const { confirmPassword, ...signupData } = form;
      const res = await signup(signupData);
      
      // Backend cũng trả về tokens khi đăng ký thành công
      const { accessToken, refreshToken, user } = res.data;
      saveAuthData(accessToken, refreshToken, user);
      
      setMessage("🎉 Đăng ký thành công!");
      setSuccess(true);
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      // redirect sau 1.5 giây về login hoặc profile
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || "❌ Lỗi: Email đã tồn tại hoặc server lỗi.";
      setMessage(errorMessage);
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
        type="email"
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
      <input 
        name="confirmPassword" 
        type="password" 
        placeholder="Nhập lại mật khẩu" 
        value={form.confirmPassword} 
        onChange={handleChange} 
        required 
      />
      <button type="submit">Đăng ký</button>
      {/* Thông báo thành công / lỗi đặt ngay dưới button */}
      {message && (
        <p className={success ? "message-success" : "message-error"}>{message}</p>
      )}
    </form>
  );
}

export default SignupForm;