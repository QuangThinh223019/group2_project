import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

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
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      alert("Xóa user thất bại.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user); // lưu user muốn sửa
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:4000/api/users/${editingUser._id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Cập nhật list users
      setUsers(users.map(u => u._id === res.data._id ? res.data : u));
      setEditingUser(null); // đóng form
    } catch (err) {
      console.error("Lỗi khi lưu user:", err);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className="list-container">
      <h2>Danh sách User</h2>
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
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Chưa có user nào
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <input
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <input
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    user.role || "user"
                  )}
                </td>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <>
                      <button onClick={handleSave}>💾 Lưu</button>
                      <button onClick={() => setEditingUser(null)}>❌ Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)}>✏️ Sửa</button>
                      <button onClick={() => handleDelete(user._id)}>🗑️ Xóa</button>
                    </>
                  )}
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
