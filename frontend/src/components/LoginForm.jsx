import React, { useState } from "react";
import { login } from "../api/authAPI";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../App.css"; // import CSS

function LoginForm({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      saveToken(res.data.token);
      setMessage("🎉 Đăng nhập thành công!");
      setSuccess(true); // đánh dấu đăng nhập thành công
      setIsLoggedIn(true);

      // Hiện thông báo 1.5s rồi redirect
      setTimeout(() => {
        navigate("/"); 
      }, 1500);
    } catch (error) {
      setMessage("❌ Sai email hoặc mật khẩu!");
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Đăng nhập</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
      <button type="submit">Đăng nhập</button>
      <p>{message}</p>
    </form>
  );
}

export default LoginForm;
