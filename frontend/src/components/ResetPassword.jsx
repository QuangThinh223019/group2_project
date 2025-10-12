import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // import CSS

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      setMessage("❌ Đổi mật khẩu thất bại!");
      console.error(err);
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

          <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>

        {message && (
          <p className="message" style={{ marginTop: "10px", color: "#333" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
