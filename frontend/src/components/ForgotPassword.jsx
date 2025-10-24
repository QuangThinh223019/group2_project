import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css"; // import CSS (App.css chứa .token-box / .token-display)

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Đang gửi email... (Lưu ý: Gmail SMTP có thể mất 1-2 phút hoặc bị block)");
    setToken("");
    setLoading(true);

    try {
      const base = 'https://thinh-backend.onrender.com';
      const res = await axios.post(`${base}/api/auth/forgot-password`, { email }, {
        timeout: 120000 // 120 giây (2 phút)
      });
      setMessage(`✅ ${res.data.message}`);
      if (res.data.token) setToken(res.data.token);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setMessage("⚠️ Gmail SMTP đang bị chậm hoặc block. Vui lòng:\n\n🔹 Liên hệ Admin để lấy token reset trực tiếp\n🔹 Hoặc Admin kiểm tra backend logs để lấy token\n🔹 Sau đó dùng nút 'Đặt lại mật khẩu' bên dưới với token đó");
      } else {
        setMessage(`❌ Gửi yêu cầu thất bại: ${err.response?.data?.message || err.message}`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // <-- Hàm copyToken đã được định nghĩa ở đây
  const copyToken = () => {
    if (!token) return;
    // copy vào clipboard
    navigator.clipboard.writeText(token).then(
      () => {
        // feedback người dùng (bạn có thể thay bằng toast)
        setMessage("✅ Token đã được copy vào clipboard!");
        // reset message sau 2s (tuỳ chọn)
        setTimeout(() => setMessage(""), 2000);
      },
      (err) => {
        console.error("Copy thất bại:", err);
        setMessage("❌ Copy thất bại!");
        setTimeout(() => setMessage(""), 2000);
      }
    );
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>🔑 Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email đăng ký"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p>
            <button type="submit" disabled={loading}>
              {loading ? "⏳ Đang gửi... (1-2 phút)" : "Gửi yêu cầu"}
            </button>
          </p>

          <p>
            <Link to="/reset-password">
              <button type="button" className="secondary-btn">
                � Đặt lại mật khẩu (nếu có token)
              </button>
            </Link>
          </p>

          <p>
            <Link to="/login">
              <button type="button" className="secondary-btn">
                ⬅️ Quay lại
              </button>
            </Link>
          </p>
        </form>

        {message && <p className="message">{message}</p>}

        {token && (
          <div className="token-box" style={{ marginTop: 12 }}>
            <p style={{ margin: 0, marginBottom: 8 }}>Token của bạn:</p>
            <div className="token-display">
              <span title={token}>{token}</span>
              <button onClick={copyToken}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
