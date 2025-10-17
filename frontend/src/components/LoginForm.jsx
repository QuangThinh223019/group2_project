import React, { useState } from "react";
import { login } from "../api/authAPI";
import { saveAuthData } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function LoginForm({ setIsLoggedIn, setRole }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      
      // Backend trả về: accessToken, refreshToken, user
      const { accessToken, refreshToken, user } = res.data;

      // Lưu tất cả thông tin authentication
      saveAuthData(accessToken, refreshToken, user);
      setRole(user.role.toLowerCase());
      setIsLoggedIn(true);
      
      setMessage("🎉 Đăng nhập thành công!");
      setSuccess(true);

      // Hiện thông báo 1.5s rồi redirect
      setTimeout(() => {
        if (user.role.toLowerCase() === "admin") {
          navigate("/admin"); // admin
        } else {
          navigate("/profile"); // user thường
        }
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "❌ Sai email hoặc mật khẩu!";
      setMessage(errorMessage);
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Đăng nhập</h2>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Mật khẩu"
        onChange={handleChange}
        required
      />
      <button type="submit">Đăng nhập</button>
      
<Link to="/forgot-password">
            <button type="button" className="secondary-btn">
              🔑 Quên mật khẩu?
            </button>
          </Link>
      <p>{message}</p>
      

    </form>
  );
}

export default LoginForm;