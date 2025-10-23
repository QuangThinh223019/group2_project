import React, { useState } from "react";
import { login } from "../api/authAPI";
import { saveAuthData } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function LoginForm({ setIsLoggedIn, setRole }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [disabledUntil, setDisabledUntil] = useState(null);
  const navigate = useNavigate();

  // Countdown timer for rate-limit lock
  React.useEffect(() => {
    if (!disabledUntil) return;
    const interval = setInterval(() => {
      if (Date.now() >= disabledUntil) {
        setDisabledUntil(null);
        setMessage("");
        clearInterval(interval);
      } else {
        const sec = Math.ceil((disabledUntil - Date.now()) / 1000);
        setMessage(`⚠️ Quá nhiều lần đăng nhập. Vui lòng thử lại sau ${sec} giây.`);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [disabledUntil]);

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
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || "❌ Sai email hoặc mật khẩu!";
      // If rate-limited (429), try to parse seconds from message and start local countdown
      if (status === 429) {
        // extract number of seconds from message (fallback to 60)
        const m = (errorMessage || '').match(/(\d+)\s*giây|after\s*(\d+)\s*second|(\d+)/i);
        let secs = 60;
        if (m) {
          const found = m[1] || m[2] || m[3];
          if (found) secs = parseInt(found, 10);
        }
        setDisabledUntil(Date.now() + secs * 1000);
        setMessage(errorMessage);
      } else {
        setMessage(errorMessage);
      }
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
        disabled={!!disabledUntil}
      />
      <input
        name="password"
        type="password"
        placeholder="Mật khẩu"
        onChange={handleChange}
        required
        disabled={!!disabledUntil}
      />
      <button type="submit" disabled={!!disabledUntil}>Đăng nhập</button>
      
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