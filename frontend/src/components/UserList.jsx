import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi load user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/users/${editingUser._id}`, editingUser);
      setUsers(users.map((u) => (u._id === editingUser._id ? editingUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Danh sách User</h2>

      {editingUser && (
        <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Chỉnh sửa user</h3>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            placeholder="Name"
            style={{ marginRight: "10px", padding: "4px" }}
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            placeholder="Email"
            style={{ marginRight: "10px", padding: "4px" }}
          />
          <button onClick={saveEdit} style={{ marginRight: "5px", padding: "4px 8px" }}>Lưu</button>
          <button onClick={() => setEditingUser(null)} style={{ padding: "4px 8px" }}>Hủy</button>
          {/* Note nhỏ */}
          <p style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
            * Chỉnh sửa user trực tiếp và nhấn Lưu
          </p>
        </div>
      )}

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.email}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button
                  style={{ marginRight: "8px", padding: "4px 8px", cursor: "pointer" }}
                  onClick={() => handleEdit(user)}
                >
                  Sửa
                </button>
                <button
                  style={{ padding: "4px 8px", cursor: "pointer" }}
                  onClick={() => handleDelete(user._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "8px" }}>
                Chưa có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
