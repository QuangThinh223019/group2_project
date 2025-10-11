import React, { useState } from "react";
import { login } from "../api/authAPI";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
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
      const { token, user } = res.data;

      // 🟢 Lưu token + role (chắc chắn là chữ thường)
      saveToken(token);
      localStorage.setItem("role", user.role.toLowerCase());
      localStorage.setItem("userId", user._id);
      setRole(user.role.toLowerCase());

      
      setIsLoggedIn(true);
      setMessage("🎉 Đăng nhập thành công!");
      setSuccess(true);

      // Delay 1.5s rồi redirect
      setTimeout(() => {
        if (user.role.toLowerCase() === "admin") {
          navigate("/admin"); // admin
        } else {
          navigate("/profile"); // user thường
        }
      }, 1500);
    } catch (error) {
      setMessage("❌ Sai email hoặc mật khẩu!");
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
      <p>{message}</p>
    </form>
  );
}

export default LoginForm;
