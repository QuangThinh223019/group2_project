
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { API_BASE } from "../config/apiBase";

function ResetPassword() {
  const { token: tokenFromUrl } = useParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("❌ Mật khẩu nhập lại không khớp!");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setMessage("❌ Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    setLoading(true);
    try {
      console.log("🔐 Reset password request:", { token: token.substring(0, 20) + "...", passwordLength: newPassword.length });
      const res = await axios.post(`${API_BASE}/api/auth/reset-password`, {
        token,
        newPassword,
      });
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("❌ Reset password error:", err.response?.data || err.message);
      setMessage(`❌ Đổi mật khẩu thất bại: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>🔒 Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nhập token nhận được"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ marginTop: "10px" }}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ marginTop: "10px" }}
          />

          <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>

        {message && (
          <p className="message" style={{ marginTop: "10px", color: "#333" }}>
            {message}
          </p>
        )}
        <p style={{ marginTop: 16 }}>
          <Link to="/login">
            <button type="button" className="secondary-btn">⬅️ Quay lại đăng nhập</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
