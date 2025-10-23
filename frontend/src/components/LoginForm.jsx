import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../features/auth/authSlice';
import "../App.css";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [disabledUntil, setDisabledUntil] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);

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
      const action = await dispatch(loginThunk(form));
      if (loginThunk.fulfilled.match(action)) {
        const user = action.payload.user;
        setMessage("🎉 Đăng nhập thành công!");
        setSuccess(true);
        setTimeout(() => {
          if (user.role.toLowerCase() === "admin") navigate('/admin');
          else navigate('/profile');
        }, 800);
      } else {
        // rejected
        const errorMessage = action.payload || action.error?.message || '❌ Sai email hoặc mật khẩu!';
        const status = (action.meta && action.meta.rejectedWithValue) ? 400 : null;
        // try parse 429-like message
        const m = (errorMessage || '').match(/(\d+)\s*giây|after\s*(\d+)\s*second|(\d+)/i);
        if (m) {
          const found = m[1] || m[2] || m[3];
          if (found) setDisabledUntil(Date.now() + parseInt(found, 10) * 1000);
        }
        setMessage(errorMessage);
        setSuccess(false);
      }
    } catch (err) {
      console.error('Unexpected login error', err);
      setMessage('❌ Lỗi hệ thống');
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
  <button type="submit" disabled={auth.loading || !!disabledUntil}>{auth.loading ? 'Đang...' : 'Đăng nhập'}</button>
      
<Link to="/forgot-password">
            <button type="button" className="secondary-btn">
              🔑 Quên mật khẩu?
            </button>
          </Link>
  <p>{message || auth.error}</p>
      

    </form>
  );
}

export default LoginForm;