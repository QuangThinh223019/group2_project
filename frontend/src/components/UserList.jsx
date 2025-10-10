import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function UserList({ refresh, onEditUser }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:4000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
  console.error("Lỗi khi load user:", err);
  setMessage("⚠️ Không thể tải danh sách user!");
  setSuccess(false);
}
  };

  useEffect(() => { fetchUsers(); }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u._id !== id));
      setMessage("🎉 Xóa user thành công!");
      setSuccess(true);
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Xóa user thất bại!");
      setSuccess(false);
      setTimeout(() => setMessage(""), 1500);
    }
  };

  return (
    <div className="list-container">
      <h2>Danh sách User</h2>
      {message && <p className={success ? "message-success" : "message-error"}>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Vai trò</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: "center" }}>Chưa có user nào</td></tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{"********"}</td>
                <td>{user.role || "user"}</td>
                <td>
                  <button onClick={() => onEditUser(user)}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(user._id)}>🗑️ Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
