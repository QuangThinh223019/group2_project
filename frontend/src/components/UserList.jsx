import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function UserList({ refresh, onEditUser }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const currentUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  
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
  // Check nếu admin đang xóa chính mình, không gửi request
  if (role === "admin" && String(id) === String(currentUserId)) {
    setMessage("⚠️ Bạn không thể xóa chính mình!");
    setSuccess(false);
    setTimeout(() => setMessage(""), 2000);
    return;
  }

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
    // Bắt lỗi 403 từ backend
    if (err.response && err.response.status === 403) {
      setMessage(err.response.data.message || "❌ Bạn không thể thực hiện thao tác này!");
    } else {
      setMessage("❌ Xóa user thất bại!");
    }
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
            <th>STT</th>
            <th>Avatar</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Vai trò</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: "center" }}>Chưa có user nào</td></tr>
          ) : (
            users.map((user, index)=> (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
          {user.avatarUrl ? (
            <img
              src={`http://localhost:4000${user.avatarUrl}`}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          ) : (
            "–"
          )}
        </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{"********"}</td>
                <td>{user.role || "user"}</td>
                <td>
                  <button onClick={() => onEditUser(user)}>✏️ Sửa</button>
                  <button
  onClick={() => handleDelete(user._id)}
  disabled={role === "admin" && String(user._id) === String(currentUserId)} // admin không xóa chính mình
  title={role === "admin" && String(user._id) === String(currentUserId) ? "Bạn không thể xóa chính mình" : ""}
>
  🗑️ Xóa
</button>

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
